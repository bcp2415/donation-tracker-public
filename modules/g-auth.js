// following lines mostly copied from G migration guide using async/await:
// https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#implicit_flow_examples

// resolve these 2 promises when their respective Google libraries are loaded:
const gapiLoadPromise = new Promise((resolve, reject) => {
  gapiLoadOkay = resolve;
  gapiLoadFail = reject;
});
const gisLoadPromise = new Promise((resolve, reject) => {
  gisLoadOkay = resolve;
  gisLoadFail = reject;
});

let tokenClient;

// this fcn is invoked immediately
// as soon as the 2 Google libraries are loaded, it initializes both
(async () => {
  document.getElementById("goToTodaysSheet").style.visibility = "hidden";
  document.getElementById("revokeBtn").style.visibility = "hidden";

  // First, load and initialize the gapi.client
  await gapiLoadPromise;
  await new Promise((resolve, reject) => {
    gapi.load("client", { callback: resolve, onerror: reject });
  });
  await gapi.client
    .init({
      // NOTE: OAuth2 'scope' and 'client_id' parameters have moved to initTokenClient().
    })
    .then(function () {
      // Load the API discovery document.
      gapi.client.load("sheets", "v4");
    });

  // Now load the GIS client
  await gisLoadPromise;
  await new Promise((resolve, reject) => {
    try {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id:
          "517104759390-edi12t55po4jcplhf5hk13m1bkf1sdfd.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/spreadsheets",
        key: APIkey,
        prompt: "consent",
        callback: "", // defined at request time in await/promise scope.
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });

  document.getElementById("goToTodaysSheet").style.visibility = "visible";
  document.getElementById("revokeBtn").style.visibility = "visible";
})();

function revokeToken() {
  let cred = gapi.client.getToken();
  if (cred !== null) {
    google.accounts.oauth2.revoke(cred.access_token, () => {
      console.log("Revoked: " + cred.access_token);
    });
    gapi.client.setToken("");
  }
}
