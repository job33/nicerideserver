const express = require('express');

const {
  create,
  readAll,
  rideSearch,
  update,
  del,
} = require('./rides');

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

/*
router.get('/', async (req, res) => {
  const { search } = req.query;

  const rows = await rideSearch(search);

  res.send(rows);
}); */

router.get('/', function(req, res, next) {
  rideSearch(req.query).then(function(data) {
    res.send(data);
  });
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

module.exports = router;