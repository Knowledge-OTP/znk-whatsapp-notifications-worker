const mailerService = require('./utils/mandrill')

module.exports = async function(job) {
    const {mailOptions} = job.data
    try {
        const mailSent = await mailerService.sendEmail(mailOptions)
        return mailSent
    } catch (e) {
        console.log('Errored')
    }
}