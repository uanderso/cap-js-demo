// Global genväg till log-funktionen, med feature detection
log = function(m) {
	if(console && console.log) {
		console.log(m);
	}
};

// Bootstrapping
// Då DOM är laddat har vi alla beroenden på plats
// och är redo att starta vår app.
document.addEventListener('DOMContentLoaded', function() {
	log('DOMContentLoaded');
	document.removeEventListener('DOMContentLoaded', arguments.callee, false);
	App.appReady();
}, false );


// Vi definierar en global variabel App, som även fungerar
// som namespace för allt vi gör samt "mediator" mellan våra
// moduler. Här används modul-mönstret, med motsvarigheten till
// privata och publika attribut och metoder.
var App = (function () {
	var appName = 'cap-js-demo';

	// models och views är helt identiska och har som
	// uppgift att hålla referenser till alla moduler.
	var models = {
		instances: {},
		// Registrerar en ny modul och ropar på dess init-
		// metod om det finns någon
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
	
	
	
	// Enkelt system för att publicera events inom appen
	var listeners = {};
	
	// Moduler lägger till sig själva för att ta emot meddelanden
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
		// Publicera ett event för att meddela alla moduler
		// att appen är redo att användas.
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