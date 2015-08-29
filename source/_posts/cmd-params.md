title: node.js基础教程(2)：命令行参数
date: 2015-06-16 23:58:29
tags:
- node.js
- learnyounode
categories: node.js
---
##要求
编写一个简单的程序，使其能接收一个或者多个命令行参数，并且在终端（标准输出 stdout）中打印出这些参数的总和。

-------------------------------------------------------------------------------
<!-- more -->
## 提示

可以通过 process 这个全局对象来获取命令行中的参数。process 对象 拥有一个名为 argv 的属性，该属性是一个数组，数组中包含了整条命令的所有部分。首先，请先编写一个包含如下带简易代码的程序来熟悉一下：

    console.log(process.argv)

通过执行命令 node program.js 并在后面多加几个参数，来运行我们的程序，比如：

    $ node program.js 1 2 3

这样，就会得到这样一个数组：

    [ 'node', '/path/to/your/program.js', '1', '2', '3' ]

需要考虑的问题是，如何去循环遍历这些代表数字的参数，从而得到他们的总和。process.argv数组的第一个元素永远都会是node，并且第二个参数总是指向程序的路径，所以，应该从第三个元素（index 是 2）开始，依次累加，直到数组末尾。

需要注意的是，所有 process.argv 中的数组的元素都是字符串类型的，因此，需要将它们强制转换成数字。可以通过加上 + 前缀，或者将其传给 Number() 来解决。例如： +process.argv[2] 或者 Number(process.argv[2])。

##代码

	var result = 0

	for (var i = 2; i < process.argv.length; i++)
		result += Number(process.argv[i])

	console.log(result)