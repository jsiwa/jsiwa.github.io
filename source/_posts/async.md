title: node.js基础教程(9)：玩转异步
date: 2015-07-05 16:12:58
tags:
- node.js
- learnyounode
categories: node.js

---

##要求

这次的问题和之前的问题（HTTP 收集器）很像，也是需要使用到 http.get() 方法。然而，这一次，将有三个 URL 作为前三个命令行参数提供。

需要收集每一个 URL 所返回的完整内容，然后将它们在终端（标准输出stdout）打印出来。这次不需要打印出这些内容的长度，仅仅是内容本身即可（字符串形式）；每个 URL对应的内容为一行。重点是必须按照这些 URL 在参数列表中的顺序将相应的内容排列打印出来才算完成。

-------------------------------------------------------------------------------
<!-- more -->
## 提示

不要期待这三台服务器能好好的一起玩耍！他们可能不会把完整的响应的结果按照希望的顺序返回，所以不能天真地只是在收到响应后直接打印出来，因为这样做的话，他们的顺序可能会乱掉。

需要去跟踪到底有多少 URL 完整地返回了他们的内容，然后用一个队列存储起来。一旦拥有了所有的结果，才可以把它们打印到终端。

对回调进行计数是处理 Node 中的异步的基础。比起自己去做，去依赖一个第三方的模块或者库会更方便，比如 [async](http://npm.im/async) 或者 [after](http://npm.im/after)。不过，在本次练习中，应该首先尝试自己去解决，而不是依赖外部的模块。

##代码

* 方法一
```
	var http = require('http');
	var result = ['','',''];
	var isEnd = [false, false, false];

    http.get(process.argv[2], function(res){
        res.setEncoding('utf8');
        res.on('data', function(data){
            result[0] += data;
        });
        res.on('end', function(data){
            isEnd[0] = true;
            if(isEnd[0]&&isEnd[1]&&isEnd[2]){
                console.log(result[0]);
                console.log(result[1]);
                console.log(result[2]);
            }
        });
    });
    http.get(process.argv[3], function(res){
        res.setEncoding('utf8');
        res.on('data', function(data){
            result[1] += data;
        });
        res.on('end', function(data){
            isEnd[1] = true;
            if(isEnd[0]&&isEnd[1]&&isEnd[2]){
                console.log(result[0]);
                console.log(result[1]);
                console.log(result[2]);
            }
        });
    });
    http.get(process.argv[4], function(res){
        res.setEncoding('utf8');
        res.on('data', function(data){
            result[2] += data;
        });
        res.on('end', function(data){
            isEnd[2] = true;
            if(isEnd[0]&&isEnd[1]&&isEnd[2]){
                console.log(result[0]);
                console.log(result[1]);
                console.log(result[2]);
            }
        });
    });
```

* 方法二
```
    var http = require('http')
    var bl = require('bl')
    var results = []
    var count = 0

    function printResults () {
      for (var i = 0; i < 3; i++)
        console.log(results[i])
    }

    function httpGet (index) {
      http.get(process.argv[2 + index], function (response) {
        response.pipe(bl(function (err, data) {
          if (err)
			return console.error(err)

          results[index] = data.toString()
          count++

          if (count == 3)
			printResults()
        }))
      })
    }

    for (var i = 0; i < 3; i++)
		httpGet(i)
```