import { Link } from "react-router-dom";
import './balnav.css';


function AdminNav() {
    return(
        <div className="admin-nav">
           <Link to="/arak" className="admin-link">
           <li className="admin-li">Árak</li>
           </Link>
           <Link to="/admin/megerosites" className="admin-link">
           <li className="admin-li">Megerősítés</li>
           </Link>
           <Link to="/admin/naptar" className="admin-link">
           <li className="admin-li">Naptár</li>
           </Link>
           <Link to="/admin/idopontok" className="admin-link">
           <li className="admin-li">Idopontok</li>
           </Link>
           
                      
         
          

        </div>

    )


}

export default AdminNav