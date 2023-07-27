/*
  This example downloads an image from the qortal full node.
*/

const axios = require('axios')

const SERVER = 'https://qortal.psfoundation.info'

async function start() {
  try {
    const path = `/arbitrary/THUMBNAIL/trout100/qortal_avatar`

    const result = await axios.get(`${SERVER}${path}`)
    console.log('result.data: ', result.data)
  } catch(err) {
    console.error(err)
  }
}
start()
