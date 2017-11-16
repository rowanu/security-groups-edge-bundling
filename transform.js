var _ = require('lodash');

var transformPromise = function (data) {
  var promise = new Promise(function (resolve, rejct) {
    var securityGroups = data.SecurityGroups;
    // console.dir(securityGroups);
    resolve(_(securityGroups)
      .map(function (sg) {
        var ingress = sg.IpPermissions.map(function (i) {
          var name;
          if (i.UserIdGroupPairs.length > 0) {
            var name = _.find(securityGroups, _.matchesProperty('GroupId', i.UserIdGroupPairs[0].GroupId));
            name = name.GroupName;
          } else {
            name = i.IpRanges[0].CidrIp;
          }
          return {
            name: name,
            protocol: i.IpProtocol,
            fromPort: i.FromPort
          };
        });

        return {
          name: sg.GroupName,
          id: sg.GroupId,
          ingress: ingress
        };
      })
      .value());
  });
  return promise;
};

module.exports = transformPromise;
