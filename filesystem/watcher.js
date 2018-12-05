const fs = require('fs')

fs.watch('target.txt', ()=>{
  console.log('文件改变了');
})
console.log("现在监听文件变化");
