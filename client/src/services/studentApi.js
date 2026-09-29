const API_URL = '/api/students';

async function request(path = '', options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Could not reach the server. Check that the API is running.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'The request could not be completed.');
  }
  return result;
}

export const studentApi = {
  list: () => request(),
  get: (id) => request(`/${encodeURIComponent(id)}`),
  create: (student) => request('', { method: 'POST', body: JSON.stringify(student) }),
  update: (id, student) => request(`/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(student),
  }),
  remove: (id) => request(`/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};