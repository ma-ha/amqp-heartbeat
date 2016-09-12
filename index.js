var amqp = require( 'amqplib/callback_api' )
var log  = require( 'npmlog' )
var uuid = require( 'node-uuid' )

var heartbeat = exports = module.exports = {
	serviceName : 'None',
	rabbitMqURL : 'amqp://localhost',
	serviceID   : uuid.v4(),
	status      : '',
	mqConn      : null
}

heartbeat.start = function start( amqURL, name, interval  ) {
	this.serviceName = name
	this.rabbitMqURL = amqURL
	var timerInterval = 10000
	if ( interval ) timerInterval = interval
	// start it
	mqConnect( 
		function ( err, conn ) {
			if ( ! err ) {
				heartbeat.mqConn = conn
				setInterval( amqpHeartbeat, timerInterval )
				log.info( 'amqp-heartbeat', 'Started.' )
			}
		}
	)
}

heartbeat.setStatus = function setStatus( statusText ) {
	this.status = statusText
}

function mqConnect( callback ) {
	amqp.connect( heartbeat.rabbitMqURL,
			function( err, conn ) {
				if ( err != null ) { 
					log.error( 'amqp-heartbeat', err ); process.exit(1) 
				}
				//log.info( 'amqp-heartbeat', 'connected to '+heartbeat.rabbitMqURL )
				callback( err, conn )
			}
	)
}

function amqpHeartbeat() {
	//log.info( 'amqp-heartbeat', 'start with '+heartbeat.rabbitMqURL  )
	heartbeat.mqConn.createChannel( 
		function( err, ch ) {
			if ( err != null ) { 
				log.error( 'amqp-heartbeat', err ); process.exit(1) 
			}
	
			var host = 'unknown'
			if ( process.env['HOSTNAME'] ) host = process.env['HOSTNAME']
			var heartbeatMsg = 
				{ 
					serviceName: heartbeat.serviceName, 
					serviceID: heartbeat.serviceID, 
					heartbeatTime: Date.now(), 
					host: host,
					status: heartbeat.status
				}
			var msg = JSON.stringify( heartbeatMsg )
			ch.assertExchange( 'heartbeats', 'topic',	{ durable : false }	);
			ch.publish( 'heartbeats', 'dashboard.collector', new Buffer( msg ) )
		    
	    //log.info( 'amqp-heartbeat' + msg  );
	  }
	)
}
