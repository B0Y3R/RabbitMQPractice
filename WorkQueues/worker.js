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

        channel.assertQueue(queue, {
            // sets message durability in case the RabbitMQ server stops, 
            durable: true,
        });

        console.log(" [*] Waiting for messages in %s. To Exit Press CTRL+C", queue);

        // using prefetch makes sure that we only assign tasks to this consumer after its finished processing its last request. 
        channel.prefetch(1);

        channel.consume(queue, function(msg) {
            var secs = msg.content.toString().split('.').length - 1;


            console.log(" [x] Recieved %s", msg.content.toString());

            setTimeout(function() {
                console.log(" [x] Done");
            }, secs * 1000);
        }, {
            // Set noAck to false in order to tell RabbitMQ to wait until the message has been delivered and processed before deleting from the queue
            noAck: false,
        })
    });
});