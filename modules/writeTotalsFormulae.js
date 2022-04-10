// formula to write following formula in each cell:
// `=SUM(UTIL_VALUESHEETS("${address-of-cell}"))`
// TODO:  refactor so we aren't using this custom function (UTIL_VALUESHEETS) --- doesn't seem to work especially well, doesn't live update when data changes...
// I think we can refactor formula so we read all the sheets actually present in the spreadsheet, then create a formula including the same cell from every sheet we want to include

function writeTotalsFormulae() {
  let rows = [];

  function constructRow(num) {
    let row = [];
    for (let i = 0; i < columns.length; i++) {
      row.push(`=SUM(UTIL_VALUESHEETS("${columns[i]}${num}"))`);
    }
    rows.push(row);
  }

  // TODO: refactor this so we determine how many rows have data to read dynamically
  for (j = 6; j < 86; j++) {
    constructRow(j);
  }

  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: spreadsheetId,
  };

  var batchUpdateValuesRequestBody = {
    // How the input data should be interpreted.
    valueInputOption: "USER_ENTERED",

    // The new values to apply to the spreadsheet.
    data: [
      {
        range: `Totals!${columns[0]}6:${columns[columns.length - 1]}87`,
        majorDimension: "ROWS",
        values: rows,
      },
    ],
  };

  let done = false;
  const request = gapi.client.sheets.spreadsheets.values.batchUpdate(
    params,
    batchUpdateValuesRequestBody
  );

  // make 1st API call
  request
    // process response from 1st call
    .then((response) => {
      done = true;
    })
    // if 1st call failed, get JWT
    .catch(async (err) => {
      done = false;
      await getToken(err);
    })
    // call throwS function to determine if we're finished
    // if not, make 2nd API call
    .then(async (retry) => {
      throwSomething(done, "writeTotalsFormulae");
      const resp2 = await request;
      return resp2;
    })
    .catch((err) => console.log(err));
}
