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
        PRICE: '99.55'
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

//   describe('GET /api/v1/waves', () => {
//     it('should get all of the waves', (done) => {
//       const mockData = {
//         WAVE_ID: '28689',
//         SOURCE_ID: '5586',
//         YEAR: '2013',
//         MONTH: '8',
//         LOCATION: 'QUEEN\'S WHARF',
//         MAXIMUM_HEIGHT: '0.07',
//         FATALITIES: '',
//         FATALITY_ESTIMATE: '',
//         ALL_DAMAGE_MILLIONS: null,
//         DAMAGE_ESTIMATE: '',
//       };
//
//       chai.request(server)
//         .get('/api/v1/waves')
//         .end((error, response) => {
//           const index = response.body.findIndex(obj => obj.WAVE_ID === mockData.WAVE_ID);
//           response.should.have.status(200);
//           response.should.be.json;
//           response.body.should.be.a('array');
//           response.body.length.should.equal(3);
//           response.body[index].should.include(mockData);
//           done();
//         });
//     });
//
//     it('should return a 404 status if the url is invalid', (done) => {
//       chai.request(server)
//         .get('/api/v1/foo')
//         .end((error, response) => {
//           response.should.have.status(404);
//           done();
//         });
//     });
//   });
//
//   describe('GET /api/v1/waves?year=:year', () => {
//     it('should return waves from a specific year', (done) => {
//       const mockData = {
//         WAVE_ID: '28689',
//         SOURCE_ID: '5586',
//         YEAR: '2013',
//         MONTH: '8',
//         LOCATION: 'QUEEN\'S WHARF',
//         MAXIMUM_HEIGHT: '0.07',
//         FATALITIES: '',
//         FATALITY_ESTIMATE: '',
//         ALL_DAMAGE_MILLIONS: null,
//         DAMAGE_ESTIMATE: '',
//       };
//
//       chai.request(server)
//         .get('/api/v1/waves?year=2013')
//         .end((error, response) => {
//           const index = response.body.findIndex(obj => obj.WAVE_ID === mockData.WAVE_ID);
//
//           response.body.length.should.equal(2);
//           response.body.should.be.a('array');
//           response.body[index].should.include(mockData);
//           done();
//         });
//     });
//
//     it('should return a 404 status if searching for a year that is not between 2013 and 2017', (done) => {
//       chai.request(server)
//         .get('/api/v1/waves?year=pizza')
//         .end((error, response) => {
//           response.should.have.status(404);
//           response.body.error.should.equal('This Database only Contains Tsunami Data from 2013 until 2017, you searched for pizza');
//           done();
//         });
//     });
//   });
//
//   describe('POST /api/v1/inventory', () => {
//
//     const mockData = {
//       SOURCE_ID: '5543',
//       YEAR: '221',
//       MONTH: '8',
//       COUNTRY: 'ITALY',
//       STATEPROVINCE: 'Foo',
//       LOCATION: 'Foo',
//       LATITUDE: '41.4',
//       LONGITUDE: '45.3',
//       MAXIMUM_HEIGHT: '21',
//       FATALITIES: '455',
//       FATALITY_ESTIMATE: '21',
//       ALL_DAMAGE_MILLIONS: '4553',
//       DAMAGE_ESTIMATE: '231',
//     };
//
//     it('should create a new source when token is in header', (done) => {
//       chai.request(server)
//         .post('/api/v1/inventory')
//         .set('Authorization', token)
//         .send(mockData)
//         .end((error, response) => {
//           const index = response.body.findIndex(obj => obj.SOURCE_ID === mockData.SOURCE_ID);
//           response.should.have.status(201);
//           response.body.should.be.a('array');
//           response.body[index].should.include(mockData);
//           done();
//         });
//     });
//
//     it('should create a new source when token is in body', (done) => {
//       chai.request(server)
//         .post('/api/v1/inventory')
//         .send(Object.assign({}, mockData, {token}))
//         .end((error, response) => {
//           const index = response.body.findIndex(obj => obj.SOURCE_ID === mockData.SOURCE_ID);
//           response.should.have.status(201);
//           response.body.should.be.a('array');
//           response.body[index].should.include(mockData);
//           done();
//         });
//     });
//
//     it('should create a new source when token is in query', done => {
//       chai.request(server)
//         .post('/api/v1/inventory?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY29vbCBhcHAiLCJlbWFpbCI6InRyb2xsNTk5MTBAdHVyaW5nLmlvIiwiYWRtaW4iOnRydWUsImlhdCI6MTUwNzgzMDg4MywiZXhwIjoxNTA4MDAzNjgzfQ.Dyq29el8iSM-78ZfLCUKFJ7cwdm_UIx3ixss741zIbE')
//         .send(mockData)
//         .end((error, response) => {
//           const index = response.body.findIndex(obj => obj.SOURCE_ID === mockData.SOURCE_ID);
//           response.should.have.status(201);
//           response.body.should.be.a('array');
//           response.body[index].should.include(mockData);
//           done();
//         });
//     });
//
//     it('should not create a new source when token is invalid', (done) => {
//       const invalidToken = {
//         'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY29vbCBhcHAiLCJlbWFpbCI6InRyb2xsNTk5MTBAYW9sLmNvbSIsImFkbWluIjpmYWxzZSwiaWF0IjoxNTA3ODQ3MzY4LCJleHAiOjE1MDgwMjAxNjh9.H7NXB25zC6Yd7KedQ40Sn7hjGX4X4NlUCxGTdYO0zTs'
//       };
//
//       chai.request(server)
//         .post('/api/v1/inventory')
//         .set('Authorization', invalidToken)
//         .send(mockData)
//         .end((error, response) => {
//           response.should.have.status(403);
//           response.body.should.be.a('object');
//           response.body.error.should.equal('Invalid token');
//           done();
//         });
//     });
//
//     it('should not create a new source when there is no token', (done) => {
//       chai.request(server)
//         .post('/api/v1/inventory')
//         .send(mockData)
//         .end((error, response) => {
//           response.should.have.status(403);
//           response.body.should.be.a('object');
//           response.body.error.should.equal('You must be authorized to hit this endpoint.');
//           done();
//         });
//     });
//
//     it('should not create a source with a missing data', (done) => {
//       chai.request(server)
//         .post('/api/v1/inventory')
//         .set('Authorization', token)
//         .send({
//           YEAR: '221',
//           LONGITUDE: '45.3',
//           DAMAGE_ESTIMATE: '',
//         })
//         .end((error, response) => {
//           response.should.have.status(422);
//           /* eslint-disable no-alert, quotes */
//           response.body.error.should.equal("Expected format: { 'SOURCE_ID': <String>, 'YEAR': <String>, 'MONTH': <String>, 'COUNTRY': <String>, 'STATEPROVINCE': <String>, 'LOCATION': <String>, 'LATITUDE': <string>, 'LONGITUDE': <string>, 'MAXIMUM_HEIGHT': <String>, 'FATALITIES': <string>, 'FATALITY_ESTIMATE': <String>, 'ALL_DAMAGE_MILLIONS': <String>, 'DAMAGE_ESTIMATE': <String> }. You're missing a SOURCE_ID property.");
//           /* eslint-enable no-alert, quotes */
//           done();
//         });
//     });
//   });
//
//   describe('POST /api/v1/waves', () => {
//     const mockData = {
//       WAVE_ID: '41232',
//       SOURCE_ID: '5586',
//       YEAR: '2011',
//       MONTH: '2',
//       LOCATION: 'QUEEN\'S WHARF',
//       MAXIMUM_HEIGHT: '0.07',
//       FATALITIES: '345',
//       FATALITY_ESTIMATE: '3232',
//       ALL_DAMAGE_MILLIONS: '3382',
//       DAMAGE_ESTIMATE: '2',
//     };
//
//     it('should create a new wave with token in header', (done) => {
//       chai.request(server)
//         .post('/api/v1/waves')
//         .set('Authorization', token)
//         .send(mockData)
//         .end((error, response) => {
//           const index = response.body.findIndex(obj => obj.SOURCE_ID === mockData.SOURCE_ID);
//           response.should.have.status(201);
//           response.body.should.be.a('array');
//           response.body[index].should.include(mockData);
//           done();
//         });
//     });
//
//     it('should create a new wave with token in body', (done) => {
//       chai.request(server)
//         .post('/api/v1/waves')
//         .send(Object.assign({}, mockData, {token}))
//         .end((error, response) => {
//           const index = response.body.findIndex(obj => obj.SOURCE_ID === mockData.SOURCE_ID);
//           response.should.have.status(201);
//           response.body.should.be.a('array');
//           response.body[index].should.include(mockData);
//           done();
//         });
//     });
//
//     it('should create a new wave when token is in query', done => {
//       chai.request(server)
//         .post('/api/v1/waves?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY29vbCBhcHAiLCJlbWFpbCI6InRyb2xsNTk5MTBAdHVyaW5nLmlvIiwiYWRtaW4iOnRydWUsImlhdCI6MTUwNzgzMDg4MywiZXhwIjoxNTA4MDAzNjgzfQ.Dyq29el8iSM-78ZfLCUKFJ7cwdm_UIx3ixss741zIbE')
//         .send(mockData)
//         .end((error, response) => {
//           const index = response.body.findIndex(obj => obj.SOURCE_ID === mockData.SOURCE_ID);
//           response.should.have.status(201);
//           response.body.should.be.a('array');
//           response.body[index].should.include(mockData);
//           done();
//         });
//     });
//
//     it('should not create a new wave with invalid token', (done) => {
//       const invalidToken = {
//         'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY29vbCBhcHAiLCJlbWFpbCI6InRyb2xsNTk5MTBAYW9sLmNvbSIsImFkbWluIjpmYWxzZSwiaWF0IjoxNTA3ODQ3MzY4LCJleHAiOjE1MDgwMjAxNjh9.H7NXB25zC6Yd7KedQ40Sn7hjGX4X4NlUCxGTdYO0zTs'
//       };
//
//       chai.request(server)
//         .post('/api/v1/waves')
//         .set('Authorization', invalidToken)
//         .send(mockData)
//         .end((error, response) => {
//           response.should.have.status(403);
//           response.body.should.be.a('object');
//           response.body.error.should.equal('Invalid token');
//           done();
//         });
//     });
//
//     it('should not create a new wave when there is no token', (done) => {
//       chai.request(server)
//         .post('/api/v1/waves')
//         .send(mockData)
//         .end((error, response) => {
//           response.should.have.status(403);
//           response.body.should.be.a('object');
//           response.body.error.should.equal('You must be authorized to hit this endpoint.');
//           done();
//         });
//     });
//
//     it('should not create a wave with missing data', (done) => {
//       chai.request(server)
//         .post('/api/v1/waves')
//         .set('Authorization', token)
//         .send({
//           WAVE_ID: '324521',
//           DAMAGE_ESTIMATE: '34235',
//         })
//         .end((error, response) => {
//           response.should.have.status(422);
//           /* eslint-disable no-alert, quotes */
//           response.body.error.should.equal("Expected format: { 'WAVE_ID': <String>, 'SOURCE_ID': <String>, 'YEAR': <String>, 'MONTH': <String>, 'LOCATION': <String>, 'MAXIMUM_HEIGHT': <String>, 'FATALITIES': <string>, 'FATALITY_ESTIMATE': <String>, 'ALL_DAMAGE_MILLIONS': <String>, 'DAMAGE_ESTIMATE': <String> }. You're missing a SOURCE_ID property.");
//           /* eslint-disable no-alert, quotes */
//           done();
//         });
//     });
//   });
//
//   describe('DELETE /api/v1/inventory/:id', () => {
//     it('should delete a source with token in the header', (done) => {
//       chai.request(server)
//         .delete('/api/v1/inventory/5586')
//         .set('Authorization', token)
//         .end((error, response) => {
//           response.should.have.status(204);
//           done();
//         });
//     });
//
//     it('should delete a source when token is in query', done => {
//       chai.request(server)
//         .delete('/api/v1/inventory/5586?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY29vbCBhcHAiLCJlbWFpbCI6InRyb2xsNTk5MTBAdHVyaW5nLmlvIiwiYWRtaW4iOnRydWUsImlhdCI6MTUwNzgzMDg4MywiZXhwIjoxNTA4MDAzNjgzfQ.Dyq29el8iSM-78ZfLCUKFJ7cwdm_UIx3ixss741zIbE')
//         .end((error, response) => {
//           response.should.have.status(204);
//           done();
//         });
//     });
//
//     it('should not delete a source with invalid token', done => {
//       const invalidToken = {
//         'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY29vbCBhcHAiLCJlbWFpbCI6InRyb2xsNTk5MTBAYW9sLmNvbSIsImFkbWluIjpmYWxzZSwiaWF0IjoxNTA3ODQ3MzY4LCJleHAiOjE1MDgwMjAxNjh9.H7NXB25zC6Yd7KedQ40Sn7hjGX4X4NlUCxGTdYO0zTs'
//       };
//
//       chai.request(server)
//         .delete('/api/v1/inventory/5586')
//         .set('Authorization', invalidToken)
//         .end((error, response) => {
//           response.should.have.status(403);
//           response.body.should.be.a('object');
//           response.body.error.should.equal('Invalid token');
//           done();
//         });
//     });
//
//     it('should not delete a source when there is no token', done => {
//       chai.request(server)
//         .delete('/api/v1/inventory/5586')
//         .end((error, response) => {
//           response.should.have.status(403);
//           response.body.should.be.a('object');
//           response.body.error.should.equal('You must be authorized to hit this endpoint.');
//           done();
//         });
//     });
//
//     it('should return a 404 error if an invalid ID is passed', (done) => {
//       chai.request(server)
//         .delete('/api/v1/inventory/pizza')
//         .set('Authorization', token)
//         .end((error, response) => {
//           response.should.have.status(404);
//           response.body.error.should.equal('Cannot find Source with ID of pizza');
//           done();
//         });
//     });
//   });
//
//   describe('DELETE /api/v1/waves/:id', () => {
//     it('should delete a wave when token is in header', done => {
//       chai.request(server)
//         .delete('/api/v1/waves/28689')
//         .set('Authorization', token)
//         .end((error, response) => {
//           response.should.have.status(204);
//           done();
//         });
//     });
//
//     it('should delete a wave when token is in query', done => {
//       chai.request(server)
//         .delete('/api/v1/waves/28689?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY29vbCBhcHAiLCJlbWFpbCI6InRyb2xsNTk5MTBAdHVyaW5nLmlvIiwiYWRtaW4iOnRydWUsImlhdCI6MTUwNzgzMDg4MywiZXhwIjoxNTA4MDAzNjgzfQ.Dyq29el8iSM-78ZfLCUKFJ7cwdm_UIx3ixss741zIbE')
//         .end((error, response) => {
//           response.should.have.status(204);
//           done();
//         });
//     });
//
//     it('should not delete a wave with invalid token', done => {
//       const invalidToken = {
//         'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY29vbCBhcHAiLCJlbWFpbCI6InRyb2xsNTk5MTBAYW9sLmNvbSIsImFkbWluIjpmYWxzZSwiaWF0IjoxNTA3ODQ3MzY4LCJleHAiOjE1MDgwMjAxNjh9.H7NXB25zC6Yd7KedQ40Sn7hjGX4X4NlUCxGTdYO0zTs'
//       };
//
//       chai.request(server)
//         .delete('/api/v1/waves/28689')
//         .set('Authorization', invalidToken)
//         .end((error, response) => {
//           response.should.have.status(403);
//           response.body.should.be.a('object');
//           response.body.error.should.equal('Invalid token');
//           done();
//         });
//     });
//
//     it('should not delete a wave when there is no token', done => {
//       chai.request(server)
//         .delete('/api/v1/waves/28689')
//         .end((error, response) => {
//           response.should.have.status(403);
//           response.body.should.be.a('object');
//           response.body.error.should.equal('You must be authorized to hit this endpoint.');
//           done();
//         });
//     });
//
//     it('should return a 404 error if an invalid ID is passed', (done) => {
//       chai.request(server)
//         .delete('/api/v1/waves/pizza')
//         .set('Authorization', token)
//         .end((error, response) => {
//           response.should.have.status(404);
//           response.body.error.should.equal('Cannot find Wave with ID of pizza');
//           done();
//         });
//     });
//   });
//
//   describe('PATCH /api/v1/inventory', () => {
//     const update = {
//       LOCATION: 'DENVER',
//     };
//
//     it('should update source object when token is in header', (done) => {
//       chai.request(server)
//         .patch('/api/v1/inventory/5586')
//         .set('Authorization', token)
//         .send(update)
//         .end((error, response) => {
//           response.should.have.status(200);
//           response.body.should.be.a('object');
//           response.body.should.have.property('LOCATION');
//           response.body.LOCATION.should.equal('DENVER');
//           response.body.YEAR.should.equal('551');
//           done();
//         });
//     });
//
//     it('should update source object when token is in body', (done) => {
//       chai.request(server)
//         .patch('/api/v1/inventory/5586')
//         .send(Object.assign({}, update, { token }))
//         .end((error, response) => {
//           response.should.have.status(200);
//           response.body.should.be.a('object');
//           response.body.should.have.property('LOCATION');
//           response.body.LOCATION.should.equal('DENVER');
//           response.body.YEAR.should.equal('551');
//           done();
//         });
//     });
//
//     it('should update source object when token is in query', done => {
//       chai.request(server)
//         .patch('/api/v1/inventory/5586?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY29vbCBhcHAiLCJlbWFpbCI6InRyb2xsNTk5MTBAdHVyaW5nLmlvIiwiYWRtaW4iOnRydWUsImlhdCI6MTUwNzgzMDg4MywiZXhwIjoxNTA4MDAzNjgzfQ.Dyq29el8iSM-78ZfLCUKFJ7cwdm_UIx3ixss741zIbE')
//         .send(update)
//         .end((error, response) => {
//           response.should.have.status(200);
//           response.body.should.be.a('object');
//           response.body.should.have.property('LOCATION');
//           response.body.LOCATION.should.equal('DENVER');
//           response.body.YEAR.should.equal('551');
//           done();
//         });
//     });
//
//     it('should not update source object with invalid token', done => {
//       const invalidToken = {
//         'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY29vbCBhcHAiLCJlbWFpbCI6InRyb2xsNTk5MTBAYW9sLmNvbSIsImFkbWluIjpmYWxzZSwiaWF0IjoxNTA3ODQ3MzY4LCJleHAiOjE1MDgwMjAxNjh9.H7NXB25zC6Yd7KedQ40Sn7hjGX4X4NlUCxGTdYO0zTs'
//       };
//
//       chai.request(server)
//         .patch('/api/v1/inventory/5586')
//         .set('Authorization', invalidToken)
//         .send(update)
//         .end((error, response) => {
//           response.should.have.status(403);
//           response.body.should.be.a('object');
//           response.body.error.should.equal('Invalid token');
//           done();
//         });
//     });
//
//     it('should not update source object when there is no token', done => {
//       chai.request(server)
//         .patch('/api/v1/inventory/5586')
//         .send(update)
//         .end((error, response) => {
//           response.should.have.status(403);
//           response.body.should.be.a('object');
//           response.body.error.should.equal('You must be authorized to hit this endpoint.');
//           done();
//         });
//     });
//
//     it('should return a 404 error if an invalid ID is passed', (done) => {
//       chai.request(server)
//         .patch('/api/v1/inventory/pizza')
//         .set('Authorization', token)
//         .send(update)
//         .end((error, response) => {
//           response.should.have.status(404);
//           response.body.error.should.equal('Cannot find Source with ID of pizza');
//           done();
//         });
//     });
//   });
//
//   describe('PATCH /api/v1/waves/:id', () => {
//     const update = {
//       LOCATION: 'DENVER',
//     };
//
//     it('should update wave object when token is in header', (done) => {
//       chai.request(server)
//         .patch('/api/v1/waves/28689')
//         .set('Authorization', token)
//         .send(update)
//         .end((error, response) => {
//           response.should.have.status(200);
//           response.body.should.be.a('object');
//           response.body.should.have.property('LOCATION');
//           response.body.LOCATION.should.equal('DENVER');
//           response.body.YEAR.should.equal('2013');
//           done();
//         });
//     });
//
//     it('should update wave object when token is in body', (done) => {
//       chai.request(server)
//         .patch('/api/v1/waves/28689')
//         .send(Object.assign({}, update, { token }))
//         .end((error, response) => {
//           response.should.have.status(200);
//           response.body.should.be.a('object');
//           response.body.should.have.property('LOCATION');
//           response.body.LOCATION.should.equal('DENVER');
//           response.body.YEAR.should.equal('2013');
//           done();
//         });
//     });
//
//     it('should update wave object when token is in query', done => {
//       chai.request(server)
//         .patch('/api/v1/waves/28689?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY29vbCBhcHAiLCJlbWFpbCI6InRyb2xsNTk5MTBAdHVyaW5nLmlvIiwiYWRtaW4iOnRydWUsImlhdCI6MTUwNzgzMDg4MywiZXhwIjoxNTA4MDAzNjgzfQ.Dyq29el8iSM-78ZfLCUKFJ7cwdm_UIx3ixss741zIbE')
//         .send(update)
//         .end((error, response) => {
//           response.should.have.status(200);
//           response.body.should.be.a('object');
//           response.body.should.have.property('LOCATION');
//           response.body.LOCATION.should.equal('DENVER');
//           response.body.YEAR.should.equal('2013');
//           done();
//         });
//     });
//
//     it('should not update wave object with invalid token', done => {
//       const invalidToken = {
//         'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY29vbCBhcHAiLCJlbWFpbCI6InRyb2xsNTk5MTBAYW9sLmNvbSIsImFkbWluIjpmYWxzZSwiaWF0IjoxNTA3ODQ3MzY4LCJleHAiOjE1MDgwMjAxNjh9.H7NXB25zC6Yd7KedQ40Sn7hjGX4X4NlUCxGTdYO0zTs'
//       };
//
//       chai.request(server)
//         .patch('/api/v1/waves/28689')
//         .set('Authorization', invalidToken)
//         .send(update)
//         .end((error, response) => {
//           response.should.have.status(403);
//           response.body.should.be.a('object');
//           response.body.error.should.equal('Invalid token');
//           done();
//         });
//     });
//
//     it('should not update wave object when there is no token', done => {
//       chai.request(server)
//         .patch('/api/v1/waves/28689')
//         .send(update)
//         .end((error, response) => {
//           response.should.have.status(403);
//           response.body.should.be.a('object');
//           response.body.error.should.equal('You must be authorized to hit this endpoint.');
//           done();
//         });
//     });
//
//     it('should return a 404 error if an invalid ID is passed', (done) => {
//       chai.request(server)
//         .patch('/api/v1/waves/gummi-worms')
//         .send(update)
//         .set('Authorization', token)
//         .end((error, response) => {
//           response.should.have.status(404);
//           response.body.error.should.equal('Cannot find Wave with ID of gummi-worms');
//           done();
//         });
//     });
//   });
// });
