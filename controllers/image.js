const clarifai = require('clarifai');

const app = new Clarifai.App({
	apiKey: process.env.CLARI_KEY
});

const handleAPICall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then((data) => res.json(data))
		.catch((err) => res.status(400).json('unable to work with API'));
};

const handleImage = (req, res, knex) => {
	const { id } = req.body;
	knex('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then((entries) => res.json(entries[0]))
		.catch(() => res.status(400).json('something went wrong'));
};

module.exports = { handleImage, handleAPICall };
