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
                Project Name
                </Menu.Item>
                <Menu.Item><Link to="/">Public Page</Link></Menu.Item>
                <Menu.Item><Link to="/protected">Dashboard</Link></Menu.Item>
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
            </Container>
            </Segment>
            {/* <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as='a'>Sitemap</List.Item>
                <List.Item as='a'>Contact Us</List.Item>
                <List.Item as='a'>Religious Ceremonies</List.Item>
                <List.Item as='a'>Gazebo Plans</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Services' />
              <List link inverted>
                <List.Item as='a'>Banana Pre-Order</List.Item>
                <List.Item as='a'>DNA FAQ</List.Item>
                <List.Item as='a'>How To Access</List.Item>
                <List.Item as='a'>Favorite X-Men</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Footer Header
              </Header>
              <p>
                Extra space for a call to action inside the footer that could help re-engage users.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment> */}
        </div>)
}


function AuthStatus() {
    let auth: any = useAuth();
    let navigate = useNavigate();
  
    if (!auth.user) {
      return <Menu.Item as='a'>You are not logged in.</Menu.Item>;
    }

    return (
        <Dropdown text={auth.user} pointing className='link item'>
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