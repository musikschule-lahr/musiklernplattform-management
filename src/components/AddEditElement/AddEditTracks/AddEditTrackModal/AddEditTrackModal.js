import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogNormalHeader,
  DialogNormalBody,
  TextButton, Button,
  Input, IconButton,
} from 'musiklernplattform-components';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/client';
import UploadIcon from '@iconify/icons-ion/cloud-upload-outline';
import TrashIcon from '@iconify/icons-ion/trash-outline';
import { Line } from 'rc-progress';
import {
  ADD_TRACK, UPDATE_TRACK, REMOVE_TRACK, REMOVE_TRACK_FILE,
} from '~/constants/gql/lib';
import { Base64 } from '~/constants/util';

const AddEditTrackModal = ({
  onClose, libElementTrack, libElementId, modalTitle, sortingValue, onTracksChange, isVideo,
}) => {
  const client = useApolloClient();

  const [title, setTitle] = useState('');
  const [file, _setFile] = useState(null);
  const [track, _setTrack] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(10);
  const [uploading, setUploading] = useState(null);
  const [uploadingMsg, setUploadingMsg] = useState(null);

  const fileRef = useRef();
  const uploadedFileRef = useRef();
  const trackRef = useRef(track);

  const setTrack = (value) => {
    _setTrack(value);
    trackRef.current = value;
  };

  const setFile = (value) => {
    _setFile(value);
    uploadedFileRef.current = value;
  };

  useEffect(() => {
    if (libElementTrack) {
      setTrack(libElementTrack);
      setFile(libElementTrack.filePath);
      setTitle(libElementTrack.title);
    } else if (isVideo) setTitle('Video');
  }, [isVideo, libElementTrack]);

  const onChangeHandler = (value) => {
    setTitle(value);
  };

  const addTrack = () => {
    client.mutate({
      mutation: ADD_TRACK,
      variables: {
        libElementId,
        title,
        isVideo,
        sorting: (isVideo ? 0 : sortingValue),
      },
    }).then((data) => {
      setTrack(data.data.addTrack);
      if (isVideo) onTracksChange(null, data.data.addTrack);
      else onTracksChange(data.data.addTrack);
    });
  };

  const editTrack = async (withoutTitle) => {
    if (!file && fileRef.current) {
      // eslint-disable-next-line no-use-before-define
      await uploadTrack();
    }
    const variables = {
      id: trackRef.current.idTrack,
      title,
      sorting: (isVideo ? 0 : sortingValue),
    };
    if (!withoutTitle)variables.title = title;
    if (uploadedFileRef.current) variables.filePath = uploadedFileRef.current;
    client.mutate({
      mutation: UPDATE_TRACK,
      variables,
    }).then((data) => {
      setTrack(data.data.updateTrack);
      if (isVideo) onTracksChange(null, data.data.updateTrack);
      else onTracksChange(data.data.updateTrack);
      setUploading(false);
      setUploadingMsg(null);
      setUploadPercentage(0);
    });
  };

  const uploadTrack = async () => {
    if (!fileRef.current) return;
    const uploadedFile = fileRef.current[0];
    if (uploadedFile.type !== ('video/mp4') && isVideo) return;
    if (uploadedFile.type !== ('audio/mpeg') && !isVideo) return;

    setUploading(true);
    setUploadPercentage(0);
    setUploadingMsg('Lade Datei hoch...');
    const xhr = new window.XMLHttpRequest();
    fileRef.current = null;
    xhr.open('POST', process.env.FILE_SERVER, true);
    xhr.setRequestHeader('Authorization', `Basic ${
      Base64.encode(`${process.env.UPLOAD_AUTH_USERNAME}:${process.env.UPLOAD_AUTH_PASSWORD}`)}`);
    xhr.setRequestHeader('correct-filename', uploadedFile.name);
    // Listen to the upload progress.

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        setUploadingMsg('Speichere Datei...');
        const result = JSON.parse(xhr.response);
        const path = result['new-path'];
        // const name = result['new-name'];
        setFile(path);
        editTrack(true);
      }
    };
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadPercentage((e.loaded / e.total) * 100);
      }
    };
    xhr.send(uploadedFile);
  };

  const removeFile = () => {
    client.mutate({
      mutation: REMOVE_TRACK_FILE,
      variables: {
        id: trackRef.current.idTrack,
      },
    }).then((data) => {
      setFile(null);
      setTrack(data.data.removeTrackFile);
      if (isVideo) onTracksChange(null, data.data.removeTrackFile);
      else onTracksChange(data.data.removeTrackFile);
    });
  };
  const removeTrack = () => {
    client.mutate({
      mutation: REMOVE_TRACK,
      variables: {
        id: trackRef.current.idTrack,
      },
    }).then(() => {
      if (isVideo) onTracksChange(null, { ...track, remove: true });
      else onTracksChange({ ...track, remove: true });
      onClose();
    });
  };
  const onCloseHandler = () => {
    if (uploadPercentage !== 0) onClose(true);
  };
  return (
    <Dialog onClose={onCloseHandler}>
      <DialogNormalHeader>
        <h4>{modalTitle}</h4>
        <TextButton title="Schließen" onClickHandler={onClose} />
      </DialogNormalHeader>
      <DialogNormalBody className="dialog-small flex-column">
        {!isVideo
        && (
        <label>
          Spurname
          <br />
          <Input
            value={title}
            clearButton
            disabled={uploading}
            name="track_title_input"
            onChangeHandler={onChangeHandler}
            onClearHandler={() => onChangeHandler('')}
            error={title.length < 1 ? 'Dieses Feld wird benötigt.' : null}
          />
          <br />
        </label>
        )}
        <br />
        <div className="flex-row" style={!track ? { opacity: 0.5 } : { opacity: 1 }}>
          <label style={{ width: '90%' }}>
            Datei
            <br />
            {file
              ? (
                <Input
                  value={file || '-'}
                  readOnly
                  disabled={!track || uploading}
                  name="track_file_input"
                  className="file-input"
                  error={file === null && 'Keine Datei hochgeladen.'}
                />
              ) : (
                <>
                  <input
                    id="uploadedfile"
                    name="uploadedfile"
                    type="file"
                    accept=".mp3,.mp4"
                    disabled={!track || uploading}
                    onChange={(e) => {
                      fileRef.current = e.target.files;
                    }}
                  />
                </>
              )}
            <br />
          </label>
          <IconButton
            icon={file ? TrashIcon : UploadIcon}
            disabled={!track || uploading}
            className="centered centeredIconBtnIcon"
            onClickHandler={file ? removeFile : uploadTrack}
          />
          <br />
        </div>
        {!track && (
        <div className="error-field">
          Um eine Datei hochladen zu können, muss erst der dazugehörige Track erstellt werden.
        </div>
        )}
        <br />
        {uploading && (
        <>
          <Line percent={uploadPercentage} strokeWidth="4" strokeColor="#D3D3D3" />
          <br />
          <small><span>{uploadingMsg}</span></small>
        </>
        )}

        <br />
        <div className="flex-row marginTop">
          <Button
            className="centered "
            onClickHandler={!track ? addTrack : editTrack}
            title={!track ? 'Track erstellen' : 'Speichern'}
            disabled={title.length < 1 || uploading}
          />
          {track && (
          <Button
            className="centered "
            onClickHandler={removeTrack}
            title="Löschen"
            disabled={uploading}
          />
          )}
        </div>
      </DialogNormalBody>
    </Dialog>
  );
};
AddEditTrackModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  libElementTrack: PropTypes.object,
  libElementId: PropTypes.number,
  modalTitle: PropTypes.string,
  sortingValue: PropTypes.number,
  onTracksChange: PropTypes.func.isRequired,
  isVideo: PropTypes.bool,
};
AddEditTrackModal.defaultProps = {
  libElementTrack: null,
  libElementId: null,
  modalTitle: '',
  sortingValue: 0,
  isVideo: false,
};
export default AddEditTrackModal;
