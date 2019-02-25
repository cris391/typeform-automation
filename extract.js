var fs = require('fs');
var Typeform = require('@typeform/api-client');
const credentials = require('./credentials.json');
var typeformAPI = Typeform.createClient({
  token: credentials.key
});

let page = 1;
let totalPages = 22;
// let totalPages = 2;
let forms = [];
let formsInRange = [];
let formIds = [];
function getAllForms(callback) {
  if (page < totalPages) {
    typeformAPI.forms.list({ page: page, pageSize: 100, search: '' }).then(function(response) {
      // if(totalPages != response.page_count){
        // totalPages = response.page_count;
      // }
      console.log(page);
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

// 15th Aug'18 until 31st Dec'18
startDate = new Date('2019-01-1T08:00:00+00:00');
endDate = new Date('2019-02-24T23:00:00+00:00');

getAllForms(function() {
  var fs = require('fs');
fs.writeFile("forms.json", forms, function(err) {
    if (err) {
        console.log(err);
    }
});
  
  forms.forEach(form => {
    let formDate = new Date(form.last_updated_at);
    if (formDate > startDate && formDate < endDate) {
      formsInRange.push(form.id);
      console.log(formDate)
    }
  });
  
  let set = new Set(formsInRange);
  let arrayFromSet = Array.from(set);
  formIds = arrayFromSet;
  
  console.log('formIds length', formIds.length);
  writeScript();
});

function writeScript() {
  
  var stream = fs.createWriteStream('kantu.txt');
  stream.once('open', function(fd) {
    let before = `{
      "Name": "Typeforms",
      "CreationDate": "2019-1-8",
      "Commands": [`;
    stream.write(before);
    formIds.forEach(id => {
      let code = `  
      {
        "Command": "store",
        "Target": "true",
        "Value": "!errorignore"
      },
      {
        "Command": "open",
        "Target": "https://admin.typeform.com/form/${id}/results#responses",
        "Value": ""
      },
      {
        "Command": "click",
        "Target": "//*[@id=\\"root\\"]/div/div[3]/div/div/div[1]/div/div[3]/div/div/div/div/button/div/span",
        "Value": ""
      },
      {
        "Command": "click",
        "Target": "//*[@id=\\"root\\"]/div/div[1]/div/div[2]/div/div/div/div/span/div/div/div[3]/div[2]/div[1]/span[1]",
        "Value": ""
      },
      {
        "Command": "click",
        "Target": "//*[@id=\\"root\\"]/div/div[1]/div/div[2]/div/div/div/div/div[2]/button/div/span",
        "Value": ""
      },`;
      stream.write(code);
    });
    let after = `]
  }`;
    stream.write(after);
    stream.end();
  });
}
