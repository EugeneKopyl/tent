import './App.scss';
import { Route, Routes } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import {
  AboutPage,
  ContactsPage,
  HomePage,
  PartsPage,
  WorksPage,
  ServicesPage,
} from '../../components';

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/parts" element={<PartsPage />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Routes>
    </div>
  );
}

export default App;
