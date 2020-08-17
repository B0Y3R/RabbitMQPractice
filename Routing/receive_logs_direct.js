var amqp = require('amqplib/callback_api');

// define args 

var args = process.argv.slice(2);

console.log(args, "ARGS RECEIVE")

if (args.legnth == 0 ) {
    console.log('Usage: receive_logs_direct.js [info] [warning] [error]');

    // exit with status code 1 - Uncausght Fatal Exception due to no arguments coming through
    process.exit(1);
} 

// Establish Connection with rabbitMq 

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }

    // if no error connection has been established with rabbitMQ

    // attempt to create a channel within connection 
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        // define exchange to listen to 

        var exchange = 'direct_logs';

        // create exchange connection 

        channel.assertExchange(exchange, 'direct', {
            durable: false,
        });

        
        channel.assertQueue('', {
            exclusive: true, 
        }, function(error2, q) {
            if (error2) {
                throw error2;
            }

            console.log( ' [*] Waiting for logs. To exit press CTRL+C');

            args.forEach(function(severity) {
                channel.bindQueue(q.queue, exchange, severity);
            });

            channel.consume(q.queue, function(msg) {
                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true,
            });
        });
    });
});