## Send Heartbeat Messages To RabitMQ

Usage is easy:

```javascript
var heartbeat = require( 'amqp-heartbeat' )
heartbeat.start( 'amqp://user:password@localhost', 'Some Service Name' )
```
 
## Run RabbitMQ (Docker Container)

    docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password rabbitmq:3-management
    
## Collect Heartbeat Messages

Use [amqp-heartbeat-to-mongodb package](https://www.npmjs.com/package/amqp-heartbeat-to-mongodb) 
to collect and store heartbeat messages in a MongoDB. 
 