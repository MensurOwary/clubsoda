// configure the .env 
require('dotenv').config()

const { Telegraf } = require('telegraf');
const rabbit = require('amqplib');
const { processVoiceMessage } = require('./speechProcessing')

const RABBIT_QUEUE = "transcripts"

async function main() {
    try {
        // establish rabbit connection
        const conn = await rabbit.connect('amqp://localhost');
        // create a channel
        const rabbitChan = await conn.createChannel();
        // make sure the queue exists
        const _ = await rabbitChan.assertQueue(RABBIT_QUEUE, { durable: false })

        const bot = new Telegraf(process.env.TELEGRAM_BOT_KEY);
        // Enable graceful stop
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));

        bot.on('voice', async (ctx) => {
            console.log("Received a voice message")

            const file = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
            const results = await processVoiceMessage(file)

            console.log(results)

            rabbitChan.sendToQueue(RABBIT_QUEUE, Buffer.from(JSON.stringify(results)));
            console.log(" [x] Sent %s", JSON.stringify(results));
        })

        bot.launch();
    } catch (err) {
        console.log(err)
    } finally {

    }
}

main();

