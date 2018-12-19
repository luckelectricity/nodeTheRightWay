const fs = require('fs')
const net = require('net')

const fileName = process.argv[2];

if (!fileName) {
  throw Error('请输入文件')
}

net.createServer(connection => {
  console.log('创建一个net server');
  connection.write(JSON.stringify({name:'luckelectricity',age:'18'}) + '\n')
  const watcher = fs.watch(fileName, () => {
    connection.write(JSON.stringify({tyepe: 'changed', timestamp: Date.now()}) + "\n")
  })
  connection.on('close', () => {
    console.log('监听完毕');
    watcher.close()
  })
}).listen(60300, () => {
  console.log('现在监听端口60300');
})
