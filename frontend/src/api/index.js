import client from './client';

// ---- Auth ----
export const authApi = {
  register: (payload) => client.post('/auth/register/', payload),
  login: (payload) => client.post('/auth/token/', payload),
};

// ---- Pets ----
export const petsApi = {
  list: () => client.get('/pets/'),
  get: (id) => client.get(`/pets/${id}/`),
  create: (data) => client.post('/pets/', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  }),
  update: (id, data) => client.patch(`/pets/${id}/`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  }),
  remove: (id) => client.delete(`/pets/${id}/`),
};

// ---- Vet Visits ----
export const vetVisitsApi = {
  list: (petId) => client.get('/vet-visits/', { params: petId ? { pet: petId } : {} }),
  create: (data) => client.post('/vet-visits/', data),
  update: (id, data) => client.patch(`/vet-visits/${id}/`, data),
  remove: (id) => client.delete(`/vet-visits/${id}/`),
};

// ---- Vaccinations ----
export const vaccinationsApi = {
  list: (petId) => client.get('/vaccinations/', { params: petId ? { pet: petId } : {} }),
  create: (data) => client.post('/vaccinations/', data),
  update: (id, data) => client.patch(`/vaccinations/${id}/`, data),
  remove: (id) => client.delete(`/vaccinations/${id}/`),
};

// ---- Medications ----
export const medicationsApi = {
  list: (petId) => client.get('/medications/', { params: petId ? { pet: petId } : {} }),
  create: (data) => client.post('/medications/', data),
  update: (id, data) => client.patch(`/medications/${id}/`, data),
  remove: (id) => client.delete(`/medications/${id}/`),
};

// ---- Weight Records ----
export const weightApi = {
  list: (petId) => client.get('/weight-records/', { params: petId ? { pet: petId } : {} }),
  create: (data) => client.post('/weight-records/', data),
  remove: (id) => client.delete(`/weight-records/${id}/`),
};

// ---- Documents ----
export const documentsApi = {
  list: (petId) => client.get('/documents/', { params: petId ? { pet: petId } : {} }),
  create: (data) => client.post('/documents/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  remove: (id) => client.delete(`/documents/${id}/`),
};

// ---- Caregivers ----
export const caregiversApi = {
  list: () => client.get('/caregivers/'),
  create: (data) => client.post('/caregivers/', data),
  remove: (id) => client.delete(`/caregivers/${id}/`),
};

// ---- Community ----
export const communityApi = {
  listPosts: (query) => client.get('/community/posts/', { params: query ? { search: query } : {} }),
  getPost: (id) => client.get(`/community/posts/${id}/`),
  createPost: (data) => client.post('/community/posts/', data),
  removePost: (id) => client.delete(`/community/posts/${id}/`),
  createComment: (data) => client.post('/community/comments/', data),
  removeComment: (id) => client.delete(`/community/comments/${id}/`),
};

// ---- Reminders ----
export const remindersApi = {
  get: (days = 14) => client.get('/reminders/', { params: { days } }),
};
