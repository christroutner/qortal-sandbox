/*
  This example attempts to broadcast a transaction for an IMAGE file on the
  QDN network, using proof-of-work.
*/

const axios = require('axios')
const apikey = require('../apikey.json')
const bs58 = require('bs58')

// const SERVER = 'https://qortal.psfoundation.info'
const SERVER = 'http://127.0.0.1:12391'

// Set the API key in the header. The API file is added to .gitignore,
// so that it is not checked in with the code.
const apiKey = apikey.apikey
const headers = {
  // 'X-API-KEY': apiKey
  'X-API-KEY': 'T6nHgBvPGh3qo91kmEwBgn'
}

async function start() {
  try {

    const rawTx = '111HXBnDamiDuWz6prep3XMnbhReFN4vrcoJjc7PHRgjxFLKZy3ZKVvrtfFvZA3ewLx5LZTUZmvVWx1SqrLpPgCodqFMQPhHmmXDGtRZiLZV5bHHNaMdUAFwH6wuy3QScy3xXUc4HoTHJNUb6Kzjx6jWi7QL7C2LDH3Vh12HSE2EQBCjYUN7dUEkeEBg8WxLWXSKm4MQXQC4Vdpg16z8xC1SpUXpM7FkdzcPgVxoptQGB1FSZwZi3XqMDqviENP9G8WF5LX6CRBtG75gyMH4kuvtiNHc57kircqJzbn8DJN2dHE1xc2ex9nyPaUQsEGEKxcxWdBX8JKEo'

    // This API call was on the Swagger UI. This seems to compute the POW nonce
    // needed to sign the transaction. Does this also broadcast the TX or do
    // I need to do an extra step?
    const result1 = await axios({
      method: 'post',
      url: `${SERVER}/arbitrary/compute`,
      headers,
      data: rawTx
    })
    console.log(`POW signed TX: `, result1.data)



    // From looking at the qortal-ui code, this endpoint is called to convert
    // the transaction for signing. I'm not sure what that means, but it returns
    // a base58 transaction that looks a little different from the original.
    // Call POST /transactions/convert to convert tx bytes into bytes for signing
    const result2 = await axios({
      method: 'post',
      url: `${SERVER}/transactions/convert`,
      headers,
      // data: rawTx
      data: result1.data
    })
    console.log('result2.data: ', result2.data)

    // Again, following the workflow form qortal-UI, the base58 transaction is
    // decodes into a string.
    const convertedBytes = bs58.decode(result2.data)
    console.log('convertedBytes: ', convertedBytes)



    // Upload the raw TX to the node for broadcast.
    const result3 = await axios({
      method: 'post',
      url: `${SERVER}/transactions/process`,
      headers,
      // data: result2.data  // Results in error
      // data: rawTx // Results in an error
      data: result1.data // Results in an error
    })
    console.log('result3.data: ', result3.data)
  } catch(err) {
    console.error(err)
  }
}
start()
