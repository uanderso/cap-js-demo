App.models.add('Contacts', {
	data: [],

	// Ropar bara vidare till bind()
	init: function() {
		this.bind();
	},
	bind: function() {
		var self = this;
		App.addListener('App.ready', function () {
			self.load();
		});
		
		App.addListener('requestSave', function (contact) {
			self.save(contact, true);
		});
	},
	
	// Returnerar ett item med matchande ID ur vår datasamling
	getById: function(id) {
		var r,
			i;
		
		for(i in this.data) {
			if(this.data[i].id == id) {
				r = this.data[i];
				break;
			}
		}
		
		return r;
	},
	
	// Sparar en ny kontakt
	save: function(contact, sync) {
		var c;
		c = this.getById(contact.id);
		if(c) {
			c.name = contact.name;
			c.phone = this.Contact.formatPhone(contact.phone);
			c.mail = contact.mail;
			c.street = contact.street;
			c.city = contact.city;
		} else {
			c = new App.models.Contact(contact);
			this.data.push(c);
		}
		
		App.fireEvent('contactSaved', c, this.data);

		if(sync === true) {
			this.sync();
		}
	},

	// Laddar data från server eller från localStorage
	load: function(p) {
		var self = this
			lsKey = App.getLocalStorageKey('contacts'),
			storedContacts = localStorage.getItem(lsKey);
			
		log('[Contacts] Loading contacts...');
		
		if(storedContacts) {
			storedContacts = JSON.parse(storedContacts);
			log('[Contacts] Got ' + storedContacts.length + ' contacts from localStorage.');
			self.populateContacts(storedContacts);
			if(p && (typeof p.done == 'function')) {
				p.done.call(App, storedContacts);
			}
		} else {
			$.ajax({
				url: 'data/contacts.json',
				dataType: 'JSON'
			}).done(function(data) {
				log('[Contacts] Got ' + data.length + ' contacts from server.');
				localStorage.setItem(App.getLocalStorageKey('contacts'), JSON.stringify(data));
				self.populateContacts(data);
				if(p && (typeof p.done == 'function')) {
					p.done.call(App, data);
				}
			});
		}
	},
	
	// Skickar våra kontakter till servern, som får stå för eventuell
	// merge av data. Om ingen server finns (!App.online) skriver vi bara ner all data
	// till localStorage. Vi hade ju kunnat göra en merge med eventuellt
	// befintlig data i localStorage, men det bidrar inte direkt till det
	// här exemplet.
	sync: function(p) {
		if(App.online) {
			log('[Contacts] Synchronizing with server...');
			$.ajax({
				type: 'POST',
				url: 'data/sync',
				dataType: 'JSON',
				data: JSON.stringify(this.data)
			}).done(function(data) {
				log('[Contacts] Got ' + data.length + ' contacts from server.');
				self.populateContacts(data);
				if(p && (typeof p.done == 'function')) {
					p.done.call(App, data);
				}
			});
		} else {
			log('[Contacts] Synchronizing with localStorage.');
			localStorage.setItem(App.getLocalStorageKey('contacts'), JSON.stringify(this.data));
			
			if(p && (typeof p.done == 'function')) {
				p.done.call(App, this.data);
			}
		}
	},
	
	// Populerar samlingen av kontakter genom att skapa ett nytt
	// kontaktobjekt för varje förekomst i den hämtade datan.
	populateContacts: function(data) {
		var i;
		for(i in data) {
			this.data.push(this.Contact.create(data[i]));
		}
		App.fireEvent('populateContacts', this.data);
	},
	
	// Kontakt-entitets"klassen"
	Contact: {
		create: function(data) {
			// Returnerar en ny instans av en en kontakt.
			return {
				id: data.id || App.generateGuid(),
				name: data.name || this.defaults.name,
				phone: this.formatPhone(data.phone || this.defaults.phone),
				mail: data.mail || this.defaults.mail,
				street: data.street || this.defaults.street,
				city: data.city || this.defaults.city
			};
		},

		defaults: {
			name: 'Contact name',
			phone: '12 345 678 901',
			mail: 'contact@email.com',
			street: 'Some street',
			city: 'Codein City'
		},

		formatPhone: function(raw) {
			var i = 0,
				r = [],
				s = raw.replace(/[^\d]/g, '');
				
			while(i < s.length) {
				r.push(s.substr(i, 3));
				i += 3;
			}
			
			return r.join(' ');
		}
	}
});