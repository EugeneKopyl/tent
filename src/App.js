import './App.scss';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import {
  AboutPage,
  ContactsPage,
  HomePage,
  PartsPage,
  WorksPage,
  ServicesPage,
} from './pages';
import { ErrorPage } from './pages/ErrorPage';

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/parts" element={<PartsPage />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
