require('dotenv').config({path: '.env/.env.dev.json'})

const messageProcessor = require('./messageProcessor')
const Queue = require('bull');
const messagerQueue = new Queue('messager', `redis://${process.env.REDIS_ENDPOINT}`)

messagerQueue.process(messageProcessor);

