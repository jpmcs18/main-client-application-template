import { AuthorizeProvider } from './custom-hooks/authorize-provider';
import Dashboard from './pages/home-page';
import './styles/style.css';
function App() {
  return (
    <AuthorizeProvider>
      <Dashboard />
    </AuthorizeProvider>
  );
}

export default App;
