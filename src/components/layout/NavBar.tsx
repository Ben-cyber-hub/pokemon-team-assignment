import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavLink {
  to: string;
  label: string;
  requiresAuth?: boolean;
}

/**
 * NavBar Component
 * 
 * Main navigation component that displays links and authentication status.
 * Handles responsive navigation and user authentication state.
 */
const NavBar: FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navLinks: NavLink[] = [
    { to: '/', label: 'Home' },
    { to: '/pokedex', label: 'Pokédex' },
    { to: '/teams', label: 'My Teams', requiresAuth: true },
  ];

  return (
    <nav 
      className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-md"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Navigation Links */}
          <div className="flex space-x-8">
            {navLinks.map(({ to, label, requiresAuth }) => (
              (!requiresAuth || user) && (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center text-white hover:text-orange-200 transition-colors"
                  aria-current={location.pathname === to ? 'page' : undefined}
                >
                  {label}
                </Link>
              )
            ))}
          </div>

          {/* Authentication Controls */}
          <div className="flex items-center">
            {user ? (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium text-orange-600 bg-white rounded-md 
                         hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 
                         focus:ring-orange-500 focus:ring-offset-2"
                aria-label="Sign out"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-orange-600 bg-white rounded-md 
                           hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 
                           focus:ring-orange-500 focus:ring-offset-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md 
                           hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 
                           focus:ring-orange-500 focus:ring-offset-2"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;