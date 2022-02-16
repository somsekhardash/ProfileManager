import FormExampleFieldControlId from './ApplicationForm';
import { useAuth } from './Layout';

function ProtectedPage() {
    let auth = useAuth();
    return <FormExampleFieldControlId 
                user={auth.user.email} 
                userid={auth.user.id} 
                setLoader={auth.setLoader} 
                setErr={auth.setErr}
            />;
}

export { ProtectedPage }