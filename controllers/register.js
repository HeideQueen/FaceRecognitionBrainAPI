const handleRegister = (req, res, knex, bcrypt) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json('incorrect form submission');
	}
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
};

module.exports = { handleRegister };
