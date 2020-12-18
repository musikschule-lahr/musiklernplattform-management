import { useCallback } from 'react';
import {
  useQuery, useApolloClient,
} from '@apollo/client';
import { CAN_USE_MANAGEMENT } from '~/constants/gql/user';

// Cannot update apollo-client above 3.1.1
// https://github.com/apollographql/apollo-client/issues/6796
export const useImperativeQuery = (query) => {
  const { refetch } = useQuery(query, { skip: true });
  const imperativelyCallQuery = (variables) => refetch(variables);
  return imperativelyCallQuery;
};

export const useIsAllowed = () => {
  const client = useApolloClient();

  const {
    data: allowedData,
  } = useQuery(CAN_USE_MANAGEMENT, {
    onError: (err) => {
      console.log('cannot query', err);
    },
  });

  const updateAllowed = useCallback(() => {
    client.query({
      query: CAN_USE_MANAGEMENT,
      fetchPolicy: 'network-only',
    }).then((newData) => newData.userCanUseManagement);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!allowedData) {
    return {
      loading: true, isAllowed: false, updateAllowed: null,
    };
  }
  return {
    loading: false, isAllowed: allowedData.userCanUseManagement, updateAllowed,
  };
};

export default { useImperativeQuery, useIsAllowed };
