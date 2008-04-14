var FormComboBox = new Class({

	el: false,

	input: false,

	initialize: function(el) {
		this.el = el;
		this.createInput();
	},

	createInput: function() {
		coord = this.el.getCoordinates();
		this.el.setStyle('z-index', '100');
		this.el.addEvent('change', function(event) {this.syncInput();}.bind(this))

		this.input = new Element('input', {
			'type': 'text',
			'value': 'Text eingeben',
			'class': 'combo',
			'style': 'z-index: 1000; top:'+(coord.top+1)+'px; left: '+(coord.left+1)+'px; width: '+(coord.width-27)+'px; border: 0; height: '+(coord.height-2)+'px;'
		}).injectAfter(this.el);
		this.input.addEvent();
	},

	syncInput: function() {
		this.input.value = this.el.getValue();
		this.input.focus();
	},

	addOption: function() {
		new Element('option', {}).setText(this.input.getValue()).injectInside(this.el);
	}

});

var FormPasswordCheck = new Class({

	el: false,

	sensor: false,

	initialize: function(el) {
		this.el = el;
		this.createSensor();
	},

	createSensor: function() {
		coord = this.el.getCoordinates();

		this.sensor = new Element('span', {
			'class': 'passwordsensor',
			'style': 'width: '+(2*coord.height)+'px; height: '+(coord.height)+'px;'
		}).injectAfter(this.el);
		this.el.setStyle('width', coord.width - 2*coord.height);
		this.el.addEvent('keypress', function(event) {
			this.checkPassword();
		}.bind(this));
	},

	checkPassword: function() {
		this.setSensor(this.checkPasswordSecurity(this.el.getValue()));
	},

	checkPasswordSecurity: function(password) {
	},

	setSensor: function(value) {
	}
});

var FormNumberPicker = new Class({

	options: {
		min: 20,
		max: 128,
		speed: 10
	},

	el: false,
	input: { hour: false, minute: false, second: false },
	time: { hour: 0, minute: 0, second: 0 },

	initialize: function(el) {
		this.el = el;
		this.createTimePicker();
	},

	createTimePicker: function() {
		coord = this.el.getCoordinates();
		this.el.setStyle('width', this.el.getStyle('width').toInt()-this.el.getStyle('height').toInt()/3);
		this.buttons =  {
			'up': new Element('button', {
				'type': 'button',
				'class': 'button button-up'
			}).injectAfter(this.el).addEvent('click', function(event) {
				this.inc();
			}.bind(this)),
			'down': new Element('button', {
				'type': 'button',
				'class': 'button button-down'
			}).injectAfter(this.el)
		}
		this.buttons.down.addEvent('mousedown', function(event) {
			this._startDec();
		}.bind(this))
		this.buttons.down.addEvent('keydown', function(event) {
			this._startDec();
		}.bind(this))

		this.buttons.down.addEvent('mouseup', function(event) {
			this._stopDec();
		}.bind(this))
		this.buttons.down.addEvent('keyup', function(event) {
			this._stopDec();
		}.bind(this))

		this.buttons.up.addEvent('mousedown', function(event) {
			this._startInc();
		}.bind(this))
		this.buttons.up.addEvent('keydown', function(event) {
			this._startInc();
		}.bind(this))

		this.buttons.up.addEvent('mouseup', function(event) {
			this._stopInc();
		}.bind(this))
		this.buttons.up.addEvent('keyup', function(event) {
			this._stopInc();
		}.bind(this))
	},

	_startInc: function() {
		this.loopInc = this.inc.periodical((1000 / this.options.speed).toInt(), this, null);
	},

	_stopInc: function() {
		$clear(this.loopInc);
	},

	inc: function() {
		if(this.options.max == false || this.el.getValue().toInt() < this.options.max) {
			this.el.setProperty('value', this.el.getValue().toInt() + 1);
		}
	},

	_startDec: function() {
		this.loopDec = this.dec.periodical((1000 / this.options.speed).toInt(), this, null);
	},

	_stopDec: function () {
		$clear(this.loopDec);
	},

	dec: function() {
		if(this.options.min == false || this.el.getValue().toInt() > this.options.min) {
			this.el.setProperty('value', this.el.getValue().toInt() - 1);
		}
	}

})


$$('select.combo').each(function(el) {
    new FormComboBox(el);
});

$$('input.number').each(function(el) {
	el.addClass('NumberPicker');
    new FormNumberPicker(el);
});

$$('input.passwordcheck').each(function(el) {
    new FormPasswordCheck(el);
});

$$('input.date').each(function(el) {
	el.addClass('DatePicker');
	new DatePicker(el, {
		monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
		daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
		format: 'dd.mm.yyyy',
		width: el.getCoordinates().width-2,
		offsets: {'x':0, 'y':20},
		delay: 100,
		zIndex: 1000
	});
});


$$('input.color').each(function(el) {
	el.addClass('ColorPicker');

	color = el.getValue().hexToRgb(true).rgbToHsb();
	el.setStyle('background-color', el.getValue());
	if(color[2] > 70 && color[1] < 40)
		el.setStyle('color', '#000');
	else
		el.setStyle('color', '#fff');


	new MooRainbow(el.getProperty('id'), {
		'startColor': el.getValue().hexToRgb(true),
		'onChange': function(color) {
			el.setProperty('value', color.hex);
			el.setStyle('background-color', color.hex);
			if(color.hsb[2] > 70 && color.hsb[1] < 40)
				el.setStyle('color', '#000');
			else
				el.setStyle('color', '#fff');
		}.bind(el),
		'imgPath': 'img/',
		'wheel': false
	});
});

$$('input.file').each(function(el){
//	new FancyUpload(el, {  });
});


tinyMCE.init({
	mode : 'textareas',
	theme : 'simple',
	editor_selector : 'wysiwygsimple',
	button_tile_map : true,
	content_css : 'css/basic.css',
	plugins : "inlinepopups,safari"
});

tinyMCE.init({
	mode : 'textareas',
	theme : 'advanced',
	editor_selector : 'wysiwygadvanced',
	editor_deselector : 'nowysiwyg',
	button_tile_map : true,
	content_css : 'css/basic.css',
	plugins : "spellchecker,inlinepopups,safari,style,visualchars,media,xhtmlxtras",
	theme_advanced_buttons3_add : "cite,ins,del,abbr,acronym,media,styleprops,visualchars,spellchecker"
});
