// id of Google Spreadsheet the app talks to, APIkey set in Google acct
const spreadsheetId = "1AudUWvTp05gBt8vv07yCLbwZOEL93L55oBZWz_5ez5I";

// variable to store JWT so we can make it persist across app reloads
let jWT;

// variables that change values as we work with donations
let sheetName;
let todaysSheetId;
let textToWrite;
let currentMember;

// variables for working with the date, name of today's sheet
let currentDate = new Date();
let cDay = currentDate.getDate();
let cMonth = currentDate.getMonth() + 1;
let cYear = currentDate.getFullYear();

// store the month names in the format app uses
// TODO: does JS use Enums?
const months = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

// categories corresponding to columns in G Sheet
// these will be moved to the Model Sheet later
// app will read column names from Model Sheet on startup, and will load these as the categories[]
const categories = [];
const category1Check = ["category1Check", "Category 1 Check", "B"];
const category1Cash = ["category1Cash", "Category 1 Cash", "C"];
const category2Check = ["category2Check", "Category 2 Check", "D"];
const category2Cash = ["category2Cash", "Category 2 Cash", "E"];
const category3Check = ["category3Check", "Category 3 Check", "F"];
const category3Cash = ["category3Cash", "Category 3 Cash", "G"];
const category4Check = ["category4Check", "Category 4 Check", "H"];
const category4Cash = ["category4Cash", "Category 4 Cash", "I"];
const category5Check = ["category5Check", "Category 5 Check", "J"];
const category5Cash = ["category5Cash", "Category 5 Cash", "K"];
const category6Check = ["category6Check", "Category 6 Check", "L"];
const category6Cash = ["category6Cash", "Category 6 Cash", "M"];
const category7Check = ["category7Check", "Category 7 Check", "N"];
const category7Cash = ["category7Cash", "Category 7 Cash", "O"];
const category8Check = ["category8Check", "Category 8 Check", "P"];
const category8Cash = ["category8Cash", "Category 8 Cash", "Q"];
const category9Check = ["category9Check", "Category 9 Check", "R"];
const category9Cash = ["category9Cash", "Category 9 Cash", "S"];
const category10Check = ["category10Check", "Category 10 Check", "T"];
const category10Cash = ["category10Cash", "Category 10 Cash", "U"];

categories.push(
  category1Check,
  category1Cash,
  category2Check,
  category2Cash,
  category3Check,
  category3Cash,
  category4Check,
  category4Cash,
  category5Check,
  category5Cash,
  category6Check,
  category6Cash,
  category7Check,
  category7Cash,
  category8Check,
  category8Cash,
  category9Check,
  category9Cash,
  category10Check,
  category10Cash
);

// array of names to refer to columns in G Sheet
// TODO:  there must be a better way to handle this!
const columns = [
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
];

// define the Member class
class Member {
  constructor(memberNumber, names) {
    this.memberNumber = memberNumber;
    this.rowNumber = parseInt(memberNumber) + 5;
    // names is an array whose first index is display name, 2nd index is the family name, following indices are given names & other names associated with this member
    this.names = names;
  }
}

// function to create [] of members, after member data is read from Members sheet
let members = [];
function createMembers(arrayOfMembers) {
  for (let i = 0; i < arrayOfMembers.length; i++) {
    const thisMembersNames = arrayOfMembers[i].slice(1);
    const nextMember = new Member(arrayOfMembers[i][0], thisMembersNames);
    members.push(nextMember);
  }
}

// opens Google Sheet in new tab, showing today's sheet
const goToGoogle = document.getElementById("goToGoogleSheet");
goToGoogle.addEventListener("click", function () {
  window.open(
    `https://docs.google.com/spreadsheets/d/1AudUWvTp05gBt8vv07yCLbwZOEL93L55oBZWz_5ez5I/edit#gid=${todaysSheetId}`,
    "tab"
  );
});

// function called when we make any API call for 2nd time
// to check whether first time worked, if it did we throw a custom error
// so we can skip the .then blocks
function throwSomething(doneValue, nameOfFunction) {
  if (doneValue) {
    throw new Error(
      `Stopping execution of ${nameOfFunction}; we've already done this.`
    );
  }
}
