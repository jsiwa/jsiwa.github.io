title: node.js基础教程(8)：http收集器
date: 2015-07-04 22:58:30
tags:
- node.js
- learnyounode
categories: node.js

---

## 要求


编写一个程序，发起一个 HTTP GET 请求，请求的 URL 为所提供的命令行参数的第一个。收集所有服务器所返回的数据（不仅仅包括 "data" 事件）然后在终端（标准输出 std out）用两行打印出来。

所打印的内容，第一行应该是一个整数，用来表示收到的字符串内容长度，第二行则是服务器返回的完整的字符串结果。

-------------------------------------------------------------------------------
<!-- more -->
## 提示

有两种实现方法：

1) 可以把所有 "data" 事件所得的结果收集起来，暂存并追加在一起，而不是在收到后立刻打印出来。通过监听 "end" 事件，可以确定 stream 是否完成传输，如果传输结束了，就可以将收集到的结果打印出来了。

2) 使用一个第三方模块，来简化从 stream 中收集数据的繁琐步骤。这里有两个不同的模块都提供了一些有用的 API 来解决这个问题（似乎还有好多另外的模块可以选哦！）：bl (Buffer list) 或者 concat-stream，来选一个吧！

  [bl模块API文档](http://npm.im/bl)
  [concat-stream模块API文档](http://npm.im/concat-stream)

要安装一个 Node 模块，需用到 Node 的包管理工具 npm，输入：

    $ npm install bl

这样，相应的模块的最新版本便会被下载到当前目录下一个名为 node_modules 的子目录中 。任何在这个子目录中的模块都可以简单地使用 require 语法来将模块载入到程序中 ，并且不需要加 ./ 这样的路径前缀，如下所示：

    var bl = require('bl')

可以把一个 stream pipe 到 bl 或 concat-stream 中去，它们会收集数据。一旦 stream 传输结束，一个回调函数会被执行，并且，这个回调函数会带上所收集的数据：

    response.pipe(bl(function (err, data) { /* ... */ }))
    // 或
    response.pipe(concatStream(function (data) { /* ... */ }))

要注意的是可能需要使用 data.toString() 来把 Buffer 转换为字符串。

-------------------------------------------------------------------------------

## 代码

* 方法一
```
    var http = require('http');

    http.get(process.argv[2], function(res){
	    var result = '';
	    res.setEncoding('utf8');
	    res.on('data', function(data){
	        result += data;
	    });
	    res.on('end', function(data){
	        console.log(result.length);
	        console.log(result);
	    });
	});
```
* 方法二
```
    var http = require('http')
    var bl = require('bl')

    http.get(process.argv[2], function (response) {
      response.pipe(bl(function (err, data) {
        if (err)
          return console.error(err)
        data = data.toString()
        console.log(data.length)
        console.log(data)
      }))
    })
```