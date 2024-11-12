import 'bootstrap/dist/css/bootstrap.min.css';
import Fooldal from "./fooldal/fooldal";
import Galleria from './galleria/galleria';
import Kepzes from './kepzes/kepzes';
import Szalon from './szalon/szalon';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Admin from './admin/admin';






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
          
          
         
          </Route>
        </Routes>
      </Router>
      
   
    </>

  );


}

export default App
