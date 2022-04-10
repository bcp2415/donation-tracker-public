// function to read row 110 (which stores column totals)
// from active sheet; calculate check and cash totals;
// display results in cells g2 and g3
function getTotals() {
  var params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: spreadsheetId,

    // The A1 notation of the values to retrieve.
    // here is the code using the categories[] to get the correct columns
    // range: `${months[cMonth - 1]} ${cDay}, ${cYear}!${categories[0][2]}110:${
    //   categories[categories.length - 1][2]
    // }110`,

    range: `${sheetName}!B110:U110`,

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
  // try 1st API call
  request
    // process response if successful
    .then((response1) => {
      processCheckAndCashTotals(response1);
      done = true;
    })
    // obtain a JWT if 1st API call failed
    .catch(async (err) => {
      done = false;
      await getToken(err);
    })
    // check whether 1st API call worked; if it did, throw an error so we avoid repeating API call
    // if it didn't work, repeat it
    .then(async (retry) => {
      throwSomething(done, "getTotals");
      const response2 = await gapi.client.sheets.spreadsheets.values.get(
        params
      );
      return response2;
    })
    // process response of 2nd API call
    .then(async (response2) => {
      processCheckAndCashTotals(response2);
    })
    .catch((err) => console.log(err));
}

function processCheckAndCashTotals(response) {
  let result = [];
  let checks = 0;
  let cash = 0;

  // since every other column contains a cash/check amount,
  // we add every other column to get these totals
  for (let i = 0; i < categories.length; i = i + 2) {
    checks += parseInt(response.result.values[0][i]);
    cash += parseInt(response.result.values[0][i + 1]);
  }

  let checkAndCashTotals = [[checks], [cash]];

  // write new values to G2:G3
  updateCellValue(checkAndCashTotals, `${sheetName}!G2:G3`, dummySaveElement);

  // display new values in app
  const totals = document.getElementById("checkAndCashTotals");
  totals.innerText = `Checks: ${checks}, Cash: ${cash}, Total: ${
    checks + cash
  }`;
  return;
}
