import React, { useEffect } from 'react';
import {
  useRouteMatch, Switch, Route, useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import AddInstrument from '~/components/AddEditElement/AddInstrument';
import AddEpoch from '~/components/AddEditElement/AddEpoch';
import AddCategories from '~/components/AddEditElement/AddCategories';
import AddComposer from '~/components/AddEditElement/AddComposer';
import AddInstrumentation from '~/components/AddEditElement/AddInstrumentation';
import AddInterpreter from '~/components/AddEditElement/AddInterpreter';

const ManageRoutes = ({
  setActionItems, setHeading, setShowBackBtn,
  setBackBtnPath, setBackBtnText,
}) => {
  const { path } = useRouteMatch();
  const location = useLocation();
  useEffect(() => {
    const currentLocation = location.pathname.split('/')[2];
    if (!currentLocation) return;
    setShowBackBtn(true);
    setBackBtnText('Home');
    setBackBtnPath('/');
    setActionItems(null);
    switch (currentLocation) {
      case 'composers': {
        setHeading('Komponisten verwalten');
        break;
      }
      case 'instruments': {
        setHeading('Instrumente verwalten');
        break;
      }
      case 'epochs': {
        setHeading('Epochen verwalten');
        break;
      }
      case 'categories': {
        setHeading('Kategorien verwalten');
        break;
      }
      case 'interpreters': {
        setHeading('Interpreten verwalten');
        break;
      }
      case 'instrumentations': {
        setHeading('Besetzungen verwalten');
        break;
      }
      default: {
        setHeading('');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  return (
    <Switch>
      <Route path={`${path}/interpreters`}>
        <div className="manage">
          <AddInterpreter
            isListing
            disallowSelectingItems
          />
        </div>

      </Route>
      <Route path={`${path}/instrumentations`}>
        <div className="manage">
          <AddInstrumentation
            isListing
            disallowSelectingItems
          />
        </div>

      </Route>
      <Route path={`${path}/categories`}>
        <div className="manage">
          <AddCategories
            isListing
            disallowSelectingItems
          />
        </div>

      </Route>
      <Route path={`${path}/composers`}>
        <div className="manage">
          <AddComposer
            isListing
            disallowSelectingItems
          />
        </div>

      </Route>
      <Route path={`${path}/instruments`}>
        <div className="manage">
          <AddInstrument
            isListing
            disallowSelectingItems
          />
        </div>

      </Route>
      <Route path={`${path}/epochs`}>
        <div className="manage">
          <AddEpoch
            isListing
            disallowSelectingItems
          />
        </div>

      </Route>
    </Switch>
  );
};
ManageRoutes.propTypes = {
  setHeading: PropTypes.func,
  setBackBtnPath: PropTypes.func,
  setBackBtnText: PropTypes.func,
  setActionItems: PropTypes.func,
  setShowBackBtn: PropTypes.func,
};

ManageRoutes.defaultProps = {
  setHeading: null,
  setBackBtnPath: null,
  setBackBtnText: null,
  setActionItems: null,
  setShowBackBtn: null,
};
export default ManageRoutes;
