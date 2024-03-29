const mandrill = require('mandrill-api/mandrill')
const mandrillClient = new mandrill.Mandrill(process.env.MANDRILL_API_KEY)
const slackService = require('./slack')
module.exports = {
    async sendEmail(mailOptions) {
        console.log('---- Starting Email Sender ----');
        if(!mailOptions) {
            return slackService.sendMessage('Mailer Error: No mail Options given')
        }
        const emailTemplateName = mailOptions.templateName
        console.log(`About to send template: ${emailTemplateName}, Recipients: ${JSON.stringify(mailOptions.emails)}`)
        const recipientEmails = (mailOptions.emails || []).map((email) => ({
            email, 
            type: email === 'dev+liveprepLogs@zinkerz.com' ? 'bcc' : 'to'
        }))
        const message = {
            global_merge_vars: mailOptions.params,
            subject: mailOptions.subject,
            to: recipientEmails,
            from_name: mailOptions.fromName,
            from_email: mailOptions.fromEmail,
            images: getImageAttachment(mailOptions.imageAttachment),
            headers: {
                'Reply-to': mailOptions.replyToEmail,
            }
        }
        console.log('Message Payload: \n %s',JSON.stringify(message, null, 2))
        const mailTemplate = {
            template_name: mailOptions.templateName,
            template_content: [{name: 'TEMPLATE_CONTENT', content: 'content'}],
            message: message,
            async: false,
        };
        console.log('Mandrill Payload: \n %s',JSON.stringify(mailTemplate, null, 2))
        return new Promise((res, rej) => {
            try {
                mandrillClient.messages.sendTemplate(
                    mailTemplate,
                    (result) => {
                        console.log('Email sent successfully: %s', JSON.stringify(result))
                        res(result)
                    }, (err) => {
                        slackService.sendMessage(`Mailer Error: \`\`\`${err.toString()}\`\`\``)
                        rej(err)
                    })
            } catch (e) {
                console.log('unexpected error')
                console.log(e)
                rej(e)
            }
        })
    }
}

function getImageAttachment(imageAttachment) {
    if (!imageAttachment) {
      return null;
    }

    console.log('added image attachment');
    return [{
      type: 'image/jpeg',
      name: 'IMAGECID',
      content: imageAttachment,
    }];
  }
