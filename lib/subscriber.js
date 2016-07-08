var redis = require('redis');

function Subscriber(args) {

	if (typeof Subscriber._id == 'undefined') {
		Subscriber._id = 0;
	}

	args = args || {};
	var options = args.options || {};

	this._channel = options.channel || 'main';
	this._isReady = false;
	this.id = Subscriber._id++;
	
	options.host = options.host || '127.0.0.1';
	options.port = options.port || 6379;
	
	var redisURI = args.redisURI;
	if(redisURI) {
		delete args.redisURI;
		this._client = redis.createClient(redisURI, options);
	} else {
		this._client = redis.createClient(options);
	}

	var self = this;
	this._client.on('ready', function() {
		self._isReady = true;
		console.log('Subscriber ' + self.id +' is ready')
		if(options.readyCB) {
			options.readyCB();
		}
		var auth = args.auth;
		if(auth) {
			self._client.auth(auth.password, auth.callback)
		}
	})
}

Subscriber.prototype.client = function() {
	return this._client;
};

Subscriber.prototype.subscribe = function(callback) {
	callback = callback || function() { console.log('Default Sub Handler')};
	var self = this;
	this._client.on('message', function(channel, message){
		console.log('[SUB id=' + self.id + ']  Channel : ' + channel + ' Message: ' + message);
		if((self.channel + ':' + self.id) === channel) {
			callback(message);
		}
	})
	console.log('Subscribing on : ' + this._channel + ':' + this.id)
	this._client.subscribe(this._channel + ':' + this.id)
};

Subscriber.prototype.unsubscribe = function() {
	var self = this;
	this._client.unsubscribe();
	this._client.on('unsubscribe', function(){
		self._client.end();
	})
} 

module.exports = Subscriber;