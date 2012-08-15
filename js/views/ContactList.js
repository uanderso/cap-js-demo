App.views.add('ContactList', {
	contactListItemTemplate: '<span class="contact-list-name">{NAME}</span><span class="contact-list-phone">{PHONE}</span><span class="contact-list-mail">{MAIL}</span>',
	elements: {},

	init: function() {
		// Sätt upp referenser till element
		this.elements.contactList = document.getElementById('contact-list');
		
		this.bind();
		log('[ContactList] initialized.');
	},
	
	bind: function() {
		var self = this;
		// App-interna events
		// Uppdatera visningen av kontaktlistan då modellen fått ny data
		App.addListener('populateContacts', function(contacts) {
			self.renderContacts(contacts);
		});
		
		App.addListener('contactSaved', function(contact, contacts) {
			self.renderContacts(contacts);
		});
		
		// Browser events
        // Vi binder click handler som visar en kontakt
        // på själva listelementet
        this.elements.contactList.addEventListener('click', function (e) {
            if(e.target.getAttribute('class').substr('contact-list-item') > -1) {
                App.fireEvent('showContact', e.target.getAttribute('data-guid'));
            }
        }, false);
        
	},
	
	// Renderar kontaktlistan
	renderContacts: function(contacts) {
		var i,
			c;
		
		this.elements.contactList.innerHTML = '';
		
		for(i in contacts) {
			c = contacts[i];
			this.elements.contactList.appendChild(this.createListItem(c.id, c.name, c.phone, c.mail));
		}
		
	},
	
	createListItem: function(guid, name, phone, mail) {
		var li = document.createElement('li');
			
		li.setAttribute('class', 'contact-list-item');
		li.setAttribute('data-guid', guid);
		li.innerHTML = this.contactListItemTemplate.replace('{NAME}', name).replace('{PHONE}', phone).replace('{MAIL}', mail);
		
		return li;
	}
});