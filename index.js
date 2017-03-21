const app = require('express')();
const redis = require('redis');
const client = redis.createClient();

const port = process.env.PORT || 4001;

app.get('/', (req, res) => res.send('Welcome to the Watson Measurement Receiver Server'));

app.get('/measurements/:id', (req, res, next) => {
  client.lrange(req.params.id, 0, -1, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.json(data);
  });
});

app.get('/clear/:id', (req, res) => {
  client.del(req.params.id, (err) => {
    if (err) {
      return next(err);
    }
    return res.send(`Deleted ${id} data.`);
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
