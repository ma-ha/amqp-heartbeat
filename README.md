## Send Heartbeat Messages To RabitMQ

Usage is easy:

 var heartbeat = require( 'amqp-heartbeat' )
 heartbeat.start( 'amqp://user:password@localhost', 'Some Service Name' )
 
## Run RabbitMQ (Docker Container)

 docker run -d --hostname my-rabbit --name some-rabbit -e RABBITMQ_DEFAULT_USER=user -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_PASS=password rabbitmq:3-management 


 
 