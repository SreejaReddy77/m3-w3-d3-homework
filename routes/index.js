const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Registration = mongoose.model('Registration');

const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd')
});

router.get('/', (req, res) => {
  res.render('index', { title: 'Simple Kitchen' });
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register', data: {} });
});

router.post('/register', [
  check('name').trim().isLength({ min: 1 }).withMessage('Please enter a name'),
  check('email').trim().isEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('register', {
      title: 'Register',
      errors: errors.array(),
      data: req.body
    });
  }

  try {
    await new Registration(req.body).save();
    res.render('thankyou', { title: 'Thank you' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Sorry, something went wrong.');
  }
});

router.get('/registrants', basic.check((req, res) => {
  Registration.find().sort({ createdAt: -1 })
    .then((registrations) => res.render('registrants', { title: 'Registrations', registrations }))
    .catch((error) => {
      console.error(error);
      res.status(500).send('Sorry, something went wrong.');
    });
}));

router.get('/registrations', basic.check((req, res) => {
  Registration.find().sort({ createdAt: -1 })
    .then((registrations) => res.render('registrants', { title: 'Registrations', registrations }))
    .catch((error) => {
      console.error(error);
      res.status(500).send('Sorry, something went wrong.');
    });
}));

module.exports = router;
