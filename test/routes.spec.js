const chai = require('chai');

/* eslint-disable no-alert, no-unused-vars */
const should = chai.should();
/* eslint-enable no-alert, no-unused-vars */
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', (done) => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.should.include('Final');
        done();
      });
  });

  it('should return a 404 for a route that does not exist', (done) => {
    chai.request(server)
      .get('/foo')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });
});

describe('API Routes', () => {
  before(done => {
     database.migrate.latest()
      .then(() => done())
      .catch(error => error);
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => error);
  });

  describe('GET /api/v1/inventory', () => {
    it('should get all of the inventory', (done) => {
      const mockData = {
        ID: 1,
        TITLE: 'Climbing Shoes',
        DESCRIPTION: 'La Sportiva Climbing Shoes',
        IMAGE: 'https://www.rei.com/media/product/896622',
        PRICE: '99.99'
    }
      chai.request(server)
        .get('/api/v1/inventory')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(4);
          response.body[0].should.include(mockData);
          done();
        });
    });

    it('should return a 404 status if the url is invalid', (done) => {
      chai.request(server)
        .get('/api/v1/foo')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  describe('GET /api/v1/history', () => {
    it('should get all order history', done => {
      const mockData = {
        ID: 1,
        TOTAL: "69.69"
      };

      chai.request(server)
        .get('/api/v1/history')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[0].should.include(mockData);
          done();
        });
    });
  });

  describe('POST /api/v1/history', () => {
    it('should post a new order to order history', done => {

      chai.request(server)
        .post('/api/v1/history')
        .send({
          TOTAL: 99.99
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('array');
          done();
      });
    })
  })
});
