import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Sua Home antiga
import Login from './pages/Login'; // O Login novo com Firebase
import Dashboard from './pages/Dashboard'; // O Dashboard novo
import PrivateRoute from './components/PrivateRoute'; // A proteção que criamos
import AdminDashboard from './pages/Dashboard_Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin" element={<AdminDashboard /> } />
      </Routes>
    </Router>
  );
}

export default App;