const mailerService = require('../utils/mandrill')
const slackService = require('../utils/slack')
module.exports = async function(job) {
    const {mailOptions} = job.data
    try {
        const mailSent = await mailerService.sendEmail(mailOptions)
        return mailSent
    } catch (e) {
        console.log('Errored')
        slackService.sendMessage('Mailer Error: %s', err)
    }
}
