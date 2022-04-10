function updateCellValue(
  textToWrite,
  cell,
  successMessageTarget,
  processMemberDonations = false
) {
  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: spreadsheetId,

    // The A1 notation of the values to update.
    range: cell,

    // How the input data should be interpreted.
    valueInputOption: "RAW",
  };

  var valueRangeBody = {
    // Add desired properties to the request body. All existing properties
    // will be replaced.
    range: cell,
    // This is an array of arrays, the outer array representing all the data and each inner array representing a major dimension. Each item in the inner array corresponds with one cell.
    values: textToWrite,
  };

  let done = false;
  const request = gapi.client.sheets.spreadsheets.values.update(
    params,
    valueRangeBody
  );

  // make 1st API call
  request
    // process response to 1st call if successful
    .then((response) => {
      if (processMemberDonations) {
        readMemberDonations(`${currentMember.rowNumber}`);
        getTotals();
      }
      done = true;
    })
    // if 1st call failed, get JWT
    .catch(async (err) => {
      done = false;
      await getToken(err);
    })
    // check whether API call has already succeeded
    // if it succeeded, throw an error we skip the 2nd call and processing
    // repeat call if not
    .then(async (retry) => {
      throwSomething(done, "updateCellValue");
      const resp2 = await request;
      return resp2;
    })
    // process response to 2nd API call
    .then((resp2) => {
      if (processMemberDonations) {
        readMemberDonations(`${currentMember.rowNumber}`);
        getTotals();
      }
    })
    .catch((err) => console.log(err));
}
