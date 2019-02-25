var fs = require('fs');
var Typeform = require('@typeform/api-client');
const credentials = require('./credentials.json');
var typeformAPI = Typeform.createClient({
  token: credentials.key
});
// typeformAPI.workspaces.list({ page: pageNo, pageSize: 100 }).then(response => {
// console.log(response);
// });

// typeformAPI.workspaces.get({ id: '10193092' }).then(response => {
//   console.log(response);
// });

// typeformAPI.forms.get({ uid: 'pksKEi' }).then(response => {
//   console.log(response);
// });

let pageNo = 1;
let formIds = [];
// set to Product Development workspace
function getAllForms(callback) {
  typeformAPI.forms.list({ page: pageNo, pageSize: 100, workspaceId: '10193092' }).then(function(response) {
    const pageCount = response.page_count;
    
    console.log('page:', pageNo);
    response.items.forEach(form => {
      formIds.push(form.id);
    });

    if (pageNo < pageCount) {
      // jump to next page
      pageNo++;
      getAllForms(callback);
    } else {
      callback();
    }
  });
}

getAllForms(function() {
  console.log('formIds:', formIds);
  // forms.forEach(formID => {
  //   updateForm(formID);
  // });
});

const forms = ['pksKEi', 'K3SbCH'];
forms.forEach(formID => {
  updateForm(formID);
});

function updateForm(formID) {
  try {
    typeformAPI.forms
      .update({
        uid: formID,
        data: [
          {
            op: 'replace',
            path: '/settings/is_public',
            value: true
          }
        ]
      })
      .then(response => {
        console.log(done);
      });
  } catch (error) {
    console.log(error);
  }
}
