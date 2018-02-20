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

        $('.spinner').height($('#calendar').height() - 42).css('top', '48px');
    }
});


function swipedetect(el, callback) {

    var touchsurface = el,
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 150, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300, // maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handleswipe = callback || function (swipedir) {
        }

    touchsurface.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)

    touchsurface.addEventListener('touchmove', function (e) {
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)

    touchsurface.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}

var el = $('.fc-view');
swipedetect(el, function (swipedir) {
    if (swipedir === 'right') {
        $('#calendar').fullCalendar('prev');
        console.log('prev');
    }
    else if (swipedir === 'left') {
        $('#calendar').fullCalendar('next');
        console.log('next');
    }
});


