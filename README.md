# Club Soda, or I am not sure what to call this.

There is a Telegram bot. You send a voice message to it. The voice message gets transcribed and that text is sent to a Rabbit MQ queue. Then the backend picks up that message and sends it to the frontend through a web socket. Upon receiving the message, the frontend displays it, and performs a sentiment analysis. If the phrase is positive, the background becomes green, if it is negative, it becomes red, if neutral it becomes dark grey.

Telegram Bot: telegraf, amqplib/rabbitmq (publishing)
Backend: amqplib/rabbitmq (subscribing), ws (web socket)
Frontend: svelte, WebSocket (browser API)

You need to run Rabbit MQ before running the apps above:

```shell
docker run -d --hostname my-rabbit --name some-rabbit -p 5671:5671 -p 5672:5672 -p 15672:15672 rabbitmq:3
# enable management if u want: rabbitmq-plugins enable rabbitmq_management
# user/pass - guest, guest
# @ : localhost:15672
```