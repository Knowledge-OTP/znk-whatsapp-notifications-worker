const mailerService = require('../utils/mandrilll')

module.exports = async function(job) {
    const {mailOptions} = job.data
    try {
        const mailSent = await mailerService.sendEmail(mailOptions)
        return mailSent
    } catch (e) {
        console.log('Errored')
    }
}