import React from 'react';
import {
  Link,
  useNavigate,
  Outlet
} from "react-router-dom";

import {
  Container,
  Dimmer,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Loader,
  Menu,
  Message,
  Segment,
} from 'semantic-ui-react'

import {AuthContext} from './Auth/AuthProvider';

function useAuth() {
    return React.useContext(AuthContext);
}

function Layout() {
    const auth: any = useAuth();
    return (<div className='layout-page'>
            <Menu fixed='top' inverted>
            <Container>
                <Menu.Item as='a' header>
                  <Image className="site-image" size='mini' src='https://images.squarespace-cdn.com/content/v1/5c61d8018dfc8cda283d4389/1552943873119-3QJ5A1WNPH3WEQP8BYM6/AD-PRO-LOGO.png' style={{ marginRight: '1.5em' }} />
                  Dashboard
                </Menu.Item>
                <Menu.Menu position='right'>
                    <AuthStatus />
                </Menu.Menu>
            </Container>
            </Menu>
            <Segment style={{ padding: '0em 0em 8em 0em' }} vertical>
            <Container text style={{ marginTop: '7em' }}>
                {auth.loading ? (<Segment>
                                <Dimmer active inverted>
                                    <Loader size='large'>Loading</Loader>
                                </Dimmer>

                                <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                            </Segment>) : <Outlet />}

                {auth.error &&  (
                  <Message negative>
                    <Message.Header>{auth.error}</Message.Header>
                    <p>Please try again</p>
                  </Message>
                )}
                {auth.success && (
                   <Message positive>
                    <Message.Header>{auth.success}</Message.Header>
                    <p>
                      Thank You
                    </p>
                  </Message>
                )}
            </Container>
            </Segment>
        </div>)
}


function AuthStatus() {
    let auth: any = useAuth();
    let navigate = useNavigate();
    debugger;
    if (!auth.user || !auth.user.email) {
      return <Menu.Item as='a'>You are not logged in.</Menu.Item>;
    }

    return (
        <Dropdown text={auth.user && auth.user.email} pointing className='link item'>
            <Dropdown.Menu>
            <Dropdown.Item  onClick={() => {
                    auth.signout(() => navigate("/"));
                }}>
                Sign out
            </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export { Layout, useAuth };