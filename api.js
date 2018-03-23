const express = require('express');
const isEmpty = require('is-empty');

const {
  create,
  readAll,
  rideSearch,
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
      cost: req.body.cost
    };
    res.status(201).send(skil);
  });
});


router.get('/rides', async (req, res) => {
  const { rideFrom, rideTo } = req.query;

  const rows = await rideSearch(rideFrom, rideTo);

  res.send(rows);
});

router.put('/:id', function(req, res, next) {
  update(req.params.id, req.body).then(function(data) {
    if(data === 1) {
      let skil = {
        id: data[0].id,
        rideFrom: req.body.rideFrom,
        rideTo: req.body.rideTo,
        date: req.body.date,
        depTime: req.body.depTime,
        seatsAvailable: req.body.seatsAvailable,
        cost: req.body.cost
      };
      res.status(201).send(skil);
    } else {
      res.status(404).send("error: not found");
    }
  });
});

router.delete('/:date', function(req, res, next) {
  del(req.body.date).then(function(data) {
    if(data === 1) {
      res.status(204).send();
    } else {
      res.status(404).send("error: not found");
    }
  });
});

router.post('/register', function(req, res, next) {
  createUser(req.body).then(function(data) {

    /*let newUser = {
      success: true,
      username: data[0].username,
      name: data[0].name,
      phone: data[0].phone,
      email: data[0].email,
    }*/
    res.status(201).send(data[0]);
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
