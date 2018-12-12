const fs = require('fs')
const net = require('net')

const fileName = process.argv[2];

if (!fileName) {
  throw Error('请输入文件')
}

net.createServer(connection => {
  console.log('创建一个net server');
  connection.write(`现在监听${fileName}的改变\n`)
  const watcher = fs.watch(fileName, ()=>{
    connection.write(`文件改变:${new Date()}\n`)
  })
  connection.on('close', () => {
    console.log('监听完毕');
    watcher.close()
  })
}).listen(60300, ()=>{
  console.log('现在监听端口60300');
})
