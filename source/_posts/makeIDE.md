title: windows下搭建前端开发IDE（maven + grunt + tomcat + cmd + sublime）
date: 2015-07-28 23:51:51
tags:
- 前端工具
- grunt
- maven
- tomcat
categories: 自动化工具
---

## 那些年用过的IDE

很有幸，在做前端工程师之前我是一名全栈开发人员，所以接触了目前主流的用于jsp开发的IDE：eclipse和IntelliJ。它们的优点就是集成了很多插件，所以够智能。
很不幸，eclipse的流畅性极差（经常容易卡死,白瞎了我10G RAM、128G SSD + 256G HD、i3 CPU的笔记本）以及贪得无厌的消耗内存。IntelliJ作为付费产品，其稳定性也是值得吐槽的，经常出现莫名其妙的bug导致项目无法正常部署。
而如果需要开发后端代码，断点调试必不可少，除IDE外也无他更好工具，所以谈起IDE都是爱恨交织。
<!-- more -->
## 项目状况

现在的项目用jsp开发，属于前后端“半分离”状态。
从技术上说，用了freemarker模板，这个东西有点像jsp页面，会用到一些java代码，却又可以写在html文件中，所以并没有真正意义上的让前后端分离。
从结构上说，整个产品有点像cs架构，分为client端的web项目和server端的web项目，client端负责响应浏览器请求，返回js、css、html等，server端负责与数据库、client端交互。表面上看是一种分离，实际上已是“半分离”状态，因为如果client端想单独调试基本不可能，原因很简单，freemarker填充模板数据失败报错404。个人觉得freemarker还是更加适合于jsp全栈开发，用于前后端分离太尴尬。
由于前段开发只需关注client端，所以开始使用Intellij的初衷是通过maven下载打包web项目，启动tomcat服务器并实时更新修改的前端文件。后来被折磨了几次，所以决定自己定制化“IDE”。

## 关于开发工具（题外话）

我觉得最优秀的开发工具需要满足两个特点：
1. 定制化
每个开发者根据自己的使用习惯和项目需求来选择插件并进行配置。
2. 可扩展
开发工具本身提供良好的接口，让各位开发者能参与开发其它插件来不断强化它。
令我印象最深的4款编辑器符合这两个特点：`emacs、vim、sublime、atom`。简单的说一说他们的优缺点吧。
* emacs：当之无愧的神之编辑器，学习曲线是最难的，只有大神才可将其用得淋漓尽致，各种ctrl、alt快捷键在windows键盘下使用相当不适应。
* vim：编辑器之神。最大的特点是可以脱离鼠标很舒服地编辑代码，与emacs不一样，它不是ctrl到死的方式使用快捷键，而是用esc来切换模式，配合上强大宏以及多种插件，也是相当顺手的一件工具。使用它还有一个原因：它跨平台。linux服务器自带了vi，掌握了vim，上linux服务器上查看编辑文件再也不用犯愁了。
* sublime：插件丰富，开发者活跃，当下流行，正在使用。
* atom：后起之秀，界面美观，github强推工具，基本上模仿了sublime，但是流畅性还是做得不够好，如果这方面加强我会毫不犹豫地转投github的怀抱。

## 实现方式

在windows下想把各种工具集成起来，变成一个傻瓜智能甚至是一键启动的软件，很自然地想到了批处理脚本。所以最终各软件的调用都是依赖cmd命令来实现的。

### 基本流程

1. 为了实现一键启动，先清除tomcat缓存和项目代码以及maven本地缓存的jar文件。
2. 停止grunt和tomcat，防止重复启动。
3. mvn命令编译发布项目和下载依赖。
4. 通过grunt拷贝生成的项目到tomcat的webapps目录下，这里用批处理也可以实现。
5. 启动tomcat服务器
6. 启动grunt watch，只要sublime修改完代码后，grunt即会自动拷贝到对应的web目录下。

### 源代码（出于保密，部分文件路径略作修改）

批处理脚本

	color 0B
	rem 设置tomcat安装路径
	set "tomcat_path=D:\Program Files\apache-tomcat-7.0.56\"
	rem 设置代码路径
	set "code_path=E:\branches\hd-2.0.0\client\"
	echo 停止grunt进程
	taskkill /F /IM node.exe
	echo 停止tomcat进程
	D:
	cd %tomcat_path%
	call bin\shutdown.bat
	echo 清除缓存
	rd /s/q work
	rd /s/q ap
	rd /s/q D:\datas\.m2\repository\com\hd
	echo 编译并发布代码
	E:
	cd %code_path%
	call mvn clean package
	call grunt
	echo 启动tomcat
	D:
	cd %tomcat_path%
	call bin\startup.bat
	echo 监听并发布代码
	E:
	cd %code_path%
	grunt watch

gruntfile.js配置文件，如果大家知道`grunt-contrib-copy`中，文件名如何使用通配符，请发邮件告诉我，必谢~

	/*global module*/
	module.exports = function (grunt) {
	  'use strict';
	  grunt.initConfig({
	    copy: {
	      publish: {
	        files: [
	          { expand: true, cwd: 'target/client-2.0.0.v20150630', src: ['**'], dest: 'D:/Program Files/apache-tomcat-7.0.56/webapps/ap'}
	        ]
	      },
	      main: {
	        files: [
	          { expand: true, cwd: 'src/main/webapp', src: ['**'], dest: 'D:/Program Files/apache-tomcat-7.0.56/webapps/ap'},
	        ]
	      }
	    },
	    watch: {
	      view: {
	          files: ['src/main/webapp/**'],
	          tasks:['copy:main'],
	          options: {livereload:false}
	      }
	    }
	  });

	  grunt.loadNpmTasks('grunt-contrib-copy');
	  grunt.loadNpmTasks('grunt-contrib-watch');

	  grunt.registerTask('default', ['copy']);
	};

## 总结

其实在开发中，最消耗时间的就是鼠标的点击和工具的切换。所以现在流行多显示器开发，让共工具在不同的屏幕上操作，减少了点击任务栏、最小化、最大化这种机械操作。另一方面IDE的出现、快捷键的使用减少鼠标的点击。
传统的IDE在开发中往往伴随这一些问题，所以了解各种工具并搭建属于自己的最适用于项目的开发环境，应当是每一位开发者追求高效开发的必经之路。这篇抛砖引玉的文章也正是出于此目的~