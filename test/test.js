'use strict';
var assert = require('assert');
var should = require('should');
var fs = require('fs');
var twitter = require('../index');
var noCache = new twitter('xxx', 'xxx', 'xxx', 'xxx', false);
var cache = new twitter('xxx', 'xxx', 'xxx', 'xxx', 3600);

//mockups
noCache.oa = {};
cache.oa = {};
noCache.oa.get = function(a,b,c,callback){
  callback({error: 'none'}, {test: 'test'});
};
noCache.oa.post = function(a,b,c,d,callback){
  callback({error: 'none'}, {test: 'test'});
};
cache.oa.get = function(a,b,c,callback){
  callback({error: 'none'}, {test: 'test'});
};


describe('Globals: ', function(){
  it('Object should exist', function () {
    assert(typeof twitter, 'function');
  });
});

describe('Events emmiters without cache: ', function(){
  it('Get data works', function () {
    noCache.on('get:whatever', function(error, data){
      data.test.should.equal('test');
    });
  });
  it('Post data works', function () {
    noCache.on('post:whatever', function(error, data){
      data.test.should.equal('test');
    });
  });
});

describe('Callbacks without cache: ', function(){
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

describe('Event emmiters Callbacks with cache: ', function(){
  it('Get data works', function () {
    cache.on('get:whatever2', function(error, data) {
      data.test.should.equal('test');
    }).get('whatever2');
  });
});


describe('Callbacks with cache: ', function(){
  it('Get data works', function () {
    cache.get('whatever', function(error, data) {
      data.test.should.equal('test');
    });
    cache.oa.get = function(a,b,c,callback){
      callback({error: 'none'}, {test: 'test2'});
    };
    cache.get('whatever', function(error, data) {
      data.test.should.equal('test');
      fs.unlink('cache/whatever.json');
    });
  });
});
