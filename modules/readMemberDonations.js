function readMemberDonations(memberLineNumber) {
  var params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: spreadsheetId,

    // The A1 notation of the values to retrieve.
    range: `${sheetName}!${categories[0][2]}${memberLineNumber}:${
      categories[categories.length - 1][2]
    }${memberLineNumber}`,

    // How values should be represented in the output.
    // The default render option is ValueRenderOption.FORMATTED_VALUE.
    valueRenderOption: "FORMATTED_VALUE",

    // How dates, times, and durations should be represented in the output.
    // This is ignored if value_render_option is
    // FORMATTED_VALUE.
    // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
    dateTimeRenderOption: "FORMATTED_STRING",
  };

  let done = false;
  var request = gapi.client.sheets.spreadsheets.values.get(params);

  // make 1st API call
  request
    // process response if successful
    .then((response) => {
      const result = getResult(response);
      fillSheetValues(result);
      done = true;
    })
    // if 1st call failed, get JWT
    .catch(async (err) => {
      done = false;
      await getToken(err);
    })
    // throw an error if 1st API call has already succeeded;
    // if it failed, make 2nd API call now that we have the JWT (or should...)
    .then(async (retry) => {
      throwSomething(done, "readMemberDonations");
      const resp2 = await request;
      return resp2;
    })
    // process the response to 2nd API call
    .then((resp2) => {
      const result = getResult(resp2);
      fillSheetValues(result);
    })
    .catch((err) => console.log(err));
}

// process the response to readMemberDonations
// so we don't duplicate all this code between 1st and 2nd API calls above
function getResult(response) {
  let result = [];
  if (
    typeof response.result.values === "undefined" ||
    typeof response.result.values[0] === "undefined"
  ) {
    for (let i = 0; i < categories.length; i++) result.push(0);
  } else {
    for (let i = 0; i < response.result.values[0].length; i++) {
      if (
        typeof response.result.values[0][i] === "undefined" ||
        response.result.values[0][i] === ""
      ) {
        result.push(0);
      } else {
        result.push(response.result.values[0][i]);
      }
    }
    const numberOfRemainingEntries =
      categories.length - response.result.values[0].length;
    for (let i = 0; i < numberOfRemainingEntries; i++) {
      result.push(0);
    }
  }
  return result;
}
