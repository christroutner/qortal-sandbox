/*
  This file makes a serices of REST API calls to the full node. It uploads an
  image to the QDN, paying for the upload with proof of work (POW).

  To run this example, you need to create an apikey.json file in the directory
  above this one. It should contain 'apikey' and 'privateKey' properties.
*/

// Global libraries
const axios = require('axios')
const fs = require('fs')

// Private data that is not checked into git.
const apikey = require('../apikey.json')

// const SERVER = 'https://qortal.psfoundation.info'
const SERVER = 'http://127.0.0.1:12391'

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

    // Private key is in the same apikey.json file, which is not checked into git.
    const privateKey = apikey.privateKey

    // The URL to call on the full node API
    const imagePath = `/arbitrary/IMAGE/trout100/cat.jpeg/base64`

    // Upload the image using the REST API.
    const result1 = await axios({
      method: 'post',
      url: `${SERVER}${imagePath}`,
      data: base64Data,
      headers
    })
    console.log('raw TX in base58: ', result1.data)

    // Decode the raw TX
    const decoded1 = await axios({
      method: 'post',
      url: `${SERVER}/transactions/decode`,
      data: result1.data,
      headers
    })
    console.log('decoded TX: ', decoded1.data)

    console.log('\nComputing POW...\n')

    // This API call updates the transaction with a POW nonce to 'pay' for the
    // transaction.
    const result2 = await axios({
      method: 'post',
      url: `${SERVER}/arbitrary/compute`,
      headers,
      data: result1.data
    })
    console.log(`POW signed TX: `, result2.data)

    // Decode the transaction, to show the updates to it.
    const decoded2 = await axios({
      method: 'post',
      url: `${SERVER}/transactions/decode`,
      data: result2.data,
      headers
    })
    console.log('POW signed, decoded TX: ', decoded2.data)

    // From looking at the qortal-ui code, this endpoint is called to convert
    // the transaction for signing. I'm not sure what that means, but it returns
    // a base58 transaction that looks a little different from the original.
    // Call POST /transactions/convert to convert tx bytes into bytes for signing
    const result3 = await axios({
      method: 'post',
      url: `${SERVER}/transactions/convert`,
      headers,
      // data: rawTx
      data: result2.data
    })
    console.log('result3.data: ', result3.data)

    const decoded3 = await axios({
      method: 'post',
      url: `${SERVER}/transactions/decode`,
      data: result2.data,
      headers
    })
    console.log('converted, decoded TX: ', decoded3.data)

    // Sign the converted transaction.
    // This API endpoint will throw an error unless the 'apiRestricted' setting
    // is set to false in the settings.json file for the full node.
    const result4 = await axios({
      method: 'post',
      url: `${SERVER}/transactions/sign`,
      headers,
      data: {
        privateKey,
        transactionBytes: result2.data
      }
    })
    console.log('signed TX: ', result4.data)

    // Upload the raw TX to the node for broadcasting to the network.
    const result5 = await axios({
      method: 'post',
      url: `${SERVER}/transactions/process`,
      headers,
      // data: result2.data  // Results in error
      // data: rawTx // Results in an error
      data: result4.data // Results in an error
    })
    console.log('result5.data: ', result5.data)

  } catch(err) {
    console.error(err)
  }
}
start()
