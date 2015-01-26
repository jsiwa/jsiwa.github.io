module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      compile: {
        options: {
          paths: ['css']
        },
        files: {
          'css/main.css': 'css/main.less'
        }
      }
    },
    // 字蛛插件：压缩与转码静态页面中的 WebFont
    'font-spider': {
      main: {
        src: './*.html'
      }
    },
    cssmin: {
      my_target: {
        files: [{
          expand: true,
          cwd: 'css/',
          src: ['*.css', '!*.min.css'],
          dest: 'css/',
          ext: '.min.css'
        }]
      }
    },
    uglify: {
      my_target: {
        files: [{
            expand: true,
            cwd: 'js',
            src: ['**/*.js', '!**/*.min.js', '!**/*less.js', '!**/*require.js'],
            dest: 'js',
            ext: '.min.js'
        }]
      }
    }
    // 自动雪碧图
    // sprite: {
    //     options: {
    //         // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
    //         imagepath: 'img/home/slice/',
    //         // 映射CSS中背景路径，支持函数和数组，默认为 null
    //         imagepath_map: null,
    //         // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
    //         spritedest: 'img/home/',
    //         // 替换后的背景路径，默认 ../images/
    //         spritepath: '../../img/home/'
    //     },
    //     autoSprite: {
    //         files: [{
    //             // 启用动态扩展
    //             expand: true,
    //             // css文件源的文件夹
    //             cwd: 'css/guanwang/',
    //             // 匹配规则
    //             src: '*.less',
    //             // 导出css和sprite的路径地址
    //             dest: 'css/guanwang/',
    //             // 导出的css名
    //             ext: '-sprite.less'
    //         }]
    //     }
    // }
  });

  // 加载包含 "uglify" 任务的插件。
  // grunt.loadNpmTasks('grunt-font-spider');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-css-sprite');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['less', 'cssmin', 'uglify']);

};