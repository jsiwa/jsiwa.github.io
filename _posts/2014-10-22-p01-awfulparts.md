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
<pre><code class="javascript">
var foo = value;
</code></pre>
<p>2.直接给全局对象（全局对象是所有全局变量的容器）添加一个属性。</p>
<pre><code class="javascript">
window.foo = value;
</code></pre>
<p>3.未声明的变量（隐式的全局变量）</p>
<pre><code class="javascript">
foo = value;
</code></pre>

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

<p>JavaScript中的 <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof">typeof</a> 可以用来做很多事，但也有很多怪异的表现</p>
<pre><code class="javascript">
> typeof undedined
‘undefined’

> typeof null
‘object’
// 解决办法
var my_value === null
if (my_value && typeof my_value === “object”){
	// my_value 是一个对象或数组
}

> typeof true
'boolen'

> typeof 123
'number'

> typeof "abc"
'string'

> typeof function(){}
'function'

> typeof {}
'object'

> typeof []
'object'

> typeof unknownVariable
'undefined'
</code></pre>

在对正则表达式的类型识别上，不同浏览器表现也不一致
<pre><code class="javascript">
typeof /a/
// IE/Firefox/Opera都返回'object'，Safari 3.x中返'function'，5.x后与其他浏览器一致
</code></pre>

<h4>七、parseInt</h4>
<p>parseInt 是一个把字符串转化为整数的函数。它在遇到非数字时会停止解析</p>
<pre><code class="javascript">
parseInt("08");
>> 0
parseInt("09");
>> 0
// 如果字符串第一个字符是0，那么该字符串会基于八进制求值
// 在八进制中8和9不是数字

// 解决
parseInt("08", 10);
>> 8
</code></pre>

<h4>八、+</h4>
<p>+ 运算符可以用于加法运算或字符串连接。</p>

<pre><code class="javascript">
var plusCheck;
plusCheck = "" + 1;
>> "1"

plusCheck = 0 + 1;
>> 1
</code></pre>

<h4>九、浮点数(Floating Point)</h4>
<pre><code class="javascript">
console.log(0.1+0.2);
>> 0.30000000000000004
// 二进制的浮点数不能正确的处理十进制的小数
</code></pre>

<p>这是JavaScript中最经常被报告的bug，并且它是遵循二进制浮点数算数标准（<a href="http://zh.wikipedia.org/wiki/IEEE_754">IEEE 754</a>）而<strong>有意</strong>导致的结果。</p>

<h4>十、NaN</h4>
<p>NaN 是 IEEE754 中定义的一个特殊的数量值。它表示的不是一个数字，尽管下面的表达式返回的是true。</p>
<pre><code class="javascript">
typeof NaN === 'number';
>> true

// 该值可能会在试图把非数字形式的字符串转换为数字时产生。
+ '0'
>> 0
+ 'oops'
>> NaN

// NaN检测，typeof 不能识别数字和NaN，而且NaN也不等同于它自己。
NaN === NaN 
>> false
NaN !== NaN
>> true

// JavaScript提供了一个isNaN函数
isNaN(NaN)       // true
isNaN(0)         // false
isNaN('oops')    // true
isNaN('0')       // false

// 判断一个值是否可用作数字的最佳办法是使用 isFinite 函数，因为它可以 筛 除掉 NaN 和 Infinity。
// 遗憾的是：isFinite会试图把它的云算数转换为一个数字
// 定义isNumber
var isNumber = function isNumber(value){
	return typeof value === 'number' && isFinite(value);
}
</code></pre>

<h4>十一、伪数组(Phony Arrays)</h4>
<p>JavaScript没有真正的数组。这也不全是坏事。JavaScript的数组确实非常容易使用。你不必给它们设置维度，而且它们永远也不会产生越界（out-of-bounds）错误。但它们的性能相比真正的数组可能箱单糟糕。</p>
<pre><code class="javascript">
// typeof 运算符不能辨别数组和对象。
// 通过检查constructor属性
if (my_value && typeof my_value === 'object' && my_value.constructor === Array ){
	// my_value 是一个数组
}

// 上面的检测对于不同帧？或窗口创建的数组将会给出false。当数组有可能在其他的帧中被创建时，下面的检测更为可靠：
if (Object.prototype.toString.apply(my_value) === '[object Array]') {
	// my_value 确实是一个数组！
}

// arguments 数组不是一个数组，它只是一个有着 length 成员属性的对象。上面的检测会分辨出arguments 并不是数组。
</code></pre>

<h4>十二、假值(Falsy Values)</h4>
<table class="jsiwa_table">
	<thead>
		<th>值</th>
		<th>类型</th>
	</thead>
	<tbody>
		<tr>
			<td>0</td>
			<td>Number</td>
		</tr>
		<tr>
			<td>NaN(非数字)</td>
			<td>Number</td>
		</tr>
		<tr>
			<td>''(空字符串)</td>
			<td>String</td>
		</tr>
		<tr>
			<td>false</td>
			<td>Boolean</td>
		</tr>
		<tr>
			<td>null</td>
			<td>Object</td>
		</tr>
		<tr>
			<td>udefined</td>
			<td>Udefined</td>
		</tr>
	</tbody>
</table>
<p>这些值全部都等同于假，但它们是不可互换的。</p>
<pre><code class="javascript">
false == null         // false
false == undefined    // false
false == 0            // true
false == ''           // true
false == NaN          // false

null == undefined     // true
null == 0             // false
null == ''            // false
null == NaN           // false

undefined == 0        // false
undefined == ''       // false
undefined == NaN      // false

0 == ''                // true
0 == NaN               // false

// ps: ==运算符会强制转换类型

// 在ECMAScript规范第五版中，明确规定了NaN和undefined 为常量，而之前的版本中都未明确规定。
// 目前主流浏览器的主流版本，都无法更改NaN和undefined的值。而IE8及8以下版本是可以的

</code></pre>

<h4>十三、hasOwnProperty</h4>
<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty">hasOwnProperty()</a> 方法用来判断某个对象是否含有指定的自身属性。</p>
<p>hasOwnProperty 是一个方法，在任何对象中，它可能会被一个不同的函数甚至一个非函数的值所替换：</p>
<pre><code class="javascript">
var name;
another_stooge.hasOwnProperty = null;     // 替换
for(name in another_stooge) {
	if (another_stooge.hasOwnProperty(name)) {
		document.writeln(name + ':' + another_stooge[name]);
	}
}
</code></pre>

<h4>十四、对象(Object)</h4>
<pre><code class="javascript">
var i;
var word;
var text = "This oracle of comfort has so pleased me, "
         + "That when I am in heaven I shall desire "
         + "To see what this child does this, "
         + "and praise my Constructor.";
var words = text.toLowerCase().split(/[\s,.]+/);
var count = {};
for (i = 0; i < words.length; i +=1){
	word = words[i];
	if (count[word]){
		count[word] += 1;
	}else{
		count[word] = 1;
	}
}
count['constructor']
>> "function Object() { [native code] }1"
</code></pre>

</div>