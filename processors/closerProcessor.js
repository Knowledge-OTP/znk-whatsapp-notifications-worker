const mongo = require('../utils/mongo')
const slackService = require('../utils/slack')
const ObjectId = require('mongodb').ObjectId;
const moment = require('moment-timezone');

module.exports = async function(job) {
    const {arguments} = job.data
    try
    {
        const client = await mongo.connectToDatabase(process.env.MONGO_URL)
        const calendarCursor = client.database.collection('calendarevents')
        const userCursor = client.database.collection('users')
        const lessonId = arguments.lessonId
        console.log('init lesson: ', lessonId)
        const lesson = await calendarCursor.findOne({_id: new ObjectId(lessonId)})
        if (lesson) {
            if (lesson.status === 'scheduledd') {
                if (!lesson.notes || lesson.notes.status === 'draft') {
                    //close lesson and send message
                    const student = lesson.kind === 'group-lesson' ? 'Group Lesson' : `${lesson.student.firstName} ${lesson.student.lastName}`
                    const options = { upsert: true }
                    const filter = { _id: new ObjectId(lessonId) }
                    const updateDoc = {
                        $set: {
                            status: 'finished'
                        }
                    };
                    let educator = `${lesson.educator.firstName} ${lesson.educator.lastName}`
                    let educatorId = lesson.educator.educatorUserId
                    if (lesson.substitute) {
                        educator = `${lesson.substitute.firstName} ${lesson.substitute.lastName}`
                        educatorId = lesson.substitute.educatorUserId
                    }
                    const educatorDocument = await userCursor.findOne({_id: new ObjectId(educatorId)})
                    const result = await client.database.collection('calendarevents').updateOne(filter, updateDoc, options);
                    await slackService.sendMessage(`Student: ${student} with Educator: ${educator} on ${moment(lesson.startDate).toISOString()} ${moment(lesson.startDate).tz(educatorDocument.timezone).format('Z')} for ${lesson.service.name} ${lesson.topic.name}`, process.env.SLACK_CHANNEL)
                    console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
                }
            }
        } else {
            //console.log('Lesson not found')
            //await slackService.sendMessage(`Couldn't solve location of ${lessonId} because it wasn't found`)
        }
    }
    catch (e) {
        console.log(e)
    }
}