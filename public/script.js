$(function() { 
  $("#themes li a").click(function(ev) {
    ev.preventDefault();
    var theme = $(this).closest("li").attr("data-theme");
    $(document.body).attr("data-theme", theme);
  });
});

$(function() {
  var renderingTimer, fetchingTimer, animationSpeed = 1000;

  History.Adapter.bind(window, 'statechange', function() {
    clearTimeout(renderingTimer);
    clearTimeout(fetchingTimer);
    
    var quote = History.getState().data;
    if (quote.id && quote.id != $currentQuote.id) renderNewQuote(quote);
  });

  function loadNewQuote() {
    $.getJSON("quote", {t: new Date().getTime()})
     .done(function(quote) {
      if (hasQuoteOnScreenAlready(quote))
        loadNewQuote();
      else {
        clearTimeout(renderingTimer);
        renderingTimer = setTimeout(function() {
          History.pushState(quote, null, quote.id);
        }, timeForReading());
      }
    })
    .fail(function() {
      clearTimeout(fetchingTimer);
      fetchingTimer = setTimeout(loadNewQuote, 5000);
    });
  }

  function renderNewQuote(quote) {
    if (hasQuoteOnScreenAlready(quote)) return;

    $("#quote").fadeOut(animationSpeed, function() {
      $(this).find("p span").html(quote.c).end()
             .find("cite").html(quote.a).end();
      showQuote(quote);
    });
  }

  function hasQuoteOnScreenAlready(quote) {
    return $("#quote").is(":visible") && $currentQuote.id == quote.id;
  }

  function renderTwitterButton() {
    var btn = '<a href="https://twitter.com/share" class="twitter-share-button" data-text="I like this quote at programming-quotes.com" data-hashtags="programming" data-url="' + window.location.href + '">Tweet</a>';
    $("#tweet-button").html(btn);

    if (!window.twttr)
      $.getScript("//platform.twitter.com/widgets.js", load)
    else
      load()

    function load() { twttr.widgets.load() }
  }

  function renderFacebookButton() {
    var btn = '<div class="fb-like" data-send="false" data-layout="button_count" data-width="350" data-show-faces="false" data-font="arial"></div>';
    $("#fb-button").html(btn);

    if (!window.FB)
      $.getScript("//connect.facebook.net/en_US/all.js#xfbml=1", parse)
    else
      parse()

    function parse() { FB.XFBML.parse() }
  }

  function showQuote(quote) {
    $("#quote").fadeIn(animationSpeed);
    
    $currentQuote = quote;
    
    renderTwitterButton();
    renderFacebookButton();
    _gaq.push(['_trackPageview']);
    
    loadNewQuote();
  }

  function timeForReading() {
    var averageWPM = 200;
    var additionalFactor = 2;
    var time = ($currentQuote.c + " " + $currentQuote.a).split(" ").length * 60 / averageWPM * additionalFactor;
    if (time < 5) time = 5;
    return time * 1000;
  }

  History.replaceState($currentQuote, null, $currentQuote.id);
  loadNewQuote();
});
