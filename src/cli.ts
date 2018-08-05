#!/usr/bin/env node

import * as Base64 from 'base64-js'
import * as fs from "fs"
import { prepareChunks, doTx, fetchTx } from './core'
import { createPayload } from './utils'

const action = process.argv[2]

if (action === 'get') {
  // fetch txs, compose, save file
  const txid = process.argv[3]
  const filename = process.argv[4]

  fetchTx(txid).then((b64str: string) => {
    const byteArray = Base64.toByteArray(b64str.split(',')[1])

    fs.writeFile(filename, byteArray, 'base64', () => {
      console.log(`Done, saved ${txid} in ${filename}`);
    });
  })

} else if (action === 'push') {
  // base64, do txs, print txid
  const filename = process.argv[3]

  async function callme() {
    let counter = 0
    let nextTx: string | null = null
    const chunks = await prepareChunks(filename)

    for (const chunk of chunks.reverse()) {

      try {
        const memo = createPayload(chunk, nextTx)
        const doneTx: any = await doTx(memo)
        // console.log(doneTx)

        // NOTE: needed for better cli formatting
        console.log(`${counter}. ${nextTx}`)
        nextTx = doneTx.id
        counter += 1
      } catch (err) {
        console.log(`steemfilestore ERROR: ${JSON.stringify(err, null, 2)}`)
        return
      }

    }
    console.log(`Done, uploaded ${filename} in ${nextTx}`)
  }
  callme()

} else if (action === 'cost') {
  // base64, count chunks
  const filename = process.argv[3]

  async function callme() {
    const chunks = await prepareChunks(filename)
    const numTxs = chunks.length
    console.log(`${numTxs} txs`)
  }
  callme()

} else if (action === '--version') {
  console.log(require('../package.json').version)
} else { // --help
  console.log(`
steemfilestore - upload and download files on STEEM Blockchain

Usage:
      steemfilestore get <txid> <my file path>
      steemfilestore cost <my file path>
      steemfilestore push <my file path>
  `)
}