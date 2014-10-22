---
layout:    default
title:     JavaScript语言精粹笔记
category:  JavaScript
tags:      学习，JavaScript
keyword:   JavaScript语言精粹,JavaScript学习
description:  JavaScript语言精粹笔记
---

<div class="post-con">
<h2>JavaScript 中一些难以避免的特性</h2>

<h4>一、全局变量</h4>
<p>JavaScript 的问题不仅在于它允许使用全局变量，而且在于它依赖全局变量。JavaScript没有链接器（linker），所有的编译单元都载入一个公共全局对象中。</p>
<p>注：在Web浏览器中，每个&lt;script&gt;标签提供一个被编译且立即执行的编译单元。</p>

<p>定义全局变量的3种方式</p>
<p>1.在任何函数之外放置一个var语句</p>
<pre>
	<code class="javascript">
   		var foo = value;
    </code>
</pre>
<p>2.直接给全局对象（全局对象是所有全局变量的容器）添加一个属性。</p>
<pre>
	<code class="javascript">
   		window.foo = value;
   	</code>
</pre>
<p>3.未声明的变量（隐式的全局变量）</p>
<pre>
	<code class="javascript">
  		foo = value;
	</code>
</pre>

<p>全局变量在代码量小的可能比较方便，项目越大，代码越复杂，就越难维护。</p>

<h4>二、JS没有块级作用域</h4>
<p>JavaScript语法来源于C。在所以其他类似C风格的语言里，一个代码块（花括号的一组语句）会创建一个作用域。</p>

<h4>三、自动插入分号</h4>
<p>JavaScript有一个自动修复机制，它试图通过自动插入分号来修正缺损的程序。</p>

<pre>
<code class="javascript">
// 返回undefined
return 
{
status: true
};

// 返回true
return{
status: true
};
</code>
</pre>

<h4>四、保留字</h4>
<p>保留字不能被用来命名变量或参数</p>
<p>abstract boolean break byte case catch char class const continue debugger default delete do double else enum export extends false final finally float for function goto if implements import in instanceof int interface long native new null package private protected public return short static super switch synchronized this throw throws transient true try typeof var volatile void while with</p>
<p>O(╯□╰)o好多</p>

<h4>五、Unicode</h4>
<p>JavaScript设计之初，Unicode预期最多会有65536个字符。但后来，它的容量慢慢增长到了拥有一百万个字符。</p>
<p>JavaScript的字符是16位的，那足以覆盖原有的65536个字符（现在被称为基本多文种平面（Basic Mulilingual Plane））。剩下的百万字符中的每一个都可以用一对字符来表示。Unicode把一对字符视为一个单一的字符。而JavaScript认为一对字符是两个不同的字符。</p>

<h4>六、Typeof</h4>

<p>JavaScript中的typeof可以用来做很多事，但也有很多怪异的表现</p>
<pre>
	<code class="javascript">
>typeof undedined
‘undefined’
>typeof null
‘object’
// 解决办法
var my_value === null
if (my_value && typeof my_value === “object”){
// my_value 是一个对象或数组
}
	</code>
</pre>

</div>