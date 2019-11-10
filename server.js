const express = require('express');

const app = express();

app.use(express.json());

const dataBase = {
	users: [
		{
			id: '123',
			name: 'queen',
			email: 'queen@queen.com',
			password: 'donuts',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'miruu',
			email: 'miruu@queen.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}
	]
};

app.get('/', (req, res) => {
	res.json(dataBase.users);
});

app.post('/signin', (req, res) => {
	if (req.body.email === dataBase.users[0].email && req.body.password === dataBase.users[0].password) {
		res.json('success');
	} else {
		res.status(400).json('error logging in');
	}
});

app.post('/register', (req, res) => {
	const { name, email, password } = req.body;
	dataBase.users.push({
		id: '124',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	res.json(dataBase.users[dataBase.users.length - 1]);
});

app.listen(3000, () => console.log("server's up nya!!"));
