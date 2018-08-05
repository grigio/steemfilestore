import * as Base64 from 'base64-js'
import * as fs from "fs";
import mime from 'mime-types'
const steem = require('steem')
import { splitString } from './utils'
import { maxPayloadSize, from, password } from './costants'
import fetch from 'isomorphic-fetch'

// 5c0cb9c63f6f19ddf232b459b04d34494547d2a2 svgz
// ccb368701b8a2c399af5e72af0d0e66ca6ed3597 png

const username = from

steem.api.setOptions({ url: 'https://rpc.buildteam.io' });
const wif = steem.auth.toWif(username, password, 'active');

// const steem = Steem(config)

export function doTx(memo: string): Promise<any> {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      steem.broadcast.transfer(wif, username, username, `${0.001} STEEM`, memo, (err: any, res: any) => {
        if (err) {
          console.error(err)
        }
        // console.log('sss', res)
        resolve(res)
      })
    }, 100); // NOTE: rate limit?
  })
}

export function fetchTx(txid: string, buffer?: string): Promise<string> {
  return new Promise((resolve: any) => {
    fetch(`https://steemd.com/tx/${txid}`)
      .then((res: any) => res.text())
      .then((data: string) => {
        // NOTE: refactor me
        const juice = data.match(/<code style="font-size: 70%">.*<\/code>/)
        const toParse = juice ? juice[0].replace(/&quot;/g, '"').replace(/<code style="font-size: 70%">/g, '').replace(/<\/code>/g, '') : 'nada'

        const memo = JSON.parse(toParse)
        
        console.log(memo.n)

        if (memo.n) {
          resolve(fetchTx(memo.n, `${buffer}${memo.c}`))
        } else {
          resolve(`${buffer}${memo.c}`)
        }
      })
  })
}

export function prepareChunks(filepath: string): Promise<string[]> {
  return new Promise((resolve: any, reject: any) => {
    fs.readFile(filepath, (err: any, data: Uint8Array) => {
      if (err) {
        console.error(err)
        reject([])
      }
      const blob = Base64.fromByteArray(data);
      const mimetype = mime.lookup(filepath)
      const dataString = `data:${mimetype};base64,${blob}`
      // console.log(dataString)
      const chunks = splitString(dataString, maxPayloadSize);

      resolve(chunks)
    });
  })
}