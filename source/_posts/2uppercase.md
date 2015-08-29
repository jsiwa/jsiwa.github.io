title: node.js基础教程(12)：大写转换器
date: 2015-07-11 00:00:51
tags:
- node.js
- learnyounode
categories: node.js
---

## 要求

编写一个 HTTP 服务器，它只接受 POST 形式的请求，并且将 POST 请求主体（body）所带的字符转换成大写形式，然后返回给客户端。

服务器需要监听由第一个命令行参数所指定的端口。

-------------------------------------------------------------------------------
<!-- more -->
## 提示

这里将不限制你使用 stream 处理 request 和 response 对象，并且这将更为简单。

在 npm 中，有很多不同的模块可以用来在 stream 传输过程中 "转换" stream 中的数据。对于本次练习来说，through2-map 这个模块有一个比较简单的 API 可以使用。

through2-map 允许你创建一个 transform stream，它仅需要一个函数就能完成「接收一个数据块，处理完后返回这个数据块」的功能 ，它的工作模式类似于 Array#map()，但是是针对 stream 的：

    var map = require('through2-map')
    inStream.pipe(map(function (chunk) {
      return chunk.toString().split('').reverse().join('')
    })).pipe(outStream)

在上面的例子中，从 inStream 传进来的数据会被转换成字符串（如果它不是字符串的话），并且字符会反转处理，然后传入 outStream。所以，我们这里是做了一个字符串反转器！记住！尽管，数据块（chunk）的大小是由上游（up-stream）所决定的，但是还是可以在这之上对传进来的数据做一点小小的处理的。

要安装 through2-map，输入:

    $ npm install through2-map

[through2-map模块API文档](https://github.com/brycebaril/through2-map) 

-------------------------------------------------------------------------------

## 代码

方法一：
`
var http = require('http');

http.createServer(function(req,res){
    var postData = '';
    req.addListener("data", function (postDataChunk) {
        if(req.method==='POST'){
            postData += postDataChunk;
        }
    });
    req.addListener("end", function(){
        if(req.method==='POST'){
            res.end(postData.toUpperCase(),'utf8');
        }
    });
}).listen(process.argv[2]);
`

方法二：
`
var http = require('http')
var map = require('through2-map')

var server = http.createServer(function (req, res) {
  if (req.method != 'POST')
    return res.end('send me a POST\n')

  req.pipe(map(function (chunk) {
    return chunk.toString().toUpperCase()
  })).pipe(res)
})

server.listen(Number(process.argv[2]))
`