// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const fetch = require('node-fetch');
const URL_DIR = 'https://data.directory.openbankingbrasil.org.br/participants'

exports.datadirectoryproxy = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    fetch(URL_DIR, {
      method: req.method,
      headers: {
        'Content-Type': req.get('Content-Type'),
      },
    })
    .then(r => r.headers.get('content-type') === 'application/json' ? r.json() : r.text())
    .then(body => res.status(200).send(body));
  });
});

