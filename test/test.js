var heartbeat = require ( '../' )       // stand alone: replace with  require( 'amqp-heartbeat' )

heartbeat.setStatus( 'some message' )

heartbeat.start( 'amqp://user:password@localhost', 'Some Service Name'  )