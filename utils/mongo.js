const MongoClient = require('mongodb').MongoClient;

let model = {}

model.getTemplate = async function(templateKey) {
  const client = new MongoClient(process.env.MONGO_URL, { useUnifiedTopology: true } )
  return new Promise((res, rej) => {
    client.connect(function(err){
      if(err){
        console.log('ERROR: %s', err)
        rej(err)
      } else {
        const templatesRef = client.db(process.env.MONGO_DBNAME).collection('msgTemplates')
        templatesRef.find({templateKey}).toArray((function (err, arr) {
          client.close()
          if(err){
            console.log('ERROR: %s', err)
            rej(err)
          } else {
            console.log('Response gotten: %s', JSON.stringify(arr))
            if(arr.length){
              res(arr[0])
            } else {
              res(null)
            }
          }
        }))
      }
    })
  })
}

module.exports = model

