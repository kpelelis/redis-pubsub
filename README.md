Pub/Sub Redis for Nodejs
=================

Lightweight abstraction of nodejs' Redis Pub/Sub feature. The module
consists of a singleton class for the publisher and a subscriber class that can
have multiple instances. 

## Install
```bash
$ npm install redis_pubsub      
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
    Callback function that will be called when 
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

/*** SUB CODE ***/
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

## API Reference
### Publicer
`Publicer` is a singleton Object that has some methods regarding. Connection and message publishing

### Publicer(args)  
Initialize the Publicer instance with specific arguments. This can be the following  

| Argument      | Default       | Description  |
| ------------- | ------------- | ----- |
| redisURI      | null | This option can be used to connect to redis instance via URI. An example is shown in the code above |
| readyCB      | function() {} | This is the function to be called after the instance is ready |
| options | {host: '127.0.0.1', port: 6379, channel: 'main'}      |   The options used when connecting to Redis. Most of them can be found [here](https://github.com/NodeRedis/node_redis/blob/master/README.md#options-object-properties |

### Publicer.client()
Returns the instance of the Redis client created by the node-redis api

### Publicer.publish(payload[, channel])
Publish a message to the channel. *payload* is the data to send in a string. Channel can be either empty, a channel name or a subscriber id. In the first case the message is sent to the channel defined in the initialization, in the second case the message is sent to the arbitary channel name, and in the third case it is sent on the `*channel*:*sid*` where channel is the initial channel name and sid the id of the subscriber.

### Subscriber
`Subscriber` is a class that can be instanciated multiple times in order to create multiple subscribers

### Subscriber(args)
The arguments used when constructin a Subscriber object are the same as in Publicer object.

### Subscriber.client()
Returns the instance of the Redis client created by the node-redis api


### Subscriber.subscribe(callback)
Subscribe to the channel used in the construction of the object. The callback will be called only if a message is published on the id specific channel

### Subscriber.unsubscribe()
Unsubscribe from all channels and terminate the client 
