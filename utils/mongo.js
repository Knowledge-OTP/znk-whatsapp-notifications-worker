const MongoClient = require('mongodb').MongoClient;
const connections = {}

async function connect(mongoURL) {
  connections[mongoURL].connecting = true

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  try{
    const client = await MongoClient.connect(
        mongoURL,
        options,
    )


  const dbName = process.env.MONGO_DBNAME
  connections[mongoURL].client = client
  connections[mongoURL].database = client.db(dbName)
  connections[mongoURL].connecting = false

  for (const resolve of connections[mongoURL].resolvers) {
    resolve(connections[mongoURL])
  }

  return connections[mongoURL]
  } catch(e){
    console.log('mongo failed')
    console.log({e})
  }
}
let model = {}
model.connectToDatabase = async function (mongoURL) {
  if (!mongoURL) {
    throw new Error('Mongo URL env is required')
  }

  connections[mongoURL] = connections[mongoURL] || {
    connecting: false,
    resolvers: [],
    client: null,
    database: null,
  }

  if (connections[mongoURL].database) {
    return connections[mongoURL]
  }

  if (!connections[mongoURL].connecting) {
    return connect(mongoURL)
  }
  try {
    return new Promise(resolve => connections[mongoURL].resolvers.push(resolve)).catch(e => {
      console.log({e})
      console.log('Promise Creation Failed')
    })
  } catch(e){
      console.log('mongo couldn create')
  }
}
module.exports = model
