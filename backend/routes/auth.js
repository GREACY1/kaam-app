const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register or Login with phone number
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, name, role, skill } = req.body;

    // Check if user already exists
    let user = await User.findOne({ phone });

    if (!user) {
      // Create new user
      user = await User.create({ phone, name, role, skill });
    }

    // Create login token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ token, user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;