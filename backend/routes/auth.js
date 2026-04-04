const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendOTP = require('../utils/email');

const otpStore = {};

router.post('/send-otp', async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('OTP for', email, ':', otp);
    otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };
    await sendOTP(email, otp);
    res.json({ msg: 'OTP sent successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error sending OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const otp = req.body.otp.toString().trim();
    const { name, role, skill } = req.body;

    const record = otpStore[email];
    if (!record) return res.status(400).json({ msg: 'OTP not sent' });
    if (Date.now() > record.expires) return res.status(400).json({ msg: 'OTP expired' });
    if (record.otp !== otp) return res.status(400).json({ msg: 'Wrong OTP' });

    delete otpStore[email];

    // ✅ FIX: Role aur skill hamesha update hoga
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, role, skill });
    } else {
      user.role = role || user.role;
      user.skill = skill || user.skill;
      user.name = name || user.name;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;