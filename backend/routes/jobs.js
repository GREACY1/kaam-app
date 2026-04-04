const router = require('express').Router();
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/jobs — customer posts a new job
router.post('/', auth, async (req, res) => {
  try {
    const { skill, description, longitude, latitude } = req.body;

    // Customer ki city fetch karo
    const customer = await User.findById(req.user._id);

    const job = await Job.create({
      customer: req.user._id,
      skill,
      description,
      city: customer.city || '',
      location: {
        type: 'Point',
        coordinates: [longitude || 0, latitude || 0]
      },
    });

    res.json({
      job,
      workersNotified: 1
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/jobs/nearby — worker ke liye same city ki open jobs
router.get('/nearby', auth, async (req, res) => {
  try {
    const worker = await User.findById(req.user._id);

    // Same city ki jobs dhundho, aur same skill ki
    const query = {
      status: 'open',
      skill: worker.skill,
    };

    // Agar worker ki city set hai toh city filter lagao
    if (worker.city && worker.city !== '') {
      query.city = worker.city;
    }

    const jobs = await Job.find(query)
      .populate('customer', 'name phone contact')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/jobs/:id/accept — worker accepts a job
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job || job.status !== 'open') {
      return res.status(400).json({ msg: 'Job not available' });
    }

    job.status = 'accepted';
    job.worker = req.user._id;
    await job.save();

    await User.findByIdAndUpdate(req.user._id, { isAvailable: false });

    res.json({ job });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/jobs/:id/complete — mark job as done
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );
    res.json({ job });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/jobs/:id/rate — rate after job completion
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    const job = await Job.findById(req.params.id);

    const isCustomer = job.customer.toString() === req.user._id.toString();

    if (isCustomer) {
      job.workerRating = rating;
      const worker = await User.findById(job.worker);
      worker.rating = ((worker.rating * worker.totalRatings) + rating) / (worker.totalRatings + 1);
      worker.totalRatings += 1;
      worker.isAvailable = true;
      await worker.save();
    } else {
      job.customerRating = rating;
      const customer = await User.findById(job.customer);
      customer.rating = ((customer.rating * customer.totalRatings) + rating) / (customer.totalRatings + 1);
      customer.totalRatings += 1;
      await customer.save();
    }

    // Sirf tab 'rated' karo jab DONO ne rating de di ho
    if (job.workerRating && job.customerRating) {
      job.status = 'rated';
    }

    await job.save();
    res.json({ job });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/jobs/mine — get my jobs
router.get('/mine', auth, async (req, res) => {
  try {
    const query = req.user.role === 'worker'
      ? { worker: req.user._id }
      : { customer: req.user._id };

    const jobs = await Job.find(query)
      .populate('customer worker', 'name phone contact rating photo')
      .sort({ createdAt: -1 });

    res.json(jobs);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/jobs/history — completed aur rated jobs
router.get('/history', auth, async (req, res) => {
  try {
    const query = req.user.role === 'customer'
      ? { customer: req.user._id, status: { $in: ['completed', 'rated'] } }
      : { worker: req.user._id, status: { $in: ['completed', 'rated'] } };

    const jobs = await Job.find(query)
      .populate('customer', 'name contact rating')
      .populate('worker', 'name contact rating')
      .sort({ updatedAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;