const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), () => {
  /* eslint-disable no-alert, no-console */
  console.log(`Final Assessment is running on ${app.get('port')}.`);
  /* eslint-enable no-alert, no-console */
});

app.get('/api/v1/inventory', (request, response) => {
  database('inventory')
    .select()
    .then(item => response.status(200).json(item))
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/inventory/:id', (request, response) => {
  const { id } = request.params;
  database('inventory')
    .where({ ID: id })
    .select()
    .then(
      item =>
        !item.length ? response.status(404).json({ error: 'Could not be found.' }) : response.status(200).json(item)
    )
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/history', (request, response) => {
  database('history')
    .select()
    .then(order => response.status(200).json(order))
    .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/history', (request, response) => {
  const order = request.body;
  database('history')
    .insert(order, '*')
    .then(item => response.status(201).json(item))
    .catch(error => response.status(500).json({ error }));
});

app.delete('/api/v1/inventory/:id', (request, response) => {
  const { id } = request.params;
  database('inventory')
    .where({ ID: id })
    .del()
    .then(
      deleted =>
        !deleted
          ? response.status(404).json({ error: `Cannot find Item with ID of ${id}` })
          : response.sendStatus(204)
    )
  .catch(error => response.status(500).json({ error }));
});

module.exports = app;
