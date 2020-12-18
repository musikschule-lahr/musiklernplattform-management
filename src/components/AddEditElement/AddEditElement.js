/* eslint-disable react/no-array-index-key */
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import {
  Input, MultiSelectInput, IconButton, TextButton, Button, ListItem,
} from 'musiklernplattform-components';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery, useApolloClient } from '@apollo/client';
import VideoIcon from '@iconify/icons-ion/film-outline';
import MusicIcon from '@iconify/icons-ion/musical-notes-outline';
import moment from 'moment';
import AddIcon from '@iconify/icons-ion/add-circle';
import styled from 'styled-components';
import {
  GET_LIB_ELEMENT_FROM_PATH, ADD_LIB_ELEMENT, EDIT_LIB_ELEMENT, UPDATE_TRACK,
} from '~/constants/gql/lib';
import { getFilePath } from '~/constants/util';
import AddEditTracks from './AddEditTracks';
import AddEditCover from './AddEditCover';
import AddComposer from './AddComposer';
import AddEpoch from './AddEpoch';
import AddInstrumentation from './AddInstrumentation';
import AddInstrument from './AddInstrument';
import AddInterpreter from './AddInterpreter';
import AddCategories from './AddCategories';
import LoadingIndicator from '~/components/Generic/LoadingIndicator';

const playerTypeOptsData = [{
  key: 'Korrepetition', value: 'Korrepetition', selected: false, idx: 0,
},
{
  key: 'Ensemble/Band', value: 'Ensemble_Band', selected: true, idx: 1,
},
{
  key: 'Solo', value: 'Solo', selected: false, idx: 2,
}];
const fieldCategories = { MAIN: 0, SUB: 1 };
const ButtonRow = styled.div`
  margin-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, .3);
  width: 100%;
  padding: 2rem 0;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  button {
    width: 30%;
    margin-left:auto;
    margin-right: auto;
  }
`;

