'use strict';

const { PORT } = require('./config');
console.log('Hello Noteful!');

// Initialize express
const express = require('express');
const app = express();

// server logs
const morgan = require('morgan');
const router = require('./router/notes.router');

// parse json
app.use(express.json());

// ADD STATIC SERVER HERE
app.use(express.static('public'));

// ADD STATIC SERVER HERE
app.use('/api', router);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});