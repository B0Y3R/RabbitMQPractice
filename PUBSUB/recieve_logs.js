var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {

    if (error0) {
        throw error0;
    }

    // established connection to localhost RabbitMQ, 
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        // created channel

        // declare exchange 
        var exchange = 'logs';

        channel.assertExchange(exchange, 'fanout', {
            // durable as false, dont need to save past logs just the ones coming through while up and running
            durable: false,
        });

        // create a non durable queue with an auto generated name

        channel.assertQueue('', {
            exclusive: true, 
        }, function(error2, q) {
            if (error2) {
                throw error2;
            }

            console.log(" [*] Waiting for messages is %s. To exit press CTRL+C", q.queue);

            // tell exchange to send messages to our non durable auto name generated queue
            channel.bindQueue(q.queue, exchange, '');

            // consume messages from the exchange and print them out if the msg has content
            channel.consume(q.queue, function(msg) {
                if (msg.content) {
                    console.log(" [x] %s", msg.content.toString());
                }
            }, {
                noAck: true,
            })

        })

    });
})