const axios = require('axios');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

const { authenticate } = require('./middlewares');

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

function generateToken(user) {
  const payload = {
      subject: user.id,
      username: user.username,
  };

  const secret = process.env.JWT_SECRET;
  const options = {
      expiresIn: '1m',
  };

  return jwt.sign(payload, secret, options);
}

function login(req, res) {
  // implement user login
  const creds = reg.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if(user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ message: 'Logged in' });
      } else {
        res.status(401).json({ message: 'Wrong username or password' });
      }
    }).catch(err => res.status(404).json({ message: 'You shall not pass!!!' }));
};

function getJokes(req, res) {
  axios
    .get(
      'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten'
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
