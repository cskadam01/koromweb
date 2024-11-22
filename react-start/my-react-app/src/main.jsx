import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Navbar from "./navbar/navbar.jsx";
import LoginAdmin from './admin/loginAdmin.jsx';


import Admin from './admin/admin.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    
    <App/>
    
   
    
  </StrictMode>,
)
