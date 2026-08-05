import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { makeFakeJwt } from './helpers';

const samplePost = {
  id: 1,
  author: { id: 1, username: 'tester2', first_name: 'Test', last_name: 'User', email: 't@example.com' },
  title: 'Hello',
  content: 'World',
  created_at: '2026-08-05T17:12:05.012318-05:00',
  upvotes_count: 0,
  comments: [],
  comment_count: 0,
};

vi.mock('../api', () => ({
  communityApi: {
    getPost: vi.fn(() => Promise.resolve({ data: samplePost })),
    createComment: vi.fn(),
    removePost: vi.fn(),
    removeComment: vi.fn(),
  },
}));

import PostDetail from '../pages/PostDetail';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => {
  const token = makeFakeJwt({ user_id: 1, username: 'tester2', exp: Math.floor(Date.now() / 1000) + 3600 });
  localStorage.setItem('pawcare_access', token);
  localStorage.setItem('pawcare_refresh', 'refresh-token');
});

describe('PostDetail', () => {
  it('renders post title and content after loading', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/community/1']}>
          <Routes>
            <Route path="/community/:postId" element={<PostDetail />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeTruthy();
    });
    expect(screen.getByText('World')).toBeTruthy();
  });
});
