import fs from 'fs'

function loadConfig() {
  const confDir = `${process.env.HOME}/.steemfilestore`

  // write default config.js in the first run
  if (!fs.existsSync(confDir)) {
    fs.mkdirSync(confDir)
    fs.writeFileSync(`${confDir}/config.json`, `
{
  "from":"",
  "privateKey":"",
  "permission":"active"
}
    `)
    console.log(`steemfilestore: Generated '${confDir}/config.json', please edit with your STEEM keys`)
  }

  // read config
  const configFile = fs.readFileSync(`${confDir}/config.json`).toLocaleString()

  return JSON.parse(configFile)

}

const confObj = loadConfig()

// console.log('cc', confObj)

export const maxPayloadSize = 1960 // 429496 // 176 // 4294967294
export const password = confObj.privateKey
export const from = confObj.from
export const permission = confObj.permission || 'active'
