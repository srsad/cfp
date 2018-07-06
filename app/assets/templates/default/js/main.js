$(function() {

	// Custom JS
	$(document).on('af_complete', function(event, response) {
		var form = response.form;
		if (response.success) {
			$('.closeModal').trigger('click');
			//var param = {loadpage: 'Отправка формы'};
			//yaCounter49355807.reachGoal('FORM_GOAL', param);
			// site order 
			//gtag('event', 'form_order', { 'event_category': 'form_order', 'event_action': 'sendForm' });

		}
	});

});
