const axios = require('axios').default
const slackApi = axios.create({
    baseURL: process.env.SLACK_WEBHOOK,
})
module.exports =  {
    async sendMessage(message, channel = '') {
        if (typeof message === 'string' && message !== "") {
            try {
                await slackApi.post(channel,{
                    text: message
                })
                return true
            } catch (e) {
                console.log('Error sending request')
                console.error({e})
            }
        }
        return false
    }
}
