const templateModel = require('./utils/templater')
module.exports = async function(job){
  const {templateKey, recipients, arguments} = job.data
  const templateInfo = await templateModel.findOne(templateKey)
  if(templateInfo){
    const message = templateModel.render(templateInfo.message, arguments)
    console.log(`About to send message: ${message}`)
    console.log('--0---')
    console.log('to:')
    console.log({recipients})
  } else {
    console.log('no Template Found')
  }
  return templateInfo
}
