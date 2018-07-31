'use strict';

// Load array of notes
const data = require('./db/notes');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

const express = require('express');
const morgan = require('morgan');

const app = express();
const router = require('./router/notes.router');
// ADD STATIC SERVER HERE
app.use('/api', router);

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});