const ejs = require('ejs')
const mongo = require('./mongo')

let model = {}

model.render = function(string, obj){
  string = string.replace(/\|\*/g, '<%=')
  string = string.replace(/\*\|/g, '%>')
  return ejs.render(string, obj)
}

model.findOne = async function(templateKey){
  return mongo.getTemplate(templateKey)
}

module.exports = model;
