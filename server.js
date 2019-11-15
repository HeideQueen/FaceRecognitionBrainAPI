const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
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

app.get('/', (req, res) => {
	res.json(dataBase.users);
});

app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	knex
		.select('email', 'hash')
		.from('login')
		.where('email', '=', email)
		.then((data) => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return knex
					.select('*')
					.from('users')
					.where('email', '=', email)
					.then((user) => {
						res.json(user[0]);
					})
					.catch((err) => res.status(400).json(err));
			} else {
				throw Error;
			}
		})
		.catch(() => res.status(400).json('wrong credentials'));
});

app.post('/register', (req, res) => {
	const { name, email, password } = req.body;
	const hash = bcrypt.hashSync(password);
	knex
		.transaction((trx) => {
			trx
				.insert({
					email: email,
					hash: hash
				})
				.into('login')
				.returning('email')
				.then((loginEmail) => {
					return trx('users')
						.returning('*')
						.insert({
							name: name,
							email: loginEmail[0],
							joined: new Date()
						})
						.then((user) => {
							res.json(user[0]);
						});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		})
		.catch(() => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	knex
		.select('*')
		.from('users')
		.where({ id })
		.then((user) => {
			if (user.length) {
				res.json(user[0]);
			} else {
				throw Error;
			}
		})
		.catch(() => res.status(404).json('user not found'));
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	knex('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then((entries) => res.json(entries[0]))
		.catch(() => res.status(400).json('something went wrong'));
});

app.listen(3000, () => console.log("server's up nya!!"));
