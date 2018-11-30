const axios = require('axios');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

const { authenticate, generateToken } = require('./middlewares');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 4);
  creds.password = hash;

  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => res.status(404).json({ message: 'Failed to register user'}));
};

function login(req, res) {
  // implement user login
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user)
        res.status(200).json({ message: 'Logged in', token });
      } else {
        res.status(401).json({ message: 'Wrong username or password' });
      }
    }).catch(err => res.status(500).json({ message: 'You shall not pass!!!' }));
};

function getJokes(req, res) {
  axios
    .get(
      'https://safe-falls-22549.herokuapp.com/random_ten'
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
