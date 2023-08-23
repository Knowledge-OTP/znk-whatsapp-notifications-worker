const mailerService = require('../utils/mandrill')
const slackService = require('../utils/slack')
const mongo = require('../utils/mongo')
const ObjectId = require('mongodb').ObjectId;
const moment = require('moment-timezone');
module.exports = async function(job) {
    const {mailOptions: mailOptionsAux} = job.data
    try {        
        console.log('---- Starting Email Sender ----');
        //queda desactivado el if
        if (mailOptionsAux.templateName === 'lp-edu-lesson-list-reminder' && false) {
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
        } else if (mailOptionsAux.templateName === 'lp-stu-lesson-reminder') {
            const today = moment().toDate()
            let mailOptions = mailOptionsAux
            const params = mailOptions.params
            let lessonDate = null
            for (let index = 0; index < params.length; index++) {
                if (params[index]?.name === 'LESSON_DATE') {
                     lessonDate = params[index].content
                    }
                }
                if (lessonDate) {
                    const parsedDate = moment(lessonDate, 'MMMM Do, YYYY');
                    const lessonIsoDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                    if (moment(lessonIsoDate).isBefore(today)) {
                        console.log('---- Finishing Email Sender because Lesson is in the past ----')
                        return }
                    let mailOptions = mailOptionsAux
                    const mailSent = await mailerService.sendEmail(mailOptions)
                    return mailSent
        }
    } else {
        let mailOptions = mailOptionsAux
        const mailSent = await mailerService.sendEmail(mailOptions)
        return mailSent
    }
    } catch (err) {
        console.log('Errored')
        console.log(JSON.stringify(err))
        await slackService.sendMessage(`Mailer Error: \`\`\`${err.toString()}\`\`\``)
    }
}