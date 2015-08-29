title: node.js基础教程(3)：同步IO读写
date: 2015-06-17 22:33:01
tags: 
- node.js
- learnyounode
categories: node.js
---
## 要求
编写一个程序，执行一个同步的文件系统操作，读取一个文件，并且在终端（标准输出stdout）打印出这个文件中的内容的行数。类似于执行 ```cat file | wc -l``` 这个命令。

所要读取的文件的完整路径会在命令行第一个参数提供。

---
<!-- more -->
## 提示

要执行一个对文件系统的操作，将会用到 fs 这个 Node 核心模块。要加载这类核心模块或者其他的"全局"模块，可以用下面的方式引入：

    var fs = require('fs')

这样就可以通过 fs 这个变量来访问整个 fs 模块了。

在 fs 中，所有的同步（或者阻塞）的操作文件系统的方法名都会以 'Sync' 结尾。要读取一个文件，将需要使用  ```fs.readFileSync('/path/to/file')``` 方法。这个方法会返回一个包含文件完整内容的 Buffer 对象。

(fs模块API文档)[https://nodejs.org/api/fs.html]

Buffer 对象是 Node 用来高效处理数据的方式，无论该数据是 ascii 还是二进制文件，或者其他的格式。Buffer 可以很容易地通过调用 ```toString()``` 方法转换为字符串。如：

	var s tr = buf.toString()。

(Buffer模块API文档)[https://nodejs.org/api/buffer.html]

简单地计算行数方法，可以使用.split() 分割成子字符串数组，'\n'可以作为分隔符。

---

## 代码

	var fs = require('fs');
	var res = fs.readFileSync(process.argv[2], 'utf-8');
	console.log(res.split('\n').length-1);