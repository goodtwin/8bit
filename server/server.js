var express = require('express'),
	app = express(),
	nodemailer = require('nodemailer'),
	mongoose = require('mongoose'),
	baucis = require('baucis'),
	os = require('os'),
	_ = require('underscore');

app.use(express.bodyParser());

//NodeMailer
var smtpTransport = nodemailer.createTransport('SMTP',{
	service: 'Gmail',
	auth: {
		user: 'support@good-twin.com',
		pass: 'gflyingpig3'
	}
});

app.post( '/email', function( req, res ){

	var name = req.body.name,
		email = req.body.email,
		handle = req.body.handle,
		body = req.body.text;

	// setup e-mail data with unicode symbols
	var mailOptions = {
			from: name + '<' + email +'>', // sender address
			to: 'greg@good-twin.com', // list of receivers
			subject: '8-Bit Request Form', // Subject line
			text: name+'\n'+email+'\n'+body //, // plaintext body
		};

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				console.log(error);
			}else{
				console.log('Message sent: ' + response.message);
				res.writeHead(200, {'content-type': 'text/json' });
				res.write( JSON.stringify({ status : 'email sent'}) );
				res.end('\n');
			}

			// if you don't want to use this transport object anymore, uncomment following line
			smtpTransport.close(); // shut down the connection pool, no more messages
		});
});

//

var host = os.hostname();
var patt = /.local/g;
var result = patt.test(host);
if(result){
	mongoose.connect('mongodb://localhost:17017/8bitomaha');
}
else {
	mongoose.connect('mongodb://localhost/8bitomaha');
}


var EightBit = new mongoose.Schema({
	first_name: String,
	last_name: String,
	handle: String,
	date_added: String
});

// Note that Mongoose middleware will be executed as usual
//Vegetable.pre('save', function () { ... });

// Register the schemata
var eightbit = mongoose.model('eightbit', EightBit );

// Create the API routes
baucis.rest({
	singular: 'eightbit',
	all: function (request, response, next) {
		response.header("Access-Control-Allow-Origin", "*");
		response.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	}
});

// Add seed.json data to mongo
// _.each(seed, function(el, idx){
// 	var newDoc = new eightbit( el );
// 	newDoc.save(function(err, data){
// 		if (err) {

// 		}
// 		else {
// 			console.log(data);
// 		}
// 	});
// });


app.use('/api/v1', baucis());
app.listen(3000);
console.log('Listening on port 3000');