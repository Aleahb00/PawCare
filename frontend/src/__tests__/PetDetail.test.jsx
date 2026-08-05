import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { makeFakeJwt } from './helpers';

const samplePet = {
  id: 1,
  owner: { id: 1, username: 'tester2', first_name: 'Test', last_name: 'User', email: 't@example.com' },
  image: null,
  name: 'Bubba',
  species: 'Dog',
  breed: 'Lab',
  age: null,
  allergies: null,
  personality: null,
  daily_routine: null,
  care_instructions: null,
  created_at: '2026-08-05T17:12:04.963389-05:00',
  my_permission: 'owner',
};

vi.mock('../api', () => ({
  petsApi: {
    get: vi.fn(() => Promise.resolve({ data: samplePet })),
    list: vi.fn(() => Promise.resolve({ data: { results: [samplePet] } })),
    remove: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  vetVisitsApi: { list: vi.fn(() => Promise.resolve({ data: { results: [] } })) },
  vaccinationsApi: { list: vi.fn(() => Promise.resolve({ data: { results: [] } })) },
  medicationsApi: { list: vi.fn(() => Promise.resolve({ data: { results: [] } })) },
  weightApi: { list: vi.fn(() => Promise.resolve({ data: { results: [] } })) },
  documentsApi: { list: vi.fn(() => Promise.resolve({ data: { results: [] } })) },
  caregiversApi: { list: vi.fn(() => Promise.resolve({ data: { results: [] } })) },
}));

import PetDetail from '../pages/PetDetail';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => {
  const token = makeFakeJwt({ user_id: 1, username: 'tester2', exp: Math.floor(Date.now() / 1000) + 3600 });
  localStorage.setItem('pawcare_access', token);
  localStorage.setItem('pawcare_refresh', 'refresh-token');
});

describe('PetDetail', () => {
  it('renders pet name and species after loading', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/pets/1']}>
          <Routes>
            <Route path="/pets/:petId" element={<PetDetail />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Bubba')).toBeTruthy();
    });
    expect(screen.getByText(/Dog/)).toBeTruthy();
  });
});
