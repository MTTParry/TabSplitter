import { render, screen, cleanup } from '@testing-library/react';
import App from './App';

// telling the "fake browser" to refresh, 
// otherwise each call to `render` makes a new `<App>` on screen
afterEach(cleanup)

it('rendered on screen', () => {
  render(<App />);
  const element = screen.getByTestId("app")
  expect(element).toBeInTheDocument();
});
