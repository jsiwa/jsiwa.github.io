;(function($){

    var defaultOps = {
        shell:    null,
        autoplay: true,
        looptime: 3000
    };

    $.fn.slider = function(ops){

        for(var k in defaultOps) {
            if(typeof ops[k] === 'undefined') {
                ops[k] = defaultOps[k];
            }
        }

        var shell = ops.shell && $(ops.shell) || $(this),
            libox = shell.find('ul'),
            item  = shell.find('li'),
            len   = item.length,
            dots  = shell.find('.ui-dots'),
            width = shell.width(),
            index = -len,
            cur   = 0;

        item.css({
            width: width
        });

        item.clone().appendTo(libox);

        libox.css({
            width: width * len * 2,
            '-webkit-transform': 'translate3d( ' + width * index + 'px, 0, 0)'
        });


        playCtrl = {
            loop: null,
            init: function(){

                if(ops.autoplay){
                    this.autoPlay();
                }

                var self = this,
                    touchStartX,
                    touchStartY,
                    touchmoveX,
                    touchmoveY,
                    timeout;

                shell.on('touchmove', function(e){
                    var touch = e.touches[0];
                    touchmoveX = touch.pageX - touchStartX;
                    var offet = width * index + touchmoveX;
                    libox.css({
                        '-webkit-transform': 'translate3d( ' + offet + 'px, 0, 0)'
                    });
                }).on('touchstart', function(e){
                    libox.trigger('webkitTransitionEnd');
                    var touch = e.touches[0];
                    touchStartX = touch.pageX;
                    touchStartY = touch.pageY;
                    self.pause();
                }).on('touchend', function(e){
                    var isSlide = Math.abs(touchmoveX) > width/3;
                    if (isSlide) {
                        if(touchmoveX > 0){
                            self.play(1);
                        }else {
                            self.play(-1);
                        }
                    }else {
                        libox.css({
                            '-webkit-transform': 'translate3d( ' + width * index + 'px, 0, 0)',
                            '-webkit-transition': '-webkit-transform 1s'
                        });
                    }

                    touchmoveX = null;
                    touchmoveY = null;

                    if(ops.autoplay){
                        clearTimeout(timeout);
                        timeout = setTimeout(function(){
                            self.autoPlay();
                        }, 3000);
                    }
                });

            },
            play: function(flip){
                index = index + flip;
                if(flip === 1){
                    cur--
                }else {
                    cur++;
                }
                
                dots.find('span').removeClass('cur').eq(cur%len).addClass('cur');

                libox.css({
                    '-webkit-transform': 'translate3d( ' + width * index + 'px, 0, 0)',
                    '-webkit-transition': '-webkit-transform '+ (ops.looptime < 1000 ? (ops.looptime - 100)/1000 : 1) +'s'
                }).one('webkitTransitionEnd', function(){
                    if(flip === 1){
                        shell.find('li').last().prependTo(libox);
                    } else {
                        shell.find('li').first().appendTo(libox);
                    }
                    index = index - flip;
                    libox.css({
                        '-webkit-transform': 'translate3d( ' + width * index + 'px, 0, 0)',
                        '-webkit-transition': '-webkit-transform 0'
                    });
                });
            },
            autoPlay: function(){
                var self = this;
                this.loop = setInterval(function(){
                    self.play(1);    
                }, ops.looptime);
            },
            pause: function(){
                clearInterval(this.loop);
            }
        }
        playCtrl.init();
    }

})(Zepto);

$('.ui-slider').eq(0).slider({
    autoplay: false,
    looptime: 3000
});

$('.ui-slider').eq(1).slider({
    autoplay: false,
    looptime: 3000
});

$(window).resize(function(){
    var win = window, doc = win.document, winH = win.innerWidth,
        _html = doc.documentElement;
    if(_html){
        _html.style.fontSize = winH > 640 ? 40 + 'px' : 40*winH/640 + 'px';
    };
});


$('section').click(function(){
    var el = $(this);
    el.addClass('hide');
    if(el.next('section')){
        el.next('section').removeClass('hide');
    }else {
        $('section').eq(0).removeClass('hide');
    }
});




