import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NavBar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/" className="flex items-center text-white hover:text-orange-200">
              Home
            </Link>
            <Link to="/pokedex" className="flex items-center text-white hover:text-orange-200">
              Pokédex
            </Link>
            {user && (
              <Link to="/teams" className="flex items-center text-white hover:text-orange-200">
                My Teams
              </Link>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium text-orange-600 bg-white rounded-md hover:bg-orange-50"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-orange-600 bg-white rounded-md hover:bg-orange-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
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