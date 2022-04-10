function enterMemberDonation(member) {
  // add fields for entering donations, in cash or by check
  let resultsOnPage = document.getElementById("resultsArea");
  const heading =
    // HTML for heading and top row of table, down to opening of table body
    `<h2>Entering donations for (${member.memberNumber}) ${member.names[0]}:  <button id="saveAllDonations" class="button-inline btn btn-success">Save All Donations</button><span id="saveMessage"></span></h2>` +
    `<table class="table table-striped table-small">` +
    `<thead class="thead-dark">` +
    `<tr>` +
    `<th colspan="2" class="center">Checks</th>` +
    `<th colspan="2" class="center">Cash</th>` +
    `</tr>` +
    `</thead>` +
    `<tbody>`;

  // this method is easier on memory than concatenating strings
  // adds 1 new row for each member in results []
  // in each row, add 2 input fields with labels, ids
  let HTMLBuffer = [];
  for (let i = 0; i < categories.length; i = i + 2) {
    HTMLBuffer.push(`<tr>`);
    HTMLBuffer.push(`<td class="right-justify">`);
    HTMLBuffer.push(`<label class="inline">${categories[i][1]} </label>`);
    HTMLBuffer.push(`</td>`);
    HTMLBuffer.push(`<td>`);
    HTMLBuffer.push(
      `<input type="number" id="${categories[i][0]}" class="inline"/>`
    );
    HTMLBuffer.push(`</td>`);
    HTMLBuffer.push(`<td class="right-justify">`);
    HTMLBuffer.push(`<label class="inline">${categories[i + 1][1]} </label>`);
    HTMLBuffer.push(`</td>`);
    HTMLBuffer.push(`<td>`);
    HTMLBuffer.push(
      `<input type="number" id="${categories[i + 1][0]}" class="inline"/>`
    );
    HTMLBuffer.push(`</td>`);
    HTMLBuffer.push(`</tr>`);
  }

  // create a single string from the array we have generated above
  const categoriesHTML = HTMLBuffer.join("");

  // close table body and table elements
  const ending = `</tbody>` + `</table>`;

  // add all the HTML generated above to the app
  resultsOnPage.innerHTML = heading + categoriesHTML + ending;

  // call readMemberDonations so we can display any values already in the sheet
  readMemberDonations(member.rowNumber);

  // read the totals from the G Sheet, display them at top of app
  getTotals();

  // add eventListener so clicking save button will write all values in input fields to their respective cells in G Sheet
  const saveAll = document.getElementById("saveAllDonations");
  saveAll.addEventListener("click", function () {
    saveDonationsToSheet(member);
  });
}

// displays values read from Google Sheet by category in app, inside input elements:
function fillSheetValues(arrayOfValues) {
  // iterate through each category
  for (let i = 0; i < categories.length; i++) {
    // grab the id we generated for each input field
    const inputBox = document.getElementById(`${categories[i][0]}`);
    // write the value from the G Sheet into the current input field
    inputBox.value = `${arrayOfValues[i]}`;
  }
}

function saveDonationsToSheet(member) {
  let valuesToWrite = [];

  // iterate through each category
  for (let i = 0; i < categories.length; i++) {
    // read value from each input field
    // we use parseInt b/c all values are read as strings
    let amount = parseInt(document.getElementById(`${categories[i][0]}`).value);
    // if no value present, we substitute a zero
    if (isNaN(amount)) {
      amount = 0;
    }
    // create an array containing all the values we'll write to the G Sheet
    valuesToWrite.push(amount);
  }

  // Google expects the first [] to be wrapped in a 2nd []
  // (This is b/c the inner array represents the major dimension, which is ROWS by default;
  // if we had more than one row to write, we would add more inner arrays within the outer array)
  const valuesArray = [valuesToWrite];
  const save = document.getElementById("saveMessage");
  // we use global variable currentMember b/c it's used by the updateCellValue function
  // TODO: can this be DRY'ed?
  currentMember = member;

  updateCellValue(
    valuesArray,
    `${sheetName}!${columns[0]}${member.rowNumber}:${
      columns[columns.length - 1]
    }${member.rowNumber}`,
    save,
    true
  );
}

function displayFinishedButton() {
  // add button to app which will take user to final screen of instructions
  // we didn't want this to appear earlier, as we need to enter donations first
  const finished = document.getElementById("finishedEnteringDonations");
  finished.style.display = "inline";
  finished.addEventListener("click", goToPage5);
}
