var heartbeat = require ( '../' )       // stand alone: replace with  require( 'amqp-heartbeat' )
var pjson = require('../package.json');

heartbeat.setStatus( 'some message' )

heartbeat.start( 'amqp://user:password@localhost', 'Some Service Name', pjson.version  )