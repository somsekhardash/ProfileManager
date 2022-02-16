import React, { useEffect } from 'react';
import {
    UserAuthenticationClient,
    setCookie,
    removeCookie
} from '../Helper/Cookieshelper';
import {
    REACT_APP_GRAPHQL,
    REACT_APP_COOKIE1,
    REACT_APP_COOKIE2,
    REACT_APP_LOGIN_REDIRECT_URL,
    REACT_APP_MEMBERSHIP_REDIRECT_URL,
    REACT_APP_COOKIE3
} from './../config';

let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
    let [user, setUser] = React.useState<any>({
        email: '',
        id: ''
    });
    let [error, setError] = React.useState<any>(null);
    let [loading, setLoading] = React.useState<any>(null);

    const verifyUser = async (token: string) => {
        try {
            if (REACT_APP_GRAPHQL) {
                setLoading(true);
                const requestBody = {
                    query: `query {
            validate(validateInput:{
              token: "${token}"
          }){
            _id,
            email,
            exp,
            auth_role,
            scope
            }
          }
          `
                };
                fetch(REACT_APP_GRAPHQL as string, {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((res) => res.json())
                    .then((res: any) => {
                        if (res.errors) {
                            setError(res.errors[0].message);
                        } else {
                            const data = res.data.validate;
                            setUser({
                                email: data.email,
                                id: data._id
                            });
                        }
                    });
            } else {
                setError('REACT_APP_GRAPHQL Not There.');
            }
        } catch (err) {
            setError('Unexpected Error on Varification Flow!');
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async (authCookie: string, subCookie: string) => {
        try {
            console.log(authCookie);
            console.log(subCookie);

            if (REACT_APP_GRAPHQL) {
                setLoading(true);
                const requestBody = {
                    query: `mutation {
              login(loginInput: {
                cn_token: "${authCookie}",
                pay_ent_pass: "${subCookie}"
              }), {
                _id,
                token,
                email,
                auth_role
              }
            }
          `
                };
                fetch(REACT_APP_GRAPHQL as string, {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((res) => res.json())
                    .then((res: any) => {
                        if (res.errors) {
                            setError(res.errors[0].message);
                        } else {
                            const data = res.data.login;
                            setCookie(`${REACT_APP_COOKIE3}`, data.token, 1);
                            setUser({
                                email: data.email,
                                id: data._id
                            });
                        }
                    })
                    .catch((err) => {
                        setError(err);
                    });
            } else {
                setError('REACT_APP_GRAPHQL Not There.');
            }
        } catch (err) {
            setError('Unexpected Error on Login Flow!');
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async (token: string) => {
        try {
            removeCookie(`${REACT_APP_COOKIE3}`);
            setUser(null);
        } catch (err) {
            setError('Unexpected Error on loginUser Flow!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const authCookie = UserAuthenticationClient.getDocumentCookie(
            `${REACT_APP_COOKIE1}`
        );
        const subCookie = UserAuthenticationClient.getDocumentCookie(
            `${REACT_APP_COOKIE2}`
        );
        const internalCookie = UserAuthenticationClient.getDocumentCookie(
            `${REACT_APP_COOKIE3}`
        );
        if (authCookie) {
            if (subCookie) {
                if (internalCookie) {
                    verifyUser(internalCookie);
                } else {
                    loginUser(authCookie, subCookie);
                }
            } else {
                // window.location.replace(`${REACT_APP_MEMBERSHIP_REDIRECT_URL}`);
                window.location.assign(
                    REACT_APP_MEMBERSHIP_REDIRECT_URL as string
                );
                //alert("redirect to membership");
            }
        } else {
            // window.location.replace(`${REACT_APP_LOGIN_REDIRECT_URL}`);
            // alert("redirect to loginpage");
            window.location.assign(REACT_APP_LOGIN_REDIRECT_URL as string);
        }
    }, []);

    // let signin = (newUser: string, callback: VoidFunction) => {
    //   return fakeAuthProvider.signin(() => {
    //     setUser(newUser);
    //     callback();
    //   });
    // };

    let setLoader = (value: boolean) => {
        setLoading(value);
    };

    let setErr = (value: string) => {
        setError(value);
    };

    let signout = (callback: VoidFunction) => {
        logoutUser(
            UserAuthenticationClient.getDocumentCookie(`${REACT_APP_COOKIE3}`)
        );
    };

    // let onError = (callback: VoidFunction, data: string) => {
    //     setError(data);
    //     callback();
    // };

    let value = { user, loading, error, signout, setLoader, setErr };
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export { AuthProvider, AuthContext };
