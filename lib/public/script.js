var RENDER_NEW_QUOTE_TIMEOUT,
    LOAD_QUOTE_TIMEOUT;

$(function() {
  History.Adapter.bind(window, 'statechange', function() {
    clearTimeout(RENDER_NEW_QUOTE_TIMEOUT);
    clearTimeout(LOAD_QUOTE_TIMEOUT);
    var quote = History.getState().data;
    if (quote.id && quote.id != CURRENT_QUOTE.id)
      renderNewQuote(quote);
  });  

  function loadNewQuote() {
    $.getJSON("quote", {t: new Date().getTime()})
     .done(function(quote) {
      if (hasQuoteOnScreenAlready(quote))
        loadNewQuote();
      else {
        clearTimeout(RENDER_NEW_QUOTE_TIMEOUT);
        RENDER_NEW_QUOTE_TIMEOUT = setTimeout(function() {
          History.pushState(quote, null, quote.id);
        }, 5000);
      }
    })
     .fail(function() {
       clearTimeout(LOAD_QUOTE_TIMEOUT);
       LOAD_QUOTE_TIMEOUT = setTimeout(loadQuote, 5000);
     });
  }

  function renderNewQuote(quote) {
    if (hasQuoteOnScreenAlready(quote)) return;

    $("blockquote").fadeOut(animationTimeout, function() {
      $(this).find(".content").html(quote.c).end()
             .find(".author").html(quote.a).end();
      showQuote(quote);
    });
  }

  function hasQuoteOnScreenAlready(quote) {
    return $("blockquote").is(":visible") && CURRENT_QUOTE.id == quote.id;
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

  function showQuote(quote) {
    $("blockquote").fadeIn(animationTimeout);
    CURRENT_QUOTE = quote;
    renderTwitterButton();
    _gaq.push(['_trackPageview']);
    loadNewQuote();
  }

  var animationTimeout = 1000;
  History.replaceState(CURRENT_QUOTE, null, CURRENT_QUOTE.id);
  renderNewQuote(CURRENT_QUOTE);
});
