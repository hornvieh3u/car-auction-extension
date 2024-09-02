$(function(){
  console.log('manheim - here')
  // loading element
  var div = document.createElement("DIV");
  div.id = "Extension-lion-trans";
  div.className = "loading-extension-lion";
  div.innerHTML = "<div></div><div></div><div></div><h2 id='can-be-error'>Loading...</h2>";
  document.getElementsByTagName("body")[0].appendChild(div);
  // error message element
  var div = document.createElement("DIV");
  div.className = "error-notification";
  div.innerHTML = "<div id='error'></div>";
  document.getElementsByTagName("body")[0].appendChild(div);
  
  getAccounts(async function(response) {
    if (response.accounts) {
        $('#mdotcom-old-header').on('DOMSubtreeModified', function(){
          if( document.querySelector('.uhf-buttons-noauth a.noauth:first-child') ) {
            document.getElementById("Extension-lion-trans").style.display = "flex";
            location.replace(document.querySelector('.uhf-buttons-noauth a.noauth:first-child').getAttribute('href'))
            return;
          }
        });
      
        if( window.location.href.indexOf('/auth/authorization.oauth2') !== -1 ) {
          document.getElementById("Extension-lion-trans").style.display = "flex";
          $("#user_username").val(response.accounts.manheim.username);
          $("#user_password").val(response.accounts.manheim.password);
          $("#submit").trigger('click');
        }
      }
  })

  $('button[data-test-id="Bid-Button"]').on('click', function(){
    let name = $("span.ListingTitle__title").attr('title');
    let lotId = 0;
    let vinCode = $("span.Listing__vin b").text();
    let bidPrice = $('button[data-test-id="Bid-Button"] .bid-buy__amount').text().trim().replace(/[^\d]/g, '');
    getToken(async function(response) {
      if (response.token) {
        var headers = {
          Authorization: "Bearer " + response.token,
        };
        await fetchRequestPost(
          "http://localhost:4000/api/user/activity" +
            "?name=" + name +
            "&lotId=" + lotId +
            "&vinCode=" + vinCode +
            "&bidPrice=" + parseInt(bidPrice) +
            "&type=manheim",
          {},
          headers
        );
      }
    })
  })
})

async function getAccounts(callBackFn) {
  if( chrome && chrome.storage ) {
    return chrome.storage.local.get(["accounts"], callBackFn);
  } else {
    return { accounts: null };
  }
}

async function getToken(callBackFn) {
  if( chrome && chrome.storage ) {
    return chrome.storage.local.get(["token"], callBackFn);
  } else {
    return { token: null };
  }
}

async function fetchRequestPost(url, data, headers) {
  const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(data) });
  return response.json();
}
