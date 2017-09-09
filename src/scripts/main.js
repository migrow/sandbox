require('!style-loader!css-loader!sass-loader!../assets/stylesheets/style.scss');

// TODO: Require assets here.
// require('../assets/images/product.png');
require('!style-loader!css-loader!codemirror/lib/codemirror.css');
require('!style-loader!css-loader!codemirror/addon/lint/lint.css');


import App from './components/App.js';
import React from 'react';
import ReactDOM from 'react-dom';
import CDS_SMART_OBJ from '../smart_authentication.js';
import querystring from 'querystring';
import FhirServerStore from './stores/FhirServerStore';
import $ from 'jquery';

var JWT = require('jsrsasign');

CDS_SMART_OBJ.fetchContext().then(
  () => {
    if (CDS_SMART_OBJ.accessToken &&
      CDS_SMART_OBJ.accessToken.hasOwnProperty('patient')
      && CDS_SMART_OBJ.hasOwnProperty('fhirBaseUrl')) {
      var fhirContext = {};
      fhirContext.patient = CDS_SMART_OBJ.accessToken.patient;
      fhirContext.baseUrl = CDS_SMART_OBJ.fhirBaseUrl;
      fhirContext.user = CDS_SMART_OBJ.smartObj.userId;
      FhirServerStore.setContext(fhirContext);
      $.ajax({
        url: 'https://raw.githubusercontent.com/cds-hooks/sandbox/master/ecprivatekey.pem',
        success: function (data) {
          var payload = JSON.stringify({
            iss: CDS_SMART_OBJ.fhirBaseUrl,
            sub: CDS_SMART_OBJ.smartObj.userId || "Practitioner/example",
            aud: '48163c5e-88b5-4cb3-92d3-23b800caa927',
            exp: Math.round((Date.now() / 1000) + 3600),
            iat: Math.round((Date.now() / 1000)),
          });
          var header = JSON.stringify({
            alg: 'ES256',
            typ: 'JWT'
          });
          CDS_SMART_OBJ.jwt = JWT.jws.JWS.sign(null, header, payload, data);
        }.bind(this)
      });
    }
    ReactDOM.render(<App/>, document.getElementById('react-wrapper'));
  }, () => {
    ReactDOM.render(<App/>, document.getElementById('react-wrapper'));
  }
);
