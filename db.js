var admin = require("firebase-admin");

var serviceAccount = require("./t-trio-firebase-adminsdk-ry02r-2c2df60460.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
