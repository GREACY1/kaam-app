const router = require('express').Router();
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/jobs — customer posts a new job
router.post('/', auth, async (req, res) => {
  try {
    const { skill, description, longitude, latitude } = req.body;

    const job = await Job.create({
      customer: req.user._id,
      skill,
      description,
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

// GET /api/jobs/nearby — worker ke liye saari open jobs
router.get('/nearby', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' })
      .populate('customer', 'name phone')
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

    job.status = 'rated';
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
      .populate('customer worker', 'name phone rating photo')
      .sort({ createdAt: -1 });

    res.json(jobs);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;