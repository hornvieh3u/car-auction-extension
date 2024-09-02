document.addEventListener("DOMContentLoaded", (event) => {
  setTimeout(() => {
    $(document).click(function (event) {
      if ($(event.target).attr("data-uname") !== undefined) {
        if ($(event.target).attr("data-uname") === "preBid") {
          getToken((response) => {
            let data = $(event.target)
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent()
              .parent();
            var headers = {
              Authorization: "Bearer " + response.token,
            };
            fetchRequestPost(
              "http://localhost:4000/api/user/activity" +
                "?name=" + $(data.find(".lot-detail > p")[0]).text() +
                "&lotId=" + $(data.find(".lot-detail a")).text() +
                "&vinCode=auction" +
                "&bidPrice=" + parseInt( $("input[data-uname='futureLotBidAmount']").val().replace(".", "").replace(",", "").match(/\d+/) ) +
                "&type=copart",
              {},
              headers
            ).then(function (response) {
              setTimeout(() => {
                fetchRequestPost("http://localhost:4000/api/user/invoice" + "?id=" + response.id, {}, headers);
              }, 5000)
            });
          });
        }
        if ($(event.target).attr("data-uname") === "bidCurrentLot") {
          getToken((response) => {
            var headers = {
              Authorization: "Bearer " + response.token,
            };
            fetchRequestPost(
              "http://localhost:4000/api/user/activity" +
                "?name=" + document.querySelector(".lotdesc > div.col-8.px-1 > div.titlelbl.ellipsis").innerHTML +
                "&lotId=" + document.querySelector(".lotdesc > div.col-8.px-1 > div > a").innerHTML +
                "&vinCode=auction" +
                "&bidPrice=" + parseFloat($("input[data-uname='bidAmount']").val().replace(".", "").replace(",", "").match(/\d+/)) +
                "&type=copart",
              {},
              headers
            ).then(function (response) {
              setTimeout(() => {
                fetchRequestPost("http://localhost:4000/api/user/invoice" + "?id=" + response.id, {}, headers);
              }, 5000)
            });
          });
        }
      }
    });
  }, 0);

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
});
