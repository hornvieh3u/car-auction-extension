const isEmail = email => {
  return !(email.indexOf('@') === -1 || email.indexOf('.') === -1)
}

const isEmpty = value => {
  return  value === '' ||
          value === null ||
          value === undefined ||
          value === 0 ||
          ( value.isArray && value.length === 0 ) ||
          ( typeof value === 'object' && Object.keys(value).length === 0 )
}

const isIp = ip => {
  return ip.split('.').length === 4
}

export { isEmpty, isEmail, isIp };