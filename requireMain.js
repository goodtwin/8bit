requirejs.config({
	shim : {
		'underscore' : []
	},
	paths  : {
		'hbs' : 'components/requireHandlebars/hbs',
		'handlebars' : 'components/requireHandlebars/Handlebars',
		'underscore' : 'public/js/lib/lodash.min',
		'i18nprecompile' : 'components/requireHandlebars/hbs/i18nprecompile',
		'json2' : 'components/requireHandlebars/hbs/json2',
		'config' : 'appconfig'
	},
	hbs : {
		disableI18n: true
	}
});