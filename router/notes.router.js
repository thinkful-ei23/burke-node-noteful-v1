'use strict';

const express = require('express');
const data = require('../db/notes');
const morgan = require('morgan');
const router = express.Router();

router.use(morgan('common'));
router.use(express.static('public'));

router.get('/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  // searches both the body and the title
  if (searchTerm) {
    const filteredData = data.filter(note => note.title.includes(searchTerm) || note.content.includes(searchTerm));
    res.json(filteredData);
  } else {
    res.json(data);
  }
});

router.get('/notes/:id', (req, res) => {
  const id = req.params.id;
  const requestedItem = data.find(item => item.id === Number(id));
  res.json(requestedItem);
});

module.exports = router;
