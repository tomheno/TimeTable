toolbarMoved = false;

function gcd(a, b) {
    return (b == 0) ? a : gcd(b, a % b);
}

var w = screen.width;
var h = screen.height;
var r = gcd(w, h);

$('#calendar').fullCalendar({


    eventSources: [

        {
            url: 'datas.php',
            type: 'POST',
            error: function (e) {
                console.log(e);
            },

            callback: function (c) {
                console.log(c);
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
        left: 'title',
        center: 'agendaWeek,agendaDay',
        right: 'prev,next'
    },

    footer: {
        left: '',
        center: '',
        right: ''
    },
    minTime: "'08:00:00",
    maxTime: "'18:30:00",
    aspectRatio: 2.5,


    eventClick: function (calEvent, jsEvent, view) {
        console.log(calEvent);
        var brExp = /<br\s*\/?>/i;
        var ev = calEvent.title.split(brExp);
        var title = ev[0];
        var content = ev[1].replace('<i>', '').replace('</i>', '');
        swal({
            title: title,
            text: '<i class="hour">' + calEvent.start.format("HH:mm") + ' - ' + calEvent.end.format("hh:mm") + '</i><br>' + content,
            html: true,
            confirmButtonText: 'Fermer',
            confirmButtonColor: calEvent.backgroundColor
        });
    },

    eventRender: function (event, element) {
        element.find('.fc-title').html(event.title);
    },

    loading: function (isLoading) {
        if (isLoading) {
            $('.spinner').addClass('spinner--visible');
        } else {
            $('.spinner').removeClass('spinner--visible');
        }
    },

    eventAfterAllRender: function (event, element) {
        $('.spinner').removeClass('spinner--visible');
    }
});

$(document).ready(function () {
    if (!toolbarMoved) {
        $('#calendar').append('<div class="bottomToolbar"></div>');
        $('.bottomToolbar').append($('.fc-prev-button'));
        $('.bottomToolbar').append($('.fc-center'));
        $('.bottomToolbar').append($('.fc-next-button'));
        toolbarMoved = true;

        $('.spinner').height($('#calendar').height()-50).css('top', '50px');
    }
});
