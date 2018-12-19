'use strict';
const net = require('net')
const client = net.connect({port: 60300})
client.on('data', (data)=>{
  const message = JSON.parse(data)
  if (message.name === 'luckelectricity'){
    console.log(message.name + '的年龄是' + message.age);
  } else if (message.type === 'changed'){
    const date = new Date(message.timestamp)
    console.log('文件更新于 ' + date);
  }else{
    console.log(message);
  }
})
