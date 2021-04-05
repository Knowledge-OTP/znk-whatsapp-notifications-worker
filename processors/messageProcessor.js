const templateModel = require('../utils/templater')
const frontAppService = require('../utils/frontAdapter')
module.exports = async function(job){
  const {templateKey, recipients, arguments} = job.data
  const templateInfo = await templateModel.findOne(templateKey)
  const shouldSend = process.env.ENABLE_SENDING
  if(templateInfo){
    const message = templateModel.render(templateInfo.message, arguments)
    console.log('--0---')
    console.log(`About to send message: ${message}`)
    console.log('to:')
    console.log({recipients})
    console.log('--0---')
    return shouldSend ? frontAppService.sendMessage(message, recipients) : false
  } else {
    console.log('no Template Found')
  }
  return false
}
