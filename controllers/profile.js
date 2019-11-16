const handleProfile = (req, res, knex) => {
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
};

module.exports = { handleProfile };
