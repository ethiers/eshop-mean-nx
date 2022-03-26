const { User } = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require('jsonwebtoken');
const { Product } = require('../models/product');
const router = express.Router();

router.get(`/`, async (req, res) => {
  const userList = await User.find().select('-passwordHash');
  // const userList = await User.find().select("name phone email");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get(`/:id`, async (req, res) => {
  const userList = await User.findById(req.params.id).select('-passwordHash');

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.post('/', async (req, res) => {
  const body = ({
    name,
    email,
    phone,
    isAdmin,
    street,
    apartment,
    zip,
    city,
    country,
  } = req.body);

  let user = new User({
    ...body,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    icon: req.body.icon,
    color: req.body.color,
  });

  User.findOne({ email: body.email }, async (err, example) => {
    if (err) console.log(err);
    if (example) {
      console.log('This has already been saved');
      res.json({ error: 'This has already been saved' });
    } else {
      console.log('user POST', user);
      user = await user.save();

      if (!user) return res.status(400).send('the user cannot be created!');

      console.log('res.send');

      res.send(user);
    }
  });
});

router.put('/:id', async (req, res) => {
  const userExist = await User.findById(req.params.id);

  console.log('userExist', userExist);

  let newPassword = null;

  if (!userExist) {
    res.json({ error: "user doesn't exist" });
    return;
  }

  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    console.log('req.body.password found');
    if (userExist.passwordHash) {
      newPassword = userExist.passwordHash;
    } else {
      newPassword = 'temp123';
    }
  }

  const body = ({
    name,
    email,
    phone,
    isAdmin,
    street,
    apartment,
    zip,
    city,
    country,
  } = req.body);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      ...body,
      passwordHash: newPassword,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }
  );

  if (!user) return res.status(400).send('the user cannot be created!');

  res.send(user);
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send('The user not found');
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET,
      {
        expiresIn: '1d',
      }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(200).send('password is wrong');
  }
});

router.post('/register', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(400).send('the user cannot be created!');

  res.send(user);
});

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments();

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});

router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: 'the user is deleted!' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'user not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
