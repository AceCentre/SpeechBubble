
function handleError(res, err) {
  console.warn(err);
  return res.send(500, 'Internal error');
}

function intFromQuery (value, default_value) {
  var v = parseInt(value) || default_value
  if (isNaN(v)) {
    return default_value
  }
  return v
}

module.exports = { handleError, intFromQuery };
