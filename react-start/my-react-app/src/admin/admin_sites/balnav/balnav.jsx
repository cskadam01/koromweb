import { Link } from "react-router-dom";
import './balnav.css';


function AdminNav() {
    return(
        <div className="admin-nav">
           
           <Link to="/admin/megerosites" className="admin-link">
           <li className="admin-li">Foglalások Megerősítés</li>
           </Link>
           <Link to="/admin/naptar" className="admin-link">
           <li className="admin-li">Képzés Hozzáadás</li>
           </Link>
           <Link to="/admin/idopontok" className="admin-link">
           <li className="admin-li">Idopontok Létrehozása</li>
           </Link>
           
                      
         
          

        </div>

    )


}

export default AdminNav