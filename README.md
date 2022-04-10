# donation-tracker-public

This is a web app built to track donations.

It uses Google Sheets as its backend.

To use:  set up your own Google Sheets spreadsheet.
After forking this project, open main.js and replace the variable spreadsheetId with the id of your spreadsheet.

Go to console.cloud.google.com and set up a project.  
Copy the API key for your project, and paste it into a file with the line:
const apiKey = "[paste API key here]";

Alternatively, you can paste the line above into the main.js file, and delete the <script> tag in index.html that loads apiKey.js.
  
The app checks your Sheets spreadsheet at startup to see if there is a sheet named with today's date.  If it doesn't find one, it creates one.
  
Data is entered only into the sheet named with today's date.
  
  Date can be entered for various memebers (create the members in the main.js file), and entered for various categories.
  
  Totals entered are updated automatically in the app.
  
  The final screen (page5.js) can hold any instructions that need to be carried out at the end of the recording process.
