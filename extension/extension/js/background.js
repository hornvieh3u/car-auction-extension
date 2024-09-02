const pacScriptConfig = {
  mode: "pac_script",
  pacScript: {
    data: `function FindProxyForURL(url, host) {
        if (host === "www.copart.com" || host === "copart.com" || host === "g2auction.copart.com") {
          return "PROXY 91.232.30.84:6554";
        } else {
          return "DIRECT";
        }
      }`,
  },
};

chrome.proxy.settings.set(
  { value: pacScriptConfig, scope: "regular" },
  function () {
    console.log("CHROME PROXY");
  }
);

chrome.webRequest.onAuthRequired.addListener(
  function (details, callbackFn) {
    console.log("onAuthRequired!", details, callbackFn);
    callbackFn({
      authCredentials: {
        username: "fY0z4R56pNv6",
        password: "kS34qGiD6lKL",
      },
    });
  },
  { urls: ["<all_urls>"] },
  ["asyncBlocking"]
);

chrome.proxy.onProxyError.addListener((details) => {
  console.log("chrome", chrome);
  if (details.fatal) {
  }
  LogOut();
});
chrome.runtime.onMessageExternal.addListener(function (
  request,
  sender,
  sendResponse
) {
  if (request) {
    if (request.message) {
      if (request.message == "getSelf") {
        sendResponse({ getSelf: chrome.management });
      }
    }
  }
  return true;
});
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    LogOut();
  }
});

chrome.runtime.onConnect.addListener(function (port) {
  port.postMessage({ status: "working" });
  port.postMessage({ worker: LogOut });
});

const LogOut = () => {
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
};

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
async function getUser(callBackFn) {
  return chrome.storage.local.get(["user", "token"], callBackFn);
}
