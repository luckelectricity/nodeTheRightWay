const fs = require('fs')

fs.writeFile('target.text', '我是刘欢', (err) => {
  if(err) throw err;
  console.log('文件保存');
})
