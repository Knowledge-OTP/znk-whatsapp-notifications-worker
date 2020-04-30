require('dotenv').config({path: '.env/env.dev.json'})

const messageProcessor = require('./messageProcessor')
const Queue = require('bull');

const messagerQueue = new Queue('messager', {
  redis: {
    host: process.env.REDIS_ENDPOINT,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
  },
})

messagerQueue.process(messageProcessor);



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

