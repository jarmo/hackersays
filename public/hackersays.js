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

  var readingTimer, fetchingTimer,
      quotesEl = $("#quotes"),
      sliderOptions = {
        infiniteLoop: false,
        hideControlOnEnd: true,
        onAfterSlide: slideChange
      };

  var slider = quotesEl.bxSlider(sliderOptions);

  $(".pause, .resume").click(function(ev) {
    ev.preventDefault();
    var el = $(ev.target);

    $(".container").toggleClass("paused", el.hasClass("pause"));
    if (el.hasClass("pause"))
      clearTimeout(readingTimer);
    else
      slider.goToNextSlide();
  });

  if (quotesEl.hasClass("via-link"))
    $(".pause").click();

  function slideChange(index, total, slide) {
    slide = $(slide);
    History.replaceState(null, "Hacker Says - quote by " + slide.find("cite").text(), slide.data("id"));
    _gaq.push(['_trackPageview']);

    if (total - index == 5) loadNewQuotes();
    clearTimeout(readingTimer);
    readingTimer = setTimeout(function() {
      slider.goToNextSlide();
    }, timeForReading(slide));
  }

  function loadNewQuotes() {
    $.getJSON("quotes", {t: new Date().getTime()})
     .done(function(quotes) {
       clearTimeout(readingTimer);
       setTimeout(function() {
         sliderOptions.startingSlide = slider.getCurrentSlide();
         // we need to destroy the show before appending new quotes, sigh :(
         slider.destroyShow()

         $.each(quotes, function(i, quote) {
           var template = $("#template").clone()
                          .find("span").html(quote.c).end()
                          .find("cite").text(quote.a).end()
                          .find("li").data("id", quote.id);
           quotesEl.append(template);
         });

         var quotesEls = quotesEl.find("li");
         if (quotesEls.length >= 42)
           quotesEls.slice(0, 20).remove();

         slider = quotesEl.bxSlider(sliderOptions);
       }, 0);
    })
    .fail(function() {
      clearTimeout(fetchingTimer);
      fetchingTimer = setTimeout(loadNewQuotes, 5000);
    });
  }

  function timeForReading(slide) {
    var averageWPM = 200;
    var additionalFactor = 2;
    var time = (slide.find("span").text() + " " + slide.find("cite").text()).split(" ").length * 60 / averageWPM * additionalFactor;
    if (time < 5) time = 5;
    return time * 1000;
  }

});
