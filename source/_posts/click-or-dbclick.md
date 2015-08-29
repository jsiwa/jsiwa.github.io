title: 双击单击傻傻分不清——IE8下点击事件的小坑
date: 2015-07-01 12:06:21
tags: 
- 兼容性
categories:
- js

---

## 场景

项目需求，做一个web页面上的虚拟小键盘来输入用户身份证号码。

## 实现

jquery + bootstrap

通过table来布局，通过行列合并的形式做出“键盘”的风格，这里使用a标签的active伪类来制作点击效果。
绑定onclick事件，当按钮被点击时将值显示在input输入框中以及一些其他逻辑，如：删除、取消。
整个逻辑还是比较简单自然。
** 可这时问题就来了 **
<!-- more -->
## 问题

连续点击某一个小键盘按钮的时候，有些点击并没有生效。出现点击效果时有时无的情况。

## 解决

1. 首先猜测可能是事件发生了阻塞。采用逐步注释代码的方法马上验证了这个猜想是错的。
2. 可能是a标签或者伪类样式有问题。使用button等其他标签样式同样不行。
3. 点击事件调用机制可能有问题。用了3种尝试方法：绑定document的click事件；html中写onclick事件；return false组织回调。统统失败。
4. 最后猜测应该是浏览器问题，果不其然，换了IE10，chrome都是正常的。
5. 仔细前后想了一下，点击事件浏览器间歇性捕获不到，这种情况很可能是被识别为其它事件捕获了，比如** 双击 **。绑定dblclick事件之后发现果然如此。

## 结论

IE8以下的浏览器判断双击事件的时间比其它浏览器要长，连续点击有可能会被当做双击捕获，所以会出现间歇性失灵的情况。

## 代码

### html

    <div class="keys" hidden>
      <div class="alert alert-danger text-center" role="alert">请输入正确的身份证号码</div>
      <table cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td colspan="4"><input type="text" class="show" maxlength="18">
            </td>
          </tr>
          <tr>
            <td><a class="num">7</a></td>
            <td><a class="num">8</a></td>
            <td><a class="num">9</a></td>
            <td rowspan="2"><div class="btn-cancel">取<br>消</div></td>
          </tr>
          <tr>
            <td><a class="num">4</a></td>
            <td><a class="num">5</a></td>
            <td><a class="num">6</a></td>
          </tr>
          <tr>
            <td><a class="num">1</a></td>
            <td><a class="num">2</a></td>
            <td><a class="num">3</a></td>
            <td rowspan="2"><div class="btn-ok">确<br>认</div></td>
          </tr>
          <tr>
            <td><a class="num">X</a></td>
            <td><a class="num">0</a></td>
            <td><a class="backspace">&larr;</a></td>
          </tr>
        </tbody>
      </table>
    </div>

### js

    $("#keyboard").on("click", function(){
      if($('.keys').is(":hidden")){
        $('.show').val('');
        $('.keys').show();
      }
    });
    $('.num').click(function(){
      $(this).addClass('active');
      setTimeout(function(){
        $('.active').removeClass('active');
      }, 100);
      if($('.show').val().length>=parseInt($('.show').attr('maxlength'))) return;
      var value = $('.show').val();
      value += $(this).text();
      $('.show').focus().val(value);
      resetCount();
    }).dblclick(function(){
      $(this).click();
    }); 
    $(".backspace").click(function(){
      var value = $('.show').val().substring(0, $('.show').val().length-1);
      $('.show').val(value);
      $(this).addClass('active');
      setTimeout(function(){
        $('.active').removeClass('active');
      }, 100);
    }).dblclick(function(){
      $(this).click();
    });
    $(".btn-cancel").on("click", function(){
      $('.show').val('');
      $('.keys').hide();
    });
    $(".btn-ok").on("click", function(){
      if(validate($('.show').val())) {
        location.href="list.html?id="+$('.show').val();
      } else {
        $(".keys>.alert").show();
        setTimeout(function(){$(".keys>.alert").hide()},3000);
      }
    });

### css

    .keys{
      position: absolute;
      text-align: center;
      width: 100%;
      margin: -520px 0 0 0;
    }
    .keys>table{
      width: 500px;
      height: 400px;
      margin: auto;
      background-color: #dfdfdf;
      padding: 0;
      border: 1px solid #000;
    }
    .keys>table td{
      width: 25%;
      height: 20%;
    }
    .keys>table .num{
      margin: auto;
      width: 125px;
      height: 80px;
      line-height: 80px;
      background-color: #eee;
      font-size: 30px;
      font-weight: 900;
      color: #000;
      display: block;
      border: 1px solid #ccc;
      text-decoration: none;
    }
    .keys>table a.active{
      background-color: #666;
    }
    .keys>table .backspace{
      display: block;
      margin: auto;
      width: 125px;
      height: 80px;
      line-height: 80px;
      background-color: #eee;
      font-size: 30px;
      font-weight: 900;
      border: 1px solid #ccc;
      text-decoration: none;
      color: #000;
    }
    .keys>table .btn-cancel{
      width: 125px;
      height: 160px;
      background-color: #eee;
      margin: auto;
      font-size: 35px;
      padding-top: 25px;
      border: 1px solid #ccc;
    }
    .keys>table .btn-ok{
      margin: auto;
      width: 125px;
      height: 160px;
      background-color: #ccc;
      font-size: 35px;
      padding-top: 25px;
      border: 1px solid #ccc;
    }
    .keys>table .show{
      height: 100%;
      font-size: 40px;
      width: 100%;
      margin: 0;
      border-width: 0;
      padding: 10px 0 0 10px;
    }
    .keys>.alert{
      position: absolute;
      margin: -60px 0 0 312px;
      font-size: 30px;
      height: 60px;
      display: none;
    }

## 效果

{% asset_img keyboard.jpg %}
