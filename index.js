const express = require('express');
const app = express();
const redis = require('redis');
const client = redis.createClient();

const port = process.env.PORT || 4001;

const getAllMeasurements = id => {
  return new Promise((resolve, reject) => {
    client.lrange(id, 0, -1, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};

app.use(express.static('public'));

app.get('/measurements/:id', (req, res, next) => {
  getAllMeasurements(req.params.id)
    .then(data => res.json(data))
    .catch(err => next(err));
});

app.get('/measurements', (req, res, next) => {
  client.keys('*', (err, keys) => {
    if (err) {
      return next(err);
    }
    Promise.all(keys.map(getAllMeasurements))
      .then(dataList => {
        return dataList.map((data, index) => {
          return {
            id: keys[index],
            data,
          };
        });
      })
      .then(data => res.json(data))
      .catch(err => next(err));

  });
});

app.get('/clear/:id', (req, res) => {
  client.del(req.params.id, (err) => {
    if (err) {
      return next(err);
    }
    return res.send(`Deleted ${req.params.id} data.`);
  });
});

app.get('/measurement/:id/:value', (req, res) => {
  const data = {
    value: parseFloat(req.params.value),
    timestamp: Date.now(),
  };
  client.rpush([req.params.id, JSON.stringify(data)], (err) => {
    if (err) {
      return next(err);
    }
    return res.send('done');
  });
});

client.on('connect', () => {
  console.log('Connected to Redis DB');
  app.listen(port, () => {
    console.log(`Started Watson Measurement Receiver @ http://localhost:${port}`);
  });
});
