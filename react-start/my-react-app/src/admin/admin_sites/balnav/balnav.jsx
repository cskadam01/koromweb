import { Link } from "react-router-dom";
import './balnav.css';


function AdminNav() {
    return(
        <div className="admin-nav">
           <Link to="/arak" className="admin-link">
           <li className="admin-li">Árak</li>
           </Link>
           <Link to="/megerosites" className="admin-link">
           <li className="admin-li">Megerősítés</li>
           </Link>
           <Link to="/naptar" className="admin-link">
           <li className="admin-li">Naptár</li>
           </Link>
           
                      
         
          

        </div>

    )


}

export default AdminNav