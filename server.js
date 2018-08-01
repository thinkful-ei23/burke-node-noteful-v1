'use strict';

// Load array of notes
const data = require('./db/notes');
// Simple In-Memory Database
const simDB = require('./db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this

const { PORT } = require('./config');

// logger
const {logger} = require('./middleware/logger');
console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const app = express();

// ADD STATIC SERVER HERE
app.use(express.static('public'));

// server logs
app.use(logger);


app.get('/api/notes', (req, res) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const requestedItem = data.find(item => item.id === Number(id));
  res.json(requestedItem);
});


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