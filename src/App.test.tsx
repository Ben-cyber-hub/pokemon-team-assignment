import { render, screen } from './utils/test-utils';
import App from './App';

// Mock react-query-devtools
jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null
}));

describe('App', () => {
  it('renders without crashing', async () => {
    render(<App />, { withRouter: false });
    expect(document.querySelector('main')).toBeInTheDocument();
  });
});