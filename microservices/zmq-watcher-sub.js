'use strict';
 const zmq = require('zeromq')

 const subscribe = zmq.socket('sub')

 subscribe.subscribe('')

 subscribe.on('message', data => {
   const message = JSON.parse(data)
   const date = new Date(message.timestamp)
   console.log(`文件${message.file}更新于${date}`);
 })

 subscribe.connect('tcp://localhost:60400')
