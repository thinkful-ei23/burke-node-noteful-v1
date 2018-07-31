'use strict';

// Load array of notes
const data = require('./db/notes');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

const express = require('express');
const morgan = require('morgan');

const app = express();

// ADD STATIC SERVER HERE
app.use(express.static('public'));

app.use(morgan('common'));

app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  // searches both the body and the title
  if (searchTerm) {
    const filteredData = data.filter(note => note.title.includes(searchTerm) || note.content.includes(searchTerm));
    res.json(filteredData);
  } else {
    res.json(data);
  }
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const requestedItem = data.find(item => item.id === Number(id));
  res.json(requestedItem);
});

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});