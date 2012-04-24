$(function() {
  var animationTimeout = 1000;

  function loadQuote(id) {
    $.getJSON("quote", {id: id})
     .done(function(quote) {
      if (hasQuoteOnScreenAlready(quote))
        loadQuote();
      else if (id)
        renderQuote(quote)
      else
        setTimeout(function() {renderQuote(quote)}, 15000);
    })
     .fail(function() {
       setTimeout(loadQuote, 5000);
     });
  }

  function renderQuote(quote) {
    $("blockquote").fadeOut(animationTimeout, function() {
      $(this).find(".content").html(quote.c).end()
             .find(".author").html(quote.a).end()
             .fadeIn(animationTimeout);
      window.location.hash = quote.id;
      loadQuote();
    });
  }

  function hasQuoteOnScreenAlready(quote) {
    return $(".content").text() == quote.c.replace(/<br>/g, "") && $(".author").text() == quote.a;
  }

  loadQuote(window.location.hash);
});
