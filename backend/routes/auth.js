const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendOTP = require('../utils/email');

// STEP 1: Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('OTP for', email, ':', otp);
    
    // Database mein save karo
    let user = await User.findOne({ email });
if (!user) {
  user = new User({ email });
}
user.otp = otp;
user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
await user.save();

    await sendOTP(email, otp);
    res.json({ msg: 'OTP sent successfully' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error sending OTP' });
  }
});

// STEP 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const { otp, name, role, skill } = req.body;

    // Database se check karo
    const user = await User.findOne({ email });

    if (!user || !user.otp) {
      return res.status(400).json({ msg: 'OTP not sent' });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ msg: 'OTP expired' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ msg: 'Wrong OTP' });
    }

    // OTP sahi hai — update karo
    user.otp = undefined;
    user.otpExpires = undefined;
    user.name = name || user.name;
    user.role = role || user.role;
    user.skill = skill || user.skill;
    await user.save();

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