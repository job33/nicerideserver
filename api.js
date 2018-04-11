const express = require('express');
const isEmpty = require('is-empty');

const {
  create,
  readAll,
  rideSearch,
  mehRides,
  update,
  del,
} = require('./rides');

const {
  createUser,
  login,
} = require('./users');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/* todo útfæra api */

router.get('/', function(req, res, next) {
  readAll().then(function(data) {
    res.send(data);
  });
});

router.post('/', function(req, res, next) {
  create(req.body).then(function(data) {
    let skil = {
      id: data[0].id,
      rideFrom: req.body.rideFrom,
      rideTo: req.body.rideTo,
      date: req.body.date,
      depTime: req.body.depTime,
      seatsAvailable: req.body.seatsAvailable,
      cost: req.body.cost,
      userName: req.body.userName,
      phone: req.body.phone,
      email: req.body.email
    };
    res.status(201).send(skil);
  });
});


router.get('/rides', async (req, res) => {
  const { rideFrom, rideTo, date } = req.query;

  const rows = await rideSearch(rideFrom, rideTo, date);

  res.send(rows);
});

router.get('/mehrides', async (req, res) => {
  const { username } = req.query;

  const rows = await mehRides(username);

  res.send(rows);
});

router.patch('/:id', catchErrors(async (req, res, next) => {
  const { id } = req.params;
  const ride = {
    rideFrom = '',
    rideTo = '',
    date = '',
    depTime = '',
    seatsAvailable,
    cost = '',
    userName = '',
    phone = '',
    email = '',
  } = req.body;

  let result;

  try {
    result = await update(ride, id);
  } catch (error) {
    return next(error);
  }
  if (!result.success) {
    return res.status(201).json({
      success: false,
    });
  }
  return res.send(result.item);
}));

router.delete('/id', catchErrors(async (req, res, next) => {
  const { id } = req.params;
  console.info('id', id);
  let result;

  try {
    result = await del(id);
  } catch (error) {
    return next(error);
  }
  console.info('result: ', result);
  return res.status(201).json({
    success: true,
  });
}));

router.post('/register', function(req, res, next) {
  createUser(req.body).then(function(data) {
    console.info("data ", data);
    if(data === null) {
      let newUser = {
        success: false,
      }
      res.send(newUser);
    }else{
      let newUser = {
        success: true,
        username: data[0].username,
        name: data[0].name,
        phone: data[0].phone,
        email: data[0].email,
      }
      res.status(201).send(newUser);
    }
  });
});

router.post('/login', function(req, res, next) {
  login(req.body).then(function(data) {
    console.info("Data: " + data);
    console.info("Data[0]: " + data[0]);
    const noUser = isEmpty(data[0]);
    console.info("noUser: " + noUser);
    if (noUser) {
      let activeUser = {
        success: false,
      }
      console.info("activeUser: " + activeUser);
      res.send(activeUser);
    } else {
      let activeUser = {
        success: true,
        username: data[0].username,
        name: data[0].name,
        phone: data[0].phone,
        email: data[0].email,
      }
      res.status(201).send(activeUser);
    }
  });
});

module.exports = router;
