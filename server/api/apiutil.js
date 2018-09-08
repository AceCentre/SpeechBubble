
function handleError(res, err) {
  console.warn(err);
  return res.send(500, 'Internal error');
}

module.exports = { handleError };
