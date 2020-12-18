/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useContext, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import HeaderContext from './HeaderContext';
import LoadingIndicator from '~/components/Generic/LoadingIndicator';
import { useIsAllowed } from '~/constants/hooks';

const MyRoute = ({
  heading, isPrivate, component: Component, showBackBtn, backBtnPath, onlyManagementUser,
  backBtnText, routePlans, hideLogo, ...rest
}) => {
  const { keycloak } = useKeycloak();
  const { menuSettings, setMenuSettings } = useContext(HeaderContext);
  const { loadingIsAllowed, isAllowed } = useIsAllowed();

  const [actionItems, setActionItems] = useState();
  const [backBtnPathValue, setBackBtnPath] = useState();
  const [backBtnTextValue, setBackBtnText] = useState();
  const [headingValue, setHeading] = useState();
  const [showBackBtnValue, setShowBackBtn] = useState();
  const [loading, setLoading] = useState();

  const componentToRender = useRef();
  const menuSettingsRef = useRef(menuSettings);

  const setMenuSettingsWithRef = (value) => {
    setMenuSettings(value);
    menuSettingsRef.current = value;
  };
  useEffect(() => {
    setMenuSettingsWithRef({
      heading, showBackBtn, backBtnPath, backBtnText, hideLogo, actionItems: null,
    });
  }, []);

  useEffect(() => {
    if (headingValue === undefined) return;
    const { heading: currentHeading, ...currentSettings } = menuSettingsRef.current;
    setMenuSettingsWithRef({
      heading: headingValue, ...currentSettings,
    });
  }, [headingValue]);

  useEffect(() => {
    if (backBtnPathValue === undefined) return;
    const { backBtnPath: currentBackBtnPath, ...currentSettings } = menuSettingsRef.current;
    setMenuSettingsWithRef({
      backBtnPath: backBtnPathValue, ...currentSettings,
    });
  }, [backBtnPathValue]);

  useEffect(() => {
    if (showBackBtnValue === undefined) return;
    const { showBackBtn: currentShowbackBtn, ...currentSettings } = menuSettingsRef.current;
    setMenuSettingsWithRef({
      showBackBtn: showBackBtnValue, ...currentSettings,
    });
  }, [showBackBtnValue]);

  useEffect(() => {
    if (actionItems === undefined) return;
    const { actionItems: currentAtionItems, ...currentSettings } = menuSettingsRef.current;
    setMenuSettingsWithRef({
      actionItems, ...currentSettings,
    });
  }, [actionItems]);

  useEffect(() => {
    if (backBtnTextValue === undefined) return;
    const { backBtnText: currentBackBtnText, ...currentSettings } = menuSettingsRef.current;
    setMenuSettingsWithRef({
      backBtnText: backBtnTextValue, ...currentSettings,
    });
  }, [backBtnTextValue]);

  const setHeadingHandler = (text) => {
    setHeading(text);
  };

  const setBackBtnPathHandler = (path) => {
    setBackBtnPath(path);
  };

  const setBackBtnTextHandler = (text) => {
    setBackBtnText(text);
  };

  const setActionItemHandler = (values) => {
    setActionItems(values);
  };

  const setShowBackbtnHandler = (value) => {
    setShowBackBtn(value);
  };
  useEffect(() => {
    if (!loadingIsAllowed) {
      const actualComponent = (
        <div className="content">
          <Component
            setHeading={setHeadingHandler}
            setBackBtnPath={setBackBtnPathHandler}
            setBackBtnText={setBackBtnTextHandler}
            setActionItems={setActionItemHandler}
            setShowBackBtn={setShowBackbtnHandler}
          />
        </div>
      );
      if (((isAllowed || onlyManagementUser === false) && keycloak.authenticated) || !keycloak.authenticated) {
        componentToRender.current = actualComponent;
      } else {
        componentToRender.current = <div>Du hast keine Berechtigung, um diese Seite zu sehen.</div>;
      }
      setLoading(false);
    }
  }, [isAllowed, keycloak.authenticated, loadingIsAllowed, onlyManagementUser]);

  if (isPrivate) localStorage.setItem('lastCalled', rest.path);

  if (loading) return <LoadingIndicator />;

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={() => (
        <div className="contentProvider">
          {(keycloak.authenticated || !isPrivate)
            ? (
              componentToRender.current
            )
            : (
              <Redirect
                to="/login"
              />
            )}
        </div>
      )}
    />
  );
};

MyRoute.propTypes = {
  component: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  isPrivate: PropTypes.bool.isRequired,
  showBackBtn: PropTypes.bool,
  shownInMenu: PropTypes.bool,
  actionItemIcon: PropTypes.func,
  backBtnPath: PropTypes.string,
  backBtnText: PropTypes.string,
  routePlans: PropTypes.arrayOf(PropTypes.number),
  hideLogo: PropTypes.bool,
};
MyRoute.defaultProps = {
  shownInMenu: false,
  actionItemIcon: null,
  showBackBtn: true,
  backBtnPath: null,
  backBtnText: 'Zurück',
  routePlans: [],
  hideLogo: false,
};

export default MyRoute;
