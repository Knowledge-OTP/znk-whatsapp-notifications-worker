const mailerService = require('../utils/mandrill')
const slackService = require('../utils/slack')
const mongo = require('../utils/mongo')
const ObjectId = require('mongodb').ObjectId;
module.exports = async function(job) {
    const {mailOptions: mailOptionsAux} = job.data
    try {        
        console.log('---- Starting Email Sender ----');
        //queda desactivado el if
        if (mailOptionsAux.templateName === 'lp-edu-lesson-list-reminder') {
            const client = await mongo.connectToDatabase(process.env.MONGO_URL)
            const calendarCursor = client.database.collection('calendarevents')            
            let finalLessonsCards = ''
            for (let index = 0; index < mailOptionsAux.lessonsCards.length; index++) {
                let lessonCard = mailOptionsAux.lessonsCards[index];
                let lessonId = lessonCard.lessonId
                let lesson = await calendarCursor.findOne({_id: new ObjectId(lessonId)})
                if (lesson && lesson.status === 'scheduled') {
                    finalLessonsCards += lessonCard.lessonsHtml
                }
            }
            if (finalLessonsCards !== '') {
                let mailOptions = {}
                mailOptions.templateName = mailOptionsAux.templateName
                mailOptions.imageAttachment = mailOptionsAux.imageAttachment
                mailOptions.subject = mailOptionsAux.subject
                mailOptions.fromName = mailOptionsAux.fromName
                mailOptions.fromEmail = mailOptionsAux.fromEmail
                mailOptions.replyToEmail = mailOptionsAux.replyToEmail
                mailOptions.params = [
                    {name: 'LESSON_LIST', content: mailOptionsAux.params[0].content + finalLessonsCards + mailOptionsAux.lessonsHtmlBottom},
                    mailOptionsAux.params[1]
                ],
                mailOptions.emails = mailOptionsAux.emails
                const mailSent = await mailerService.sendEmail(mailOptions)
                return mailSent
            }
            return null
        } else {
            let mailOptions = mailOptionsAux
            // revisar fecha de la leccion que viene acá adentro. Si esta es del pasado, no envair el mail
            const mailSent = await mailerService.sendEmail(mailOptions)
            return mailSent
        }
    } catch (err) {
        console.log('Errored')
        console.log(JSON.stringify(err))
        await slackService.sendMessage(`Mailer Error: \`\`\`${err.toString()}\`\`\``)
    }
}
