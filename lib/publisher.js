var redis = require('redis');

function Publisher(args) {

	if (Publisher._instance) {
		return Publisher._instance;
	}

	args = args || {}; 
	var options = args.options || {};

	this._channel = options.channel || 'main';
	this._isReady = false;
	_instance = this;


	options.host = options.host || '127.0.0.1';
	options.port = options.port || 6379;
	
	var redisURI = args.redisURI;
	
	if(redisURI) {
		delete args.redisURI;
		this._client = redis.createClient(redisURI, options);
	} else {
		this._client = redis.createClient(options);
	}

	this._client.on('ready', function() {
		_instance._isReady = true;
		if(options.readyCB) {
			options.readyCB()
		}
	})
}

Publisher.prototype.client = function() {
	return this._client;
};

Publisher.prototype.publish = function(payload, channel) {
	const Channel = typeof channel == 'undefined' 	? this._channel 
				  : typeof channel == 'string' 		? channel 
													: this._channel + ":" + id;
	console.log('[PUB] Publishing on: ' + Channel + ' message: ' + payload);
	return this._client.publish(Channel, payload);
};

module.exports = Publisher;