'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('GET /api/notes', function () {

  it('should return the default of 10 Notes as an array', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.equal(10);
      });
  });

  it('should return an array of objects with the id, title and content', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        const expectedKeys = ['id', 'title', 'content'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  it('should return a correct search result for a valid query that returns a single result', function () {
    return chai.request(app)
      .get('/api/notes?searchTerm=lady')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.equal(1);
        expect(res.body[0].title + ' ' + res.body[0].content).to.include('lady');
      });
  });

  it('should return correct search results for a valid query that returns multiple results', function () {
    return chai.request(app)
      .get('/api/notes?searchTerm=most')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.equal(2);
        expect(res.body[0].title + ' ' + res.body[0].content).to.include('most');
      });
  });

  it('should return an empty array for an valid query that returns no results', function () {
    return chai.request(app)
      .get('/api/notes?searchTerm=abcd')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.equal(0);
      });
  });

});


describe('GET /api/notes/:id', function () {

  it('should return correct note object with id, title and content for a given id', function () {
    return chai.request(app)
      .get('/api/notes/1001')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        const expectedKeys = ['id', 'title', 'content'];
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys(expectedKeys);
        expect(res.body.id).to.equal(1001);
        // TA: how do I check that the content and title match the response?
      });
      
  });

  it('should respond with a 404 for an invalid id (/api/notes/DOESNOTEXIST)', function () {
    return chai.request(app)
      .get('/api/notes/3000')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(404);
        // how do I check that the content and title match the response?
      });
      
  });

});


describe('POST /api/notes/', function () {

  it('should create and return a new item with location header when provided valid data', function () {
    const newNote = { title: 'CATS', content: 'Posuere sollicitudin aliquam...' };
    return chai
      .request(app)
      .post('/api/notes')
      .send(newNote)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('title', 'content');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(
          Object.assign(newNote, { id: res.body.id })
        );
      });
  });
    

  it('should return an object with a message property "Missing title in request body" when missing content in "title"', function () {
    const malformedNote = {title: '' , content: 'Posuere sollicitudin aliquam...'};
    return chai
      .request(app)
      .post('/api/notes')
      .send(malformedNote)
      .then(function(res) {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('message', 'error');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
      
  });

  it('should return an object with a message property "Missing title in request body" when missing "title" entirely', function () {
    const malformedNote = {content: 'Posuere sollicitudin aliquam...' };
    return chai
      .request(app)
      .post('/api/notes')
      .send(malformedNote)
      .then(function(res) {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('message', 'error');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
      
  });

});


describe('PUT /api/notes/:id', function () {

  it('should update items on PUT', function() {
    const updateData = {
      title: 'CATS',
      content: 'Posuere sollicitudin aliquam...' 
    };
    return (
      chai
        .request(app)
        .get('/api/notes')
        .then(function(res) {
          updateData.id = res.body[0].id;
          return chai
            .request(app)
            .put(`/api/notes/${updateData.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.deep.equal(updateData);
        })
    );
  });

  it('should respond with a 404 for an invalid id (/api/notes/DOESNOTEXIST)', function() {
    const updateData = {
      title: 'CATS',
      content: 'Posuere sollicitudin aliquam...' 
    };
    return chai
      .request(app)
      .put('/api/notes/fdslkfjsdfjsodif')
      .send(updateData)
      .then(function(res) {
        expect(res).to.have.status(404);
      });
  });

  it('should return an object with a message property "Missing title in request body" when missing "title" field', function() {
    const updateData = {
      title: '',
      content: 'Posuere sollicitudin aliquam...' 
    };
    return chai
      .request(app)
      .put('/api/notes/1005')
      .send(updateData)
      .then(function(res) {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });

  it('should delete items by id', function() {
    return (
      chai
        .request(app)
        .get('/api/notes/')
        .then(function(res) {
          return chai.request(app).delete(`/api/notes/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    );
  });

  // comment so as to pus
    
});
