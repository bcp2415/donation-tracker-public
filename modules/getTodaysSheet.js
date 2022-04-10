function getExistingSheets() {
  let params = {
    spreadsheetId: spreadsheetId,
    ranges: [],
    includeGridData: false,
    key: APIkey,
  };

  let done = false;
  const request = gapi.client.sheets.spreadsheets.get(params);
  request
    .then((resp1) => {
      findSheetForToday(resp1);
      done = true;
    })
    .catch(async (err) => {
      done = false;
      await getToken(err);
    }) // for auth errors obtain an access code
    .then(async (retry) => {
      throwSomething(done, "getExistingSheets");
      const resp2 = await gapi.client.sheets.spreadsheets.get(params);
      return resp2;
    })
    .then(async (resp2) => {
      findSheetForToday(resp2);
    })
    .catch((err) => console.log(err));
}

function findSheetForToday(sheetsAPIResponse) {
  moveToPage2();
  writeTotalsFormulae();
  let sheetsArray = [];

  sheetName = `${months[cMonth - 1]} ${cDay}, ${cYear}`;
  sheetsArray = sheetsAPIResponse.result.sheets;
  let found = false;
  for (let i = 0; i < sheetsArray.length; i++) {
    if (sheetsArray[i].properties.title === sheetName) {
      found = true;
      let start = document.getElementById("nameOfSheetEdited");
      start.innerText = `Count for: ${sheetName}`;
      todaysSheetId = sheetsArray[i].properties.sheetId;
    }
  }

  if (found) {
    // read totals of checks and cash values from cells g2 and g3, display on main page
    getTotals();
  } else {
    createSheetForToday();
  }
  readMembers();
}

function createSheetForToday() {
  var params = {
    // The ID of the spreadsheet containing the sheet to copy.
    spreadsheetId: spreadsheetId,
    // The ID of the sheet to copy.
    sheetId: "1515706123",
    key: APIkey,
  };

  var requestBody = {
    // The ID of the spreadsheet to copy the sheet to.
    destinationSpreadsheetId: spreadsheetId,
  };

  let done = false;
  const request = gapi.client.sheets.spreadsheets.sheets
    .copyTo(params, requestBody)
    .then((sheetsAPIResponse) => {
      newSheetId = sheetsAPIResponse.result.sheetId;
      todaysSheetId = newSheetId;
      renameSheet(newSheetId);
      done = true;
    })
    .catch(async (err) => {
      done = false;
      await getToken(err);
    })
    .then((retry) => {
      throwSomething(done, "createSheetForToday");
      gapi.client.sheets.spreadsheets.sheets.copyTo(params, requestBody);
    })
    .then((sheetsAPIResponse) => {
      newSheetId = sheetsAPIResponse.result.sheetId;
      todaysSheetId = newSheetId;
      renameSheet(newSheetId);
    })
    .catch((err) => console.log(err)); // cancelled by user, timeout, etc.
}

function renameSheet(targetSheetId) {
  let requests = [];
  // Change the spreadsheet's title.
  requests.push({
    updateSheetProperties: {
      properties: {
        sheetId: targetSheetId,
        title: `${months[cMonth - 1]} ${cDay}, ${cYear}`,
      },
      fields: "title",
    },
  });
  // Set index of the new sheet to 3, making it appear on the left
  // just after "Members", "Totals" and "Model" sheets
  requests.push({
    updateSheetProperties: {
      properties: {
        sheetId: targetSheetId,
        index: 3,
      },
      fields: "index",
    },
  });

  let done = false;
  const batchUpdateRequest = { requests: requests };

  // initial request
  gapi.client.sheets.spreadsheets
    .batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: batchUpdateRequest,
    })
    // process response if successful
    // TODO: DRY this code by putting processing into separate function which we can call from both blocks that process responses
    .then((response) => {
      sheetName = requests[0].updateSheetProperties.properties.title;
      const rowsArray = [sheetName];
      const values = [rowsArray];
      const start = document.getElementById("nameOfSheetEdited");
      const sheetNameSaved = document.getElementById("dummySaveElement");
      start.innerText = `Editing sheet: ${sheetName}`;
      updateCellValue(
        // first param must be an array of arrays
        // inner array = major dimension, ROWS by default
        // outer array = all data to be written
        values,
        `${months[cMonth - 1]} ${cDay}, ${cYear}!B2`,
        sheetNameSaved
      );
      const totalsToStore = [[0], [0]];
      updateCellValue(
        totalsToStore,
        `${months[cMonth - 1]} ${cDay}, ${cYear}!G2:G3`,
        sheetNameSaved
      );
      getTotals();
      done = true;
    })
    // if 1st API call produced an error, obtain a token
    .catch(async (err) => {
      done = false;
      await getToken(err);
    })
    // check whether 1st API call succeeded; if it did, throw an error so we don't repeat it
    // if it didn't succeed, make API call 2nd time
    .then(async (retry) => {
      throwSomething(done, "renameSheet");
      const resp2 = await gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        resource: batchUpdateRequest,
      });
      return resp2;
    })
    // do processing on response if 2nd API call was necessary
    .then((response) => {
      sheetName = requests[0].updateSheetProperties.properties.title;
      const rowsArray = [sheetName];
      const values = [rowsArray];
      const start = document.getElementById("nameOfSheetEdited");
      const sheetNameSaved = document.getElementById("dummySaveElement");
      start.innerText = `Editing sheet: ${sheetName}`;
      updateCellValue(
        // first param must be an array of arrays
        // inner array = major dimension, ROWS by default
        // outer array = all data to be written
        values,
        `${months[cMonth - 1]} ${cDay}, ${cYear}!B2`,
        sheetNameSaved
      );
      const totalsToStore = [[0], [0]];
      updateCellValue(
        totalsToStore,
        `${months[cMonth - 1]} ${cDay}, ${cYear}!G2:G3`,
        sheetNameSaved
      );
      getTotals();
    })
    .catch((err) => console.log(err));
}

function readMembers() {
  var params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: spreadsheetId,
    // The A1 notation of the values to retrieve.
    range: `Members!A1:H80`,
    // How values should be represented in the output.
    // The default render option is ValueRenderOption.FORMATTED_VALUE.
    valueRenderOption: "FORMATTED_VALUE",
    // How dates, times, and durations should be represented in the output.
    // This is ignored if value_render_option is FORMATTED_VALUE.
    // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
    dateTimeRenderOption: "FORMATTED_STRING",
  };

  let done = false;
  var request = gapi.client.sheets.spreadsheets.values.get(params);

  // 1st API call
  request
    // process response if 1st call worked
    .then((response) => {
      createMembers(response.result.values);
      done = true;
    })
    // get JWT if 1st call failed
    .catch(async (err) => {
      done = false;
      await getToken(err);
    })
    // check whether 1st call worked; if it did, throw error to avoid repeating it
    .then(async (retry) => {
      throwSomething(done, "readMembers");
      const resp2 = request;
      return resp2;
    })
    // process response if 2nd call was needed
    .then((response) => {
      createMembers(response.result.values);
    })
    .catch((err) => console.log(err));
}
