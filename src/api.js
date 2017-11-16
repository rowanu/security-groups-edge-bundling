var AWS = require('aws-sdk');

const getData = (credentials) => {
  const ec2 = new AWS.EC2(credentials);
  console.log('Requesting security groups...')
  return ec2.describeSecurityGroups().promise()
    .then((data) => (data.SecurityGroups))
}

module.exports = {
  getData
}
