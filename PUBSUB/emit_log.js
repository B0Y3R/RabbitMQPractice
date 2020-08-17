var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }

    // connection established, now create a channel
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        // channel created

        // name exchange 
        var exchange = 'logs';
        var msg = process.argv.slice(2).join(' ') || 'Hello James!';

        // create exchange with the type 'fanout' 
        
        channel.assertExchange(exchange, 'fanout', {
            // set durable to false, we only care about flowing logs, not past ones so no need to attempt to cache
            durable: false, 
        });

        channel.publish(exchange, '', Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
    });

    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
})