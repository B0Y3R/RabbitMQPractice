var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'task_queue';
        var msg = process.argv.slice(2).join(' ') || "Hello James!......";

        channel.assertQueue(queue, {
            // sets message durability so that our message isn't lost if RabbitMQ server stops
            durable: true, 
        });

        channel.sendToQueue(queue, Buffer.from(msg), {
            // try and save message to disk with this parameter to persist message if RabbitMQ server stops
            persistent: true, 
        });

        setTimeout(function() {
            // kill connection to RabbitMQ
            connection.close();
            // Exit process in terminal after 500 ms
            process.exit(0);
        }, 500)

        
    })
})