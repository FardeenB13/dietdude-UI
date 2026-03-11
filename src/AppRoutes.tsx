// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './homepage';



const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<HomePage />} />
    </Routes>
);

export default AppRoutes;
