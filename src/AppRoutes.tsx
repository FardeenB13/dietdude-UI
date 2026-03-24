// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './homepage';
import Login from './authorization/Login';
import SignUp from './authorization/SignUp';
import Preferences from './Preferences';
import Dashboard from './Dashboard';


const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path ="/login" element = {<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Preferences" element={<Preferences />} />
        <Route path="/Dashboard" element={<Dashboard />} />
    </Routes>
);

export default AppRoutes;
