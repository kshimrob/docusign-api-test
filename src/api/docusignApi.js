const docusign = require('docusign-esign');

/****** CREATE ENVELOPE RECIPIENT VIEW ******/
// instantiate a new EnvelopesApi object
var envelopesApi = new docusign.EnvelopesApi();

// set the url where you want the recipient to go once they are done signing
// should typically be a callback route somewhere in your app
var viewRequest = new docusign.RecipientViewRequest();
viewRequest.returnUrl = '/';
viewRequest.authenticationMethod = 'email';

// recipient information must match embedded recipient info we provided in step #2
viewRequest.email = 'kelly@workwithdomino.com';
viewRequest.userName = '{USER_NAME}';
viewRequest.recipientId = '1';
viewRequest.clientUserId = '1001';

// call the CreateRecipientView API
envelopesApi.createRecipientView(accountId, envelopeId, {'recipientViewRequest': viewRequest}, function (error, recipientView, response) {
  if (error) {
    console.log('Error: ' + error);
    return;
  }

  if (recipientView) {
    console.log('ViewUrl: ' + JSON.stringify(recipientView));
  }
  return JSON.stringify(recipientView);
});