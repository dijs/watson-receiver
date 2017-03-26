require('dotenv').config();
const express = require('express');
const app = express();
const redis = require('redis');
const request = require('request');
const fs = require('fs');
const client = redis.createClient();
const Rekognition = require('aws-sdk/clients/Rekognition');

const rekognition = new Rekognition({
  region: 'us-east-1',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

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

// TEMP
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.use(allowCrossDomain);

const cameraUrls = [
  'http://192.168.1.161/snapshot.jpg?user=api&pwd=api',
  'http://192.168.1.17:88/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=api&pwd=api&',
];

function saveSnapshot(url, index) {
  const ws = fs.createWriteStream(`./snapshot-${index}.jpg`);
  ws.on('error', console.log);
  request(url).pipe(ws);
}

// Could just call this save... every 30 seconds or so...
app.get('/snaps', (req, res) => {
  cameraUrls.map(saveSnapshot);
  res.json({
    count: cameraUrls.length,
  });
});

app.get('/snapshot/:index', (req, res) => {
  fs.createReadStream(`./snapshot-${req.params.index}.jpg`).pipe(res);
});

app.get('/snapshot-info/:index', (req, res) => {
  const data = fs.readFileSync(`./snapshot-${req.params.index}.jpg`);
  const params = {
    Image: {
      Bytes: data,
    },
  };
  rekognition.detectLabels(params, (err, data) => {
    if (err) {
      return console.log(err, err.stack);
    }
    res.json(data);
  });
});

app.get('/snapshot-faces/:index', (req, res) => {
  const data = fs.readFileSync(`./snapshot-${req.params.index}.jpg`);
  const params = {
    Image: {
      Bytes: data,
    },
    Attributes: [
      'ALL',
    ]
  };
  rekognition.detectFaces(params, (err, data) => {
    if (err) {
      return console.log(err, err.stack);
    }
    console.log(data);
    res.json(data);
  });
});

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
