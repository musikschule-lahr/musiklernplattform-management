import React, { useState } from 'react';
import { useApolloClient, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Search } from 'my-common-components';
import { SEARCH_LIB_ELEMENTS, GET_EPOCHS } from '~/constants/gql/lib';
import { GET_INSTRUMENTS } from '~/constants/gql/user';
import LoadingIndicator from "~/components/Generic/LoadingIndicator";

const SearchWrapper = () => {
  const client = useApolloClient();
  const history = useHistory();

  const [searchResult, setSearchResult] = useState(null);
  const [instruments, setInstruments] = useState([]);
  const [epochs, setEpochs] = useState([]);

  const { loading: loadingInstruments } = useQuery(GET_INSTRUMENTS,
    {
      onCompleted: (allInstruments) => {
        setInstruments(JSON.parse(JSON.stringify((allInstruments.getInstruments))));
      },
    });
  const { loading: loadingEpochs } = useQuery(GET_EPOCHS, {
    onCompleted: (epochResults) => {
      setEpochs(JSON.parse(JSON.stringify((epochResults.getEpochs))));
    },
  });

  const executeSearch = (variables) => new Promise((resolve, reject) => {
    client.query({
      query: SEARCH_LIB_ELEMENTS,
      variables,
      fetchPolicy: 'network-only',
    }).then((libData) => {
      setSearchResult(libData.data.filterLibElements);
      resolve();
    })
      .catch((err) => reject(err));
  });

  const onItemClick = (playerPath) => {
    history.push(`/lib-element/${playerPath}`);
  };

  if (loadingInstruments || loadingEpochs) return <LoadingIndicator />;

  return (
    <div className="search">
      <Search
        executeSearch={executeSearch}
        searchResult={searchResult}
        instrumentList={instruments}
        epochList={epochs}
        onItemClick={onItemClick}
      />
    </div>
  );
};

export default SearchWrapper;
