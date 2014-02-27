'use strict';

var OAuth= require('oauth').OAuth,
    util = require('util'),
    events = require('events'),
    fs = require('fs');

/**
 * Main twitter function
 * @param  {string} consumer_key        consumer key from twitter api
 * @param  {string} consumer_secret     consumer secret key from twitter api
 * @param  {string} access_token        acces token from twitter api
 * @param  {string} access_token_secret acces token secret from twitter api
 * @param  {number} cache               (optional) time in seconds in which file should be cached (only for get requests), put false for no caching
 * @return {void}
 * @chainable
 *
 * @sample usage:
 *
 * Constructor:
 * var twitter= require('twitter');
 * twitter = new twitter('xxx',
 *                       'xxx',
 *                       'xxx',
 *                       'xxx',
 *                        3600
 *                       );
 *
 *
 * Getting data from twitter:
 * --------------------------
 * twitter.get('statuses/user_timeline',
 *             function(error, data) {
 *               console.dir(data);
 *             }
 *            );
 *
 *
 * Getting data with the events emmiter:
 *
 * twitter.on('get:statuses/user_timeline', function(error, data){
 *   console.dir(data);
 * });
 * twitter.get('statuses/user_timeline');
 *
 * Searching for some tweets
 * twitter.on('get:search/tweets', function(error, data){
 *   console.dir(data);
 * });
 * twitter.get("search/tweets", "?geocode=37.781157,-122.398720,100mi");
 *
 *
 * Posting data to twitter:
 * ------------------------
 * twitter.post('statuses/update',
 *              {'status' : 'testing message'},
 *              function(error, data) {
 *                console.dir(data);
 *              }
 *             );
 *
 * Posting data with events emmiter:
 *
 * twitter.on('post:statuses/update', function(error, data){
 *   console.dir(data);
 * });
 * twitter.post('statuses/update', {'status' : 'testing message'});
 *
 */
exports.twitter= function(consumer_key, consumer_secret, access_token, access_token_secret, cache) {
  this.consumer_key        = consumer_key;
  this.consumer_secret     = consumer_secret;
  this.access_token        = access_token;
  this.access_token_secret = access_token_secret;
  this.cache               = cache || false;
  this.baseUrl             = 'https://api.twitter.com/1.1/';
  this.type                = 'json';
  this.oa                  = new OAuth('https://twitter.com/oauth/request_token',
                                       'https://twitter.com/oauth/access_token',
                                       this.consumer_key,
                                       this.consumer_secret,
                                       '1.0A',
                                       null,
                                       'HMAC-SHA1'
                                      );
  events.EventEmitter.call(this);
};

util.inherits(exports.twitter, events.EventEmitter);

/**
 * Get methods to the twitter api
 * @param  {method}   string   method from twitter api
 * @param  {params}   string   query params to include
 * @param  {Function} function callback to be called when we get data
 * @return {void}
 */
exports.twitter.prototype.get = function(method, params, callback) {

  callback = (typeof callback === 'function') ? callback : params;
  params = (typeof params === 'string') ? params : '';

  var cacheName = method.replace(/\//g, '-'),
      data,
      that = this;


  var getData = function(){
    try{
      that.oa.get(that.baseUrl + method +'.' + that.type + params,
                  that.access_token,
                  that.access_token_secret,
                  function(error, data) {
                    execute(error, data);
                    if(that.cache && !data.errors){
                      helpers.storeCache(cacheName, data);
                    }
                  }
                 );
    }catch(err){
      if(that.cache && (data = helpers.getCache(cacheName))){
        execute({error: 'none'}, data);
      } else {
        execute({error : 'An error occured'}, {error : 'Twitter is probably down.'});
      }
    }
  };

  var execute = function(error, data){
    if(typeof callback === 'function'){
      callback(error, data);
    }
    that.emit('get:' + method, error, data);
  };

  if(this.cache){
    helpers.cacheDir();
    var fileUpdate = helpers.readCache(cacheName).mtime || false;
    var lastUpdate = fileUpdate ? (new Date().getTime() - new Date(fileUpdate).getTime()) / 1000 : false;
    if(lastUpdate && lastUpdate < this.cache){
      if(data = helpers.getCache(cacheName)){
        execute({error: 'none'}, JSON.parse(data));
      }else{
        getData();
      }
    }else{
      getData();
    }
  }else{
    getData();
  }

  return this;

};

/**
 * Post methos to twitter api
 * @param  {string}   method   method from the twitter api
 * @param  {object}   params   data to post
 * @param  {Function} callback callback to be executed in post finished
 * @return {void}
 */
exports.twitter.prototype.post = function(method, params, callback) {
  var that = this;
  that.oa.post(that.baseUrl + method +'.' + that.type,
               that.access_token,
               that.access_token_secret,
               params,
               function(error, data) {
                  if(typeof callback === 'function'){
                    callback(error, data);
                  }
                  that.emit('post:' + method, error, data);
                }
              );
  return this;
};



/**
 * Helpers object
 */
var helpers = {

  /**
   * Base path for caching for our app
   * @type {string}
   */
  baseCachePath :  process.cwd() + '/cache/',

  /**
   * Returns the fullfile path
   * @param  {file} file - file name
   * @return {string} full file path
   */
  basePathFile : function(file){
    return (helpers.baseCachePath + file + '.json');
  },

  /**
   * Create directory for caching
   * @return {void}
   */
  cacheDir : function(){
    if(!fs.existsSync(helpers.baseCachePath)){
      fs.mkdir(helpers.baseCachePath);
    }
  },

  /**
   * Get the cached file
   * @param  {file} file - file name
   * @return {object} file content or false if it doesnt exists
   */
  getCache : function(file){
    file = helpers.basePathFile(file);
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8' ) : false;
  },

  /**
   * Read the file properties
   * @param  {string} file - file name
   * @return {object} file properties or false if it doesnt exists
   */
  readCache : function(file){
    file = helpers.basePathFile(file);
    return fs.existsSync(file) ? fs.statSync(file) : false;
  },

  /**
   * Store data in file
   * @param  {filenam} file - file name
   * @param  {object} data to storeCache
   * @return {void}
   */
  storeCache : function(file, data){
    if(typeof data === 'object'){
      data = JSON.stringify(data);
    }
    file = helpers.basePathFile(file);
    fs.writeFileSync(file, data);
  }

};
