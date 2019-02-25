var fs = require('fs');
var Typeform = require('@typeform/api-client');
const credentials = require('./credentials.json');
var typeformAPI = Typeform.createClient({
  token: credentials.key
});

let page = 1;
let totalPages = 21;
let forms = [];
// 15th Aug'18 until 31st Dec'18
let formsInRange = [];
let formIds = [];
function getAllForms(callback) {
  if (page < totalPages) {
    typeformAPI.forms.list({ page: page, pageSize: 100, search: '' }).then(function(response) {
      console.log(page);
      //   console.log(response);
      response.items.forEach(item => {
        forms.push(item);
      });
      getAllForms(callback);
      page++;
    });
  } else {
    callback();
  }
}

startDate = new Date('2018-08-15T08:00:00+00:00');
endDate = new Date('2018-12-31T23:00:00+00:00');

getAllForms(function() {
  forms.forEach(form => {
    let formDate = new Date(form.last_updated_at);
    if (formDate > startDate && formDate < endDate) {
      formsInRange.push(form.id);
    }
  });

  let set = new Set(formsInRange);
  let arrayFromSet = Array.from(set);
  formIds = arrayFromSet;

  writeScript();
});

function writeScript() {
  var stream = fs.createWriteStream('iMacrosScript.txt');
  stream.once('open', function(fd) {
    let before = `
    SET !ERRORIGNORE YES
    VERSION BUILD=12.5.2018.1105\n `;
    stream.write(before);
    formIds.forEach(id => {
      let code = `  
      URL GOTO = https://admin.typeform.com/form/${id}/results#responses
      TAG POS=1 TYPE=BUTTON:SUBMIT ATTR=TXT:"Download all responses"
      TAG POS=1 TYPE=DIV ATTR=CLASS:"RadioBox-sc-1dpnbb5-0 eLzjUp"
      ONDOWNLOAD FOLDER=* FILE=* WAIT=YES
      TAG POS=1 TYPE=BUTTON:SUBMIT ATTR=TXT:Download\n`;
      //   ONDOWNLOAD FOLDER=C:\\Users\\UT04\\Downloads\\responses FILE=* WAIT=YES
      
      // URL GOTO = https://admin.typeform.com/form/${id}/results#responses
      // TAG POS=7 TYPE=DIV ATTR=TXT:Download<SP>all<SP>responses
      // TAG POS=1 TYPE=DIV ATTR=TXT:XLSX<SP>file
      // TAG POS=3 TYPE=DIV ATTR=TXT:Download
      // ONDOWNLOAD FOLDER = C:\\Users\\UT04\\Downloads\\responses FILE=* WAIT=YES\n`;
      stream.write(code);
    });
    // let after = 'SET !ERRORIGNORE NO';
    // stream.write(after);
    stream.end();
  });
}
