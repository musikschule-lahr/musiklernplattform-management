import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import SearchIcon from 'musiklernplattform-components/iconify/icon-suchen-active';
import PropTypes from 'prop-types';
import { generateActionItem } from '~/constants/util';
import { SEARCH_LIB_ELEMENTS } from '~/constants/gql/lib';
import LoadingIndicator from '~/components/Generic/LoadingIndicator';
import LibItemsList from './LibItemsList';

const Library = ({ setActionItems }) => {
  const history = useHistory();

  useEffect(() => {
    setActionItems(
      generateActionItem(SearchIcon, true, 'Suche',
        () => history.push('/library/search')),
    );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    loading, data,
  } = useQuery(SEARCH_LIB_ELEMENTS, {
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <LoadingIndicator />;

  function getItemClickHandler(element) {
    return () => history.push(`/lib-element/${element.playerPath}`);
  }

  return (
    <div className="lib">
      <LibItemsList
        heading="Alle Werke"
        listStyle="grid"
        list={(data || []).filterLibElements}
        getItemClickHandler={getItemClickHandler}
      />

    </div>
  );
};
Library.propTypes = {
  setActionItems: PropTypes.func,
};

Library.defaultProps = {
  setActionItems: null,
};
export default Library;
