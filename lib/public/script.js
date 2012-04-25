$(function() {
  var animationTimeout = 1000;

  function loadQuote(id) {
    $.getJSON("quote", {id: id})
     .done(function(quote) {
      if (hasQuoteOnScreenAlready(quote))
        loadQuote();
      else if (id || $("blockquote").is(":not(:visible)"))
        renderQuote(quote)
      else
        setTimeout(function() {renderQuote(quote)}, 15000);
    })
     .fail(function() {
       setTimeout(loadQuote, 5000);
     });
  }

  function renderQuote(quote) {
    $("blockquote").data("quote-id", quote.id).fadeOut(animationTimeout, function() {
      $(this).find(".content").html(quote.c).end()
             .find(".author").html(quote.a).end()
             .fadeIn(animationTimeout);
      window.location.hash = quote.id;
      renderTwitterButton();
      loadQuote();
    });
  }

  function hasQuoteOnScreenAlready(quote) {
    return $("blockquote").data("quote-id") == quote.id;
  }

  function renderTwitterButton() {
    var btn = '<a href="https://twitter.com/share" class="twitter-share-button" data-text="I like this quote at programming-quotes.com" data-hashtags="programming" data-url="' + window.location.href + '">Tweet</a>';
    $("#tweet-button").empty().html(btn);

    if (!window.twttr)
      $.getScript("//platform.twitter.com/widgets.js", function() {
        twttr.widgets.load();
      });
    else
      twttr.widgets.load();
  }

  loadQuote(window.location.hash);
});
