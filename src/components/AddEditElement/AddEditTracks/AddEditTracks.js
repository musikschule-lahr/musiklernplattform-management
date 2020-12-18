/* eslint-disable react/no-array-index-key */
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { IconButton, ListItem } from 'musiklernplattform-components';
import PropTypes from 'prop-types';
import VideoIcon from '@iconify/icons-ion/film-outline';
import MusicIcon from '@iconify/icons-ion/musical-notes-outline';
import AddIcon from '@iconify/icons-ion/add-circle';
import { DndProvider } from 'react-dnd';
import update from 'immutability-helper';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ListItemContent from '~/components/Generic/ListItemContent';
import AddEditTrackModal from './AddEditTrackModal';
import TrackElement from './TrackElement';

// DnD from example https://react-dnd.github.io/react-dnd/examples/sortable/simple
const AddEditTracks = ({
  libElementTracks, libElementVideo, libElementExists, onTracksChange, libElementId,
}) => {
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [video, setVideo] = useState(null);

  const libElementTrack = useRef();
  const trackModalIsVideo = useRef();
  const trackModalTitle = useRef();

  useEffect(() => {
    setTracks(libElementTracks);
    setVideo(libElementVideo);
  }, [libElementTracks, libElementVideo]);

  const moveTrackElement = useCallback((dragIndex, hoverIndex) => {
    const dragCard = tracks[dragIndex];
    setTracks(update(tracks, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragCard],
      ],
    }));
  }, [tracks]);

  // bissl unsauber gegen das nicht updatende opacity
  const tracksSetNewSorting = () => {
    const newTrackSorting = tracks.map((e, index) => {
      const { sorting, ...rest } = e;
      const newSorting = index + 1;
      return { sorting: newSorting, newSorting, ...rest };
    });
    // setTracks(newTrackSorting);
    onTracksChange(newTrackSorting, video);
  };

  const addTrack = () => {
    trackModalTitle.current = 'Neuen Track hinzufügen';
    trackModalIsVideo.current = false;
    libElementTrack.current = null;
    setShowTrackModal(true);
  };

  const addVideo = () => {
    trackModalTitle.current = 'Video hinzufügen';
    trackModalIsVideo.current = true;
    libElementTrack.current = null;
    setShowTrackModal(true);
  };

  const editVideo = () => {
    trackModalTitle.current = 'Video bearbeiten';
    trackModalIsVideo.current = true;
    libElementTrack.current = video;
    setShowTrackModal(true);
  };

  const editTrack = (item) => {
    trackModalTitle.current = 'Track bearbeiten';
    trackModalIsVideo.current = false;
    libElementTrack.current = item;
    setShowTrackModal(true);
  };

  const onTrackModalClose = (clearCurrent) => {
    if (clearCurrent) libElementTrack.current = null;
    setShowTrackModal(false);
  };

  const onTracksChangeFunc = (track, changedVideo) => {
    const newTracks = [...tracks];
    if (track) {
      if (libElementTrack.current) {
        const idx = newTracks.findIndex((trck) => (trck.idTrack === (libElementTrack.current).idTrack));
        if (track) {
          if (track.remove) newTracks.splice(idx, 1);
          else {
            newTracks[idx] = track;
          }
        }
      } else {
        newTracks.push(track);
        libElementTrack.current = track;
      }
    }
    let newVideo = video;
    if (changedVideo) {
      newVideo = changedVideo;
      if (changedVideo.remove) newVideo = null;
    }
    onTracksChange(newTracks, newVideo);
  };

  return (
    <>
      {showTrackModal && (
      <AddEditTrackModal
        onClose={onTrackModalClose}
        libElementTrack={libElementTrack.current}
        modalTitle={trackModalTitle.current}
        isVideo={trackModalIsVideo.current}
        libElementId={libElementId}
        sortingValue={libElementTrack.current ? libElementTrack.current.sorting : tracks.length + 1}
        onTracksChange={onTracksChangeFunc}
      />
      )}
      {!libElementExists
        ? (
          <div className="error-field">
            Um Tracks und Videos hochladen zu können, muss zuerst ein Bibliothekselement angelegt werden.
          </div>
        )
        : (
          <>
            <IconButton
              icon={AddIcon}
              className="flex-row"
              label="Neuen Track hinzufügen"
              onClickHandler={addTrack}
            />
            <IconButton
              icon={AddIcon}
              className="flex-row"
              label="Video hinzufügen"
              onClickHandler={addVideo}
              disabled={video !== null}
            />
            <ul style={{
              listStyle: 'none',
              padding: 0,
              borderBottom: '1px solid rgba(0, 0, 0, .3)',
            }}
            >
              <ListItem
                icon={VideoIcon}
              >
                {video ? (
                  <ListItemContent
                    name={video.title}
                    value={video.filePath}
                    onClickHandler={editVideo}
                  />
                ) : <span style={{ opacity: 0.5 }}>Kein Video hinterlegt</span>}
              </ListItem>
            </ul>

            {tracks.length > 0
              ? (
                <DndProvider backend={HTML5Backend}>
                  {tracks.map((track, index) => (
                    <TrackElement
                      key={`track_${index}`}
                      moveTrackElement={moveTrackElement}
                      text={track.title}
                      index={index}
                      id={track.idTrack}
                      sorting={track.sorting || index}
                      tracksSetNewSorting={tracksSetNewSorting}
                      item={track}
                      onClickHandler={editTrack}
                    />
                  ))}
                </DndProvider>
              )
              : (
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                }}
                >
                  <ListItem
                    icon={MusicIcon}
                  >
                    <span style={{ opacity: 0.5 }}>Keine Audiodateien hinterlegt</span>
                  </ListItem>
                </ul>
              )}
          </>
        )}
    </>
  );
};

AddEditTracks.propTypes = {
  libElementTracks: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/forbid-prop-types
  libElementVideo: PropTypes.object,
  libElementExists: PropTypes.bool,
  onTracksChange: PropTypes.func.isRequired,
  libElementId: PropTypes.number,
};
AddEditTracks.defaultProps = {
  libElementTracks: [],
  libElementVideo: null,
  libElementExists: false,
  libElementId: null,
};
export default AddEditTracks;
