title: node.js基础教程(4)：异步IO读写
date: 2015-06-19 19:40:27
tags: 
- node.js
- learnyounode
categories: node.js
---

## 要求

编写一个程序，执行一个异步的对文件系统的操作：读取一个文件，并且在终端（标准输出stdout）打印出这个文件中的内容的行数。类似于执行 cat file | wc -l 这个命令。 所要读取的文件的完整路径会在命令行第一个参数提供。

---
<!-- more -->
## 提示

解决这个问题将需要用到Node.js最鲜明的风格的方式：异步。

'''fs.readFile()'''方法可以满足这个需求，这需要从传入的[回调函数](https://github.com/maxogden/art-of-node#callbacks)中去收集数据（这些数据会作为第二参数传递给回调函数），而不是使用方法的返回值。

记住，Node.js 回调函数都有像如下所示的特征：

    function callback (err, data) { /* ... */ }

可以通过检查第一个参数的真假值来判断是否有错误发生。如果没有错误发生，第二个参数将获取到一个Buffer对象。和 readFileSync() 一样，可以传入 'utf8 ' 作为它的第二个参数，然后把回调函数作为第三个参数，这样，得到的将会是一个字符而不是 Buffer。

[fs模块API文档](https://nodejs.org/api/fs.html)

---

## 代码

	var fs = require('fs');
	fs.readFile(process.argv[2], function(err,data){
	    if(err) throw err;
	    console.log(data.toString().split('\n').length-1);
	});