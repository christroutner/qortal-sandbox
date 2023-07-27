/*
  This example attempts to broadcast a transaction for an IMAGE file on the
  QDN network, using proof-of-work.
*/

async function start() {
  try {

    const rawTx = '111HXBnDam2zD5MiwYfVdgmVEsBfNJT2xSgVEgXV9NvCk7Zbm3ZAqJiJ3KJJXLEogLyqjWt3ZbZvm77TxCxS2i396e3c6SYPBAEfjTJBrb3i2eUo8SSjgVdsYBn8mtL6HAJJMxsUhZRvWsAkEGvxMBfT5Jy9d8Cdju6SzEjroQRjcisK82cNNob87tGnBQFfNHeqdkRy3X4sPYFtjRBzfFTXsE4zZfSYYdc8bd2FFhWXwCPAarW152LrXY5JD9ZgGXzB7E7s9c7vHP9F9LcjdhXTSueN4xBX9BUMKzX8USbUr4QGmN1Rw5m48NRwuzhfjt1B4yR3Cuf3d'

    // Upload the raw TX to the node for broadcast.
    const result = await axios({
      method: 'post',
      url: `${SERVER}/transactions/process`,
      headers,
      data: rawTx
    })
    console.log('result.data: ', result.data)
  } catch(err) {
    console.error(err)
  }
}
start()
