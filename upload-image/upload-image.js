/*
  This example uploads an image file in base64 to the qortal full node. It
  returns a base58 raw transaction in response. That output is fed to the
  broadcast transaction example.
*/

const axios = require('axios')
const fs = require('fs')
const apikey = require('../apikey.json')

const SERVER = 'https://qortal.psfoundation.info'

const filename = './cat.jpeg'

async function start() {
  try {
    // Read in the image file and convert to base64.
    const buff = fs.readFileSync(filename)
    const base64Data = buff.toString('base64')
    // console.log('base64Data: ', base64Data)

    // Set the API key in the header. The API file is added to .gitignore,
    // so that it is not checked in with the code.
    const apiKey = apikey.apikey
    const headers = {
      'X-API-KEY': apiKey
    }

    // The URL to call on the full node API
    const path = `/arbitrary/IMAGE/trout100/cat.jpeg/base64`

    // Upload the image using the REST API.
    const result = await axios({
      method: 'post',
      url: `${SERVER}${path}`,
      data: base64Data,
      headers
    })
    console.log('raw TX in base58: ', result.data)

  } catch(err) {
    console.error(err)
  }
}
start()
