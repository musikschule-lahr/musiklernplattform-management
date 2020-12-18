import React, { useState } from 'react';
import { Switch } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import StartIcon from 'musiklernplattform-components/iconify/icon-start';
import StartIconActive from 'musiklernplattform-components/iconify/icon-start-active';
import SearchIcon from 'musiklernplattform-components/iconify/icon-suchen';
import SearchIconActive from 'musiklernplattform-components/iconify/icon-suchen-active';
import AddIcon from '@iconify/icons-ion/add';
import MediaIcon from 'musiklernplattform-components/iconify/icon-mediathek';
import MediaIconActive from 'musiklernplattform-components/iconify/icon-mediathek-active';
import Header from './Header';
import Menu from './Menu';
import MyRoute from './MyRoute';
import PlansProvider from './PlansProvider';
import Login from '~/components/Login';
import Home from '~/components/Home';
import Manage from '~/components/Manage';
import Player from '~/components/Player';
import Search from '~/components/Search';
import { plans } from '~/constants/util';
import HeaderContext from './HeaderContext';
import LibElement from '~/components/LibElement';
import AddEditElement from '~/components/AddEditElement';
import { useIsAllowed } from '~/constants/hooks';
import Library from '~/components/Library';

const Routes = () => {
  const { keycloak } = useKeycloak();
  const [menuSettings, setMenuSettings] = useState({
    heading: '',
  });
  const value = { menuSettings, setMenuSettings };

  const routes = [
    {
      heading: 'Start',
      showInMenu: false,
      isPrivate: true,
      path: '/',
      isExact: true,
      component: Home,
      onlyManagementUser: false,
      showBackBtn: false,
      icon: StartIcon,
      iconActive: StartIconActive,
    },
    {
      heading: 'Start',
      showInMenu: true,
      isPrivate: true,
      path: '/home',
      isExact: true,
      component: Home,
      onlyManagementUser: false,
      showBackBtn: false,
      icon: StartIcon,
      iconActive: StartIconActive,
    },
    {
      heading: 'Anmelden',
      showInMenu: false,
      isPrivate: false,
      path: '/login',
      isExact: false,
      component: Login,
      onlyManagementUser: false,
      showBackBtn: false,
    },
    {
      heading: 'Eintrag hinzufügen',
      showInMenu: true,
      isPrivate: true,
      path: '/add-element',
      isExact: false,
      component: AddEditElement,
      onlyManagementUser: true,
      showBackBtn: true,
      icon: AddIcon,
    }, {
      heading: 'Mediathek',
      showInMenu: true,
      isPrivate: true,
      path: '/library',
      isExact: false,
      component: Library,
      showBackBtn: false,
      onlyManagementUser: true,
      icon: MediaIcon,
      iconActive: MediaIconActive,
    },
    {
      heading: 'Suchen',
      showInMenu: true,
      isPrivate: true,
      path: '/search',
      isExact: true,
      component: Search,
      showBackBtn: true,
      onlyManagementUser: true,
      icon: SearchIcon,
      iconActive: SearchIconActive,
    },
    {
      heading: 'Bibliothekseintrag',
      showInMenu: false,
      isPrivate: true,
      path: '/lib-element/:path',
      isExact: false,
      component: LibElement,
      onlyManagementUser: true,
      showBackBtn: true,
    },
    {
      heading: 'Player',
      showInMenu: false,
      isPrivate: true,
      path: '/player/:path',
      isExact: false,
      component: Player,
      onlyManagementUser: true,
      showBackBtn: true,
    },
    {
      heading: 'Bibliothekseintrag editieren',
      showInMenu: false,
      isPrivate: true,
      path: '/edit-lib/:path',
      isExact: false,
      component: AddEditElement,
      onlyManagementUser: true,
      showBackBtn: true,
    },
    {
      heading: 'Verwaltung',
      showInMenu: false,
      isPrivate: true,
      path: '/manage',
      isExact: false,
      component: Manage,
      onlyManagementUser: true,
      showBackBtn: true,
    },
  ];
  return (
    <>
      <PlansProvider>
        <HeaderContext.Provider value={value}>
          <Header />
          <Switch>
            {routes.map((route) => (
              <MyRoute
                key={`${route.heading}Route`}
                heading={route.heading}
                isPrivate={route.isPrivate}
                path={route.path}
                exact={route.isExact}
                component={route.component}
                actionItemIcon={route.actionItemIcon}
                showBackBtn={route.showBackBtn}
                routePlans={route.routePlans}
                onlyManagementUser={route.onlyManagementUser}
                hideLogo={route.hideLogo}
              />
            ))}
          </Switch>
          {keycloak.authenticated && <Menu items={routes} /> }
        </HeaderContext.Provider>
      </PlansProvider>
    </>
  );
};

export default Routes;
