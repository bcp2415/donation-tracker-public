function goToPage5() {
  // remove search area, table for entering donations,
  // leave date and count totals on screen
  // display instructions for finishing up
  const page3 = document.getElementById("searchForm");
  const page4 = document.getElementById("resultsArea");

  // remove stuff we're finished with from screen
  page3.innerHTML = "";
  page4.innerHTML = "";

  // add final instructions
  // TODO: refactor following page4 model (array.push, then join(""))
  page3.innerHTML =
    `<div id="page5">` +
    `<h2>To Finish Up: </h2>` +
    `<h3>First Big Job: [For example, fill out deposit slip.]</h3>` +
    `<ol class="finalCheckList list-group list-group-flush">` +
    `<li class="list-group-item">Step One</li>` +
    `<li class="list-group-item">Step Two</li>` +
    `<li class="list-group-item">Step Three</li>` +
    `</ol>` +
    `<hr>` +
    `<h3>Second Big Job: [For example, fill out bag for night deposit...]</h3>` +
    `<ol  class="finalCheckList list-group list-group-flush">` +
    `<li class="list-group-item">Step One</li>` +
    `<li class="list-group-item">Step Two</li>` +
    `<li class="list-group-item">Step Three</li>` +
    `</ol>` +
    `<hr>` +
    `<h3>Final Steps:</h3>` +
    `<ol class="finalCheckList list-group list-group-flush">` +
    `<li class="list-group-item">Any last thing to do...</li>` +
    `</ol>` +
    `</div>`;
}
