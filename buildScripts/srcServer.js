const express = require('express');
const docusign = require('docusign-esign');
const path = require('path');
const open = require('open');
const chalk = require('chalk');
// const webpack = require('webpack');
// const config = require('../webpack.config.dev');
const apiClient = new docusign.ApiClient();
// instantiate a new EnvelopesApi object
const envelopesApi = new docusign.EnvelopesApi();

const port = 3000;
var app = express();
// const compiler = webpack(config);

// for Docusign
const integratorKey = '7d798ff6-a2c7-4836-b786-3a43394d74b9';
const clientSecret = 'd53241b0-f3aa-4d0c-812b-1a81fe0486b1';
const redirectUri = 'http://localhost:3000/auth';
const basePath = 'https://demo.docusign.net/restapi';
const accountId = '6313838';
const envelopeId = '05b63209-c481-46be-bc69-0999e0d73b70';

const responseType = apiClient.OAuth.ResponseType.CODE; // Response type of code, to be used for the Auth code grant
const scopes = [apiClient.OAuth.Scope.EXTENDED];
const randomState = "*^.$DGj*)+}Jk"; // after successful login you should compare the value of URI decoded "state" query param with the one created here. They should match
 
apiClient.setBasePath(basePath);

// app.use(require('webpack-dev-middleware')(compiler, {
//   noInfo: true,
//   publicPath: config.output.publicPath
// }));

// call the getEnvelope() API
envelopesApi.getEnvelope(accountId, envelopeId, null, function (error, env, response) {
  if (error) {
    console.log('Error: ' + error);
    return;
  }

  if (env) {
    console.log('Envelope: ' + JSON.stringify(env));
  }
  return env;
});

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.get('/docusign', function(req, res){
  const authUri = apiClient.getAuthorizationUri(integratorKey, scopes, redirectUri, responseType, randomState);//get DocuSign OAuth authorization url
  //Open DocuSign OAuth login in a browser, res being your node.js response object.
  res.redirect(authUri);
});

app.get('/auth', function (req, res) {
  // IMPORTANT: after the login, DocuSign will send back a fresh
  // authorization code as a query param of the redirect URI.
  // You should set up a route that handles the redirect call to get
  // that code and pass it to token endpoint as shown in the next
  // lines:
  apiClient.generateAccessToken(integratorKey, clientSecret, req.query.code, function (err, oAuthToken) {
    
    console.log(oAuthToken);
    
    //IMPORTANT: In order to access the other api families, you will need to add this auth header to your apiClient.
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + oAuthToken.accessToken);
 
    apiClient.getUserInfo(oAuthToken.accessToken, function (err, userInfo) {
      console.log("UserInfo: " + userInfo);
      // parse first account's baseUrl
      // below code required for production, no effect in demo (same
      // domain)
      apiClient.setBasePath(userInfo.accounts[0].baseUri + "/restapi");
      res.send(userInfo);
    });
  });
});

app.listen(port, function(err){
  if (err) {
      console.log(err);
  } else {
      open('http://localhost:' + port);
  }
});

console.log('Running on port 3000');