# Simple Twitter [![Build Status](https://travis-ci.org/danielhusar/simple-twitter.svg?branch=master)](https://travis-ci.org/danielhusar/simple-twitter) [![NPM version](https://badge.fury.io/js/simple-twitter.svg)](http://badge.fury.io/js/simple-twitter)

[![NPM](https://nodei.co/npm/simple-twitter.png)](https://nodei.co/npm/simple-twitter/)

## Description

Twitter simple library.<br>
It supporst API 1.1<br>
Currently it runs only get and post methods. (streaming is not supported)<br>
It supports caching inside json files, and node events.

## Installation
Download and place it inside node_modules.<br>
Or use npm: <b>npm install simple-twitter</b>.

# Usage

Constructor:
```javascript
 var twitter = require('simple-twitter');
 twitter = new twitter( 'xxx', //consumer key from twitter api
						'xxx', //consumer secret key from twitter api
						'xxx', //acces token from twitter api
			 			'xxx', //acces token secret from twitter api
						3600  //(optional) time in seconds in which file should be cached (only for get requests), put false for no caching
		      		  );
```

Get method:
```javascript
twitter.get('statuses/user_timeline',
			function(error, data) {
				console.dir(data);
		   });
```
Get method via node events.
```javascript
twitter.on('get:statuses/user_timeline', function(error, data){
	console.dir(data);
});
twitter.get("statuses/user_timeline");
```

Chainable get method via node events.
```javascript
twitter.on('get:search/tweets', function(error, data){
	console.dir(data);
}).get("search/tweets", "?geocode=37.781157,-122.398720,100mi");
```

Post method:
```javascript
twitter.post('statuses/update',
			 {'status' : 'testing message'},
				function(error, data) {
					console.dir(data);
				}
			);
```
Post method via node events.
```javascript
twitter.on('post:statuses/update', function(error, data){
	console.dir(data);
});
twitter.post('statuses/update', {'status' : 'testing message'});
```

