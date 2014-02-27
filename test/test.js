'use strict';
var assert = require('assert');
var should = require('should');
var fs = require('fs');
var twitter = require('../index');
var noCache = new twitter('xxx', 'xxx', 'xxx', 'xxx', false);
var cache = new twitter('xxx', 'xxx', 'xxx', 'xxx', true);

//mockups
noCache.oa = {};
cache.oa = {};
noCache.oa.get = function(a,b,c,callback){
  callback({error: "none"}, {test: "test"});
};
noCache.oa.post = function(a,b,c,d,callback){
  callback({error: "none"}, {test: "test"});
};
cache.oa.get = function(a,b,c,callback){
  callback({error: "none"}, {test: "test"});
};


describe('Globals: ', function(){
  it('Object should exist', function () {
    assert(typeof twitter, 'function');
  });
});


describe('Without cache: ', function(){
  it('Get data works', function () {
    noCache.get('whatever', function(error, data) {
      data.test.should.equal('test');
    });
  });
  it('Post data works', function () {
    noCache.post('whatever', {}, function(error, data) {
      data.test.should.equal('test');
    });
  });
});

describe('With cache: ', function(){
  it('Get data works', function () {
    cache.get('whatever', function(error, data) {
      data.test.should.equal('test');
    });
    cache.oa.get = function(a,b,c,callback){
      callback({error: "none"}, {test: "test2"});
    };
    cache.get('whatever', function(error, data) {
      data.test.should.equal('test');
      //clear cache folder
      fs.unlink('cache/whatever.json');
    });
  });
});
