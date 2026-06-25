import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Select from './pages/Select.jsx';
import Batalha from './pages/Battle.jsx';
import Fim from './pages/Fim.jsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/select" element={<Select />} />
        <Route path="/batalha" element={<Batalha />}/>
        <Route path="/fim" element={<Fim/>}/>
      </Routes>
    </BrowserRouter>
  );
}