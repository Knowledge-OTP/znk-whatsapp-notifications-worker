const axios = require('axios')

const frontApi = axios.create({
  baseURL: process.env.FRONT_BASEURL,
  headers: {
    "Authorization": `Bearer ${process.env.FRONT_APIKEY}`,
    "Content-Type": 'application/json'
  }
})

let model = {}

model.sendMessage = async function (message, to){
  try{
    const response = await frontApi.post(`/channels/${process.env.FRONT_CHANNEL_ID}/messages`, {
      to: to,
      body: message,
      options: {
        archive: true,
      },
    })
    console.log({response})
    return true
  } catch (e) {
    console.log({e})
    return false
  }
}

module.exports = model;
