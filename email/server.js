var express = require('express'),
	app = express(),
	nodemailer = require('nodemailer'),
	mongoose = require('mongoose');

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
				console.log("Message sent: " + response.message);
				res.writeHead(200, {'content-type': 'text/json' });
				res.write( JSON.stringify({ status : 'email sent'}) );
				res.end('\n');
			}

			// if you don't want to use this transport object anymore, uncomment following line
			smtpTransport.close(); // shut down the connection pool, no more messages
	});
});

app.listen(3000);
console.log('Listening on port 3000');