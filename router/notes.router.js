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

// Post (insert) an item
router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  // how does this access simDB?
  data.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});

router.get('/notes/:id', (req, res) => {
  const id = req.params.id;
  const requestedItem = data.find(item => item.id === Number(id));
  res.json(requestedItem);
});



module.exports = router;
