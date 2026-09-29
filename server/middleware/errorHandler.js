export function notFoundHandler(_request, response) {
  response.status(404).json({ success: false, message: 'API route not found.' });
}

export function errorHandler(error, _request, response, _next) {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'Admission number';
    return response.status(409).json({ success: false, message: `${field} already exists.` });
  }

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    const message = error.name === 'ValidationError'
      ? Object.values(error.errors).map((item) => item.message).join(' ')
      : `Invalid value for ${error.path}.`;
    return response.status(400).json({ success: false, message });
  }

  console.error(error);
  return response.status(error.status || 500).json({
    success: false,
    message: error.status && error.status < 500 ? error.message : 'An unexpected server error occurred.',
  });
}