const MyLibElement = ({ setActionItems, setHeading }) => {
  const client = useApolloClient();
  const history = useHistory();

  const { path } = useParams();
  const [fields, _setFields] = useState(null);
  const [playerTypeOpts, _setPlayerTypeOpts] = useState(playerTypeOptsData);
  const [coverImagePath, setCoverImagePath] = useState(null);
  const [epoch, setEpoch] = useState(null);
  const [instrumentation, setInstrumentation] = useState(null);
  const [composer, setComposer] = useState(null);
  const [interpreter, setInterpreter] = useState(null);
  const [instruments, setInstruments] = useState(null);
  const [categories, setCategories] = useState(null);
  const [libElement, setLibElement] = useState(null);
  const [productionNo, setProductionNo] = useState('');
  const [tracks, setTracks] = useState([]);
  const [video, setVideo] = useState(null);

  const fieldsRef = useRef(null);
  const playerTypeOptsRef = useRef(playerTypeOpts);
  const setPlayerTypeOpts = (data) => {
    _setPlayerTypeOpts(data);
    playerTypeOptsRef.current = data;
  };

  const setFields = (data) => {
    _setFields(data);
    fieldsRef.current = data;
  };
  const getFieldTemplate = (name, value, listIdx, itemIdx, isRequired, fieldRegex, label, type) => ({
    name, value, listIdx, itemIdx, isRequired, fieldRegex, label, type: (type || 'text'),
  });
  const playerTypeChangeHandler = (item) => {
    let newPlayerTypes = [...playerTypeOpts];
    newPlayerTypes = newPlayerTypes.map((type) => {
      const { selected, ...rest } = type;
      return ({ ...rest, selected: false });
    });
    newPlayerTypes[item.idx].selected = !item.selected;
    setPlayerTypeOpts(newPlayerTypes);
  };

  const generateNewFields = (data) => [
    {
      title: 'Generelle Daten',
      values: [
        getFieldTemplate('Titel', data ? data.metaData.title : '', 0, 0, true, null, 'title'),
        getFieldTemplate('Kurztitel', data ? data.metaData.shortTitle : '', 0, 1, true, null, 'shortTitle'),
        getFieldTemplate('Kommentar', data ? data.metaData.comment : '', 0, 2, false, null, 'comment'),
      ],
    },
    {
      title: 'Metadaten',
      values: [
        getFieldTemplate('Unterer Schwierigkeitsgrad',
          data ? `${data.metaData.difficultyMin || ''}` : '', 1, 0, false, /\d+/, 'difficultyMin', 'number'),
        getFieldTemplate('Oberer  Schwierigkeitsgrad',
          data ? `${data.metaData.difficultyMax || ''}` : '', 1, 1, false, /\d+/, 'difficultyMax', 'number'),
        getFieldTemplate('Satz',
          data ? data.metaData.movement : '', 1, 2, false, null, 'movement'),
        getFieldTemplate('Tuning (Hz)',
          data ? data.metaData.tuning : '', 1, 3, true, /\d+/, 'tuning', 'number'),
        getFieldTemplate('Aufnahmejahr',
          data ? data.metaData.yearOfRecording : '', 1, 4, false, /\d+/, 'yearOfRecording', 'number'),
      ],
    },
  ];
  // Normale Inputfelder in Array zum dynamischen Hinzufügen beliebiger Eingabefelder
  useEffect(() => {
    if (path) {
      client.query({
        query: GET_LIB_ELEMENT_FROM_PATH,
        variables: { path: `${path}` },
        fetchPolicy: 'network-only',
      }).then((data) => {
        setLibElement(data.data.getLibElementFromPath);
        setFields(generateNewFields(data.data.getLibElementFromPath));
        setComposer(data.data.getLibElementFromPath.metaData.composer);
        setInterpreter(data.data.getLibElementFromPath.metaData.interpreter);
        setEpoch(data.data.getLibElementFromPath.metaData.epoch);
        setCategories(data.data.getLibElementFromPath.categories);
        setInstrumentation(data.data.getLibElementFromPath.metaData.instrumentation);
        setInstruments(data.data.getLibElementFromPath.instruments);
        setProductionNo(data.data.getLibElementFromPath.productionNo);
        const dataTracks = [...data.data.getLibElementFromPath.tracks];
        const idx = dataTracks.findIndex((track) => (track.isVideo));
        if (idx >= 0) {
          setVideo(dataTracks.splice(idx, 1)[0]);
        }
        setTracks(dataTracks);
        const newTypeOpts = [...playerTypeOpts];
        playerTypeOpts.forEach((item, index) => {
          if (data.data.getLibElementFromPath.playerType === item.value) {
            newTypeOpts[index].selected = true;
          } else newTypeOpts[index].selected = false;
        });
        setCoverImagePath(data.data.getLibElementFromPath.metaData.coverImagePath);
        setPlayerTypeOpts(newTypeOpts);
      });
    } else setFields(generateNewFields());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkErrorMsg = (fieldValue) => {
    let result = '';
    // eslint-disable-next-line no-param-reassign
    if (!fieldValue.value) fieldValue.value = '';
    if (fieldValue.isRequired && fieldValue.value.length < 1) result += 'Dieses Feld ist benötigt. ';
    if (fieldValue.value.length > 0 && fieldValue.fieldRegex
      && !fieldValue.value.match(fieldValue.fieldRegex)) result += 'Die Eingabe stimmt nicht. ';
    if (result.length > 0) return result;
    return null;
  };
  const fieldEditHandler = (value, listIdx, itemIdx) => {
    const newFields = [...fields];
    newFields[listIdx].values[itemIdx].value = value;
    setFields(newFields);
  };
  const fieldClearHandler = (listIdx, itemIdx) => {
    const newFields = [...fields];
    newFields[listIdx].values[itemIdx].value = '';
    setFields(newFields);
  };
  const onEpochChange = (value) => {
    setEpoch(value);
  };
  const onCategoryChange = (value) => {
    setCategories(value);
  };
  const onInstrumentationChange = (value) => {
    setInstrumentation(value);
  };

  const onComposerChange = (value) => {
    setComposer(value);
  };

  const onInterpreterChange = (value) => {
    setInterpreter(value);
  };
  const onInstrumentChange = (value) => {
    setInstruments(value);
  };
  const changeCoverImagePath = (newPath) => {
    setCoverImagePath(newPath);
  };

  const generateVariables = () => {
    const variables = { metadata: {}, productionNo };
    fields[fieldCategories.MAIN].values.forEach((item) => {
      if (item.value.length > 0) {
        if (item.type === 'number') variables.metadata[item.label] = parseInt(item.value, 10);
        else variables.metadata[item.label] = item.value;
      }
    });
    playerTypeOpts.some((item) => {
      if (item.selected) {
        variables.playerType = item.value;
        return true;
      }
    });
    fields[fieldCategories.SUB].values.forEach((item) => {
      if (item.value.length > 0) {
        if (item.type === 'number') variables.metadata[item.label] = parseInt(item.value, 10);
        else variables.metadata[item.label] = item.value;
      }
    });
    if (composer)variables.metadata.composer = { id: composer.idComposer };
    if (interpreter)variables.metadata.interpreter = { id: interpreter.idInterpreter };
    if (epoch)variables.metadata.epoch = { id: epoch.idEpoch };
    if (categories) {
      variables.categories = categories.map(
        (category) => ({ id: category.idCategory }),
      );
    }
    if (instrumentation)variables.metadata.instrumentation = { id: instrumentation.idInstrumentation };
    if (instruments) {
      variables.instruments = instruments.map(
        (instrument) => ({ id: instrument.idInstrument }),
      );
    }
    return variables;
  };
  const addElement = () => {
    const variables = generateVariables();

    Promise.all(tracks.map(async (track) => {
      /* return new Promise((res, rej) => {
        client.mutate({
          mutation: UPDATE_TRACK,
          variables: {
            libElementId,
            title,
            isVideo,
            sorting: (isVideo ? 0 : sortingValue),
          },
        }).then((data) => {
          resolve();
        });
      }); */
    }));

    client.mutate({
      mutation: ADD_LIB_ELEMENT,
      variables,
    }).then((data) => {
      alert('Das Element wurde erfolgreich erstellt.');
      history.push(`/edit-lib/${data.data.addLibElement.playerPath}`);
    });
  };
  const editElement = () => {
    const variables = generateVariables();
    Promise.all(tracks.map(async (track) => {
      if (track.newSorting) {
        return new Promise((res, rej) => {
          client.mutate({
            mutation: UPDATE_TRACK,
            variables: {
              id: track.idTrack,
              sorting: track.sorting,
            },
          }).then((data) => {
            res();
          });
        });
      }
    }));

    variables.idLibElement = libElement.idLibElement;
    client.mutate({
      mutation: EDIT_LIB_ELEMENT,
      variables,
    }).then(() => {
      alert('Das Element wurde erfolgreich geändert.');
    });
  };
  const removeElement = () => {

  };

  const isDisabled = () => {
    let disabled = false;
    if (!(composer || interpreter) || (instruments || []).length < 1
    || !instrumentation || (categories || []).length < 1 || !epoch || productionNo.length < 1) return true;
    fields.forEach((field) => {
      field.values.forEach((item) => {
        if ((checkErrorMsg(item) || '').length > 1) disabled = true;
      });
    });
    return disabled;
  };

  const onTracksChange = (newTracks, newVideo) => {
    setTracks(newTracks);
    setVideo(newVideo);
  };
  const getFieldValues = (fieldValue) => (
    <label key={`libElem_${fieldValue.name}`}>
      {fieldValue.name}
      <br />
      {fieldValue.customField ? <>{fieldValue.customField}</>
        : (
          <Input
            value={fieldValue.value}
            clearButtons
            name={`${fieldValue}_input`}
            onChangeHandler={(value) => fieldEditHandler(value, fieldValue.listIdx, fieldValue.itemIdx)}
            onClearHandler={() => fieldClearHandler(fieldValue.listIdx, fieldValue.itemIdx)}
            error={checkErrorMsg(fieldValue)}
          />
        )}
      <br />
    </label>
  );
  if (!fields) return <LoadingIndicator />;
  return (
    <div className="libElement">
      <div>
        <h3>{fields[fieldCategories.MAIN].title}</h3>
        {fields[fieldCategories.MAIN].values.map(getFieldValues)}
        <label>
          Produktionsnummer
          <br />
          <Input
            value={productionNo}
            clearButtons
            name="productionNo_input"
            onChangeHandler={(value) => setProductionNo(value)}
            onClearHandler={() => setProductionNo('')}
            error={productionNo.length < 1 && 'Dieses Feld ist benötigt.'}
          />
          <br />
        </label>
        <AddComposer
          onChange={onComposerChange}
          preSelected={composer}
          isNotRequired={interpreter !== null}
        />
        <AddInterpreter
          onChange={onInterpreterChange}
          preSelected={interpreter}
          isNotRequired={composer !== null}
        />
        <AddInstrument
          onChange={onInstrumentChange}
          preSelected={instruments}
        />
        <label>
          Playertyp
          <br />
          <MultiSelectInput
            options={playerTypeOpts}
            onChangeHandler={playerTypeChangeHandler}
            placeholder="Wähle einen Playertyp aus"
            overlayTitle="Playertyp"
          />
          <br />
        </label>
      </div>
      <div>
        <h3>{fields[fieldCategories.SUB].title}</h3>
        {fields[fieldCategories.SUB].values.map(getFieldValues)}

        <AddEpoch onChange={onEpochChange} preSelected={epoch} />
        <AddCategories onChange={onCategoryChange} preSelected={categories} />
        <AddInstrumentation onChange={onInstrumentationChange} preSelected={instrumentation} />
      </div>
      <div>
        <h3>Cover</h3>
        <AddEditCover
          coverImagePath={getFilePath(coverImagePath, libElement)}
          setCoverImagePath={changeCoverImagePath}
          libElementId={libElement ? libElement.idLibElement : null}
        />
      </div>
      <div>

        <h3>Tracks</h3>
        <span>Änderungen an Tracks (mit Ausnahme der Reihenfolge) werden automatisch gespeichert.</span>
        <AddEditTracks
          libElementTracks={tracks}
          libElementExists={libElement !== null}
          libElementVideo={video}
          onTracksChange={onTracksChange}
          libElementId={libElement ? libElement.idLibElement : null}
        />
      </div>
      <ButtonRow>
        <Button
          onClickHandler={libElement ? editElement : addElement}
          disabled={isDisabled()}
          title={libElement ? 'Bibliothekselement bearbeiten' : 'Bibliothekselement anlegen'}
        />
        {libElement
              && (
              <Button
                style={{ marginLeft: '1rem' }}
                onClickHandler={removeElement}
                title="Bibliothekselement löschen"
              />
              )}
      </ButtonRow>
    </div>
  );
};

MyLibElement.propTypes = {
  setActionItems: PropTypes.func,
  setHeading: PropTypes.func.isRequired,
};

MyLibElement.defaultProps = {
  setActionItems: null,
};

export default MyLibElement;
