import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { makeFakeJwt } from './helpers';

vi.mock('../api', () => ({
  petsApi: {
    get: vi.fn(() => Promise.reject({ response: { status: 404 } })),
  },
  vetVisitsApi: { list: vi.fn() },
  vaccinationsApi: { list: vi.fn() },
  medicationsApi: { list: vi.fn() },
  weightApi: { list: vi.fn() },
  documentsApi: { list: vi.fn() },
  caregiversApi: { list: vi.fn() },
}));

import PetDetail from '../pages/PetDetail';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => {
  const token = makeFakeJwt({ user_id: 1, username: 'tester2', exp: Math.floor(Date.now() / 1000) + 3600 });
  localStorage.setItem('pawcare_access', token);
  localStorage.setItem('pawcare_refresh', 'refresh-token');
});

describe('PetDetail error handling', () => {
  it('shows an error message instead of a blank page when the fetch fails', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/pets/999']}>
          <Routes>
            <Route path="/pets/:petId" element={<PetDetail />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/doesn't exist/i)).toBeTruthy();
    });
  });
});
