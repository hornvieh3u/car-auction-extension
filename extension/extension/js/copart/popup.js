(async function () {
  var extensionsGlobal = [];

  var manifest = chrome.runtime.getManifest();
  var version = manifest.version;

  const token = window.localStorage.token;
  if (token && token.length > 10) {
    me();
  } else {
    checkPermission(chrome, manifest);
  }

  $("#version").text(version);

  function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
      if (haystack[i] == needle) return true;
    }
    return false;
  }

  function checkPermission(chrome, manifest) {
    let extensions = chrome.management.getAll(function (result) {
      extensions = result.filter(function (value) {
        if (inArray("proxy", value.permissions)) {
          if (value.enabled) {
            if (value.name != manifest.name) {
              return true;
            }
          }
        }
      });
      if (extensions.length > 0) {
        $("#needDisable").show();
        $("#login-form").hide();
        for (let i = 0; i < extensions.length; i++) {
          $("#needDisable .extension-list").append(
            "<div>" +
              '<div class="extension-name">' +
              extensions[i].name +
              "</div>" +
              "</div>"
          );
        }
      } else {
        $("#needDisable").hide();
        $("#main-page").hide();
        $("#login-form").show();
      }

      return extensions;
    });
    extensionsGlobal = extensions;
  }

  $("#disable-all").on("click", async function () {
    await chrome.management.getAll(async function (result) {
      await result.filter(function (value) {
        if (inArray("proxy", value.permissions)) {
          if (value.enabled) {
            if (value.name != manifest.name) {
              chrome.management.setEnabled(value.id, false);
              checkPermission(chrome, manifest);
            }
          }
        }
      });
    });
    checkPermission(chrome, manifest);
  });

  async function me() {
    fetchRequestGet("https://usa-trans.pp.ua/api/user-profile")
      .then((data) => {
        window.localStorage.user = data;
        if (data.status === "Token is Expired") {
          LogOut();
          $("#main-page").hide();
          $("#login-form").show();
        } else {
          $("#main-page").show();
        }
      })
      .catch((err) => {
        $("#main-page").hide();
        $("#login-form").show();
        LogOut();
      });
  }

  async function fetchRequestGet(
    url = "",
    headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + window.localStorage.token,
    }
  ) {
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: headers,
      redirect: "follow", // manual, *follow, error
    });

    return response.json(); // parses JSON response into native JavaScript objects
  }

  async function fetchRequestPost(
    url = "",
    data = {},
    headers = {
      "Content-Type": "application/json",
    }
  ) {
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: headers,
      // mode: "no-cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      redirect: "follow", // manual, *follow, error
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  // console.log(extensions);
  // const extensionWhatNeedDisable =

  $("#app form").on("submit", function ($e) {
    $e.preventDefault();
    fetchRequestPost(
      "https://usa-trans.pp.ua/api/auth/login?user_name=" +
        $("#username").val() +
        "&password=" +
        $("#password").val(),
      {
        email: $("#username").val(),
        password: $("#password").val(),
      }
    )
      .then((data) => {
        window.localStorage.token = data.original.access_token;
        window.localStorage.user = data.original.user;
        console.log(data);
        chrome.storage.local.set(
          { user: data.original.user },
          function (value) {}
        );
        chrome.storage.local.set(
          { token: data.original.access_token },
          function (value) {}
        );
        chrome.tabs.create({
          url: "https://www.copart.com/",
        });
        $("#main-page").show();
        $("#login-form").hide();
      })
      .catch((err) => {
        console.log(err);
        LogOut();
      });
  });

  $("#copart-url").on("click", function ($e) {
    chrome.tabs.create({
      url: "https://www.copart.com/",
    });
  });

  $(".btn-logout").on("click", function ($e) {
    LogOut();
  });

  function LogOut() {
    window.localStorage.user = null;
    window.localStorage.token = null;
    getCookies(function (response) {
      for (let i = 0; i < response.length; i++) {
        console.log(response[i]);
        chrome.cookies.remove(
          {
            name: response[i].name,
            url: "https://" + response[i].domain,
          },
          (response) => {}
        );
      }
    });
    chrome.storage.local.set({ user: null }, function (value) {});
    chrome.storage.local.set({ token: null }, function (value) {});
    checkPermission(chrome, manifest);
  }

  function getCookies(callback) {
    chrome.cookies.getAll(
      {
        domain: "www.copart.com",
      },
      function (cookie) {
        if (callback) {
          callback(cookie);
        }
      }
    );
  }

  //usage:

  $("#auck-url").on("click", function ($e) {
    chrome.tabs.create({
      url: "https://www.copart.com/auctionDashboard",
    });
  });
})();
