# 文件读取的读书笔记

## 事件循环编程

```
fs.watch(fileName,callback)
```
******

### **process.argv**

返回进程启动时的命令行参数。 第一个元素是 process.execPath。 使用 process.argv0 可以获取 argv[0] 原始的值。 第二个元素是当前执行的 JavaScript 文件的路径。 剩余的元素都是额外的命令行参数。

例子，假设 process-args.js 文件如下:
```
// 输出 process.argv。
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```
运行以下命令启动进程：
```
$ node process-args.js one two=three four
```
输出如下：
```
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```
*****

## 创建子进程
[Child Process模块](http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options)

spawn() 返回的对象是`ChildProcess`. 他的
1. `stdin`  ---->   标准输入
2. `stdout` ---->   标准输出
3. `stdin`  ---->   标准输入


***

## 用EventEmitter 获取数据

`on()`方法用于给指定事件添加事件监听函数.

[nodejs的流](http://nodejs.cn/api/stream.html#stream_organization_of_this_document)
***

