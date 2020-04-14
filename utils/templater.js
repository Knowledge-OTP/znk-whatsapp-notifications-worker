const ejs = require('ejs')
const mongo = require('./mongo')

let model = {}

model.render = function(string, obj){
  string = string.replace(/\|\*/g, '<%=')
  string = string.replace(/\*\|/g, '%>')
  return ejs.render(string, obj)
}

model.findOne = async function(templateKey){
  const client = await mongo.connectToDatabase(process.env.MONGO_URL)
  const templates = await client.database.collection('msgTemplates').find({templateKey}).toArray()
  if(templates.length){
    return templates[0]
  }
  return null
}

module.exports = model;