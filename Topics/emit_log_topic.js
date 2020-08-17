var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        // define exchange 
        var exchange = 'topic_logs';

        // define args
        var args = process.argv.slice(2);

        // define key
        var key = (args.length > 0) ? args[0] : 'anonymous.info';

        // define message 
        var msg = args.slice(1).join(' ') || 'Hello James!';

        // create exchange 
        channel.assertExchange(exchange, 'topic', {
            // durable false means message will not be saved in queue if rabbitMQ stops 
            durable: false, 
        });

        // create channel
        channel.publish(exchange, key, Buffer.from(msg));
        console.log( " [x] Sent %s: '%s'", key, msg);
    });

    // Define timeout for producer to close connection and end proceess after 500ms 
    setTimeout(function() {
        connection.close()
        process.exit(0);
    });
})