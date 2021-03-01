const mailerService = require('../utils/mandrill')
const slackService = require('../utils/slack')
module.exports = async function(job) {
    const {mailOptions} = job.data
    try {
        const mailSent = await mailerService.sendEmail(mailOptions)
        return mailSent
    } catch (err) {
        console.log('Errored')
        console.log(JSON.stringify(err))
        slackService.sendMessage('Mailer Error: %s', err)
    }
}
