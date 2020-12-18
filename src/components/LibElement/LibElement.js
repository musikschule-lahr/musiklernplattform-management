/* eslint-disable react/no-array-index-key */
import React, { useState, useCallback } from 'react';
import {
  List, ListItem, ListDivider, Col, Row, Button,
} from 'musiklernplattform-components';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery, useApolloClient } from '@apollo/client';
import VideoIcon from '@iconify/icons-ion/film-outline';
import MusicIcon from '@iconify/icons-ion/musical-notes-outline';
import moment from 'moment';
import { getFilePath } from '~/constants/util';
import { GET_LIB_ELEMENT_FROM_PATH } from '~/constants/gql/lib';
import LoadingIndicator from '~/components/Generic/LoadingIndicator';

const ListItemContent = ({ name, value }) => (
  <span>
    <b>
      {name}
      :
    </b>
    {' '}
    {value || 'Kein Datensatz hinterlegt'}
  </span>
);
ListItemContent.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
};
ListItemContent.defaultProps = {
  name: '',
  value: null,
};
const MyLibElement = ({ setHeading }) => {
  const client = useApolloClient();
  const history = useHistory();

  const { path } = useParams();
  const [fields, setFields] = useState(null);

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
        const {
          createdAt, updatedAt, playerType, author, productionNo, instruments, categories,
        } = data.getLibElementFromPath;
        const {
          title, shortTitle, composer, comment, epoch, interpreter, instrumentation,
          difficultyMax, difficultyMin, movement, coverImagePath, tuning, yearOfRecording,
        } = data.getLibElementFromPath.metaData;
        const newFields = {
          coverImagePath,
          productionNo,
          tracks: [],
          title,
          shortTitle,
          composer,
          interpreter,
          comment,
          playerType,
          epoch,
          createdAt,
          updatedAt: (updatedAt || createdAt),
          author: `${author.firstname} ${author.lastname}`,
          moreInfoData:
          {
            'Unterer Schwierigkeitsgrad': difficultyMax,
            'Oberer Schwierigkeitsgrad': difficultyMin,
            Satz: movement,
            Aufnahmejahr: yearOfRecording,
            Tuning: `${tuning}Hz`,
            Instrumentation: (instrumentation ? instrumentation.name : 'Keine Besetzung'),
            Instrumente: instruments.map((instrument) => (`${instrument.name}`)).join(', '),
            Kategorien: categories.map((category) => (`${category.name}`)).join(', '),
          },
        };
        newFields.tracks = data.getLibElementFromPath.tracks.map((track) => ({
          isVideo: track.isVideo,
          title: track.title,
          filePath: track.filePath,
        }));
        setFields({ ...newFields });
      },
    });

  const renderArtist = useCallback(() => {
    switch (fields.playerType) {
      case 'Korrepetition': {
        if (fields.composer) {
          return `${fields.composer.firstname} ${fields.composer.lastname}(*${
            fields.composer.yearOfBirth} - ${
            fields.composer.yearOfDeath ? `✝${fields.composer.yearOfDeath}` : '*'})`;
        }
        return '';
      }
      case 'Ensemble_Band': {
        if (fields.interpreter) return fields.interpreter.name;
        return '';
      }
      default: {
        return '';
      }
    }
  }, [fields]);

  if (!fields) return <LoadingIndicator />;

  return (
    <div className="libElement">
      <Row breakpoint="sm">
        <Col>
          {' '}
          <img
            alt="Kein Cover hochgeladen"
            style={{ width: '45vw', maxWidth: 250, height: 'auto' }}
            src={fields.coverImagePath && getFilePath(
              fields.coverImagePath, { productionNo: fields.productionNo },
            )}
          />
        </Col>
        <Col>
          <div style={{ height: 250, display: 'flex', flexDirection: 'column' }}>
            <h2>{fields.title}</h2>
            <h3>{fields.shortTitle}</h3>
            <h4>
              {
               renderArtist()
              }
            </h4>
            <span>{fields.playerType}</span>
            <br />
            <div style={{ marginTop: 'auto' }}>
              <Button
                onClickHandler={() => {
                  history.push(`/player/${path}`);
                }}
                title="Player öffnen"
              />
              <Button
                style={{ marginLeft: '1rem' }}
                onClickHandler={() => {
                  history.push(`/edit-lib/${path}`);
                }}
                title="Element bearbeiten"
              />
            </div>
          </div>
        </Col>
      </Row>

      <p />
      <List>
        <ListDivider sticky={false} key="divider_metadata" label="Metadaten" />
        <ListItem key="moreInfo_Epoche">
          <ListItemContent
            name="Epoche"
            value={fields.epoch ? `${fields.epoch.description} (${
              fields.epoch.code})` : 'Keine Epoche hinterlegt.'}
          />
        </ListItem>
        {Object.keys(fields.moreInfoData).map((key) => (
          <ListItem key={`moreInfo_${key}`}>
            <ListItemContent name={key} value={fields.moreInfoData[key]} />
          </ListItem>
        ))}

        <ListDivider sticky={false} key="divider_tracks" label="Verknüpfte Tracks" />
        {fields.tracks.map((item, idx) => (
          <ListItem
            icon={item.isVideo ? VideoIcon : MusicIcon}
            key={`track_${idx}`}
          >
            <ListItemContent name={item.title} value={item.filePath} />
          </ListItem>
        ))}
        <ListDivider sticky={false} key="divider_uploader" label="Über diesen Eintrag" />
        <ListItem>
          <ListItemContent name="Hochgeladen von" value={fields.author} />
        </ListItem>
        <ListItem>
          <ListItemContent
            name="Erstellt am"
            value={
            moment(fields.createdAt).format('DD.MM.YYYY, HH:mm')
          }
          />
        </ListItem>
        <ListItem>
          <ListItemContent
            name="Zuletzt aktualisiert am"
            value={
            moment(fields.updatedAt).format('DD.MM.YYYY, HH:mm')
}
          />
        </ListItem>
        <ListItem>
          <ListItemContent name="Kommentar" value={fields.comment} />
        </ListItem>
      </List>
    </div>
  );
};

MyLibElement.propTypes = {
  setHeading: PropTypes.func.isRequired,
};

MyLibElement.defaultProps = {
};
export default MyLibElement;
