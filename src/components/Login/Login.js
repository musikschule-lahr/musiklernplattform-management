import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Button } from 'musiklernplattform-components';
import { useLazyQuery } from '@apollo/client';
import {
  Redirect,
} from 'react-router-dom';
import { GET_USER } from '~/constants/gql/user';
import LoadingIndicator from '~/components/Generic/LoadingIndicator';

const Login = (() => {
  const { keycloak, initialized } = useKeycloak();
  const [loadUser, { data, loading, error }] = useLazyQuery(GET_USER, {
  });
  if (initialized && keycloak.authenticated && !data && !loading) {
    if (error) {
      return (
        <Redirect
          to="/home"
        />
      );
    }
    loadUser();
  }
  if (data) {
    const lastCalled = localStorage.getItem('lastCalled');
    localStorage.removeItem('lastCalled');
    if (lastCalled) {
      return (
        <Redirect
          to="/home"
        />
      );
    }
  }
  return (
    <div className="login">
      {!initialized ? <LoadingIndicator />
        : (
          <div>
            {!keycloak.authenticated
              ? (
                <div className="loginPage">
                  <br />
                  <Button
                    title="Login"
                    name="loginBtn"
                    onClickHandler={() => keycloak.login({ scope: 'offline_access', cordovaOptions: { zoom: 'no' } })}
                  />

                </div>
              )
              : (
                <Button
                  title="Logout"
                  name="logoutBtn"
                  onClickHandler={
                  () => {
                    localStorage.removeItem('accesstoken');
                    localStorage.removeItem('refreshtoken');
                    keycloak.logout();
                  }
                }
                />
              )}
          </div>
        )}
    </div>
  );
});

export default Login;
