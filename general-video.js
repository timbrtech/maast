const Twit = require('twit')
const request = require('request')
const fs = require('fs')
const config = require('./config')
const path = require('path')
const Tabletop = require('tabletop');

const T = new Twit(config)

// var b64content = fs.readFileSync('images/IMG_2024.jpg', { encoding: 'base64' })

// Get Image //	
function random_from_array(images){
	return images[Math.floor(Math.random() * images.length)];
	}

// first we must upload the media to Twitter	
function upload_random_image(images) {
	console.log('Opening and image...')
	var filePath = path.join(__dirname, '/videos/' + random_from_array(images)),
		b64content = fs.readFileSync(filePath, { encoding: 'base64' });
		
	console.log('Uploading an image...')
	
// next we must post the media to Twitter
T.postMediaChunked({ file_path: filePath }, function (err, data, response) {
  if (err) {
		console.log('ERROR:');
		console.log(err);
	}
	else{
		console.log('Image uploaded!');
		console.log('Now tweeting it...');
		console.log(data.media_id_string);
  // now we can assign alt text to the media, for use by screen readers and
  // other text-based presentations and interpreters
  var mediaIdStr = data.media_id_string
  var meta_params = { media_ids: [mediaIdStr] }
  
  //initiate tabletop
  //grab random text
  Tabletop.init({ 
  key: 'https://docs.google.com/spreadsheets/d/1mRGZyB4kCax0-VAl8PFjb988BDnBFsYFo6W9KnXrFHw/edit?usp=sharing',
  callback: (data, tabletop) => {
    var item = data[Math.floor(Math.random() * data.length)];
    console.log(item.copy)

      // now we can reference the media and post a tweet (media will attach to the tweet)
      var params = { status: item.copy, media_ids: [mediaIdStr] }

      T.post('statuses/update', params, function (err, data, response) {
        console.log(data.text)
      })
  
    },
  simpleSheet: true
});
}
})
}

fs.readdir(__dirname + '/videos', function(err, files) {
	if (err) {
		console.log(err);
	}
	else{
		var images = [];
		files.forEach(function(f) {
			images.push(f);
		});
		
		upload_random_image(images);
		
	}
});