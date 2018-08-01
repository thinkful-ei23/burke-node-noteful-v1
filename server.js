'use strict';

// Load array of notes
const data = require('./db/notes');

const { PORT } = require('./config');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

const express = require('express');

const app = express();

// ADD STATIC SERVER HERE
app.use(express.static('public'));

// server logs
app.use( (req, res, next) => {
  const now = new Date();
  console.log(
    `${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});


app.get('/api/notes', (req, res) => {
  if (req.query.searchTerm) {
    const filteredData = data.filter(element => element.title.includes(req.query.searchTerm));
    res.json(filteredData);
  }
  res.json(data);
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const requestedItem = data.find(item => item.id === Number(id));
  res.json(requestedItem);
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});