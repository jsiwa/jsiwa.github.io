title: node.js基础教程(13)：JSON API服务器
date: 2015-07-11 00:06:49
tags:
- node.js
- learnyounode
categories: node.js
---

## 要求

编写一个 HTTP 服务器，每当接收到一个路径为 '/api/parsetime' 的 GET 请求的时候，响应一些 JSON 数据。我们期望请求会包含一个查询参数（query string），key 是 "iso ，值是 ISO 格式的时间。

如:

    /api/parsetime?iso=2013-08-10T12:10:15.474Z

所响应的 JSON 应该只包含三个属性：'hour'，'minute' 和 'second'。例如：

    {
      "hour": 14,
      "minute": 23,
      "second": 15
    }

然后增再加一个接口，路径为 '/api/unixtime'，它可以接收相同的查询参数（query strng），但是它的返回会包含一个属性：'unixtime'，相应值是一个 UNIX 时间戳。例如:

    { "unixtime": 1376136615474 }

服务器需要监听第一个命令行参数所指定的端口。

-------------------------------------------------------------------------------
<!-- more -->
## 提示

HTTP 服务器的 request 对象含有一个 url 属性，你可以通过它来决定具体需要走哪一条"路由"。

可以使用 Node 的核心模块 'url' 来处理 URL 和 查询参数（query string）。`url.parse(request.url, true)` 方法会处理 request.url，它返回的对象中包含了一些很有帮助的属性，方便方便你处理 querystring。

举个例子，可以在命令行窗口输入以下命令试试：

    $ node -pe "require('url').parse('/test?q=1', true)"

服务器的响应应该是一个 JSON 字符串的形式。请查看 JSON.stringify() 来获取更多信息。

为了争做 Web 世界的好公民，正确地为响应设置 Content-Type 属性：

    res.writeHead(200, { 'Content-Type': 'application/json' })

JavaScript 的 Date 可以将日期以 ISO 的格式展现出来，如：`new Date().toISOString() `。并且，如果把一个字符串传给 Date的构造函数，它也可以帮你将字符串处理成日期类型。另外，Date#getTime() 放个应该也会很有用。

[url模块API文档](https://nodejs.org/api/url.html)

-------------------------------------------------------------------------------

## 代码

`
var http = require('http');
var url = require('url');
var querystring = require('querystring');

http.createServer(function(req,res){
    var obj = url.parse(req.url);
    var param = querystring.parse(obj.query);
    res.writeHead(200, { "Content-Type": "application/json" });
    if("/api/parsetime"===obj.pathname){
        var date = new Date(param.iso);
        var retObj = {
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        };
        res.end(JSON.stringify(retObj));
    }
    if('/api/unixtime'===obj.pathname){
        var date = new Date(param.iso);
        var retObj = {unixtime: date.getTime()};
        res.end(JSON.stringify(retObj));
    }
}).listen(process.argv[2]);
`