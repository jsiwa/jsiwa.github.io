(function ($){
	var datePicker,uiTmpl,currentInput,initialized,currentYear,stopFocusTrgger,ui = {},styleText,
		conf = {icon: 'i.date'},
		ie6 = !window.XMLHttpRequest && window.ActiveXObject;
	function QEvent(obj){
		var C={};
		obj = obj||{};
		if (!obj['!EVENTABLE']) {
			obj['!EVENTABLE'] = 1;
			obj.on = function (type, fn){
				if(fn instanceof Function){if (!C[type]) {C[type]=[];}C[type].push(fn);}
				return obj;
			}
			obj.un = function (type, fn){
				var cbs = C[type];
				if (cbs) {if (fn) {for (var i =  cbs.length; i--;) {if (cbs[i] === fn) {cbs.splice(i,1);}}}else{cbs.length=0;}}
				return obj;
			};
			obj.trigger = function (type){
				var args = [].slice.call(arguments,1),cbs = C[type];
				if (cbs) {for (var i = 0, j = cbs.length; i < j; i++) {if (false === cbs[i].apply(obj, args)) {break;}}}
				return obj;
			};
		}
		return obj;
	}
	datePicker = QEvent({});
	styleText = 'iframe.datepicker-ie6-iframe{position:absolute;z-index:-1;top:0;left:-2px;display:none;}'+
		'.kyp-datetimepicker{top:0;left:0;width:250px;margin-top:1px;z-index:3000;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;position:absolute;display:none;float:left;min-width:160px;padding:4px;margin:2px 0 0;list-style:none;background-color:#FFF;border:1px solid #CCC;border:1px solid rgba(0, 0, 0, 0.2);-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;-webkit-box-shadow:0 5px 10px rgba(0, 0, 0, 0.2);-moz-box-shadow:0 5px 10px rgba(0, 0, 0, 0.2);box-shadow:0 5px 10px rgba(0, 0, 0, 0.2);-webkit-background-clip:padding-box;-moz-background-clip:padding;background-clip:padding-box;font-size:16px;font-family:\'Myriad Pro\', Calibri, Helvetica, Arial, sans-serif;zoom:1;}'+
		'.kyp-datetimepicker ul,.kyp-datetimepicker li{list-style-type:none;margin:0;padding:0;line-height:20px;display:list-item;text-align:-webkit-match-parent;}'+
		'.kyp-datetimepicker li.collapse{position:relative;height:auto;overflow:hidden;-webkit-transition:height 0.35s ease;-moz-transition:height 0.35s ease;-o-transition:height 0.35s ease;transition:height 0.35s ease;}'+
		'.kyp-datetimepicker .picker-switch {text-align:center;}'+
		'.kyp-datetimepicker table{width:100%;margin:0;max-width:100%;background-color:rgba(0, 0, 0, 0);border-collapse:collapse;border-spacing:0;}'+
		'.kyp-datetimepicker th{text-align:center;width:20px;height:20px;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;cursor:pointer;}'+
		'.kyp-datetimepicker th.dow{cursor:default;}'+
		'.kyp-datetimepicker td{text-align:center;}'+
		'.kyp-datetimepicker td.day:hover,.datepicker-days td.hover,.kyp-datetimepicker td.hour:hover, .timepicker-hours td.hover, .kyp-datetimepicker td.minute:hover, .timepicker-minutes td.hover, .kyp-datetimepicker td.second:hover,.timepicker-seconds td.hover {background:#EEE;cursor:pointer;}'+
		'.kyp-datetimepicker thead tr:first-child th:hover {background:#EEE;}'+
		'.kyp-datetimepicker th, .kyp-datetimepicker td {padding:4px 5px;background:#fff;}'+
		'.kyp-datetimepicker th.prev,.kyp-datetimepicker th.next {font-size:21px;}'+
		'.kyp-datetimepicker th.switch {width:145px;}'+
		'.kyp-datetimepicker td, .kyp-datetimepicker th {text-align:center;height:20px;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;}'+
		'div.datepicker-days td{width:20px;}'+
		'.kyp-datetimepicker td.old, .kyp-datetimepicker td.new {color:#999;}'+
		'.kyp-datetimepicker td.day,.kyp-datetimepicker td.hour,.kyp-datetimepicker td.minute,.kyp-datetimepicker td.second {cursor:pointer;}'+
		'.kyp-datetimepicker td.day:hover,.kyp-datetimepicker td.hour:hover,.kyp-datetimepicker td.minute:hover,.kyp-datetimepicker td.second:hover {background:#EEE;}'+
		'.kyp-datetimepicker table tr td span.old {color:#999;}'+
		'.kyp-datetimepicker td.date-overflow, .kyp-datetimepicker td.date-overflow,.kyp-datetimepicker td.date-overflow:hover {color:red;background:none;text-decoration:line-through;cursor:default;}'+
		'.kyp-datetimepicker .icon-time {background-position:-48px -24px;display:inline-block;width:14px;height:14px;margin-top:1px;line-height:14px;vertical-align:text-top;}'+
		'li.picker-switch a {display:block;padding:3px 20px;clear:both;font-weight:normal;line-height:20px;color:#333;white-space:nowrap;text-decoration:none;}'+
		'li.picker-switch a:hover, li.picker-switch a:focus {color:#FFF;text-decoration:none;background-color:#007AFF;cursor:pointer;}'+
		'.kyp-datetimepicker td span {display:block;width:55px;height:54px;line-height:54px;float:left;position:relative;margin:2px;cursor:pointer;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;}'+
		'.kyp-datetimepicker table tr td span.date-overflow {color:red;background:none;text-decoration:line-through;cursor:default;}'+
		'.kyp-datetimepicker .timepicker-picker td span{height:30px;line-height :30px;}'+
		'.kyp-datetimepicker td span:hover,.kyp-datetimepicker td span.hover{background:#EEE;}'+
		'.kyp-datetimepicker .data-shorttime td span:hover,.kyp-datetimepicker .data-shorttime td span.hover{background:#fff;}'+
		'.kyp-datetimepicker td span.date-overflow,.kyp-datetimepicker td span.date-overflow:hover{background:none;}'+
		'.kyp-datetimepicker td.active, .kyp-datetimepicker td.active:hover,.kyp-datetimepicker td span.active {color:#FFF;background-color:#007AFF;}'+
		'.kyp-datetimepicker td span.active:hover, .kyp-datetimepicker td span.active:active, .kyp-datetimepicker td span.active.active, .kyp-datetimepicker td span.active.disabled, .kyp-datetimepicker td span.active[disabled] {color:#FFF;background-color:#04C;}'+
		'.kyp-datetimepicker td span.active:hover, .kyp-datetimepicker td span.active:active, .kyp-datetimepicker td span.active.active, .kyp-datetimepicker td span.active.disabled, .kyp-datetimepicker td span.active[disabled] {color:#FFF;background-color:#04C;}'+
		'.kyp-datetimepicker td span.active:active, .kyp-datetimepicker td span.active.active {background-color:#039 \9;}'+
		'.kyp-datetimepicker .btn {display:inline-block;*display:inline;padding:4px 12px;margin-bottom:0;*margin-left:.3em;font-size:14px;line-height:20px;color:#333333;text-align:center;text-shadow:0 1px 1px rgba(255, 255, 255, 0.75);vertical-align:middle;cursor:pointer;background-color:#f5f5f5;*background-color:#e6e6e6;_background-color:#e6e6e6;background-image:-moz-linear-gradient(top, #ffffff, #e6e6e6);background-image:-webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6));background-image:-webkit-linear-gradient(top, #ffffff, #e6e6e6);background-image:-o-linear-gradient(top, #ffffff, #e6e6e6);background-image:linear-gradient(to bottom, #ffffff, #e6e6e6);background-repeat:repeat-x;border:1px solid #bbbbbb;*border:0;border-color:#e6e6e6 #e6e6e6 #bfbfbf;border-color:rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);border-bottom-color:#a2a2a2;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr="#ffffffff", EndColorStr="#ffe6e6e6");*zoom:1;-webkit-box-shadow:inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);-moz-box-shadow:inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);box-shadow:inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);}'+
		'.kyp-datetimepicker .btn:hover {color:#333;text-decoration:none;}'+
		'.kyp-datetimepicker .timepicker-picker a{font-size:11px;font-weight:bold;font-family:verdana,Tahoma, Arial;text-decoration:none;}'+
		'.kyp-datetimepicker .timepicker-picker a i.icon-chevron-down {font-size:17px;}'+
		'.kyp-datetimepicker .timepicker-picker table.data-shorttime .col-second{display:none;}'+
		'.kyp-datetimepicker span.before {display:inline-block;_display:none;border-left:7px solid rgba(0, 0, 0, 0);border-right:7px solid rgba(0, 0, 0, 0);border-bottom:7px solid #CCC;border-bottom-color:rgba(0, 0, 0, 0.2);position:absolute;top:-7px;left:6px;}'+
		'.kyp-datetimepicker span.after {display:inline-block;;_display:none;border-left:6px solid rgba(0, 0, 0, 0);border-right:6px solid rgba(0, 0, 0, 0);border-bottom:6px solid #FFF;position:absolute;top:-6px;left:7px;}'+
		'.kyp-datetimepicker .timepicker-hour, .kyp-datetimepicker .timepicker-minute, .kyp-datetimepicker .timepicker-second {width:100%;font-weight:bold;font-size:1.2em;}'+
		'.kyp-datetimepicker li.datepicker-tools {text-align:center;border-top:1px solid #ddd;padding-top:5px;}'+
		'.kyp-datetimepicker li.datepicker-tools a {display:inline-block;height:22px;min-width:24px;line-height:22px;line-height:23px\\9\\0;font-family:Simsun\\9;_overflow-y:hidden;padding:0 12px;margin:0 5px;text-align:center;text-decoration:none;vertical-align:middle;cursor:default;-moz-user-select:none;-webkit-user-select:none;border-radius:3px;border-radius:0\\9\\0;font-size:12px;cursor:pointer;border:1px solid #aaa;color:#000;color:#000!important;background:#F3F3F3;}'+
		'.kyp-datetimepicker li.datepicker-tools a:hover{border:1px solid #0060bf;color:#FFF;color:#FFF!important;background:#007AFF;}';
	uiTmpl = '<div class="kyp-datetimepicker"><span class="before"></span><span class="after"></span><ul>'+
		'	<li class="picker-ymd collapse">'+
		'		<div class="datepicker">	'+
		'			<div class="datepicker-days" style="display:;"></div>'+
		'			<div class="datepicker-months" style="display:none;"></div>	'+
		'			<div class="datepicker-years" style="display:none;"></div>'+
		'		</div>	</li>'+
		'	<li class="picker-switch accordion-toggle"><a href="javascript:void(0)">\u65F6\u95F4\u8BBE\u7F6E</a></li>'+
		'	<li class="picker-hms collapse" style="display:none;">'+
		'		<div class="timepicker" style="">'+
		'			<div class="timepicker-picker"><table class="table-condensed"><tbody><tr><td><a href="#" hidefocus class="btn" data-action="incrementHours"><i class="icon-chevron-up">+</i></a></td><td class="separator"></td><td><a href="#" hidefocus class="btn" data-action="incrementMinutes"><i class="icon-chevron-up">+</i></a></td><td class="separator" class="col-second"></td><td class="col-second"><a href="#" hidefocus class="btn" data-action="incrementSeconds"><i class="icon-chevron-up">+</i></a></td></tr><tr><td><span data-action="showHours" data-time-component="hours" class="timepicker-hour">10</span></td> <td class="separator">:</td><td><span data-action="showMinutes" data-time-component="minutes" class="timepicker-minute">44</span></td> <td class="separator col-second">:</td><td class="col-second"><span data-action="showSeconds" data-time-component="seconds" class="timepicker-second">37</span></td></tr><tr><td><a href="#" hidefocus class="btn" data-action="decrementHours"><i class="icon-chevron-down">-</i></a></td><td class="separator"></td><td><a href="#" hidefocus class="btn" data-action="decrementMinutes"><i class="icon-chevron-down">-</i></a></td><td class="separator" class="col-second"></td><td class="col-second"><a href="#" hidefocus class="btn" data-action="decrementSeconds"><i class="icon-chevron-down">-</i></a></td></tr></tbody></table></div>'+
		'			<div class="timepicker-hours" style="display:none;"></div>'+
		'			<div class="timepicker-minutes" style="display:none;"></div>'+
		'			<div class="timepicker-seconds" style="display:none;"></div>'+
		'		</div></li><li class="datepicker-tools"><a href="#" class="btn_def" title="\u9ED8\u8BA4">\u9ED8\u8BA4</a><a href="#" class="btn_close">\u5173\u95ED</a><li></ul>';
	function getDayCountByMooth(y, m){
		return m==2 ? ((y%4==0&&y%4!=100||y%100==0&&y%400==0)?29:28) :
			(/^(4|6|9|11)$/.test(m) ? 30 : 31);
	}
	function getWeekByDate(y, m, d){return (new Date(y, --m, d)).getDay();}
	function addStyle(){
        var STYLE=document.createElement('style');
        STYLE.setAttribute("type","text/css");
        STYLE.styleSheet&&(STYLE.styleSheet.cssText=styleText)||STYLE.appendChild(document.createTextNode(styleText));
        document.getElementsByTagName('head')[0].appendChild(STYLE);
	}
	function addIE6Frame(){
		if(!ie6){return;}
		ui.iframe = $(document.createElement('IFRAME')).appendTo(document.body);
		ui.iframe.addClass('datepicker-ie6-iframe');
		ui.iframe.get(0).frameBorder = 0;
	}
	function showIframe(){
		if(!ie6){return;}
		var pos = ui.dlg.offset(), margin = 10;
		ui.iframe.show().css({
			left: pos.left,
			top: pos.top,
			width: ui.dlg.width()+margin,
			height: ui.dlg.height()+margin,
			zIndex: ui.dlg.css('zIndex')-2
		});
	}
	function hideIframe(){
		if(!ie6){return;}
		ui.iframe.hide();
	}
	function createUI(){
		ui.dlg = $(uiTmpl).appendTo(document.body);
		ui.dlg.mousedown(function (e){e.stopPropagation();});
		$(document).mousedown(function (){ui.dlg.hide();hideIframe();});
		addIE6Frame();
		addMonthSelector();
		addHoursSelector();
		addMinutesSelector();
		addSecondsSelector();
	}
	var head1 = '<table class="table-condensed"><thead><tr><th class="prev">‹</th><th colspan="5" class="switch"></th><th class="next">›</th></tr></thead><tbody><tr><td colspan="7">',
		head2 = '<table class="table-condensed"><tbody><tr>',
		head3 = '<table class="table-condensed"><thead><tr><th class="prev">‹</th><th colspan="5" class="switch"></th><th class="next">›</th></tr><tr><th class="dow">\u65E5</th><th class="dow">\u4E00</th><th class="dow">\u4E8C</th><th class="dow">\u4E09</th><th class="dow">\u56DB</th><th class="dow">\u4E94</th><th class="dow">\u516D</th></tr></thead><tbody>',
		foot = '</tr></tbody></table>',
		mNames = "\u4E00|\u4E8C|\u4E09|\u56DB|\u4E94|\u516D|\u4E03|\u516B|\u4E5D|\u5341|\u5341\u4E00|\u5341\u4E8C".split('|');
	function addMonthSelector(){
		var html = head1;
		for (var i = 0, j = mNames.length; i < j; i++) {html+='<span class="month" data-mon="'+i+'">'+mNames[i]+'\u6708</span>';}
		html+='</td></tr></tbody></table>';
		ui.months = ui.dlg.find('div.datepicker-months').html(html);
	}
	function addYearSelector(year){
		var html = head1, n=0,
			cy = datePicker.current.getFullYear(),
			sj = parseInt((year||cy)/10,10)*10;
		for (var i = sj-1, j=i+12; i < j; i++,n++) {html+='<span class="year '+(i==cy?'active':(n==0||n==11?'old':''))+'">'+i+'</span>';}
		html+='</td></tr></tbody></table>';
		ui.years = ui.dlg.find('div.datepicker-years').html(html);
		$('div.datepicker-years').show().find('th.switch').html((sj-1)+' - '+j);
		datePicker.trigger('fillYear', sj-1, j);
	}
	function addHoursSelector(){
		var html = head2;
		for (var i = 0, n=1; i < 24; i++,n++) {html+='<td class="hour" text-align="center">'+(i<10?'0':'')+i+'</td>'+(n%4===0?'</tr><tr>':'');}
		ui.hours = ui.dlg.find('div.timepicker-hours').html(html + foot);
	}
	function addMinutesSelector(){
		var html = head2;
		for (var i = 0, n=1; i < 60; i+=3,n++) {html+='<td class="minute">'+(i<10?'0':'')+i+'</td>'+(n%4===0?'</tr><tr>':'');}
		ui.minutes = ui.dlg.find('div.timepicker-minutes').html(html + foot);
	}
	function addSecondsSelector(){
		var html = head2;
		for (var i = 0, n=1; i < 60; i+=3,n++) {html+='<td class="second">'+(i<10?'0':'')+i+'</td>'+(n%4===0?'</tr><tr>':'');}
		ui.seconds = ui.dlg.find('div.timepicker-seconds').html(html + foot);
	}
	function addZero(s){return ('0'+s).slice(-2);}
	function getDateVals(date){
		var split = {
			src: date,
			y: date.getFullYear(),
			M: date.getMonth()+1,
			MM: date,
			d: date.getDate()	,
			h: date.getHours(),
			m: date.getMinutes(),
			s: date.getSeconds()
		};
		split.yyyy = split.yy = split.y;
		split.mm = addZero(split.m);
		split.MM = addZero(split.M);
		split.dd = addZero(split.d);
		split.hh = addZero(split.h);
		split.ss = addZero(split.s);
		return split;
	}
	function getOldList(y,m, w, tmp){
		var date = new Date(y, m, 1);
		date.setDate(0);
		var lastDay = getDayCountByMooth(date.getFullYear(), date.getMonth());
		for (w; w--;) {tmp.push(['old',lastDay - w]);}
		return tmp;
	}
	function getNowList(lastDay, tmp){
		for (var i = 0; i < lastDay; i++) {tmp.push(['',i+1]);}
		return tmp;
	}
	function getNewList(lastRow, tmp, hasc){
		var i = 0, buf = 7-lastRow, j = buf + hasc <= 35 ? buf+7 : buf;
		for (; i < j; i++) {tmp.push(['new',i+1]);}
		return tmp;
	}
	function updateDayList(){
		var html = head3, y, m, d, now, lastDay, w, oldList, nowList, newList, allList, table;
		now = getDateVals(datePicker.current);
		y = now.y;
		m = now.M;
		d = now.d;
		lastDay = getDayCountByMooth(y, m);
		w = getWeekByDate(y, m, 1);
		nowList = getNowList(lastDay,[]);
		if (w===0) {w=7;}
		oldList = getOldList(y,m, w,[]);
		newList = getNewList((oldList.length+lastDay)%7,[], oldList.length+nowList.length);
		allList = oldList.concat(nowList.concat(newList));
		html+='<tr>';
		for (var i = 0, j = allList.length; i < j; i++) {
			html+='<td class="day '+allList[i][0]+(!allList[i][0]&&allList[i][1]==d?' active':'')+'">'+allList[i][1]+'</td>'+(i&&(i+1)%7===0?'</tr><tr>':'');
		}
		table = ui.dlg.find('div.datepicker-days').html(html + '</tr></tbody></table>');
		table.find('th.switch').html(y+'\u5E74'+m+'\u6708');
		datePicker.checkRange();
	}
	function initialize(){
		if (!initialized) {
			addStyle();
			createUI();
			datePicker.initialize();
			initialized = true;
		}
	}
	function bindInput(input){
		if($(input).data('isBindDatePicker')){return false;}
		$(input).data('isBindDatePicker', 1);
		$(input).focus(function (){
			currentInput = this;
			if (!stopFocusTrgger) {showToInput();}
		}).mousedown(function (e){
			e.stopPropagation();
		});
		return true;
	}
	function showToInput(offset){
		if (currentInput) {
			if ($.trim($(currentInput).val())=='') {$(currentInput).data('date', new Date());}
			datePicker.getInfoByInput();
			var pos = $(currentInput).offset();
			ui.dlg.css({
				left: pos.left,
				top: pos.top + $(currentInput).height() + (datePicker.topOffset)
			}).show();
			showIframe();
			if (ie6) {
				ui.dlg.css('zoom', 0.999);
				setTimeout(function() {ui.dlg.css('zoom', 1);},1);
			}
		}
	}
	datePicker.initialize = function (){
		datePicker.toToday();
		this.topOffset = ie6 ? 2 : 9;
		this.addDomEvent();
		this.formatSet = {};
		this.currentSetYear = this.current.getFullYear();
		this.on('select', function (e){
			this.setInputDate();
		});
		this.on('updateDate', function (date){
			var now = getDateVals(datePicker.current);
			$('span.timepicker-hour').html(addZero(now.hh));
			$('span.timepicker-minute').html(addZero(now.mm));
			$('span.timepicker-second').html(addZero(now.ss));
			if(!this.isFocusInput){this.setInputDate();}
		});
		this.on('fillYear', function (startYear, endYear){
			datePicker.checkYear(startYear, endYear);
		});
	};
	datePicker.setCurrentDateTime = function (date, val, isOffset){
		var start = this.startDate, end = this.endDate,
			current = setDateTime(this.current, date, val, isOffset);
		if (start && current < start) {current = start;}
		if (end && current > end) {current = end;}
		this.current = current;
		this.trigger('updateDate', this.current);
	};
	datePicker.setInputDate = function (){
		if ($(currentInput).parent().size()) {
			$(currentInput).val(this.format());
			$(currentInput).data('date', this.current);
		}
		return this;
	};
	function offsetMonth(n){
		var current = new Date(this.current);
		current.setMonth(current.getMonth()+n);
		return current;
	}
	datePicker.setRange = function (){
		if (this.startDate) {
			var current = offsetMonth(1);
			if (current < this.startDate) {$('div.datepicker-days th.prev').hide();}
		}
	}
	function isRange(v){
		if (!isLikeDate.test(v)) {v = $(v).val();}
		if (isLikeDate.test(v)) {
			return {val:v, full: isFullDate.test(v),date: onlyDate.test(v),time: onlyTime.test(v)};
		}
	}
	function fixRange(test){
		if (test.date) {test.val+=' 00:00:00';}else if(test.time){var now = getDateVals(new Date());
			test.val = now.y+'/'+now.M+'/'+now.d+' '+test.val;}
		if (test.val.split(':').length < 3) {test.val+=':00';}
		return new Date(test.val.replace(/-/g,'/'));
	}
	var isLikeDate = /\d+[\/\-]\d+[\/\-]\d+|\d+(\:\d+)?\:\d+/,
		isFullDate = /^\d+[\/\-]\d+[\/\-]\d+\s+\d+(\:\d+)?\:\d+$/,
		onlyDate = /^\d+[\/\-]\d+[\/\-]\d+$/,
		onlyTime= /^\d+(\:\d+)?\:\d+$/;
	datePicker.getRange = function (el){
        var gt = el.attr('date-gt')||el.attr('data-gt'), lt = el.attr('date-lt')||el.attr('data-lt'), test;
        this.startDate = this.endDate = false;
		if (gt) {test = isRange(gt);if (test) {this.startDate = fixRange(test);}}
		if (lt) {test = isRange(lt);if (test) {this.endDate = fixRange(test);}}
	};
	function setDateTime(src, newDate, val, isOffset){
		var tmp;
		if (newDate instanceof Date) {
			return new Date(newDate);
		}else{
			var attr = {'y':'FullYear','M':'Month','d':'Date','h':'Hours','m':'Minutes','s':'Seconds'};
			if (isOffset) {val += src['get'+attr[newDate]]();}
			if (newDate in attr) {
				tmp = new Date(src);
				tmp['set'+attr[newDate]](val);
			}
		}
		return tmp;
	}
	datePicker.checkRange = function (){
		var day_prev, day_next, mon_prev, mon_next, days, mons, tmp, start = this.startDate, end = this.endDate;
		days = $('div.datepicker-days td.day');
		mons = $('div.datepicker-months span.month');
		mon_prev = $('div.datepicker-months th.prev');
		mon_next = $('div.datepicker-months th.next');
		if (start || end) {
			if (start) {
				day_prev = $('div.datepicker-days th.prev');
				tmp = setDateTime(datePicker.current, 'M', -1, true);
				tmp.setDate(1);
				day_prev.css('visibility', tmp < start ? 'hidden': 'visible');
				tmp = setDateTime(datePicker.current, 'y', -1, true);
				tmp.setMonth(1);
				mon_prev.css('visibility', tmp < start ? 'hidden': 'visible');
			}
			if (end) {
				day_next = $('div.datepicker-days th.next');
				tmp = setDateTime(datePicker.current, 'M', 1, true);
				tmp.setDate(1);
				day_next.css('visibility', tmp > end ? 'hidden': 'visible');
				tmp = setDateTime(datePicker.current, 'y', -1, true);
				tmp.setMonth(1);
				mon_next.css('visibility', tmp < start ? 'hidden': 'visible');
			}
			days.each(function (i, td){
				tmp = setDateTime(datePicker.current, 'd', td.innerHTML);
				if (td.className.indexOf('old')>-1) {
					tmp = setDateTime(tmp, 'M', -1,true);
				}else if(td.className.indexOf('new')>-1) {
					tmp = setDateTime(tmp, 'M', 1,true);
				}
				if ((start && tmp < start) || (end && tmp > end)) {
					$(td).addClass('date-overflow');
				}else{
					$(td).removeClass('date-overflow');
				}
			});
			mons.each(function (i, td){
				tmp = setDateTime(datePicker.current, 'M', td.getAttribute('data-mon'));
				if ((start && tmp < start) || (end && tmp > end)) {
					$(td).addClass('date-overflow');
				}else{
					$(td).removeClass('date-overflow');
				}
			});
		}else{
			mons.removeClass('date-overflow');
			mon_next.css('visibility', 'visible');
			mon_prev.css('visibility', 'visible');
		}
	};
	datePicker.checkYear = function (startYear, endYear){
		var year, start = this.startDate, end = this.endDate;
		if (start || end) {
			var year_prev = $('div.datepicker-years th.prev'),
				year_next = $('div.datepicker-years th.next');
			years = $('div.datepicker-years span.year');
			if (start) {
				tmp = setDateTime(datePicker.current, 'y', startYear-1);
				tmp.setMonth(1);
				year_prev.css('visibility', tmp < start ? 'hidden': 'visible');
			}
			if (end) {
				tmp = setDateTime(tmp, 'y', parseInt(endYear,10)+1);
				tmp.setMonth(1);
				year_next.css('visibility', tmp > end ? 'hidden': 'visible');
			}
			years.each(function (i, td){
				tmp = setDateTime(datePicker.current, 'y', td.innerHTML);
				if ((start && tmp < start) || (end && tmp > end)) {$(td).addClass('date-overflow');}else{$(td).removeClass('date-overflow');}
			});
		}
	};
	datePicker.checkhms = function (hms, tds){
		var tmp, start = this.startDate, end = this.endDate;
		tds.each(function (i, td){
			tmp = setDateTime(datePicker.current, hms, td.innerHTML);
			if ((start && tmp < start) || (end && tmp > end)) {$(td).addClass('date-overflow');}else{$(td).removeClass('date-overflow');}
		});
	};
	datePicker.getInfoByInput = function (){
		var el = $(currentInput), now = new Date();
		this.formatString = (el.attr('data-datetype') || el.attr('data-format') || 'yy/MM/dd').replace(/mm[^:]/,'MM');
		this.onlyTime = /^\w+(\:\w+)+$/.test(this.formatString);
		this.onlyDate = !/\w+\:/.test(this.formatString);
		this.isShortTime = this.formatString.split(':').length == 2;
		this.getRange(el);
		this.current = (el.val() ? el.data('date') : now) || now;
		if (this.startDate||this.endDate) {
			if (this.startDate&&this.current<this.startDate) {this.current = this.startDate;}
			if (this.endDate&&this.current>this.endDate) {this.current = this.endDate;}
		}
		if (this.onlyTime) {
			ui.dlg.find('li').hide();
			$('li.picker-hms').show();
			this.toggleToTime();
		}else{
			ui.dlg.find('li').show();
			if(this.onlyDate){$('li.picker-hms,li.picker-switch').hide();}else{$('li.picker-hms').hide();}
			this.toggleToDays();
		}
		if (this.isShortTime) {
			datePicker.setCurrentDateTime('s', 0);
		}
		this.isFocusInput = true;
		this.updateTime();
		this.isFocusInput = false;
		return this;
	};
	datePicker.format = function (format){
		var format = this.formatString, data = getDateVals(this.current);
		return format.replace(/\b[yMdhsm]+\b/g,function (a){return data[a];});
	};
	datePicker.setMonth = function (mon){
		this.setCurrentDateTime('M', mon);
		updateDayList();
		datePicker.trigger('select');
	};
	datePicker.setYear = function (year){
		this.setCurrentDateTime('y', year);
		updateDayList();
		datePicker.trigger('select');
	};
	datePicker.setMonthOffset = function (offset){
		this.setCurrentDateTime('M', offset, true);
		updateDayList();
		datePicker.trigger('select');
	};
	datePicker.selectDay = function (day){
		$('div.datepicker-days td.day').removeClass('active').each(function (){
			if (this.innerHTML==day && this.className.indexOf('old')==-1 &&  this.className.indexOf('new')==-1 ) {
				$(this).addClass('active');
				datePicker.setCurrentDateTime('d', day);
				datePicker.trigger('select');
				return false;
			}
		});
	};
	datePicker.toToday = function (){
		this.setCurrentDateTime(new Date());
		updateDayList();
	};
	datePicker.highLightMonth = function (){
		var mon = datePicker.current.getMonth();
		$('div.datepicker-months span.month').removeClass('active').each(function (){
			if (this.getAttribute('data-mon')==mon) {$(this).addClass('active');}
		});
		$('div.datepicker-months').show().find('th.switch').html(datePicker.current.getFullYear()+'\u5E74');
	};
	datePicker.setYearOffset = function (offset, backNow){
		if (Math.abs(offset)>1) {
			this.currentSetYear+=offset;
			addYearSelector(this.currentSetYear);
		}else{
			var ny = backNow ? (new Date()).getFullYear() : (this.current.getFullYear()+offset);
			this.setCurrentDateTime('y', ny);
			datePicker.highLightMonth();
		}
		datePicker.trigger('select', {caller: 'setYearOffset'});
	};
	datePicker.updateTime = function (){
		this.setTime('Hours', 0, 1);
		this.setTime('Minutes', 0, 1);
		this.setTime('Seconds', 0, 1);
	};
	datePicker.setTime = function (type, val, isOffset){
		var h = this.current['get'+type](),
			newVal = (isOffset ? (val + h) : val) %(type=='Hours'?24:60);
		if (newVal<0) {newVal = (type=='Hours'?23:59);}
		var attr = {'FullYear':'y','Month':'M','Date':'d','Hours':'h','Minutes':'m','Seconds':'s'};
		if (this.isShortTime && type == 'Seconds') {return;}
		datePicker.setCurrentDateTime(attr[type], newVal);
	};
	datePicker.toggleToDays = function (){
		updateDayList();
		ui.dlg.find('div.datepicker').children().hide();
		$('div.datepicker-days').show();
		$('li.picker-switch').html(function (){return this.innerHTML.replace('\u65E5\u671F', '\u65F6\u95F4');});
		showIframe();
	};
	datePicker.toggleToMonths = function (){
		datePicker.highLightMonth();
		ui.dlg.find('div.datepicker').children().hide();
		$('div.datepicker-months').show();
		showIframe();
	};
	datePicker.toggleToTime = function (){
		$('div.timepicker>div').hide();
		$('div.timepicker-picker').show().find('table')[(this.isShortTime?'add':'remove')+'Class']('data-shorttime');
		$('li.datepicker-tools').show();
		$(document.body).attr('zoom', 1);
		showIframe();
	}
	datePicker.addDomEvent = function (){
		$('div.datepicker-days').delegate('th.prev', 'click', function (){datePicker.setMonthOffset(-1);});
		$('div.datepicker-days').delegate('th.next', 'click', function (){datePicker.setMonthOffset(1);});
		$('div.datepicker-days').delegate('th.switch', 'click', function (){
			ui.dlg.find('div.datepicker').children().hide();
			datePicker.highLightMonth();
		});
		$('div.datepicker-days').delegate('td.day', 'click', function (){
			if (this.className.indexOf('date-overflow')>-1) {return;}
			var isOld = this.className.indexOf('old')>-1,
				isNew = this.className.indexOf('new')>-1,
				date = +$.trim(this.innerHTML);
			if (isOld||isNew) {datePicker.setMonthOffset(isOld?-1:1);}
			datePicker.selectDay(date);
		});
		$('div.datepicker-months').delegate('th.prev', 'click', function (){datePicker.setYearOffset(-1);});
		$('div.datepicker-months').delegate('th.next', 'click', function (){datePicker.setYearOffset(1);});
		$('div.datepicker-months').delegate('th.switch', 'click', function (){
			ui.dlg.find('div.datepicker').children().hide();
			datePicker.currentSetYear = datePicker.current.getFullYear();
			addYearSelector();
		});
		$('div.datepicker-months').delegate('span.month', 'click', function (){
			if (this.className.indexOf('date-overflow')>-1) {return;}
			datePicker.setMonth(parseInt(this.getAttribute('data-mon'),10));
			datePicker.toggleToDays();
		});
		$('div.datepicker-years').delegate('th.prev', 'click', function (){datePicker.setYearOffset(-10);});
		$('div.datepicker-years').delegate('th.next', 'click', function (){datePicker.setYearOffset(10);});
		$('div.datepicker-years').delegate('span.year', 'click', function (){
			if (this.className.indexOf('date-overflow')>-1) {return;}
			datePicker.setYear(parseInt(this.innerHTML,10));
			datePicker.toggleToMonths();
		});
		$('div.datepicker-years').delegate('th.switch', 'click', function (){
			ui.dlg.find('div.datepicker').children().hide();
			datePicker.currentSetYear = (new Date()).getFullYear();
			addYearSelector(datePicker.currentSetYear);
		});
		$('li.picker-switch').click(function (){
			if (this.innerHTML.indexOf('\u65F6\u95F4')>-1) {
				$('li.picker-ymd').hide();
				$('li.picker-hms').show();
				this.innerHTML = this.innerHTML.replace('\u65F6\u95F4', '\u65E5\u671F');
				datePicker.toggleToTime();
			}else{
				$('li.picker-ymd').show();
				$('li.picker-hms').hide();
				this.innerHTML = this.innerHTML.replace('\u65E5\u671F', '\u65F6\u95F4');
			}
			$(document.body).attr('zoom', 1);
		});
		$('li.picker-hms a.btn').click(function (){
			var act = this.getAttribute('data-action');
			if (this.className.indexOf('date-overflow')==-1) {
				datePicker.setTime(act.replace(/decrement|increment/,''),act.indexOf('increment')>-1?1:-1, true);
			}
			return false;
		});
		$('span.timepicker-hour').click(function (){
			$('div.timepicker>div').hide();
			$('div.timepicker-hours').show();
			datePicker.checkhms('h', $('div.timepicker-hours td.hour'));
			showIframe();
		});
		$('span.timepicker-minute').click(function (){
			$('div.timepicker>div').hide();
			$('div.timepicker-minutes').show();
			datePicker.checkhms('m', $('div.timepicker-minutes td.minute'));
			showIframe();
		});
		$('span.timepicker-second').click(function (){
			if (datePicker.isShortTime) {return;}
			$('div.timepicker>div').hide();
			$('div.timepicker-seconds').show();
			datePicker.checkhms('s', $('div.timepicker-seconds td.second'));
			showIframe();
		});
		ui.dlg.find('.btn_def').click(function (){
			$(currentInput).val($(currentInput).prop('defaultValue')).data('date',null);
			return false;
		});
		ui.dlg.find('.btn_close').click(function (){
			ui.dlg.hide();
			return false;
		});
		function setTimeByPanel(type, val, td){
			if (td.className.indexOf('date-overflow')>-1) {return;}
			datePicker.toggleToTime();
			datePicker.setTime(type, val);
		}
		$('div.timepicker-hours td').click(function (){setTimeByPanel('Hours', parseInt(this.innerHTML, 10), this);});
		$('div.timepicker-minutes td').click(function (){setTimeByPanel('Minutes', parseInt(this.innerHTML, 10), this);});
		$('div.timepicker-seconds td').click(function (){setTimeByPanel('Seconds', parseInt(this.innerHTML, 10), this);});
		if (ie6) {
			ui.dlg.delegate('td', 'mouseover', function (){
				$(this).addClass('hover');
			});
			ui.dlg.delegate('td', 'mouseout', function (){
				$(this).removeClass('hover');
			});
			ui.dlg.delegate('td span', 'mouseover', function (){
				$(this).addClass('hover');
			});
			ui.dlg.delegate('td span', 'mouseout', function (){
				$(this).removeClass('hover');
			});
		}
	};
	$.fn.datePicker = function (opts){
		initialize();
		conf = $.extend({icon:'i.date'}, opts);
        if (conf.delegate) {
            this.delegate(conf.delegate, 'focus', function (e){
				if (this.disabled) {return false;}
				currentInput=this;
				showToInput();
				e.stopPropagation();
			});
            this.delegate(conf.delegate, 'mousedown', function (e){
				e.stopPropagation();
			});
			this.delegate(conf.icon, 'click', function(){
				if (this.disabled) {return false;}
				var t=this;
				setTimeout(function() {
					var o = $(t).prev('input:text')[0];
					if (o) {o.focus();}
				},10);
			});
        }else{
            jQuery.each(this,function (i,o){
                if (conf.readonly) {o.setAttribute('readonly','readonly');}
				if (o.disabled) {return;}
                if(bindInput(o)){
					$(this).next(conf.icon).click(function (){setTimeout(function() {o.blur();o.focus();},40);});
				}				
            });
        }
		function repos(){if (currentInput && jQuery.contains(this, currentInput) && ui.dlg.is(':visible')) {showToInput();}}
		if (conf.autoScroll) {
			$(conf.autoScroll).scroll(repos);
			$(window).resize(repos);
		}
        return datePicker;
	};
	if ('namespace' in this) {
		namespace("KUI.fn", {
			datePicker: function (opts){
				var conf = JS.extend({content:this}, opts);
				if (conf.content === this) {$(this).datePicker(opts);}else{$(this).find(conf.content).datePicker(opts);}
			}
		});
	}
})(jQuery);