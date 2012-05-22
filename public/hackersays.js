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

  var opacityResetTimer, mouseMoveTimer, lastPageX, lastPageY,
      opacityElsSelector = "#share a, #toolbar a",
      originalControlsOpacity = $(opacityElsSelector).css("opacity");

  $(document).mousemove(function(ev) {
    clearTimeout(mouseMoveTimer);
    mouseMoveTimer = setTimeout(function() {
      if (ev.pageX == lastPageX && ev.pageY == lastPageY)
        return;

      lastPageX = ev.pageX; lastPageY = ev.pageY;
      $(opacityElsSelector).stop(true).animate({opacity: 1}, 400);
      clearTimeout(opacityResetTimer);
      opacityResetTimer = setTimeout(function() {
        $(opacityElsSelector).stop(true).animate({opacity: originalControlsOpacity}, 800);
      }, 2000)
    }, 100);
  });
});

$(function() {
  var readingTimer, fetchingTimer, reloadTimer,
      quotesEl = $("#quotes");
      
  var sliderOptions = {
    infiniteLoop: false,
    hideControlOnEnd: true,
    onAfterSlide: slideChange,
    prevText: '',
    nextText: '',
    prevSelector: '#toolbar',
    nextSelector: '#toolbar'
  };

  var slider = quotesEl.bxSlider(sliderOptions);

  $("#toolbar .play").click(function(ev) {
    ev.preventDefault();

    if ($(this).toggleClass("paused").hasClass("paused"))
      clearTimeout(readingTimer);
    else
      slider.goToNextSlide();
  });

  $(window).resize(function() {
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(function() { 
      sliderOptions.startingSlide = slider.getCurrentSlide();
      slider.destroyShow();
      slider = quotesEl.bxSlider(sliderOptions);
    }, 100);
  });

  if (quotesEl.hasClass("via-link")) $("#toolbar .play").click();

  function slideChange(index, total, slide) {
    slide = $(slide);
    total--;

    History.replaceState(null, "Hacker Says - quote by " + slide.find("cite").text(), slide.data("id"));
    _gaq.push(['_trackPageview']);
    $("#toolbar")
      .toggleClass("first-quote", index == 0)
      .toggleClass("last-quote", index == total);

    if ($("#toolbar .play").hasClass("paused")) return;

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
         $("#toolbar").find(".bx-prev, .bx-next").remove();

         $.each(quotes, function(i, quote) {
           var template = $("#template").clone()
                          .find("span").html(quote.c).end()
                          .find("cite").text(quote.a).end()
                          .find("li").data("id", quote.id);
           quotesEl.append(template);
         });

         var quotesEls = quotesEl.find("li");
         if (quotesEls.length >= 42) {
           quotesEls.slice(0, 20).remove();
           sliderOptions.startingSlide -= 20;
         }

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

