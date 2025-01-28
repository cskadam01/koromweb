import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from "./AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

import Fooldal from "./fooldal/fooldal";
import Galleria from './galleria/galleria';
import Kepzes from './kepzes/kepzes';
import Layout from './Layout';
import LoginAdmin from './admin/loginAdmin';
import Admin from './admin/admin';
import Megerosites from './admin/admin_sites/megerosites/megerosites';
import Idopontok from './admin/admin_sites/idopontok/idopontok';
import AdminWrapper from './AdminWrapper';
import ProtectedRoute from './protectedRoute';
import RedirectIfAuthenticated from './redict';
import Szalon from './szalon/szalon';
import Naptar from './szalon/szalon';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <AdminWrapper> {/* Wrapper az egész alkalmazás köré */}
                <Routes>
                    <Route element={<Layout />}>
                        {/* Nyitott oldalak */}
                        <Route path='/' element={<Fooldal />} />
                        <Route path='/galleria' element={<Galleria />} />
                        <Route path='/kepzes' element={<Kepzes />} />
                        <Route path='/szalon' element={<Szalon />} />
                        

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
                                        <Route path="idopontok" element={<Idopontok />} />
                                        
                                        
                                    </Routes>
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Routes>
            </AdminWrapper>
        </Router>
    );
}

export default App;
