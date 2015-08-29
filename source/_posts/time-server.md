title: node.js基础教程(10)：授时服务器
date: 2015-07-06 23:11:30
tags: 
- node.js
- learnyounode
categories: node.js

---

## 要求

编写一个 TCP 时间服务器

服务器监听一个端口，以获取一些TCP连接，这个端口会经由第一个命令行参数传递给程序。针对每一个 TCP 连接，都必须写入当前的日期和24小时制的时间，如下格式：

    "YYYY-MM-DD hh:mm"

然后紧接着是一个换行符。

月份、日、小时和分钟必须用零填充成为固定的两位数：

    "2013-07-06 17:42"

-------------------------------------------------------------------------------
<!-- more -->
## 提示

这次练习中，将会创建一个 TCP 服务器。这里将不会涉及到任何 HTTP 的事情，因此只需使用 net 这个 Node 核心模块就可以了。它包含了所有的基础网络功能。
net 模块拥有一个名叫 net.createServer() 的方法，它会接收一个回调函数。和 Node 中其他的回调函数不同，createServer() 所用的回调函数将会被调用多次。服务器每收到一个 TCP 连接，都会调用一次这个回调函数。这个回调函数有如下特征：

    function callback (socket) { /* ... */ }

net.createServer() 也会返回一个 TCP 服务器的实例，必须调用 server.listen(portNumber) 来让服务器开始监听一个特定的端口。

一个典型的 Node TCP 服务器将会如下所示：

    var net = require('net')
    var server = net.createServer(function (socket) {
      // socket 处理逻辑
    })
    server.listen(8000)

[net模块API文档](https://nodejs.org/api/net.html)

记住，请一定监听由第一个命令行参数指定的端口。

socket 对象包含了很多关于各个连接的信息（meta-data），但是它也同时是一个 Node 双工流（duplex Stream），所以，它即可以读，也可以写。对这个练习来说，只需要对socket 写数据和关闭它就可以了。

使用  socket.write(data) 可以写数据到 socket 中，用  socket.end() 可以关闭一个 socket。另外， .end() 方法也可以接收一个数据对象作为参数，因此，可简单地使用 socket.end(data) 来完成写数据和关闭两个操作。

----

## 代码

方法一：
```
var net = require('net');

net.createServer(function(socket){
    var date= new Date();
    socket.end(date.toLocaleDateString());
}).listen(process.argv[2]);
```
方法二：
```
    var net = require('net')

    function zeroFill(i) {
      return (i < 10 ? '0' : '') + i
    }

    function now () {
      var d = new Date()
      return d.getFullYear() + '-'
        + zeroFill(d.getMonth() + 1) + '-'
        + zeroFill(d.getDate()) + ' '
        + zeroFill(d.getHours()) + ':'
        + zeroFill(d.getMinutes())
    }

    var server = net.createServer(function (socket) {
      socket.end(now() + '\n')
    })

    server.listen(Number(process.argv[2]))
```