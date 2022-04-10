const page3HTML =
  // TODO: rewrite this concatenation following page4.js model
  `<div id="searchForm">` +
  `<h2>Search for a member</h2>` +
  `<p>Enter a name or member number</p>` +
  `<p>...or leave search box blank for a list of all members: </p>` +
  `<input type="text" id="searchTerm" class="form-control" size="20"/>` +
  `<button id="searchButton" class="btn btn-success button-inline">Search</button>` +
  `<br>` +
  `<hr>` +
  `</div>` +
  `<div id="resultsArea"></div>`;

// we need a global variable so we can process searches easily across functions
let searchString;

function moveToPage3() {
  // delete input fields for saving counters' names:
  const searchSection = document.getElementById("enterCounterNamesArea");
  searchSection.innerHTML = "";
  // replace with input field for searching members:
  searchSection.innerHTML = page3HTML;

  // add eventListener to perform search
  const doSearch = document.getElementById("searchButton");
  const searchTerm = document.getElementById("searchTerm");
  doSearch.addEventListener("click", search);

  // display name of sheet being edited in-app
  let start = document.getElementById("nameOfSheetEdited");
  start.innerText = `Count for: ${sheetName}`;
}

function search() {
  // delete any results from previous searches
  const resultsOnPage = document.getElementById("resultsArea");
  resultsOnPage.innerText = "";

  // convert all search terms to lower case
  searchString = searchTerm.value.toLowerCase();
  // initialize a results [] to hold all hits
  let results = [];

  // check every memberNumber value in case search is a number:
  // add any matches to results array
  for (let i = 0; i < members.length; i++) {
    if (members[i].memberNumber.toString() === searchString) {
      results.push(members[i]);
    }

    // now check every member names array in case search is a letter(s)
    for (let j = 0; j < members[i].names.length; j++) {
      if (members[i].names[j].toLowerCase().includes(searchString)) {
        // add to results array only if not already present
        if (!results.includes(members[i])) {
          results.push(members[i]);
        }
      }
    }
  }
  // display results [] on screen in-app
  displayResults(results);
}

function displayResults(resultsArray) {
  // build the HTML string we'll display under the search input field
  const resultsOnPage = document.getElementById("resultsArea");
  let resultsHTMLString = "<hr><h2>Click on a member to add donations:</h2>";

  // for each member of results array, add the memberNumber and the display names
  for (let i = 0; i < resultsArray.length; i++) {
    resultsHTMLString += `<h3 id=result-${i} class="clickable">`;
    resultsHTMLString += `${resultsArray[i].memberNumber}: `;
    resultsHTMLString += `${resultsArray[i].names[0]}`;

    resultsHTMLString += `</h3>`;
  }
  // put the results HTML string into the "resultsArea"
  resultsOnPage.innerHTML = resultsHTMLString;

  // now that results are on page, add a click event to each one:
  for (let i = 0; i < resultsArray.length; i++) {
    // grab the automatically-generated id for each result
    let result = document.getElementById(`result-${i}`);

    // add eventListener to the current result element
    result.addEventListener("click", function () {
      currentMember = resultsArray[i];
      // we call the same function for every result, passing in the member object used to generate each result being displayed
      enterMemberDonation(resultsArray[i]);

      // add button to app so we can move to final page of instructions when all donations have been entered
      displayFinishedButton();
    });
  }
}
