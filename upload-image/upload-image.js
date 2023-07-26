/*
  My attempt to upload an image using the Qortal API.
*/

const axios = require('axios')
const fs = require('fs')
const apikey = require('../apikey.json')

const SERVER = 'https://qortal.psfoundation.info'

const filename = './cat.jpeg'

async function start() {
  try {
    const buff = fs.readFileSync(filename)
    const base64Data = buff.toString('base64')
    // console.log('base64Data: ', base64Data)

    const apiKey = apikey.apikey

    const headers = {
      'X-API-KEY': apiKey
    }

    const body = {
      apiKey,
      service: 'IMAGE',
      name: 'trout100',
      identifier: 'cat.jpeg',
      title: 'cat.jpeg',
      description: 'a cat',
      filename: 'cat.jpeg'
    }


    const path = `/arbitrary/IMAGE/trout100/cat.jpeg/base64`

    // const result = await axios.post(`${SERVER}${path}`, body, headers)
    const result = await axios({
      method: 'post',
      url: `${SERVER}${path}`,
      data: body,
      headers
    })
    console.log('result.data: ', result.data)
  } catch(err) {
    console.error(err)
  }
}
start()
