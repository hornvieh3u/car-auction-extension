document.addEventListener("DOMContentLoaded", (event) => {
  console.log('iaai - here')
  // loading element
  let div = document.createElement("DIV");
  div.id = "Extension-lion-trans";
  div.className = "loading-extension-lion";
  div.innerHTML = "<div></div><div></div><div></div><h2 id='can-be-error'>Loading...</h2>";
  document.getElementsByTagName("body")[0].appendChild(div);
  // error message element
  div = document.createElement("DIV");
  div.className = "error-notification";
  div.innerHTML = "<div id='error'></div>";
  document.getElementsByTagName("body")[0].appendChild(div);

  getAccounts(async function(response) {
    if (response.accounts) {
        if( document.querySelector('.profile a[aria-label="Log In"]') ) {
          document.getElementById("Extension-lion-trans").style.display = "flex";
          location.replace(document.querySelector('.profile a[aria-label="Log In"]').getAttribute('href'))
          return;
        }

        if( window.location.href.indexOf('/Identity/Account/Login') !== -1 ) {
          document.getElementById("Extension-lion-trans").style.display = "flex";
          $("#Email").val(response.accounts.iaai.username);
          $("#Password").val(response.accounts.iaai.password);
          $('button[type="submit"]').trigger('click');
        }
      }
  })

  let preBids = {};
  $('input[aria-label="Max bid"]').on('change', function(event) {
    let row = event.target.parentElement.closest('.table-row');
    let name = row.querySelector('.heading-7 a').innerText;
    let lotId = row.querySelector('.heading-7 a').getAttribute('id');
    let vinCode = row.querySelector('.table-cell--data .table-cell:first-child .data-list__item:nth-child(2) .data-list__label span').innerText;
    let bidPrice = event.target.value;
    preBids[lotId] = {
      name,
      lotId,
      vinCode,
      bidPrice
    };
  })

  $(document).on('click', function (event) {
    const clickedClassName = event.target.className;
    const clickedId = event.target.id;
    /* bidding event start */
    if( clickedId === 'js-place-bid' || clickedId === 'js-asking-bid' || clickedClassName === 'bid-area__amount' || clickedClassName === 'bid-area__text' ) {
      let bidAmount = event.target.parentElement.querySelector('.bid-area__amount').getAttribute('data-askingamount');
      let names = [];
      let nameElement = event.target.parentElement.closest('.AuctionContainer').querySelector('.vehicle-name').children;
      for( const child of nameElement ) {
        names.push( child.innerText );
      }
      let infoUrl = event.target.parentElement.closest('.AuctionContainer').querySelector('.stock-number a[target="_blank"]').getAttribute('href');
      let lotId = infoUrl.replace(/^.+\/(\d+)~.+$/g, '$1');
      getToken(function(response) {
        if (response.token) {
            var headers = {
              Authorization: "Bearer " + response.token,
            };
            fetchRequestPost(
              "http://localhost:4000/api/user/activity" +
                "?name=" + names.join(' ') +
                "&lotId=" + lotId +
                "&vinCode=auction" +
                "&bidPrice=" + parseInt(bidAmount) +
                "&type=iaai",
              {},
              headers
            ).then(function (response) {});
          }
      })
    }
    /* bidding event end */

    /* preBidding event start */
    if( clickedId === 'ConfirmPlaceBid' ) {
      getToken(async function(response) {
        if (response.token) {
            var headers = {
              Authorization: "Bearer " + response.token,
            };
            for (const key in preBids) {
              await fetchRequestPost(
                "http://localhost:4000/api/user/activity" +
                  "?name=" + preBids[key].name +
                  "&lotId=" + preBids[key].lotId +
                  "&vinCode=" + preBids[key].vinCode +
                  "&bidPrice=" + parseInt(preBids[key].bidPrice) +
                  "&type=iaai" + 
                  "&status=prebid",
                {},
                headers
              );
              delete preBids[key];
            }
          }
      })
    }
    /* preBidding event end */

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
