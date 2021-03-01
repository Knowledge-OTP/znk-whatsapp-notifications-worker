const messageProcessor = require('./processors/messageProcessor')
const mailerProcessor = require('./processors/mailerProcessor')
const Queue = require('bull');

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

var http = require('http');
try{
  http.createServer(function (req, res) {
    res.write('OK!');
    res.end(); //end the response
  }).listen(8081);
} catch(e){
  console.log('http server errored')
  console.log({e})
}

