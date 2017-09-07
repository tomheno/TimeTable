toolbarMoved = false;
$('#calendar').fullCalendar({

	
    eventSources: [

        {
            url: 'datas.php',
            type: 'POST',
            error: function(e) {
                console.log(e);
            },
            textColor: 'black'
        }


    ],

    weekends: false,
    firstDay: 1,
    defaultView: 'agendaDay',
    lang: 'fr',

    theme: true,
		header: {
    left:   'title',
    center: 'agendaWeek,agendaDay',
    right:  'prev,next'
},

footer: {
	left: '',
    center: '',
    right:  ''
},
    minTime: "'08:00:00",
    maxTime: "'18:30:00",
    aspectRatio: 1.7,

	
    eventClick: function(calEvent, jsEvent, view) {
		console.log(calEvent);
		 var brExp = /<br\s*\/?>/i;
		 var ev = calEvent.title.split(brExp);
		var title =ev[0];
		var content =ev[1].replace('<i>','').replace('</i>','');
	swal({
	  title: title,
	  text: '<i class="hour">'+calEvent.start.format("HH:mm")+' - ' + calEvent.end.format("hh:mm") + '</i><br>' + content,
	  html: true,
	  confirmButtonText: 'Fermer',
	  confirmButtonColor: calEvent.backgroundColor
	});
    },
	
    eventRender: function (event, element) {
        element.find('.fc-title').html(event.title);
    },
	
	eventAfterAllRender: function (view){
		if(!toolbarMoved){
		$('#calendar').append('<div class="bottomToolbar"></div>');
		console.log('rendered');
		$('.bottomToolbar').append($('.fc-prev-button'));
		$('.bottomToolbar').append($('.fc-center'));
				$('.bottomToolbar').append($('.fc-next-button'));
		toolbarMoved = true;
		}
	}

});
