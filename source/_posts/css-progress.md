title: 移动端用css实现稍微复杂一点的进度条
date: 2015-08-27 20:21:49
tags:
- css
- 移动端
categories: css
---

## 需求
最简单的进度条实现方式：两个div嵌套，父层div背景填充底色，子层div背景填充高亮颜色，然后改变子层的宽度来表示进度条。
这次实现的效果稍微复杂一些，除了按宽度显示进度以外，还需要添加以下3个东西：
+ 进度条需要有节点，节点的样式根据进度进行变化
+ 当前节点上方需要配置图片，图片位置需要根据进度进行变化
+ 当前节点上方需要配置文字，文字位置根据图片位置而变化

点击查看效果（略有修改，请把大圆球想象成图片）
http://runjs.cn/code/q7tnucdj

<!-- more -->
## 进度条及节点实现
### 横线
看到这么多有规律的圆点和横线，第一眼想到的就是ul-li标签了。ul可以用来当整个进度条的背景，li是用来做圆点还是横线呢？当然是横线，不然红色的高亮横线用什么填充？新建dom元素？nonono~

### 圆点
那这样圆点怎么实现，而且这个圆点有个复杂的地方：外面套了一层圆环。两个有用的css伪类可以帮助我——before和after。简单的理解它的作用就是在元素中创建dom并给它添加样式。
这里两个伪类都要用到来实现圆环效果。一个做底部的圆环，另一个做顶部的圆点。这里用before做圆点，after做圆环，因为默认第一个节点是高亮的。问题来了：这样的话第一个节点没有圆环，最后一个节点没有圆点。
解决的方法当然很简单，多加两个li标签就行了。

## 图片位置变化实现
因为li标签按百分比显示/高亮，所以计算图片的位置并不难，用绝对定位可以轻松搞定

## 文字位置变化实现
这个也没有什么难度，关键是注意图片的在移动过程中会遮挡文字，所以需要动态改变图片的左右位置，通过float属性的left和right值即可轻松实现。

## html代码
    <html>
        <body>
            <div class="ans-head">
                <i class="person"></i>
                <ul class="progress">
                    <li></li>
                    <li class="step-5 active"></li>
                    <li class="step-5 active"></li>
                    <li class="step-5"></li>
                    <li class="step-5"></li>
                    <li class="step-5"></li>
                    <li></li>
                </ul> 
                <div class="right-title" >这里是标题文字</div>
            </div>
        </body>
    </html>

## css代码
    html,body{
        width:320px;
        height:100%;
        padding:0;
        margin:0;
        font-size: 20px;
    }
    .ans-head {
      height: 2.5rem;
      line-height: 2.5rem;
      padding: 0 1rem;
    }
    .ans-head .left-title {
      font-size: 0.6rem;
      float: left;
      color: #929295;
    }
    .ans-head .right-title {
      font-size: 0.6rem;
      float: right;
      color: #929295;
    }
    .ans-head i {
      background-size: 100%;
      width: 1.5rem;
      height: 1.5rem; 
      border-radius: 1.5rem;
      display: block;
      position: absolute;
      top: 0.5rem;
      margin-left: 0.5rem;
      left: 5.6rem; 
      background-color: red;
    }
    .ans-head ul.progress {
      position: absolute;
      margin-top: 2.4rem;
      padding: 0;
      height: 0.1rem;
      width: 14rem;
      left: 1rem;
      background-color: #d4d4d5;
      overflow: visible;
    }
    .ans-head ul.progress li {
      float: left;
      background-color: #d4d4d5;
      position: relative;
      display: inline-block;
      height: 0.1rem;
      line-height: 0;
    }
    .ans-head ul.progress li.step-2 {
      width: 50%;
    }
    .ans-head ul.progress li.step-3 {
      width: 33.3%;
    }
    .ans-head ul.progress li.step-4 {
      width: 25%;
    }
    .ans-head ul.progress li.step-5 {
      width: 20%;
    }
    .ans-head ul.progress li.step-6 {
      width: 16.6%;
    }
    .ans-head ul.progress li.active {
      background-color: #ff0000;
    }
    .ans-head ul.progress li:before {
      display: inline-block;
      position: absolute;
      width: 0.5rem;
      height: 0.5rem;
      left: -0.25rem;
      top: -0.25rem;
      border-radius: 0.5rem;
      background-color: #f0eff4;
      content: '';
    }
    .ans-head ul.progress li:after {
      content: '';
      position: absolute;
      display: inline-block;
      height: 0.2rem;
      width: 0.2rem;
      right: -0.1rem;
      top: -0.1rem;
      border-radius: 0.3rem;
      background-color: #d5d5d5;
      z-index: 1;
    }
    .ans-head ul.progress li:first-child:after {
      content: '';
      position: absolute;
      display: inline-block;
      height: 0.2rem;
      width: 0.2rem;
      right: -0.1rem;
      top: -0.1rem;
      border-radius: 0.3rem;
      background-color: #ff0000;
      z-index: 1;
    }
    .ans-head ul.progress li.active:after {
      content: '';
      position: absolute;
      display: inline-block;
      height: 0.2rem;
      width: 0.2rem;
      right: -0.1rem;
      top: -0.1rem;
      border-radius: 0.3rem;
      background-color: #ff0000;
      z-index: 1;
    }

## 总结
1. 移动端在html中设置font-size之后，再用rem来设置字体和边距、元素大小可以较好的做到适配不同大小的屏幕。
2. 圆环和箭头一般的实现思路都是元素的叠加。
3. before和after可以有效的减少dom

>本篇文章并没有太多新鲜的东西，之所以还是记下来，一是养成了写文章整理记录的习惯，二是因为觉得，相比技能本身，解决问题的思路更重要。就像是很多人认得三千个汉字，但是有的人就可以写出优秀的文章，思维决定行为。

- - - 
博客：http://yalishizhude.github.io
作者：[亚里士朱德](http://yalishizhude.github.io/about/)