title: 优雅的underscore
date: 2015-08-02 22:56:05
tags:
- js
- underscore.js
categories: js
---

*Less write,less bug.*

*Don't repeat it.*

这是我写代码奉行的原则，而underscore.js很好地体现了上面两句话的精髓。

之前学习angular的时候了解到了同类型的类库有backbone，然后一看backbone的介绍顿时莫名其妙了：轻度依赖jquery，重度依赖underscore。jquery不是最流行的js类库么？竟然重度依赖个没听说过的underscore，打开underscore官网，介绍别具一格：

>他解决了这个问题：“如果我面对一个空白的 HTML 页面，并希望立即开始工作，我需要什么？” 他弥补了 jQuery 没有实现的功能，同时又是 Backbone 必不可少的部分。

“弥补了”、“必不可少”这牛皮吹得有点过了吧，于是了解使用了一下，发现确实是个好工具，于是把常用的几个函数做了一下整理。

<!-- more -->

***

## 函数

### template

经常看到这样的代码

	var str = '<div class="'+obj.className+'" id="'+obj.id+'">'+obj.name+'</div>';

在javascript中拼凑html字符串是一件很蛋疼的事情，尤其是穿插json变量的时候，现在有了template函数：

	var temp = _.template('<div class="<%=className%>" id="<%=id%>"><%=name%></div>');
	var str = temp(obj);

像不像ejs？jsp？underscore！如果对`templateSettings`进行设置，可以变成改变模板变量的匹配规则，比如angular爱好者可以通过下面的函数改成花括号

	_.templateSettings = {
	  interpolate: /\{\{(.+?)\}\}/g
	};

### _.now()

以前是不是这么取时间戳？
	
	var date = new Date();
	var seconds = date.getTimes();

现在可以这么简单

	var seconds = _.now();

### uniqueId

给多个元素创建id以前这么写

	var dom = document.createElement('div');
	for(var i=0;i<arr.length;i++){
		dom.id = 'xxx'+i;
	}

有时候id容易重复，如果比如数组重复执行或者和其它逻辑冲突，现在这么写100%不会冲突

	var dom = document.createElement('div');
	for(var i=0;i<arr.length;i++){
		dom.id = _.uniqueId('xxx');
	}

### random

我要随机数，而且是整数

	parseInt(Math.random()*100)

如果改一下，要1到100的整数？用三目运算？函数？还是underscore吧~

	_.random(1,100)

### delay

js并行写法

	setTimeout(function(){
		console.log(obj.id);
	}, 0);

用underscore并行

	_.delay(function(){
		console.log(obj.id);	
	}, 0, obj.id);

参数传递很方便		

## 对象

### isEqual

	var obj = {id:1, name:'tom'};
	var _obj = {id:1, name:'tom'};

	var arr = [1,2,3];
	var _arr = [2,1,3];

这两个对象怎么比较是否相等？函数？循环遍历？

	_.isEqual(obj, _obj) ==> true
	_.isEqual(arr, _arr) ==> false

轻轻松松3秒钟~

### pick/omit

服务器返回的结果可能是这样的

	var old = {k1: v1, k2: v2, k3: v3, k4: v4, k5: v5};

我们需要的可能是这样的

	var new = {k1: old.k1, k3: old.k3};

每个属性抄一遍多麻烦~轮到pick/omit这一对好基友上场了

	var new1 = _.pick(old, 'k1', 'k3');
	var new2 = _.omit(old, 'k2', 'k4', 'k5');

反正过滤得多就用pick，复制得多就用omit

### extend

	var info = {id:1, name:'jack', sex: 'male', age: '22'};
	var score = {id:1, math:88, biology:64, chinese: 55};

要把个人信息和成绩合并怎么办？一个属性一个属性的赋值？no~

	var student = _.extend(info, score);

### map

遍历对象
	
	function(obj){
		for(var e in obj){
			//...
		}
	}

用map

	_.map(obj,function(){value, key}{
		//...
	});

## 数组

### union

两个数组要合并，循环去重？一个函数搞定

	_.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
	==> [1, 2, 3, 101, 10]

### range

来个整数数组

	var arr = [];
	for(var i=0; i<10; i++){
		arr[i] = i+1;
	}

明明可以一行代码搞定

	var arr = _.range(1,100);

### each

写了多少便的经典代码：

	for(var i=0;i<arr.length;i++){
		//arr[i]...
	}

改一改吧

	_.each(arr, function(obj, index){
		console.log(index);
		console.log(obj);
	});

### reduce

累加求和用得再多不过了

	var count = 0;
	for(var i=0;i<i<arr.length;i++){
		count += arr[i].price;
	}

多么简洁~

	var count = _.reduce([{name:'x', price:10}, {name:'y', price:20}], function(memo, item){ return memo + item.price; }, 0);

### filter/where

过滤数组元素可以用each来实现，但是filter/where用于过滤更方便

	_.filter([-1, 2, -3, -4, 5, 6], function(num){ return num > 0; });
	==> [2, 5, 6]

	_.where([{author:'zdl', year:2015},{title: "Cymbeline", author: "Shakespeare", year: 1611}]], {author: "Shakespeare", year: 1611});
	==> [{title: "Cymbeline", author: "Shakespeare", year: 1611}]

### pluck

用来抽取复杂数组的数据

	_.pluck([{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}], 'name');
	==> ["moe", "larry", "curly"]
	
### sortBy

排序太常用了，不传函数的情况下按大小排序，传函数的情况下可以通过计算结果对原数组排序

	_.sortBy([1, 2, 3, -4, 5, 6]);
	==> [-4,1,2,3,5,6]
	
	_.sortBy([1, 2, 3, -4, 5, 6], function(num){ return num*num})
	[1, 2, 3, -4, 5, 6]

更多内容请查看[API文档](http://www.bootcss.com/p/underscore)