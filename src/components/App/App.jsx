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
import { ErrorPage } from '../ErrorPage/ErrorPage';

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
