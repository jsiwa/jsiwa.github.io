title: 浅谈js中多并发的一些处理方法
date: 2015-08-18 01:35:10
tags: 
- js
categories: js
---

经常在写代码的时候碰到这样的场景：页面初始化时显示loading页，同时启动多个ajax并发请求获取数据，当每个ajax请求返回时结束loading。
举个例子，一个下订单的页面，要查询常用地址信息、商品信息、地市信息...而这些请求都是异步的，希望等到所有数据加载完成后再允许用户操作。
要实现这个场景容易碰到的一个问题就是多并发怎么控制？下面是一些解决方法和思路：

- - -
<!-- more -->

## 并行改为串行

如果业务逻辑本身是串行的，但是提供的请求方式又是异步的，可以考虑此方法。
但本场景显然不是这种情况，这样做大大降低了页面性能，延长了加载速度。

### 回调

只适合并发数少的情况，多层嵌套回调会让代码的可读性大大降低

    function async1(){
        //do sth...
    }
    function async2(){
        //do sth...
        async1();
    }
    async2();

### ajax改为同步

如在jquery中将async参数设置为false

    $.ajax({
        url:"/jquery/test1.txt",
        async:false
    });

## 设置结束标识

简单一点的可以设置计数器，每完成一个异步函数加1，或者设置一个数组，每执行完一个异步函数更新数组。

## 回调计数

    var cnt = 0;
    function async1(){
        //do sth...
        callback();
    }
    function async2(){
        //do sth...
        callback();
    }
    function callback(){
        cnt++;
        if(2==cnt) console.log('都已执行完毕');
    }

### 循环阻塞

    var cnt = 0;
    function async1(){
        //do sth...
        cnt++;
    }
    function async2(){
        //do sth...
        cnt++;
    }
    while(2>cnt){}

### 循环非阻塞

不建议过多使用，以免影响性能

    var cnt = 0;
    
    function async1(){
        //do sth...
        cnt++;
    }
    function async2(){
        //do sth...
        cnt++;
    }
    var interval = setInterval(function(){
        if(2===cnt){
            console.log('已执行完成');
            clearInterval(interval)
        }
    }, 0);

## 第三方框架实现

### jquery

目前我在项目中采用的方式

    var d1 = $.Deferred();
    var d2 = $.Deferred();
     
    function async1(){
        d1.resolve( "Fish" );
    }
    
    function async2(){
        d2.resolve( "Pizza" );
    }
    
    $.when( d1, d2 ).done(function ( v1, v2 ) {
        console.log( v1 + v2 + '已完成');
    });
     

### angular

具体代码不写了，可以参考API文档中关于[$watch](http://docs.angularjs.cn/api/ng/type/$rootScope.Scope#$watch)的说明

