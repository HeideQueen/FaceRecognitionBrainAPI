const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const knex = require('knex')({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		port: '5433',
		user: 'heidequeen',
		password: '888',
		database: 'smart-brain'
	}
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('You found my API :c'));

app.post('/signin', (req, res) => signin.handleSignin(req, res, knex, bcrypt));

app.post('/register', (req, res) => register.handleRegister(req, res, knex, bcrypt));

app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, knex));

app.put('/image', (req, res) => image.handleImage(req, res, knex));

app.post('/imageurl', (req, res) => image.handleAPICall(req, res));

app.listen(process.env.PORT || 3000, () => console.log("server's up nya!!"));
