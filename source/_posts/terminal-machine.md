title: 细数在自助终端机上开发混合应用的那些坑（前端）
date: 2015-07-16 17:13:37
tags:
- html
- css
- js
categories: 混合应用
---

## 需求

应客户要求开发部署在自助终端机（可理解为带触摸屏的电脑）上的程序，主要实现身份证识别、订单查询和打印功能。
---
<!-- more -->
## 开发环境
* windows XP
xp没什么好吐槽的，老系统了，还比较稳定。
* IE 8
不支持css3，不支持媒体查询，没有chrome的实时打印预览（虽然后面也没用到这个功能）。
好处就是支持actvieX插件，可以扩展浏览器功能，打破浏览器默认的一些限制。
* visual studio
开发程序外壳，生成可执行的exe，内嵌浏览器加载html。

---

## 前端技术选型

由于对jquery比较熟悉，ui考虑使用bootstrap一方面是因为其比较火，另外一方面是它跟jquery可以完美结合，觉得坑会少一些，事后证明其实作用并不大，自己写样式也差不多。尤其是bootstrap的栅格布局，在打印的时候就是一个大坑，而且在IE8下媒体查询也失效了，所以对本次开发的贡献度实在是低。。。

## 问题和解决方案

终端机开发其实和pc端的web开发大致相同，就界面展现而已，其实更加简单，因为浏览器是固定的，屏幕分辨率是固定的。这次的难点就在于*浏览器调用多台打印机同时直接打印*。

* 启动同步问题
*描述：*
由于是bs架构同时部署在一台机器上，两端同时由应用程序启动，所以正常的程序是tomcat启动完成后，再访问服务器加载页面。
*难度：*\**
*方案：*
首先加载一个loading页面，每秒js轮询调用C++提供的接口，如果tomcat已经启动则跳转到首页。

* 身份证识别功能
*描述：*
一般的查询系统是通过输入编号来进行查询，而更多的取票系统现在采用了更简单的身份证识别方式，如高铁取票机。这次终端机也通过轮询外部接口的方式实现了该功能。
同时应当考虑的时候身份证识别系统失效的提供手动输入的情况，由此开发了虚拟键盘，但是开发键盘输入的时候，有两个要点：一是身份证号码校验，另一个就是虚拟键盘的触控效果。
*难度：*\****
*方案：*
身份证校验这个功能很多帖子都讲了算法，不复杂，js代码如下：
    /* 复杂验证！ */
    var province = '11;12;13;14;15;21;22;23;31;32;33;34;35;36;37;41;42;43;44;45;46;50;51;52;53;54;61;62;63;64;65;71;81;82;91;';
    var iSum = 0;
    var info = '', sBirthday = '';
    if (!/^\d{17}(\d|x)$/i.test(value))return false;
    value = value.replace(/x$/i, "a");
    if (province.indexOf(value.substr(0, 2) + ';') === -1)return false;//"Error:非法地区";
    sBirthday = value.substr(6, 4) + "/" + Number(value.substr(10, 2)) + "/" + Number(value.substr(12, 2));
    var d = new Date(sBirthday);
    if (sBirthday !== (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()))return false;//"Error:非法生日";
    for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(value.charAt(17 - i), 11);
    if (iSum % 11 !== 1)return false;//"Error:非法证号";
    return true;
触控效果比较难搞，之前考虑用a标签的active样式来做点击效果，但是由于IE8的双击判断间隔有问题，具体问题参见我的另一篇[博客](http://yalishizhude.github.io/2015/07/01/click-or-dbclick/)。后来用dblclick双击事件来调用click事件，pc端上没有问题，部署到终端机的时候还是显示迟钝，效果不理想。改用mousedown和mouseup效果也不好。有更好的方法请告知我~

* 