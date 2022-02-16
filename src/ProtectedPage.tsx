import AdminPage from './AdminPage';
import FormExampleFieldControlId from './ApplicationForm';
import { useAuth } from './Layout';

function ProtectedPage(): any {
    const auth = useAuth();
    const { user, userid, auth_role } = auth;

    if(auth_role == "admin") {
        return <AdminPage />
    } else {
        return <FormExampleFieldControlId user={user} userid={userid} />
    }
}

export { ProtectedPage }