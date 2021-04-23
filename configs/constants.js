const fs = require('fs')
const path = require('path')
const privateKey = path.resolve(__dirname, '../../')
console.log('privateKey', privateKey)
const DEPLOY_CONFIG = {
  // develop: {
  //   host: '10.1.10.244',
  //   port: 2822,
  //   username: 'realai',
  //   password: 'Realai@2020',
  //   buildPathServer: '/home/realai/deepreal_private/deepreal-fe/dist',
  // },
  // test: {
  //   host: '182.92.185.94',
  //   port: 2822,
  //   username: 'root',
  //   password: 'cbn3YLhihjcGvKKg',
  //   buildPathServer: '/root/deep-real-1.0/dist',
  //
  // },
  // report: {
  //   host: '35.220.236.194',
  //   port: '22',
  //   username: 'gcp',
  //   privateKey: fs.readFileSync('/Users/maolipeng/.ssh/gcp-report'),
  //   buildPathServer: '/www/report-dist/dist',
  // },
}
module.exports = { DEPLOY_CONFIG }
