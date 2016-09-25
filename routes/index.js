var express = require('express');                                                              
var firebase = require("firebase");
var gcloud = require('google-cloud');
var storage = gcloud.storage;
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var projectId = 'transmute-industries';
// var projectId = process.env.GCLOUD_PROJECT;

var gcs = storage({
  projectId: projectId,
  keyFilename: './credentials.json'
});

// var firebaseApp = firebase.initializeApp({
//   serviceAccount: "/Users/ericolszewski/Developer/JavaScript/mondarch-ipfs/credentials.json",
//   databaseURL: "https://transmute-industries.firebaseio.com"
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Monarch' });
});

router.post('/upload', multipartMiddleware, function(req, res, next) {
	var bucket = gcs.bucket('monarch-app');

	// Upload a local file to a new file to be created in your bucket.
	bucket.upload(req.files.file['path'], function(err, file) {
	  if (!err) {
	  	console.log('success');
	  } else {
	  	console.log('upload failed');
	  }
	});

});

module.exports = router;