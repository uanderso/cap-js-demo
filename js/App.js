// Global genv�g till log-funktionen, med feature detection
log = function(m) {
	if(console && console.log) {
		console.log(m);
	}
};

// Bootstrapping
// D� DOM �r laddat har vi alla beroenden p� plats
// och �r redo att starta v�r app.
document.addEventListener('DOMContentLoaded', function() {
	log('DOMContentLoaded');
	document.removeEventListener('DOMContentLoaded', arguments.callee, false);
	App.appReady();
}, false );


// Vi definierar en global variabel App, som �ven fungerar
// som namespace f�r allt vi g�r samt "mediator" mellan v�ra
// moduler. H�r anv�nds modul-m�nstret, med motsvarigheten till
// privata och publika attribut och metoder.
var App = (function () {
	var appName = 'cap-js-demo';

	// models och views �r helt identiska och har som
	// uppgift att h�lla referenser till alla moduler.
	var models = {
		instances: {},
		// Registrerar en ny modul och ropar p� dess init-
		// metod om det finns n�gon
		add: function(name, instance) {
			this.instances[name] = instance;
			if(typeof instance.init == 'function') {
				instance.init();
			}
		},
		exists: function(name) {
			return (name in this.instances);
		},
		get: function(name) {
			return this.instances[name];
		}
	};
	var views = {
		instances: {},
		add: function(name, instance) {
			this.instances[name] = instance;
			if(typeof instance.init == 'function') {
				instance.init();
			}
		},
		exists: function(name) {
			return (name in this.instances);
		},
		get: function(name) {
			return this.instances[name];
		}
	};
	
	
	
	// Enkelt system f�r att publicera events inom appen
	var listeners = {};
	
	// Moduler l�gger till sig sj�lva f�r att ta emot meddelanden
	// som andra moduler publicerar.
	var addListener = function(eventName, handler, context) {
		if(!listeners[eventName]) {
			listeners[eventName] = [];
		}
		listeners[eventName].push({
			handler: handler,
			context: context || App
		});
	};
	
	// Moduler kan publicera meddelanden via denna metod.
	var fireEvent = function() {
		var	eventName = arguments[0],
			boundHandlers = listeners[eventName],
			i;
			
		log('[App.fireEvent] ' + eventName);
		
		if(boundHandlers && boundHandlers.length > 0) {
			for(i in boundHandlers) {
				boundHandlers[i].handler.apply(boundHandlers[i].context, Array.prototype.slice.call(arguments, 1));
			}
		}
	};
	
	var appReady = function() {
		// Publicera ett event f�r att meddela alla moduler
		// att appen �r redo att anv�ndas.
		fireEvent('App.ready');
	};
	
	
	// Genererar en nyckel att spara saker i localStorage med
	var getLocalStorageKey = function(subKey) {
		return appName + '-' + subKey;
	};
	
	
	// Genererar ett ganska unikt ID
	var GuidGen = (function() {
		function S4() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}
		return function generateGuid() {
			return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
		}
	}());
	
	// Returnera publikt interface
	return {
		models: models,
		views: views,
	
		appReady: appReady,
		fireEvent: fireEvent,
		addListener: addListener,
		getLocalStorageKey: getLocalStorageKey,
		generateGuid: GuidGen
	};
}());