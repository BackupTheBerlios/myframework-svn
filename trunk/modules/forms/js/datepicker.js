/**
 * DatePicker
 * @author Rick Hopkins
 * @version 1.0
 * @classDescription A date picker object. Created with the help of MooTools v1.11
 * MIT-style License.
 */

var DatePicker = new Class({
	/** set options */
	options: {
		onShow: function(dp){
			dp.setStyle('visibility', 'visible');
		}, 
		onHide: function(dp){
			dp.setStyle('visibility', 'hidden');
		}, 
		className: 'DatePicker', 
		monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], 
		daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], 
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 
		format: 'mm/dd/yyyy', 
		yearStart: new Date().getFullYear(), 
		yearRange: 10, 
		yearOrder: 'asc', 
		width: 155, 
		offsets: {'x':0, 'y':20}, 
		delay: 100, 
		zIndex: 1000
	}, 
	
	/** setup the new DatePicker */
	initialize: function(el, options){
		if (!el) return false;
		
		if (options) this.setOptions(options);
		else if (el.alt) this.setOptions(Json.evaluate(el.alt));
		
		this.active = false;
		
		if (el.value.length > 9){
			switch (this.options.format){
				case 'mm/dd/yyyy': d = el.value.split('/'); this.year = d[2].toInt(); (this.month = d[0].toInt() - 1); this.day = d[1].toInt(); break;
				case 'yyyy-mm-dd': d = el.value.split('-'); this.year = d[0].toInt(); (this.month = d[1].toInt() - 1); this.day = d[2].toInt(); break;
				case 'yyyy.mm.dd': d = el.value.split('.'); this.year = d[0].toInt(); (this.month = d[1].toInt() - 1); this.day = d[2].toInt(); break;
				case 'mm.dd.yyyy': d = el.value.split('.'); this.year = d[2].toInt(); (this.month = d[0].toInt() - 1); this.day = d[1].toInt(); break;
				case 'dd.mm.yyyy': d = el.value.split('.'); this.year = d[2].toInt(); (this.month = d[1].toInt() - 1); this.day = d[0].toInt(); break;
				default: d = new Date(); this.year = d.getFullYear(); this.month = d.getMonth(); this.day = d.getDate(); break;
			}
		} else {
			d = new Date(); this.year = d.getFullYear(); this.month = d.getMonth(); this.day = d.getDate();
		}
		
		this.dp =  new Element('div', {
			'class': this.options.className + '-Container', 
			'styles': {
				'position':'absolute', 
				'top':'0px', 
				'left':'0px', 
				'z-index':this.options.zIndex, 
				'visibility':'hidden'
			}
		}).injectInside(document.body);
		this.wrapper = new Element('div', {
			'class':this.options.className + '-Wrapper', 
			'styles': {
				'position':'absolute', 
				'width':this.options.width + 'px'
			}
		}).injectInside(this.dp);
		this.setup(el);
	},
	
	/** setup the calendar */
	setup: function(el){
		el.addEvent('click', function(){
			this.position(el);
			this.build(el);
		}.bind(this));
		var destroy = this.destroy.bind(this);
		this.dp.addEvent('mouseleave', destroy);
	}, 
	
	/** build the calendar */
	build: function(el){
		this.wrapper.empty();
		date = new Date();
		date.setFullYear(this.year, this.month, 1);
		this.year % 4 == 0 ? this.options.daysInMonth[1] = 29 : this.options.daysInMonth[1] = 28;
		var firstDay = 1 - date.getDay();
		
		/** create the month select box */
		monthSel = new Element('select', {'class':this.options.className + '-monthSelect'});
		for (var m = 0; m < this.options.monthNames.length; m++){
			monthSel.options[m] = new Option(this.options.monthNames[m], m);
			if (this.month == m) monthSel.options[m].selected = true;
		}
		
		/** create the year select box */
		yearSel = new Element('select', {'class':this.options.className + '-yearSelect'});
		i = 0;
		if (this.options.yearOrder == 'desc'){
			for (var y = this.options.yearStart; y > (this.options.yearStart - this.options.yearRange - 1); y--){
				yearSel.options[i] = new Option(y, y);
				if (this.year == y) yearSel.options[i].selected = true;
				i++;
			}
		} else {
			for (var y = this.options.yearStart; y < (this.options.yearStart + this.options.yearRange + 1); y++){
				yearSel.options[i] = new Option(y, y);
				if (this.year == y) yearSel.options[i].selected = true;
				i++;
			}
		}
		
		/** start creating calendar */
		calTable = new Element('table', {'styles':{'width':'100%'}}).injectInside(this.wrapper);
		calTableTbody = new Element('tbody').injectInside(calTable);
		new Element('tr').adopt(new Element('td', {'class':'nav', 'styles':{'text-align':'center'}, 'colspan':'7'}).adopt(monthSel).adopt(yearSel)).injectInside(calTableTbody);
		
		/** create day names */
		calDayNameRow = new Element('tr').injectInside(calTableTbody);
		for (var i = 0; i < this.options.dayNames.length; i++){
			calDayNameCell = new Element('td', {'class':'dayName', 'styles':{'text-align':'center', 'width':'14%'}}).setText(this.options.dayNames[i].substr(0, 1)).injectInside(calDayNameRow);
		}
		
		/** create the day cells */
		date2 = new Date();
		while (firstDay <= this.options.daysInMonth[this.month]){
			calDayRow = new Element('tr').injectInside(calTableTbody);
			for (i = 0; i < 7; i++){
				if ((firstDay <= this.options.daysInMonth[this.month]) && (firstDay > 0)){
					calDayCell = new Element('td', {'class':'day', 'styles':{'cursor':'pointer', 'text-align':'center'}, 'axis':this.year + '-' + (this.month + 1) + '-' + firstDay}).setText(firstDay).injectInside(calDayRow);
					if (date2.getFullYear() == this.year && date2.getMonth() == this.month && date2.getDate() == firstDay) calDayCell.addClass('current');
				} else {
					calDayCell = new Element('td', {'class':'empty'}).setText(' ').injectInside(calDayRow);
				}
				firstDay++;
			}
		}
		
		/** set the onclick events for all calendar days */
		$$('div.DatePicker-Wrapper td.day').each(function(d){
			d.onclick = function(){
				ds = d.axis.split('-');
				el.value = this.formatValue(ds[0], ds[1], ds[2]);
				this.hide();
			}.bind(this);
		}.bind(this));
		
		/** set the onchange event for the month & year select boxes */
		monthSel.onfocus = function(){ this.active = true; }.bind(this);
		monthSel.onblur = function(){ this.active = false; }.bind(this);
		monthSel.onchange = function(){
			this.month = monthSel.value.toInt();
			this.year = yearSel.value.toInt();
			this.active = false;
			this.build(el);
		}.bind(this);
		
		yearSel.onfocus = function(){ this.active = true; }.bind(this);
		yearSel.onblur = function(){ this.active = false; }.bind(this);
		yearSel.onchange = function(){
			this.month = monthSel.value.toInt();
			this.year = yearSel.value.toInt();
			this.active = false;
			this.build(el);
		}.bind(this);
		this.timer = this.show.delay(this.options.delay, this);
	}, 
	
	/** destroy the calendar */
	destroy: function(event){
		$clear(this.timer);
		this.timer = this.hide.delay(this.options.delay, this);
	}, 
	
	/** position the calendar */
	position: function(el){
		this.coords = el.getCoordinates();
		this.dp.setStyles({'top':this.coords.top + 'px', 'left':(this.coords.left + this.options.offsets.x) + 'px', 'width':this.coords.width + 'px', 'padding-top': this.coords.height + 'px'});
	}, 
	
	/** show the calendar */
	show: function(){
		this.fireEvent('onShow', [this.dp]);
	}, 
	
	/** hide the calendar */
	hide: function(){
		if (!this.active) this.fireEvent('onHide', [this.dp]);
	}, 
	
	/** format the returning date value */
	formatValue: function(year, month, day){
		/** setup the date string variable */
		var dateStr = '';
		
		/** check the length of day */
		if (day < 10) day = '0' + day;
		if (month < 10) month = '0' + month;
		
		/** check the format & replace parts // thanks O'Rey */
		dateStr = this.options.format.replace( /dd/i, day ).replace( /mm/i, month ).replace( /yyyy/i, year );
		this.month = month.toInt() - 1;
		this.year = year.toInt();
		
		/** return the date string value */
		return dateStr;
	}
});

DatePicker.implement(new Events, new Options);

/** create the DatePicker objects 
window.addEvent('domready', function(){
	$each($$('input.DatePicker'), function(el){
		new DatePicker(el);
	});
});*/