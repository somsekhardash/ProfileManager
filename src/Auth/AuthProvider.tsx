import React, { useEffect } from 'react';
import {
    UserAuthenticationClient,
    setCookie,
    removeCookie
} from '../Helper/Cookieshelper';
import { HttpContext } from '../Helper/HttpProvider';
import {
    REACT_APP_GRAPHQL,
    REACT_APP_COOKIE1,
    REACT_APP_COOKIE2,
    REACT_APP_LOGIN_REDIRECT_URL,
    REACT_APP_MEMBERSHIP_REDIRECT_URL,
    REACT_APP_COOKIE3
} from './../config';

const AuthContext = React.createContext<AuthContextType>(null!);

function useHttp() {
    return React.useContext(HttpContext);
}

function AuthProvider({ children }: { children: React.ReactNode }) {
    const userHttp = useHttp();
    const [user, setUser] = React.useState<any>(null);
    const [userid, setUserid] = React.useState<any>(null);
    const [auth_role, setAuthRole] = React.useState<any>(null);
    const verifyUser = async (token: any) => {
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
                    }`
        };
        userHttp.makeTheCall(
            REACT_APP_GRAPHQL as string,
            {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            (res: any) => {
                if (res.errors) {
                    userHttp.error = res.errors[0].message;
                } else {
                    const data = res.data.validate;
                    setUser(data.email);
                    setUserid(data._id);
                    setAuthRole(data.auth_role);
                }
            }
        );
    };

    const loginUser = async (authCookie: string, subCookie: string) => {
        try {
            console.log(authCookie);
            console.log(subCookie);

            if (REACT_APP_GRAPHQL) {
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
                            }`
                };

                userHttp.makeTheCall(
                    REACT_APP_GRAPHQL as string,
                    {
                        method: 'POST',
                        body: JSON.stringify(requestBody),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    },
                    (res: any) => {
                        if (res.errors) {
                            userHttp.error = res.errors[0].message;
                        } else {
                            const data = res.data.login;
                            setCookie(`${REACT_APP_COOKIE3}`, data.token, 1);
                            setUser(data.email);
                            setUserid(data._id);
                        }
                    }
                );
            }
        } catch (err) {
            userHttp.error = 'Unexpected Error on Login Flow!';
        }
    };

    const logoutUser = async (token: string) => {
        try {
            removeCookie(`${REACT_APP_COOKIE3}`);
            setUser(null);
            setUserid(null);
        } catch (err) {
            userHttp.error = 'Unexpected Error on loginUser Flow!';
        } finally {
            userHttp.isLoading = false;
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

    const signout = (callback: VoidFunction) => {
        logoutUser(
            UserAuthenticationClient.getDocumentCookie(`${REACT_APP_COOKIE3}`)
        );
    };

    // let onError = (callback: VoidFunction, data: string) => {
    //     setError(data);
    //     callback();
    // };

    const value = { user, userid, signout, auth_role };
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export { AuthProvider, AuthContext, useHttp };
