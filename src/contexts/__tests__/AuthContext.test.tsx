import { renderHook } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'
import { createMockUser } from '../../utils/test-utils'

const createWrapper = (initialUser: any | null = null) => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    const createElement = require('react').createElement;
    return createElement(AuthProvider, { initialUser }, children);
  };
};

describe('AuthContext', () => {
  it('provides expected auth properties', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current).toHaveProperty('user')
    expect(result.current).toHaveProperty('isAuthenticated')
    expect(result.current).toHaveProperty('loading')
    expect(result.current).toHaveProperty('signIn')
    expect(result.current).toHaveProperty('signUp')
    expect(result.current).toHaveProperty('signOut')
  })

  it('handles initialUser correctly', () => {
    const mockUser = createMockUser()
    const wrapper = createWrapper(mockUser);
    
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.user).toBeTruthy()
  })
})