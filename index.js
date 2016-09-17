var amqp = require( 'amqplib/callback_api' )
var log  = require( 'npmlog' )
var uuid = require( 'node-uuid' )

var heartbeat = exports = module.exports = {
	serviceName : 'None',
	rabbitMqURL : 'amqp://localhost',
	serviceID   : uuid.v4(),
	status      : '',
	version     : '',
	error       : '',
	mqChannel   : null
}

heartbeat.start = function start( amqURL, name, version, interval  ) {
	this.serviceName = name
	this.rabbitMqURL = amqURL
	var timerInterval = 10000
	this.version = version
	if ( interval ) timerInterval = interval
	// start it
	mqConnect( 
		function ( err, ch ) {
			if ( ! err ) {
				heartbeat.mqChannel = ch 
				setInterval( amqpHeartbeat, timerInterval )
				log.info( 'amqp-heartbeat', 'Started.' )
			}
		}
	)
}

heartbeat.setStatus = function setStatus( statusText ) {
	this.status = statusText
}

heartbeat.setError = function setError( errorText ) {
	this.error = errorText
}

function mqConnect( callback ) {
	amqp.connect( heartbeat.rabbitMqURL,
			function( err, conn ) {
				if ( err != null ) { 
					log.error( 'amqp-heartbeat', err )
					callback( err, null ) 
				} else {
					conn.createChannel( 
						function( err, ch ) {
							if ( err != null ) { 
								log.error( 'amqp-heartbeat', err ) 
								callback( err, null ) 
							} else {
								//log.info( 'amqp-heartbeat', 'connected to '+heartbeat.rabbitMqURL )
								callback( err, ch )								
							}
						}
					)					
				}
			}
	)
}

function amqpHeartbeat() {
	//log.info( 'amqp-heartbeat', 'start with '+heartbeat.rabbitMqURL  )
	var host = 'unknown'
	if ( process.env['HOSTNAME'] ) host = process.env['HOSTNAME']
	var heartbeatMsg = 
		{ 
			serviceName    : heartbeat.serviceName, 
			serviceVersion : heartbeat.version,
			serviceID      : heartbeat.serviceID, 
			heartbeatTime  : Date.now(), 
			host           : host,
			status         : heartbeat.status,
			error          : heartbeat.error
		}
	var msg = JSON.stringify( heartbeatMsg )
	heartbeat.mqChannel.assertExchange( 'heartbeats', 'topic',	{ durable : false }	)
	heartbeat.mqChannel.publish( 'heartbeats', 'dashboard.collector', new Buffer( msg ) )
	//log.info( 'amqp-heartbeat' + msg  );
}
