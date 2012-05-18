$(function() { 
  $("#themes li a").click(function(ev) {
    ev.preventDefault();
    var theme = $(this).closest("li").attr("data-theme");
    $.cookie("theme", theme, {expires: 3650, path: "/"});
    showTheme(theme);
  });

  function showTheme(name) {
    $(document.body).attr("data-theme", name);
  }

  if ($.cookie("theme")) showTheme($.cookie("theme"));
});

$(function() {

  var readingTimer,
      template = tmpl("template");

  var slider = $("#quotes").bxSlider({
    infiniteLoop: false,
    hideControlOnEnd: true,
    onAfterSlide: function(index, total, slide) {
      slide = $(slide);
      History.replaceState(null, "Hacker Says - quote by " + slide.find("cite").text(), slide.data("id"));
      _gaq.push(['_trackPageview']);

      renderTwitterButton();
      renderFacebookButton();
      renderGooglePlusButton();

      //if (total - index == 5) loadNewQuotes();

      clearTimeout(readingTimer);
      readingTimer = setTimeout(function() {
        slider.goToNextSlide();
      }, timeForReading(slide));
    }
  });

  function loadNewQuotes() {
    $.getJSON("quotes", {t: new Date().getTime()})
     .done(function(quotes) {
        renderingTimer = setTimeout(function() {
          History.pushState(quote, null, quote.id);
        }, timeForReading());
    })
    .fail(function() {
      clearTimeout(fetchingTimer);
      fetchingTimer = setTimeout(loadNewQuote, 5000);
    });
  }


  function timeForReading(slide) {
    var averageWPM = 200;
    var additionalFactor = 2;
    var time = (slide.find("span").text() + " " + slide.find("cite").text()).split(" ").length * 60 / averageWPM * additionalFactor;
    if (time < 5) time = 5;
    return time * 1000;
  }

  function renderTwitterButton() {
    var btn = '<a href="https://twitter.com/share" class="twitter-share-button" data-text="I like this quote at programming-quotes.com" data-hashtags="programming" data-url="' + window.location.href + '">Tweet</a>';
    $("#tweet-button").html(btn);

    if (typeof twttr == 'undefined')
      $.getScript("//platform.twitter.com/widgets.js", load)
    else
      load()

    function load() { twttr.widgets.load() }
  }

  function renderFacebookButton() {
    var btn = '<div class="fb-like" data-send="false" data-layout="button_count" data-width="70" data-show-faces="false" data-font="arial"></div>';
    $("#fb-button").html(btn);
    if (typeof FB == 'undefined')
      $.getScript("//connect.facebook.net/en_US/all.js#xfbml=1", parse)
    else
      parse()

    function parse() { FB.XFBML.parse() }
  }

  function renderGooglePlusButton() {
    var btn = '<div class="g-plusone" data-size="small" data-href="' + window.location.href + '"></div>';
    $("#gplus-button").html(btn);
    gapi.plusone.go();
  }


});

