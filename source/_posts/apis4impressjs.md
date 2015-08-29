title: impressjs扩展：显示页数/进度条
date: 2015-07-06 21:45:41
tags: impressjs
categories: js

---

{% asset_img demo.jpg %}

## 什么是impressjs？

impressjs就是为html文件添加css3动画，变成类似ppt效果的工具，它支持图片和文字（flash动画可能支持），跨平台，用impressjs做ppt，你再也不用担心pc上有没有安装powerpoint了。重要的是它学习门槛也很低。大家只要下载项目，打开index.html修改内容即可（不过作者并不提倡这样做）。大家有兴趣可以查看项目主页和demo。

[github主页](https://github.com/impress/impress.js)

[demo页面](http://bartaz.github.io/impress.js/)
<!-- more -->
## impressjs API开发

### 起因

之前由于公司需要我做个ppt介绍一下CDN，但是身为一个前端工程师，尤其是反感word的工程师，于是找到了这款高逼格的做演示文件的利器——impressjs。加了css3特效的html当然是华丽丽的，但是用起来之后发现和通常用的ppt还是有些区别，那就是缺少了当前页数的显示，再加上灵光一闪，觉得加个进度条也不错，于是中午抽空就写了一下~

### js代码分析

#### 添加当前页

impressjs的每一页都有一个step样式，总览页也不列外。而且每页都有一个id，如果id不存在的话则默认为'step-x'，x为序号。利用这个特性就可以实现所要的功能。

新增一个header元素，通过修改元素宽度来显示当前进度。
```
var showProgress = function(){
    var head = {};
    if(document.getElementsByTagName('header')[0]){
        head = document.getElementByTagsName('header')[0];
    } else {
        head = document.createElement('header');
        document.body.appendChild(head);
    }
    var percent = getCurrent()*100.00/getTotal();
    console.log(percent);
    head.style.width = percent + '%';
    window.addEventListener("hashchange", function () {
        var percent = getCurrent()*100.00/getTotal();
        head.style.width = percent + '%';
    }, false);
};
```
新增一个footer元素来显示当前页和总页数，同时监听url地址来的hash值变化来修改当前页序号
```
var showPage = function(){
    var foot = {};
    if(document.getElementsByTagName('footer')[0]){
        foot = document.getElementByTagsName('foot')[0];
    } else {
        foot = document.createElement('footer');
        document.body.appendChild(foot);
    }
    foot.innerText = getCurrent()>0?(getCurrent()+'/'+getTotal()):'';
    window.addEventListener("hashchange", function () {
        foot.innerText = getCurrent()>0?(getCurrent()+'/'+getTotal()):'';
    }, false);
};
```
#### 暴露接口
impressjs默认开放了4个接口```init,goto,next,prev```,这里需要新增两个
```
return (roots[ "impress-root-" + rootId ] = {
    init: init,
    goto: goto,
    next: next,
    prev: prev,
    showPage: showPage,
    showProgress: showProgress
});
```
### css样式分析
底部显示页数，用固定定位
```
footer{
    position: fixed;
    bottom: 150px;
    height: 30px;
    text-align: center;
    width: 100%;
    font-size: 25px;
    font-weight: 900;
}
```

顶部显示进度条，用固定定位，通过改变百分比宽度来表示进度
```
header{
    position: fixed;
    top: 0;
    height: 10px;
    background-color: #3879d9;
}
```

### html的调用示例
```
impress().showPage();
impress().showProgress();
```

### 大结局

预知后事如何，可以[点击](https://github.com/impress/impress.js/pull/487)查看我提交的版本以及作者的回复