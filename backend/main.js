const { WebSocketServer } = require('ws')
const rabbit = require('amqplib');

const RABBIT_QUEUE = "transcripts"
const WS_ENDPOINT = "ws://localhost"

let ws = null;

const wss = new WebSocketServer({ host: "127.0.0.1", port: 8888 });

console.log(wss.address())

wss.on('connection', function connection(wsObj) {
    ws = wsObj;
});

async function main() {
    try {
        // establish rabbit connection
        const conn = await rabbit.connect('amqp://localhost');
        // create a channel
        const rabbitChan = await conn.createChannel();
        // make sure the queue exists
        const _ = await rabbitChan.assertQueue(RABBIT_QUEUE, { durable: false })

        rabbitChan.consume(RABBIT_QUEUE, async (msg) => {
            if (msg == null) return;
            console.log(msg.content.toString())
            if (ws) {
                ws.send(msg.content.toString())
            } else {
                console.log("No web socket connection available")
            }
        }, {
            noAck: true
        })
    } catch (err) {
        console.log(err)
    }
}

main();