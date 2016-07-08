Pub/Sub Redis for Nodejs
=================

Lightweight abstraction of nodejs' Redis Pub/Sub feature. The module
consists of a singleton class for the publisher and a subscriber class that can
have multiple instances. 

## Install
```bash
$ npm install redis-pubsub      
```

## Usage
### Setup

```javascript
/*** PUB CODE ***/

var Publisher    = require('redis-pubsub').Publisher;

var args = {
  options :{
    channel: 'mainchannel',
    host  : 'localhost',
    port  : 6379,   
  },
  /* 
    Callback function that will be callede when 
    the publisher is ready
  */
  readyCB : function() {
    console.log('Publisher is ready')
  },
};

var pub = new Publisher(args);

/*** SUB CODE ***/
var Subscriber    = require('redis-pubsub').Subscriber;

var args = {
  options :{
    channel: 'mainchannel',
    host  : 'localhost',
    port  : 6379,   
  },
  /* 
    Callback function that will be callede when 
    the publisher is ready
  */
  readyCB : function() {
    console.log('Subscriber is ready')
  },
};

var sub1 = new Subscriber(args);
var sub2 = new Subscriber(args);
```

Alternatively you can use the Redis URI 

```javascript
var Subscriber    = require('redis-pubsub').Subscriber;

var args = {
  options: {
    channel: 'mainchannel',
  }
  redisURI: 'redis://:password@hostname:port/db_number'
  readyCB : function() {
    console.log('Subscriber is ready')
  },
};

```

### Publishing and Subscribing

```javascript
/*** PUB CODE ***/
var sub1_id = 1;
var sub2_id = 1;
pub.publish("This is my message for sub1", sub2_id)
pub.publish("This is my message for sub2", sub2_id)

/*** PUB CODE ***/
sub1.subscribe(function(mesage){
  console.log(message);
  //Should be 'This is my message for sub1'
})

sub1.subscribe(function(mesage){
  console.log(message);
  //Should be 'This is my message for sub1'
})

sub1.unsubscribe()
sub2.unsubscribe()
```