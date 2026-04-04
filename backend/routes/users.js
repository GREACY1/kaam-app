const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Update profile - ProfileSetupScreen ke liye
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, address, contact, aadhar, gender, altEmail, experience, docType, city } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, address, contact, aadhar, gender, altEmail, experience, docType, city, profileDone: true },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update location
router.put('/location', auth, async (req, res) => {
  try {
    const { longitude, latitude, fcmToken } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      location: { type: 'Point', coordinates: [longitude, latitude] },
      fcmToken,
    });
    res.json({ msg: 'Location updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get my profile
router.get('/me', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get any user profile by id
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name photo skill rating totalRatings role city');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update availability
router.put('/availability', auth, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    await User.findByIdAndUpdate(req.user._id, { isAvailable });
    res.json({ msg: 'Availability updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Report a user
router.post('/:id/report', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    console.log(`Report against user ${req.params.id} by ${req.user._id}: ${reason}`);
    res.json({ msg: 'Report received. Our team will review it.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;