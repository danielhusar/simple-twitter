# Node Simple Twitter

## Description

Twitter simple library.
It supporst API 1.1
Currently it runs get and post methods.
It supports caching inside json files, and node events.

## Installation
Download and place it inside node_moudles.
Or use npm: npm install node-simple-twitter.

# Usage

Constructor:
```javascript
 var twitter= require('twitter');
 twitter = new twitter('xxx', 
 		               		 'xxx', 
 		               		 'xxx',
		               		 'xxx',
 		               		  3600
 	               			 );
```

Get method:
```javascript
twitter.get('statuses/user_timeline',  
						 function(error, data) {
						   console.dir(data);
					   }
 				   );
```
Get method via node events.
```javascript
twitter.get("statuses/user_timeline");
twitter.on('get:statuses/user_timeline', function(error, data){
  console.dir(data);
});
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
twitter.post('statuses/update', {'status' : 'testing message'});
twitter.on('post:statuses/update', function(error, data){
  console.dir(data);
});
```
