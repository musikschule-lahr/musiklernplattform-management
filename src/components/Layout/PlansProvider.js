import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useApolloClient } from '@apollo/client';
import { CAN_USE_MANAGEMENT } from '~/constants/gql/user';
import { plans } from '~/constants/util';
import LoadingIndicator from '~/components/Generic/LoadingIndicator';

const PlansProvider = ({ children }) => {
  const client = useApolloClient();

  const { loading, data: userData, error } = useQuery(CAN_USE_MANAGEMENT, { fetchPolicy: 'network-only' });

  if (loading) return <LoadingIndicator padding />;

  return (
    <>
      {children}
    </>
  );
};

PlansProvider.propTypes = {
  children: PropTypes.node,
};

PlansProvider.defaultProps = {
  children: <div />,
};

export default PlansProvider;
