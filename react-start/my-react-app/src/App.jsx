import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from "./AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import RedirectIfAuthenticated from './redict';
import Fooldal from "./fooldal/fooldal";
import Galleria from './galleria/galleria';
import Kepzes from './kepzes/kepzes';
import Layout from './Layout';
import AdminWrapper from './AdminWrapper'; // ✅ MINDEN ROUTE KÖRÉ!

import LoginAdmin from './admin/loginAdmin';
import ProtectedRoute from './protectedRoute';
import Admin from './admin/admin'
import Megerosites from './admin/admin_sites/megerosites/megerosites'
import Naptar from './admin/admin_sites/naptar/naptar'
import Idopontok from './admin/admin_sites/idopontok/idopontok';
import Aszf from './asf';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <AdminWrapper> {/* ✅ Most már minden oldal körül van! */}
            <Routes>
                <Route element={<Layout />}>
                    {/* Nyitott oldalak */}
                    <Route path='/' element={<Fooldal />} />
                    <Route path='/galleria' element={<Galleria />} />
                    <Route path='/kepzes' element={<Kepzes />} />
                    <Route path='/aszf' element={<Aszf />} />

                    {/* Bejelentkezési oldal */}
                    <Route
                        path='/loginAdmin'
                        element={
                            <RedirectIfAuthenticated>
                                <LoginAdmin />
                            </RedirectIfAuthenticated>
                        }
                    />

                    {/* Admin oldalak */}
                    <Route
                        path='/admin/*'
                        element={
                            <ProtectedRoute>
                                <Routes>
                                    <Route path="" element={<Admin />} />
                                    <Route path="megerosites" element={<Megerosites />} />
                                    <Route path="naptar" element={<Naptar />} />
                                    <Route path="idopontok" element={<Idopontok />} />
                                </Routes>
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </AdminWrapper> 
    );
}

export default App;
