import 'bootstrap/dist/css/bootstrap.min.css';
import Fooldal from "./fooldal/fooldal";
import Login from './login_reg/login';
import Regist from './login_reg/reg';
import Galleria from './galleria/galleria';
import Kepzes from './kepzes/kepzes';
import Szalon from './szalon/szalon';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';





function App() {
  return(

    <>
      
      <Router>
        <Routes>
          <Route element={<Layout/>}>
          <Route path='/' element={<Fooldal/>}/>
          <Route path='/galleria' element={<Galleria/>}/>
          <Route path='/kepzes' element={<Kepzes/>}/>
          <Route path='/szalon' element={<Szalon/>}/>
          <Route path='/reg' element={<Regist/>}/>
          <Route path='/login' element={<Login/>}/>
          </Route>
        </Routes>
      </Router>
      
   
    </>

  );


}

export default App
