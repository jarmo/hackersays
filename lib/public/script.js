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
        }, timeForReading());
      }
    })
     .fail(function() {
       clearTimeout(LOAD_QUOTE_TIMEOUT);
       LOAD_QUOTE_TIMEOUT = setTimeout(loadNewQuote, 5000);
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

  function renderFacebookButton() {
    var btn = '<div class="fb-like" data-send="false" data-layout="button_count" data-width="450" data-show-faces="false" data-font="arial"></div>';
    $("#fb-button").empty().html(btn);

    if (!window.FB)
      $.getScript("//connect.facebook.net/en_US/all.js#xfbml=1", function() {
        FB.XFBML.parse();
      });
    else
      FB.XFBML.parse();
  }

  function showQuote(quote) {
    $("blockquote").fadeIn(animationTimeout);
    CURRENT_QUOTE = quote;
    renderTwitterButton();
    renderFacebookButton();
    _gaq.push(['_trackPageview']);
    loadNewQuote();
  }

  function timeForReading() {
    var averageWPM = 200;
    var additionalFactor = 1.5;
    var time = (CURRENT_QUOTE.c + " " + CURRENT_QUOTE.a).split(" ").length * 60 / averageWPM * additionalFactor;
    return time * 1000;
  }

  var animationTimeout = 1000;
  History.replaceState(CURRENT_QUOTE, null, CURRENT_QUOTE.id);
  renderNewQuote(CURRENT_QUOTE);
});
