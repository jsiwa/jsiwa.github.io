title: 学习jquery之前了解一下requirejs也无妨
tags:
  - requirejs
date: 2015-08-22 09:35:51
categories: js
---

jquery算是最先了解的一个js库，算是一种工具库，提供了很多实用的工具函数，也为其它很多插件提供了开发基础，但是用了这么久，我看不出其中有什么核心的思想性的东西。
requirejs的核心思想用一个单词可以概括：AMD。它只做了一件事：模块化。而且这件事做得还挺好：通过简单的配置、调用方式，加速、优化了代码。结合我在项目中的一些使用经验，从以下几个方面总结了一下requirejs的特点。

- - - 
<!-- more -->
### 配置

    <script data-main="main.js" src="frame/js/require.js"></script>
首先需要像这样在页面上引用requirejs。它和jquery这种类库的不同之处是，它并不是引用了之后就可以使用，它需要一个简单的配置文件来定义那些不符合requirejs格式的模块以及它们之间的依赖关系。这里main.js就是它的配置文件。打开来是这样的结构

    requirejs.config({
            baseUrl: "frame",//模块查找的根路径
            paths: {
                "zepto": "js/zepto",
                "frozen": "js/frozen",
                "underscore": "js/underscore",
                "text": "js/text",
                "css": "js/css",
                "route": "../js/route"
            },
            shim: {
                "zepto": {
                    exports: "$"
                },
                "underscore": {
                    exports: "_"
                },
                "frozen": {
                    deps: ["zepto"]
                }
            }
        });
paths是预定义的一些模块，比如frame/js/zepto.js定义为zepto模块。
shim很重要，处理了导出名称和依赖关系。第1个zepto模块的全局变量名称为'$'（这个就好比JQuery.js我们叫做jquery，实际用的时候我们用$作为变量），第3个frozen模块表示当它被加载的时候，需要先加载zepto模块。
### 调用
常用的调用方式一般是执行一个define函数
* 第1个参数是依赖的模块，可以是在path定义的公用模块，也可以是自定义的代码，不过自定义的代码需要注明引用路径，例如`../js/util.js`这种
* 第2个参数是自定义模块，传入的是一个匿名函数，函数参数顺序和模块顺序一一对应，最后return的对象或函数即为对外暴露的接口。对详细的使用方法有兴趣的可以看[这篇文章](http://javascript.ruanyifeng.com/tool/requirejs.html)
* 第3个是模块加载报错的处理函数（一般可以省略）。

需要注意的是，这里的模块加载是*异步*的，也就是说同时加载zepto和route这两个模块，但是只等两个模块加载完成之后才执行后面的模块代码。想详细了解的话可以看[这篇文章](http://www.douban.com/note/283566440/)。
这种异步加载模块的方式很像我之前一篇文章[浅谈js中多并发的一些处理方法](http://yalishizhude.github.io/2015/08/18/js-async/#comments)提到的场景，个人比较推崇这种高效的方式，不像CMD按顺序依次加载影响性能。

    define(['zepto', 'route'], function($, state) {
        return {
            init: function(){
                $('.logo-wrap').click(function(){
                    state.go('photo');
                });
            }
        };
    });
### 进阶or技巧

* package

包就是讲模块再次组合封装起来。目前项目中没有用到，感觉在很大型的项目才有使用必要。

* CDN

如果我们想引用cdn上的代码，可以在配置文件中的paths属性中这么写

    "zepto": ['http://apps.bdimg.com/libs/zepto/1.1.4/zepto.min',"js/zepto"]

第一个值为cdn中的路径，当加载失败时从第2个本地路径加载。

想知道cdn是什么有什么用，可以看我之前写的[CDN简介](http://yalishizhude.github.io/2015/07/04/cdn/)

* 插件

如果认为requirejs只能管理js代码那就想得太简单了。
配上text插件即可把html文件当做模块引入。用处就是可以当做碎片页来处理，类似jquery中的load函数，不过好处就是这个html文件可以被缓存，而不是像jquery每load一次就发起一次ajax请求。
配上[require-css插件](https://github.com/guybedford/require-css)即可管理css代码。不过并不建议这样做，个人觉得还是老老实实在head中通过link标签来引入有利于页面快速加载。

### 使用意义

* 各个功能可以协同开发
* 公用代码形成模块后方便调用
* 避免各个模块冲突
* 可以良好地处理依赖关系
