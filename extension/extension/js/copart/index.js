document.addEventListener("DOMContentLoaded", (event) => {
  console.log('copart - here')
  let interval = setInterval(() => {
    let logOut = () => {};
    try {
      var port = chrome.runtime.connect({ name: "content" });
      port.onMessage.addListener(function (message, sender) {
        if (message.status === "working") {
        }
        if (message.worker) {
          logOut = message.worker;
        }
      });
    } catch (error) {
      $(
        "#headerloggedInUserDropdown > div > span.mt-5.mb-10.logged-in-user-link"
      ).click();
      clearInterval(interval);
    }
  }, 1000);

  const checkAuction = function () {
    if (window.location.href.indexOf("/auctionDashboard") !== -1) {
      document.getElementById("Extension-lion-trans").style.display = "flex";
      setTimeout(() => {
        location.replace(document.getElementById("iAuction5").src);
      }, 5000);
    }
  };

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

  getAccounts(async function (response) {
    if (response.accounts) {
      if (document.querySelector(".btn-register")) {
        document.getElementById("Extension-lion-trans").style.display = "flex";
        await fetchRequestPost("https://www.copart.com/processLogin", {
          accountType: "0",
          accountTypeValue: "0",
          rememberme: !0,
          username: response.accounts.copart.username,
          password: response.accounts.copart.password,
        })
        .then(function (response) {
          if (response.data.error) {
            document.getElementById("error").innerHTML = response.data.error + " <br> Please, contact to administrator!";
            document.querySelector(".error-notification").style.display = "flex";
          } else {
            location.reload();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      } else {
        document.querySelector(".loggedInUserIcon").innerHTML = response.email;
        checkAuction();
      }

      setTimeout(() => {
        document.getElementById("Extension-lion-trans").style.display = "none";
        document.querySelector(".error-notification").style.display = "none";
      }, 5000)
    }
  });

  var BidPrice = 0;
  $(document).click(function (event) {
    if (BidPrice != 0) {
      if ($(event.target).attr("class") === "btn btn-copart-blue") {
        if ($(event.target).attr("ng-click") === "increaseBidForLot()") {
          getToken(function (response) {
            var headers = {
              Authorization: "Bearer " + response.token,
            };
            fetchRequestPost(
              "http://localhost:4000/api/user/activity" +
                "?name=" + $("#lot-details > div > div.container-fluid.lot-details-header > div > div > div.col-md-7.col-sm-12.clearfix.lot-details-heading.p-0.mb-5 > div:nth-child(1) > h1").text().trim() +
                "&lotId=" + parseInt($("#lot-details > div > div.container-fluid.lot-details-header > div > div > div.col-md-7.col-sm-12.clearfix.lot-details-heading.p-0.mb-5 > div:nth-child(2) > span.lot-number.nowrap").text().trim().match(/\d+/) ) +
                "&bidPrice=" + BidPrice +
                "&vinCode=" + $("#vinDiv > span").text().trim() +
                "&type=copart",
              {},
              headers
            ).then(function (response) {
              BidPrice = 0;
            });
          });
        }
        if ($(event.target).attr("ng-click") === "confirmBuyItNowPurchase()") {
          getToken(function (response) {
            var headers = {
              Authorization: "Bearer " + response.token,
            };
            fetchRequestPost(
              "http://localhost:4000/api/user/activity" +
                "?name=" + $("#lot-details > div > div.container-fluid.lot-details-header > div > div > div.col-md-7.col-sm-12.clearfix.lot-details-heading.p-0.mb-5 > div:nth-child(1) > h1").text().trim() +
                "&lotId=" + parseInt( $("#lot-details > div > div.container-fluid.lot-details-header > div > div > div.col-md-7.col-sm-12.clearfix.lot-details-heading.p-0.mb-5 > div:nth-child(2) > span.lot-number.nowrap").text().trim().match(/\d+/) ) +
                "&bidPrice=" + BidPrice +
                "&vinCode=" + $("#vinDiv > span").text().trim() +
                "&type=copart",
              {},
              headers
            ).then(function (response) {
              BidPrice = 0;
            });
          });
        }
        if ($(event.target).attr("ng-click") === "prelimBidForLot()") {
          getToken(function (response) {
            var headers = {
              Authorization: "Bearer " + response.token,
            };
            fetchRequestPost(
              "http://localhost:4000/api/user/activity" +
                "?name=" + $("#lot-details > div > div.container-fluid.lot-details-header > div > div > div.col-md-7.col-sm-12.clearfix.lot-details-heading.p-0.mb-5 > div:nth-child(1) > h1").text().trim() +
                "&lotId=" + parseInt( $("#lot-details > div > div.container-fluid.lot-details-header > div > div > div.col-md-7.col-sm-12.clearfix.lot-details-heading.p-0.mb-5 > div:nth-child(2) > span.lot-number.nowrap").text().trim().match(/\d+/) ) +
                "&bidPrice=" + BidPrice +
                "&vinCode=" + $("#vinDiv > span").text().trim() +
                "&type=copart",
              {},
              headers
            ).then(function (response) {
              BidPrice = 0;
            });
          });
        }
      }
    }
  });
  setTimeout(() => {
    $(document).on("change", "input#max-bid", function (e) {
      BidPrice = $(this).val();
    });
    $(document).on("change", "input#your-max-bid", function (e) {
      BidPrice = $(this).val();
    });
  }, 0);

  $(document).on(
    "click",
    "#Hero-banner > div > div.live-auction-banner > div",
    () => checkAuction()
  );
  $(document).on(
    "click",
    'span[ng-click="gtmTrackingLiveBid(lotNumber,displaySaleDate,bidEligibilityFlag)"] a',
    () => checkAuction()
  );
  $(document).on(
    "click",
    "#serverSideDataTable > tbody > tr > td > ul > li > ul > li > a.btn-green",
    () => checkAuction()
  );
  $(document).on(
    "click",
    "#bid-information-id > div:nth-child(1) > div > div.bid-info-content > div > div > div > div > div > div > div > div > div > div.live-auction-notification.text-center > a",
    () => checkAuction()
  );
  $(document).on(
    "click",
    "#auctionLiveNow-datatable > tbody > tr > td.text-center > ul > li > a",
    () => checkAuction()
  );
  $(document).on(
    "click",
    "#mobile-header-nav-links > ul > li.dropdown.active > ul > li:nth-child(3) > a",
    () => checkAuction()
  );
});

async function getAccounts(callBackFn) {
  if( chrome && chrome.storage ) {
    return chrome.storage.local.get(["accounts", "email"], callBackFn);
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