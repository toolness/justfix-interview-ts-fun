const lambda = require('./lambda.bundle');

console.log('executing handler...');

lambda.handler({}, {}).then(response => {
  console.log(response.toString());
}).catch(e => {
  console.log(e);
  process.exit(1);
});
