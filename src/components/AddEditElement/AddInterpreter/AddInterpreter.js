/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  GET_INTERPRETERS, ADD_INTERPRETER, UPDATE_INTERPRETER, REMOVE_INTERPRETER,
} from '~/constants/gql/lib';
import {
  validationFunctions,
} from '~/constants/util';
import AddElement from '../AddElement';
import AddElementWithoutModal from '../AddElement/AddElementWithoutModal';

const AddInterpreter = ({
  onChange, preSelected, isNotRequired, isListing,
}) => {
  const interpreterProps = {
    title: 'Interpret',
    getQuery: GET_INTERPRETERS,
    addQuery: ADD_INTERPRETER,
    updateQuery: UPDATE_INTERPRETER,
    removeQuery: REMOVE_INTERPRETER,
    addTitleValues: {
      title: 'Neuen Interpret hinzufügen',
      submitTitle: 'Interpret hinzufügen',
    },
    editTitleValues: {
      title: 'Interpret bearbeiten',
      submitTitle: 'Interpret bearbeiten',
    },
    getDisplayedLabel: (interpreter) => (interpreter.name ? `${interpreter.name}` : 'Kein Interpret'),
    elementFields: [{
      valueName: 'name',
      label: 'Name',
      errorFunc: validationFunctions.isRequiredFunc,
    },
    ],
    idField: 'idInterpreter',
    addElementTitle: 'Interpret hinzufügen',
    removeText: 'Instrument entfernen',
    removeMsg: (e) => (e) => (`Sicher, dass der Interpret ${
      e.name} entfernt werden soll?`),
  };
  if (!isListing) {
    return (
      <>
        <AddElement
          {...interpreterProps}
          onChange={onChange}
          idField="idInterpreter"
          getError={(interpreter) => (isNotRequired || interpreter.name ? null
            : 'Es ist kein Interpret ausgewählt.')}
          preSelected={preSelected}
          canPickMultiple={false}
        />
      </>
    );
  }
  return (
    <AddElementWithoutModal
      disallowSelectingItems
      {...interpreterProps}
    />
  );
};
AddInterpreter.propTypes = {
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  preSelected: PropTypes.object,
  isNotRequired: PropTypes.bool,
  isListing: PropTypes.bool,
};
AddInterpreter.defaultProps = {
  onChange: () => {},
  preSelected: null,
  isNotRequired: false,
  isListing: false,
};
export default AddInterpreter;
