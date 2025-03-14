import './App.css';
// React Query imports for data fetching and caching
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// Router imports for navigation
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Component imports
import NavBar from './components/layout/NavBar';
import { Home } from './pages/Home';
import { Pokedex } from './pages/Pokedex';
import { Teams } from './pages/Teams';
import { TeamDetails } from './pages/TeamDetails';
import { NotFound } from './pages/NotFound';

// Configure React Query client with default settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable automatic refetching when window regains focus
      retry: 1, // Only retry failed requests once
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes before refetching
    },
  },
});

function App() {
  return (
    // Provide React Query context to entire app
    <QueryClientProvider client={queryClient}>
      {/* Router setup with public URL basename for GitHub Pages compatibility */}
      <Router basename={process.env.PUBLIC_URL}>
        <div className="min-h-screen bg-gray-100">
          {/* Global navigation */}
          <NavBar />
          {/* Main content area with responsive padding */}
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Route definitions */}
              <Route path="/" element={<Home />} />
              <Route path="/pokedex" element={<Pokedex />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
      {/* Development tools for React Query (only visible in development) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;