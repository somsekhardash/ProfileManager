import {
    useNavigate,
    useLocation
  } from "react-router-dom";
  import { useAuth } from './Layout';

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation() as any;
    const auth = useAuth();
  
    const from = location.state?.from?.pathname || "/";
  
    return (
      <div>
        <p>You must log in to view the page at {from}</p>
      </div>
    );
  }

  export {LoginPage};