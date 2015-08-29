title: node.js基础教程(6)：自定义模块
date: 2015-06-25 22:15:49
tags:
- node.js
- learnyounode
categories: node.js

---

## 要求

这个问题和前面一个一样，但是这次需要使用模块。将需要创建两个文件来解决这个问题。

编写一个程序来打印出所给文件目录的所含文件的列表，并且以特定的文件名后缀来过滤这个列表。这次将会提供两个参数，第一个参数是要列举的目录，第二个参数是要过滤的文件扩展名。在终端中打印出过滤出来的文件列表（一个文件一行）。此外，必须使用异步 I/O。

需要编写一个模块文件去做大部分的事情。这个模块必须导出（export）一个函数，这个函数将接收三个参数：目录名、文件扩展名、回调函数，并按此顺序传递。文件扩展名必须和传递给程序的扩展名字符串一模一样。也就是说，请不要把它转成正则表达式或者加上"."前缀或者做其他的处理，而是直接传到模块中去，在模块中，可以做一些处理来使过滤器能正常工作。

这个回调函数必须以 Node 编程中惯用的约定形式（err,data）去调用。这个约定指明了，除非发生了错误，否则所传进去给回调函数的第一个参数将会是 null，第二个参数才会是数据。在本题中，这个数据将会是过滤出来的文件列表，并且是以数组的形式。如果接收到了一个错误，如：来自```fs.readdir()``` 的错误，则必须将这个错误作为第一个，也是唯一的参数传递给回调函数，并执行回调函数。

绝对不能直接在模块文件中把结果打印到终端中，只能在原始程序文件中编写打印结果的代码。

当程序接收到一些错误的时候，请简单的捕获它们，并且在终端中打印出相关的信息

这里有四则规定，模块必须遵守：

  * 导出一个函数，这个函数能准确接收上述的参数。
  * 当有错误发生，或者有数据的时候，准确调用回调函数。
  * 不要改变其他的任何东西，比如全局变量或者 stdout。
  * 处理所有可能发生的错误，并把它们传递给回调函数。

遵循一些约定的好处是，模块可以被任何其他也遵守这些约定的人所使用。

---
<!-- more -->
## 提示

通过创建一个仅包含目录读取和文件过滤相关的函数的文件来建立一个新的模块。要使模块导出（export）单一函数（single function），可以将函数赋值给```module.exports```对象：

    module.exports = function (args) { /* ... */ }

或者也可以使用命名函数，然后把函数名赋值给```module.exports```。

要在原来的程序中使用新的模块，请用 require() 载入模块，这和载入 fs 模块时候用 ```require('fs')```一样，唯一的区别在于本地模块需要加上 './' 这个相对路径前缀。所以，如果模块文件名字是 mymodule.js，那么需要像这样写：

    var mymodule = require('./mymodule.js')

'.js' 这个文件扩展名通常是可以省略的。

现在，mymodule 这个变量就指向了模块中  module.exports了，因为刚导出了一个单一的函数，所以现在所声明的变量 mymodule 就是那个模块所导出的函数了，就可以直接调用它了！

同样，请记住，尽早捕获错误，并且在回调中返回：

    function bar (callback) {
      foo(function (err, data) {
        if (err)
          return callback(err) // 尽早返回错误

        // ... 没有错误，处理 `data`

        // 一切顺利，传递 null 作为 callback 的第一个参数

        callback(null, data)
      })
    }

---

## 代码

### solution.js:

    var filterFn = require('./solution_filter.js')
    var dir = process.argv[2]
    var filterStr = process.argv[3]

    filterFn(dir, filterStr, function (err, list) {
      if (err)
        return console.error('There was an error:', err)

      list.forEach(function (file) {
        console.log(file)
      })
    })

### solution_filter.js:

    var fs = require('fs')
    var path = require('path')

    module.exports = function (dir, filterStr, callback) {

      fs.readdir(dir, function (err, list) {
        if (err)
          return callback(err)

        list = list.filter(function (file) {
          return path.extname(file) === '.' + filterStr
        })

        callback(null, list)
      })
    }