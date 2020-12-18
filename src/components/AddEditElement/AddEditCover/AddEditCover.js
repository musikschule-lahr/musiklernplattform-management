import React, { useState, useRef, useEffect } from 'react';
import {
  Row, Col,
  Input, IconButton,
} from 'musiklernplattform-components';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/client';
import UploadIcon from '@iconify/icons-ion/cloud-upload-outline';
import TrashIcon from '@iconify/icons-ion/trash-outline';
import { Line } from 'rc-progress';
import { Base64 } from '~/constants/util';
import { REMOVE_COVER_FILE, EDIT_LIB_ELEMENT } from '~/constants/gql/lib';

const AddEditCover = ({
  coverImagePath, setCoverImagePath, libElementId,
}) => {
  const client = useApolloClient();

  const [file, _setFile] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(10);
  const [uploading, setUploading] = useState(null);
  const [uploadingMsg, setUploadingMsg] = useState(null);

  const fileRef = useRef();

  const setFile = (value) => {
    _setFile(value);
    fileRef.current = value;
  };

  useEffect(() => {
    if (coverImagePath) {
      setImagePath(coverImagePath);
    }
  }, [coverImagePath]);

  const uploadFile = async () => {
    if (!fileRef.current) return;
    const uploadedFile = fileRef.current[0];
    if (!uploadedFile.type.includes('image/')) return;
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
        client.mutate({
          mutation: EDIT_LIB_ELEMENT,
          variables: {
            idLibElement: libElementId,
            metadata: { coverImagePath: path },
          },
        }).then((data) => {
          setCoverImagePath(path);
          setUploading(false);
        });
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
      mutation: REMOVE_COVER_FILE,
      variables: {
        id: libElementId,
      },
    }).then((data) => {
      setCoverImagePath(null);
    });
  };

  return (
    <div>

      <Row breakpoint="sm">
        <Col>
          {coverImagePath ? (
            <img
              alt="Cover kann nicht abgerufen werdenn"
              style={{ width: '45vw', maxWidth: 250, height: 'auto' }}
              src={coverImagePath}
            />
          ) : <div style={{ minWidth: 250 }}>Es wurde kein Cover hinzugefügt.</div>}
        </Col>
        <Col className="width-100">
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <label style={{ width: '80%' }}>
              Datei
              <br />
              {
                  coverImagePath
                    ? (
                      <Input
                        value={coverImagePath || '-'}
                        readOnly
                        disabled={!coverImagePath}
                        name="cover_file_input"
                        className="file-input"
                        error={coverImagePath === null && 'Keine Datei hochgeladen.'}
                      />
                    )
                    : (
                      <input
                        id="uploadedfile"
                        name="uploadedfile"
                        type="file"
                        accept=".jpg,.png,.bmp"
                        disabled={uploading}
                        onChange={(e) => {
                          fileRef.current = e.target.files;
                        }}
                      />
                    )
}

            </label>
            <IconButton
              icon={coverImagePath ? TrashIcon : UploadIcon}
              disabled={uploading}
              className="centered centeredIconBtnIcon paddingTop"
              onClickHandler={coverImagePath ? removeFile : uploadFile}
            />
          </div>
        </Col>
      </Row>

      <br />

      {uploading && (
      <>
        <Line percent={uploadPercentage} strokeWidth="4" strokeColor="#D3D3D3" />
        <br />
        <small><span>{uploadingMsg}</span></small>
      </>
      )}

    </div>
  );
};
AddEditCover.propTypes = {
  onClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  libElementTrack: PropTypes.object,
  libElementId: PropTypes.number,
  modalTitle: PropTypes.string,
  sortingValue: PropTypes.number,
  onTracksChange: PropTypes.func.isRequired,
  isVideo: PropTypes.bool,
};
AddEditCover.defaultProps = {
  libElementTrack: null,
  libElementId: null,
  modalTitle: '',
  sortingValue: 0,
  isVideo: false,
};
export default AddEditCover;
