import { Link } from 'react-router-dom';
import pokeball from '../../assets/images/pokeball-icon.png';

const NavBar = () => {
  return (
    <nav className="bg-orange-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-white text-xl font-bold"
            >
              <img 
                src={pokeball} 
                alt="Pokeball" 
                className="w-12 h-12 object-contain p-1 filter brightness-0 invert"
              />
              <span>Pokemon Teams</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/pokedex" 
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Pokedex
            </Link>
            <Link 
              to="/teams" 
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Teams
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;