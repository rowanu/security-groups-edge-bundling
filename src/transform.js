const ingressName = (i, sgs) => {
  var name
  if (i.UserIdGroupPairs.length > 0) {
    const sg = sgs.find((s) => (s.GroupId === i.UserIdGroupPairs[0].GroupId))
    name = sg.GroupName
  } else {
    name = i.IpRanges[0].CidrIp
  }
  return {
    name: name,
    protocol: i.IpProtocol,
    fromPort: i.FromPort || '-1'
  };
}

const ingressRule = (sg, sgs) => {
  return sg.IpPermissions.map((i) => ingressName(i, sgs))
}

const sgMapper = (sg, index, sgs) => {
  const ingress = ingressRule(sg, sgs)
  return {
    name: sg.GroupName,
    id: sg.GroupId,
    ingress: ingress
  };
}

const transform = (sgs) => {
  return sgs.map(sgMapper)
}

module.exports = transform
