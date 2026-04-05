const router = require('express').Router();
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/jobs — customer posts a new job
router.post('/', auth, async (req, res) => {
  try {
    const { skill, description, longitude, latitude, city } = req.body;

    const job = await Job.create({
      customer: req.user._id,
      skill,
      description,
      city: city || '',
      location: {
        type: 'Point',
        coordinates: [longitude || 0, latitude || 0]
      },
    });

    // NOTIFICATION CODE COMMENTED OUT
    // const workers = await User.find({
    //   role: 'worker',
    //   skill: skill,
    //   isAvailable: true,
    //   expoPushToken: { $exists: true, $ne: null }
    // });

    // const notifications = workers.map(worker => ({
    //   to: worker.expoPushToken,
    //   sound: 'default',
    //   title: '🔔 Naya Kaam Mila!',
    //   body: `${skill} ki zaroorat hai — jaldi accept karo!`,
    //   data: { jobId: job._id.toString() },
    // }));

    // if (notifications.length > 0) {
    //   const response = await fetch('https://exp.host/--/api/v2/push/send', {
    //     method: 'POST',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(notifications),
    //   });
    // }

    res.json({
      job,
      workersNotified: 0  // Changed from workers.length
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// REST OF THE CODE STAYS SAME...
// (Copy all other routes as they are)

module.exports = router;