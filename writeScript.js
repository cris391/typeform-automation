//post-run: run iMacros Internet Explorer on Windows

var fs = require('fs');
var Typeform = require('typeform-node-api');
var credentials = require('./credentials.json');
console.log(credentials.firstName);

var typeform_api = new Typeform('');

let formIds = [];

// get form ids from api
typeform_api.getForms(function (data) {
  data.forEach(form => {
    formIds.push(form.id);
  });
  writeScript()
});

function writeScript() {
  var stream = fs.createWriteStream("iMacrosScript.txt");
  stream.once('open', function (fd) {
    let before = `
  SET !ERRORIGNORE YES
  VERSION BUILD=1003 RECORDER=CR\n `;
    stream.write(before);
    formIds.forEach(id => {
      let code = `
  URL GOTO = https://admin.typeform.com/form/${id}/results#responses
  TAG POS=7 TYPE=DIV ATTR=TXT:Download<SP>all<SP>responses
  TAG POS=1 TYPE=DIV ATTR=TXT:XLSX<SP>file
  TAG POS=3 TYPE=DIV ATTR=TXT:Download
  ONDOWNLOAD FOLDER = C:\\Users\\UT17\\Downloads\\responses FILE=* WAIT=YES\n`
      stream.write(code);
    });
    // let after = 'SET !ERRORIGNORE NO';
    // stream.write(after);
    stream.end();
  });
}