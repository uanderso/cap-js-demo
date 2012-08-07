App.views.add('ContactEditor', {
	elements: {},

	init: function() {
		// Sätt upp referenser till element
		this.elements.editor = document.getElementById('contact-viewer-editor');
		this.elements.placeholder = document.getElementById('contact-viewer-placeholder');
		
		this.elements.guid = document.getElementById('contact-editor-guid');
		this.elements.name = document.getElementById('contact-editor-name');
		this.elements.phone = document.getElementById('contact-editor-phone');
		this.elements.mail = document.getElementById('contact-editor-mail');
		this.elements.street = document.getElementById('contact-editor-street');
		this.elements.city = document.getElementById('contact-editor-city');
		
		this.elements.saveButton = document.getElementById('contact-editor-save');
		this.elements.resetButton = document.getElementById('contact-editor-reset');

		this.bind();
		log('[ContactEditor] initialized.');
	},
	
	bind: function() {
		var self = this;
		// App-interna events
		// Visa en kontakt vid klick i kontaktlistan
		App.addListener('showContact', function(guid) {
			log('[ContactList] Show contact ' + guid);
			self.showContact(guid);
		});
		
		// Browser events
		this.elements.saveButton.addEventListener('click', function (ev) {
			// Vi måste förhindra normalt webläsarbeteende här.
			// Annars försöker webläsaren posta formuläret synkront.
			ev.preventDefault();
			App.fireEvent('requestSave', self.getContactData());
		}, false);
	},

	// Populerar input-elementen med data från en kontaktinstans
	// och visar kontakteditorn.
	showContact: function(guid) {
		var c;
		if(App.models.exists('Contacts')) {
			c = App.models.get('Contacts').getById(guid);
			if(c) {
				this.elements.guid.value = c.id;
				this.elements.name.value = c.name;
				this.elements.phone.value = c.phone.replace(/[^\d]/g, '');
				this.elements.mail.value = c.mail;
				this.elements.city.value = c.city;
				this.elements.street.value = c.street;
				
				this.elements.placeholder.style.display = 'none';
				this.elements.editor.style.display = 'block';
			} else {
				this.elements.placeholder.style.display = 'block';
				this.elements.editor.style.display = 'none';
				
				this.elements.guid.value = '';
				this.elements.name.value = '';
				this.elements.phone.value = '';
				this.elements.mail.value = '';
				this.elements.city.value = '';
				this.elements.street.value = '';
				
				console.error('No matching contact found (ID: ' + guid + ')');
			}
		}
	},
	
	// Hämtar data från formuläret
	getContactData: function() {
		return {
			id: this.elements.guid.value,
			name: this.elements.name.value,
			phone: this.elements.phone.value,
			mail: this.elements.mail.value,
			street: this.elements.street.value,
			city: this.elements.city.value
		};
	}
});