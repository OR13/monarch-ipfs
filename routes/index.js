var express = require('express');                                                              
var firebase = require("firebase");
var gcloud = require('google-cloud');
var storage = gcloud.storage;
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var ipfsAPI = require('ipfs-api')
// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'}) // leaving out the arguments will default to these values

var projectId = 'transmute-industries';
// var projectId = process.env.GCLOUD_PROJECT;

var gcs = storage({
  projectId: projectId,
  keyFilename: './credentials.json'
});

// var firebaseApp = firebase.initializeApp({
//   serviceAccount: "./credentials.json",
//   databaseURL: "process.env.DATABASE_URL"
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Monarch' });
});

router.post('/upload', multipartMiddleware, function(req, res, next) {

	ipfs.util.addFromFs(req.files.file['path'], { recursive: false }, (err, result) => {
	  if (err) {
	    throw err
	  }

		var bucket = gcs.bucket('monarch-app');
		req.body = {hash : result[0]['hash']};
		console.log(req.body);
		// Upload a local file to a new file to be created in your bucket.
		bucket.upload(req.files.file['path'], function(err, file) {
		  if (!err) {
		  	res.end('Success');
		  } else {
		  	res.end('Upload failed');
		  }
		});
	})


});

module.exports = router;