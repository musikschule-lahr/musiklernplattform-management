import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useQuery } from '@apollo/client';
import { Button } from 'musiklernplattform-components';
import LogoutIcon from '@iconify/icons-ion/power-sharp';
import { GET_USER } from '~/constants/gql/user';
import { useIsAllowed } from '~/constants/hooks';
import LoadingIndicator from '~/components/Generic/LoadingIndicator';
import ManagementOverview from './ManagementOverview';
import { generateActionItem } from '~/constants/util';

const Home = ({ setActionItems, setBackBtnText }) => {
  const { keycloak } = useKeycloak();
  const { loadingIsAllowed, isAllowed } = useIsAllowed();

  useEffect(() => {
    setActionItems(
      generateActionItem(LogoutIcon, true, 'Abmelden',
        () => {
          localStorage.removeItem('accesstoken');
          localStorage.removeItem('refreshtoken');
          keycloak.logout();
          if (window.device.platform.toLowerCase() === 'ios') {
            window.location.href = window.location.href.substring(0, window.location.href.indexOf('#'));
          }
        }),
    );
  }, []);
  const {
    loading, data,
  } = useQuery(GET_USER);
  if (loading || loadingIsAllowed) return <LoadingIndicator />;
  if (!keycloak.authenticated) return (<span>Bitte loggen Sie sich ein!</span>);
  if (!isAllowed || !data.getUser) {
    return (
      <div className="error-field">
        Um my-Management nutzen zu können,
        müssen Sie die Berechtigung anfordern.
      </div>
    );
  }

  return (
    <div className="home">
      <h2>Willkommen</h2>
      <div>
        <span>
          Hallo&nbsp;
          {data.getUser.username}
          !
        </span>
        <br />
        <ManagementOverview />
      </div>
    </div>
  );
};

export default Home;
