var http = require('http');
var mailer = require("nodemailer");
var config = require("./config");

var ip = '';

var smtp = mailer.createTransport({
   service: config.service,
   auth: config.auth
});

console.log("starting");

sendIp();
setInterval(sendIp, 600000);

function sendIp() {
	console.log("checking ip");
	http.get("http://checkip.amazonaws.com", function(response) {
	   var body = '';
	    response.on('data', function(d) {
	        body += d;
	    });
	    response.on('end', function() {
	    	console.log("received data");
	        if (ip != body)
	        {
	        	console.log("sending mail");
	    		smtp.sendMail({
				   from: config.sender, // sender address
				   to: config.receiver, // comma separated list of receivers
				   subject: "Your external IP has changed or has been initiated " + body, // Subject line
				   text: "IP " + body, // plaintext body
				   html: "IP " + body
				}, function(error, info){
				    if(error){
				        return console.log(error);
				    }
				    console.log('Message sent: ' + info.response);
				});
	        }

	        ip = body;

	    });
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}
