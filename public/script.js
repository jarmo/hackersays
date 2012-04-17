$(function() {
  var animationTimeout = 1000;

  $("blockquote").fadeIn(animationTimeout);

  function loadNewQuote() {
    $.getJSON("quote")
     .done(function(data) {
      if (hasQuoteOnScreen(data))
        loadNewQuote();
      else
        setTimeout(function() {renderQuote(data)}, 15000);
    })
     .fail(function() {
       setTimeout(loadNewQuote, 5000);
     });
  }

  function renderQuote(quote) {
    $("blockquote").fadeOut(animationTimeout, function() {
      $(this).find(".content").html(quote.c).end()
             .find(".author").html(quote.a).end()
             .fadeIn(animationTimeout);

      loadNewQuote();
    });
  }

  function hasQuoteOnScreen(quote) {
    return $(".content").text() == quote.c.replace(/<br>/g, "") && $(".author").text() == quote.a;
  }

  loadNewQuote();
});
