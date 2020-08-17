var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }

    // if no error connection established 

    // create a channel on the connection 
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        // if no error channel is created 

        // define the exchange name
        var exchange = 'direct_logs';
        
        // define the arguments 
        var args = process.argv.slice(2);

        console.log(args, "ARGS");

        // define msg var
        var msg = args.slice(1).join(' ') || "Hello James!";

        console.log(msg, "MSG");

        // define severity level
        var severity = (args.length > 0 ) ? args[0] : 'info';
        
        console.log(severity, "SEV");

        // create exchange with 'direct' type
        channel.assertExchange(exchange, 'direct', {
            durable: false, 
        });

        // create publish channel with severity as channel name
        channel.publish(exchange, severity, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", severity, msg);
    });

    // disconnect channel and close process 500 ms after finish

    setTimeout(function() {
        connection.close();
        process.exit(0)
    }, 500);
})