require('dotenv').config();
const express = require('express');
const app = express();
const redis = require('redis');
const request = require('request');
const fs = require('fs');
const client = redis.createClient();
const Rekognition = require('aws-sdk/clients/Rekognition');

const mockData = require('./mockData.json');

import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './app/components/App.js';
import template from './template';

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

const getAllKeys = () => {
  return new Promise((resolve, reject) => {
    client.keys('*', (err, keys) => {
      if (err) {
        return reject(err);
      }
      return resolve(keys);
    });
  });
};

const getAllDeviceData = () => {
  return getAllKeys()
    .then(keys => {
      return Promise.all(keys.map(getAllMeasurements))
        .then(dataList => {
          return dataList.map((data, index) => {
            return {
              id: keys[index],
              data,
            };
          });
        });
    });
};

app.use('/', express.static(__dirname + '/public'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', (req, res, next) => {
  getAllDeviceData()
    .then(data => {
      const initialState = { data };
      const appString = renderToString(<App {...initialState} />);
      res.send(template({
        body: appString,
        initialState: JSON.stringify(initialState)
      }));
    })
    .catch(err => next(err))
});

const cameraUrls = [
  'http://192.168.1.161/snapshot.jpg?user=api&pwd=api',
  'http://192.168.1.17:88/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=api&pwd=api&',
];

function saveSnapshot(url, index) {
  const ws = fs.createWriteStream(`./snapshot-${index}.jpg`);
  ws.on('error', console.log);
  request(url).pipe(ws);
}

// Save new pics every five seconds
setInterval(() => {
  cameraUrls.map(saveSnapshot);
}, 5000);

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
