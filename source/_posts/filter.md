title: node.js基础教程(5)：过滤器
date: 2015-06-25 00:38:38
tags:
- node.js
- learnyounode
categories: node.js
-------

## 要求

编写一个程序来打印出指定目录下的文件列表，并且以特定的文件名扩展名来过滤这个列表。命令行提供两个参数提，第一个是所给的文件目录路径（如：path/to/dir），第二个参数则是需要过滤出来的文件的扩展名。

举个例子：如果第二个参数是 txt，那么需要过滤出那些扩展名为 .txt的文件。

注意，第二个参数将不会带有开头的"."。

需要在终端中打印出这个被过滤出来的列表，每一行一个文件。另外，必须使用异步的I/O 操作。

-------------------------------------------------------------------------------
<!-- more -->
## 提示

fs.readdir() 方法接收两个参数：第一个是一个路径，第二个则是回调函数，这个回调函数会有如下特征：

    function callback (err, list) { /* ... */ }

这里的 list 是一个数组，它所包含的元素是每个文件的文件名（字符串形式）。

[fs模块API文档](https://nodejs.org/api/fs.html)

node 自带的 path 模块也很有用，特别是它那个 extname 方法。

[path模块API文档](https://nodejs.org/api/path.html)

-----

## 代码

	var fs = require('fs')
	var path = require('path')

	fs.readdir(process.argv[2], function (err, list) {
	  list.forEach(function (file) {
	    if (path.extname(file) === '.' + process.argv[3])
	      console.log(file)
	  })
	})