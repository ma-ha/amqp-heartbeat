var heartbeat = require ( '../' )       // stand alone: replace with  require( 'amqp-heartbeat' )
var pjson = require('../package.json');

heartbeat.setError( 'ERROR 1234: Something ugly!!' )

heartbeat.start( 'amqp://user:password@localhost', 'Some Service Name', pjson.version  )