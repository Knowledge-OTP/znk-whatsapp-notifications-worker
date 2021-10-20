// require('dotenv').config({path: "./.env/.env.dev.json"})
const messageProcessor = require('./processors/messageProcessor')
const mailerProcessor = require('./processors/mailerProcessor')
const closerProcessor = require('./processors/closerProcessor')
const Queue = require('bull');
console.log(process.env.REDIS_ENDPOINT)
const redis = {
  host: process.env.REDIS_ENDPOINT,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
}
// Whatsapp/Frontapp Queue
const messagerQueue = new Queue('messager', {
  redis,
})
messagerQueue.process(messageProcessor);

// Mandrill Queue
const mailerQueue = new Queue('mailer', {
  redis,
})
mailerQueue.process(mailerProcessor)

// Lesson Closer Queue
// const closerQueue = new Queue('closer', {
//   redis,
// })
// closerQueue.process(closerProcessor)

var http = require('http');
try {
  http.createServer(function (req, res) {
    res.write('OK!');
    res.end(); //end the response
  }).listen(8080);
} catch(e){
  console.log('http server errored')
  console.log({e})
}

