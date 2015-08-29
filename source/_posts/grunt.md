categories: 自动化工具
title: Grunt入门
date: 2015-06-07 21:13:16
tags: 
- Grunt
- 前端工具
---
#1. 安装grunt
	npm i -g grunt
	npm i -g grunt-cli
<!-- more -->
#2. 编写插件配置文件package.json
	{
	  "name": "my-project-name",
	  "version": "0.1.0",
	  "devDependencies": {
	    "grunt": "",
	    "grunt-contrib-jshint": "",
	    "grunt-contrib-uglify": "",
	    "grunt-contrib-concat": "",
	    "grunt-contrib-watch": "",
	    "grunt-contrib-cssmin": "",
	    "grunt-contrib-htmlmin": ""
	  }
	}
#3. 安装配置的插件
	npm i
#4. 编写Gruntfile.js
	module.exports = function(grunt) {
	  // Project configuration.
	  grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    //合并js文件
	    concat: {
	      options: {
	        // 定义一个用于插入合并输出文件之间的字符
	        separator: ';'
	      },
	      js: {
	        // 将要被合并的js文件
	        src: ['WebContent/frame/js/*.js'],
	        // 合并后的JS文件的存放位置
	        dest: 'dist/frame/js/public.js'
	      },
	      css: {
	        src: ['WebContent/frame/css/*.css'],
	        dest: 'dist/frame/css/public.css'
	      }
	    },
	    //检查js语法
	    jshint: {
	      // define the files to lint
	      files: ['gruntfile.js', 'WebContent/**/*.js'],
	      // configure JSHint (documented at http://www.jshint.com/docs/)
	      options: {
	        // more options here if you want to override JSHint defaults
	        globals: {
	          jQuery: true,
	          console: true,
	          module: true
	        }
	      }
	    },
	    //压缩js文件
	    uglify: {
	      options: {
	        banner: 'photter'
	      },
	      minify:{
	        files: {
	          'dist/frame/js/public.min.js': 'dist/frame/js/public.js'
	        }
	      }
	    },
	    //压缩css文件
	    cssmin: {
	      dist: {
	        options: {
	          banner: 'photter 1.0'
	        },
	        files: {
	          'dist/frame/css/public.min.css': ['dist/frame/css/*.css']
	        }
	      }
	    },
	    //压缩html
	    htmlmin:{
	      dist: {
	        options: {
	          removeComments: true, //删除注释
	          collapseWhitespace: true //删除标签间的空格
	        },
	        files: [
	          {
	            expand: true,
	            cwd: 'WebContent',
	            src: ['*.html'],
	            dest: 'dist'
	          }
	        ]
	      }
	    }
	  });

	  grunt.loadNpmTasks('grunt-contrib-uglify');
	  //grunt.loadNpmTasks('grunt-contrib-jshint');
	  // grunt.loadNpmTasks('grunt-contrib-watch');
	  grunt.loadNpmTasks('grunt-contrib-concat');
	  //grunt.loadNpmTasks('grunt-contrib-imagemin');
	  grunt.loadNpmTasks('grunt-contrib-cssmin');
	  //grunt.loadNpmTasks('grunt-contrib-uncss');
	  // 只需在命令行上输入"grunt"，就会执行default task 
	  grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
	};
#5.自动化构建
	grunt