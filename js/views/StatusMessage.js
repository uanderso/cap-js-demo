App.views.add('StatusMessage', {
	elements: {},
	timerHandle: null,

	init: function() {
		// Setup element references
		this.elements.root = document.getElementById('status-message');
	
		this.bind();
	},
	
	bind: function() {
		var self = this;
		// App internal events
		// Show status message on various events
		App.addListener('contactSaved', function(contact) {
			self.showMessage('Contact "' + contact.name + '" saved!');
		});
		
		// Browser events
		// onChange
		// Save btn
		// Reset btn
	},
	
	showMessage: function(message) {
		var self = this;
		this.elements.root.innerHTML = message;
		this.elements.root.setAttribute('class', 'visible');
		this.timerHandle = setTimeout(function () {
			self.clearMessage();
		}, 2000);
	},
	
	clearMessage: function() {
		this.elements.root.removeAttribute('class');
		this.elements.root.innerHTML = '';
	}
});