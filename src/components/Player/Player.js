import React, {
  useEffect, useState,
} from 'react';
import { TonePlayer as Player, playerTypes } from 'my-common-components';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useQuery, useApolloClient, gql } from '@apollo/client';
import EllipsisCircleIcon from '@iconify/icons-ion/ellipsis-horizontal-circle';
import { generateActionItem, libItemOptionsConstants, getFilePath } from '~/constants/util';
import { GET_LIB_ELEMENT_FROM_PATH } from '~/constants/gql/lib';
import LoadingIndicator from '~/components/Generic/LoadingIndicator';

const MyPlayer = ({ setActionItems, setHeading }) => {
  const client = useApolloClient();

  const { path } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const { data, loading } = useQuery(GET_LIB_ELEMENT_FROM_PATH,
    {
      variables: { path: `${path}` },
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let heading = '';
        if (data.getLibElementFromPath.playerType === 'Ensemble_Band') {
          if (data.getLibElementFromPath.metaData.interpreter) {
            heading = `${data.getLibElementFromPath.metaData.interpreter.name} - `;
          }
        }
        if (data.getLibElementFromPath.playerType === 'Korrepetition') {
          heading = `${data.getLibElementFromPath.metaData.composer.firstname} ${
            data.getLibElementFromPath.metaData.composer.lastname} - `;
        }
        setHeading(`${heading} ${data.getLibElementFromPath.metaData.title}`);
        const trackList = [];
        const spurNamen = [];
        let videoSource;
        let spurCounter = 1;
        data.getLibElementFromPath.tracks.forEach((track) => {
          if (!track.isVideo) {
            if (!track.filePath) return;
            trackList.push(getFilePath(track.filePath, data.getLibElementFromPath));
            spurNamen.push(track.title || `Spur ${spurCounter}`);
            spurCounter += 1;
          } else videoSource = getFilePath(track.filePath, data.getLibElementFromPath);
        });
        const playerType = playerTypes[data.getLibElementFromPath.playerType.toUpperCase()];
        const coverPath = getFilePath(data.getLibElementFromPath.metaData.coverImagePath, data.getLibElementFromPath);
        setSelected({
          trackList,
          videoSource,
          spurNamen,
          playerType,
          coverPath,
        });
      },
    });

  if (!selected) return <LoadingIndicator />;

  return (
    <div className="player">
      <Player
        trackList={selected.trackList}
        playerType={selected.playerType}
        spurNamen={selected.spurNamen}
        videoSource={selected.videoSource}
        coverPath={selected.coverPath}
      />
    </div>
  );
};

MyPlayer.propTypes = {
  setActionItems: PropTypes.func,
  setHeading: PropTypes.func.isRequired,
};

MyPlayer.defaultProps = {
  setActionItems: null,
};
export default MyPlayer;
