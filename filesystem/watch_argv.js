const fs = require('fs')

let fileName = process.argv[2]

if(!fileName){
  throw Error('必须输入一个文件名')
}else{
  fs.watch(fileName, ()=>{
    console.log(`文件${fileName}改变了`);
  })
  console.log(`现在监听文件${fileName}的变化`);
}
