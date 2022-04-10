async function getToken(err) {
  if (
    err.result.error.code == 401 ||
    (err.result.error.code == 403 &&
      err.result.error.status == "PERMISSION_DENIED")
  ) {
    // The access token is missing, invalid, or expired, prompt for user consent to obtain one.
    await new Promise((resolve, reject) => {
      try {
        // Settle this promise in the response callback for requestAccessToken()
        tokenClient.callback = (resp) => {
          if (resp.error !== undefined) {
            reject(resp);
          }
          // GIS has automatically updated gapi.client with the newly issued access token.
          console.log(
            "gapi.client access token: " +
              JSON.stringify(gapi.client.getToken())
          );
          jwt = resp;
          resolve(resp);
        };
        tokenClient.requestAccessToken();
      } catch (err) {
        console.log(err);
      }
    });
  } else {
    // Errors unrelated to authorization: server errors, exceeding quota, bad requests, and so on.
    throw new Error(err);
  }
}
