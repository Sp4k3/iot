const { parseISO } = require('date-fns/fp')

function getJSDateFromUtcIso (dateUtcIso) {
  return parseISO(dateUtcIso)
}

module.exports = {
  getJSDateFromUtcIso,
}
