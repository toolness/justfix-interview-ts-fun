const lambda = require('./lambda.bundle');

console.log('executing handler...');

lambda.handler(null, null, (err, twiml) => {
  if (err) {
    throw err;
  }
  console.log(twiml.toString());
});
