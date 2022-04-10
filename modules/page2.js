let counter1String, counter2String;

const page2HTML =
  // TODO: rewrite this following model on page4.js, so we're not recreating a string for each element
  // (I have read that the method below is hard on memory)
  `<div id="sheetNameArea"></div>` +
  `<h2 id="nameOfSheetEdited"></h2>` +
  `<span id="sheetNameSaved"></span>` +
  `<h3 id="checkAndCashTotals"></h3>` +
  `<span id="runningTotalsSaved"></span>` +
  `<hr>` +
  `<div id="enterCounterNamesArea">` +
  `<h2>Enter the counters\' names:</h2>` +
  `<table>` +
  `<tr>` +
  `<td>` +
  `<label for="counter1">First counter: </label>` +
  `</td>` +
  `<td>` +
  `<input type="text" class="form-control" id="counter1" size="20" />` +
  `</td>` +
  `<td>` +
  `<button id="writeCounter1" class="btn btn-success" >Save</button>` +
  `</td>` +
  `<td>` +
  `<span id="counter1Success" class="saveMessage"></span>` +
  `</td>` +
  `</tr>` +
  `<br>` +
  `<tr>` +
  `<td>` +
  `<label for="counter2">Second counter: </label>` +
  `</td>` +
  `<td>` +
  `<input type="text" class="form-control" id="counter2" size="20" />` +
  `</td>` +
  `<td>` +
  `<button id="writeCounter2" class="btn btn-success" >Save</button>` +
  `</td>` +
  `<td>` +
  `<span id="counter2Success" class="saveMessage"></span>` +
  `</td>` +
  `</tr>` +
  `</table>` +
  `<hr>` +
  `<button id="goToPage3" class="button-centered btn btn-success">Ready to Enter Donations</button>` +
  `</div>`;

function moveToPage2() {
  const mainPageContent = document.getElementById("mainPageContent");
  // add HTML to page2 area in app
  mainPageContent.innerHTML = page2HTML;

  // add eventListeners to buttons on this page
  const writeCounter1 = document.getElementById("writeCounter1");
  const writeCounter2 = document.getElementById("writeCounter2");
  const moveOverToPage3 = document.getElementById("goToPage3");
  writeCounter1.addEventListener("click", writeC1);
  writeCounter2.addEventListener("click", writeC2);
  moveOverToPage3.addEventListener("click", moveToPage3);
}

// TODO: DRY these 2 functions --- they are duplicates, except for 1/2
function writeC1() {
  const counter1Success = document.getElementById("counter1Success");
  let counter1String = [[document.getElementById("counter1").value]];
  let success = updateCellValue(
    counter1String,
    `${months[cMonth - 1]} ${cDay}, ${cYear}!J1`,
    counter1Success
  );
}

function writeC2() {
  const counter2Success = document.getElementById("counter2Success");
  let counter2String = [[document.getElementById("counter2").value]];
  updateCellValue(
    counter2String,
    `${months[cMonth - 1]} ${cDay}, ${cYear}!J2`,
    counter2Success
  );
}
