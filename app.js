var express = require('express'),
	bodyParser = require('body-parser');
const oAuth2Service = require('./authentication/OAuth2Service.js').getInstance();
const PORT = 5000;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.all('/oauth/token', oAuth2Service.obtainToken);
app.use(oAuth2Service.authenticateRequest);

app.get('/', function(req, res) {

	res.send('Congratulations, you are in a secret area!');
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app;
