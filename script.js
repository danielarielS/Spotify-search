var input = $(".input");
var search = $(".search");
var button = $(".button");
var show = $(".show");
var num = 20;
var more = $(".next");
more.hide();
var song = $(".song");
var dataResults = [];
button.click(function() {
    var typeSel = $(".search").val();
    var inputVal = $(".input").val();
    $.get(
        "https://elegant-croissant.glitch.me/spotify",
        {
            q: inputVal,
            type: typeSel
        },
        function dataFn(data) {
            console.log(data);
            data = data.artists || data.albums;
            for (var i = 0; i < data.items.length; i++) {
                if (data.items[i].images.length) {
                    dataResults.push({
                        photo: data.items[i].images[0].url,
                        url: data.items[i].external_urls.spotify,
                        name: data.items[i].name
                    });
                }
            }
            console.log(dataResults);
            show.html(Handlebars.templates.songs({ dataResults: dataResults }));
            if (data.next) {
                if (location.search.indexOf("scroll=infinite") > -1) {
                    // more.hide();
                    scroll();
                } else {
                    more.show();
                }
            }
        }
    );
});
Handlebars.templates = Handlebars.templates || {};

var templates = document.querySelectorAll(
    'script[type="text/x-handlebars-template"]'
);

Array.prototype.slice.call(templates).forEach(function(script) {
    Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
});

function showMore() {
    $.ajax({
        url: "https://elegant-croissant.glitch.me/spotify",
        method: "GET",
        data: {
            q: input.val(),
            type: search.val(),
            offset: num
        },
        success: function showMore(data) {
            console.log(data);
            data = data.artists || data.albums;
            for (var i = 0; i < data.items.length; i++) {
                if (data.items[i].images.length) {
                    dataResults.push({
                        photo: data.items[i].images[0].url,
                        url: data.items[i].external_urls.spotify,
                        name: data.items[i].name
                    });
                }
            }
            console.log(dataResults);
            show.html(Handlebars.templates.songs({ dataResults: dataResults }));
            num += 20;
            if (data.next) {
                if (location.search.indexOf("scroll=infinite") > -1) {
                    scroll();
                } else {
                    more.show();
                }
            }
            if (location.search.indexOf("scroll=infinite") > -1) {
                scroll();
            }
        }
    });
}

more.click(showMore);

var win = $(window);
var doc = $(document);

function scroll() {
    if (doc.height() <= win.height() + doc.scrollTop() + 200) {
        console.log("should scroll");
        showMore();
    } else {
        setTimeout(scroll, 1000);
    }
}
