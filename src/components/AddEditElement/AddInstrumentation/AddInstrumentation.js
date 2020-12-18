/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  GET_INSTRUMENTATIONS, ADD_INSTRUMENTATION, UPDATE_INSTRUMENTATION, REMOVE_INSTRUMENTATION,
} from '~/constants/gql/lib';
import {
  validationFunctions,
} from '~/constants/util';
import AddElement from '../AddElement';
import AddElementWithoutModal from '../AddElement/AddElementWithoutModal';

const AddInstrumentation = ({ onChange, preSelected, isListing }) => {
  const instrumentationProps = {
    title: 'Besetzung',
    getQuery: GET_INSTRUMENTATIONS,
    addQuery: ADD_INSTRUMENTATION,
    updateQuery: UPDATE_INSTRUMENTATION,
    removeQuery: REMOVE_INSTRUMENTATION,
    addTitleValues:
      {
        title: 'Neue Besetzung hinzufügen',
        submitTitle: 'Besetzung hinzufügen',
      },
    editTitleValues: {
      title: 'Besetzungen bearbeiten',
      submitTitle: 'Besetzungen bearbeiten',
    },
    getDisplayedLabel: (instrumentation) => (instrumentation.idInstrumentation ? `${
      instrumentation.name || 'Keine Besetzung'}` : 'Keine Besetzung ausgewählt'),
    elementFields: [{
      valueName: 'name',
      label: 'Name',
      errorFunc: validationFunctions.isRequiredFunc,
    },
    ],
    idField: 'idInstrumentation',
    addElementTitle: 'Besetzung hinzufügen',
    removeText: 'Besetzung entfernen',
    removeMsg: (e) => (`Sicher, dass die Besetzung ${
      e.name} entfernt werden soll?`),
  };
  if (!isListing) {
    return (
      <>
        <AddElement
          {...instrumentationProps}
          onChange={onChange}
          getError={(instrumentation) => (instrumentation.idInstrumentation ? null
            : 'Eine Besetzung muss ausgewählt werden')}
          preSelected={preSelected}
        />
      </>
    );
  }
  return (
    <AddElementWithoutModal
      disallowSelectingItems
      {...instrumentationProps}
    />
  );
};
AddInstrumentation.propTypes = {
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  preSelected: PropTypes.object,
  isListing: PropTypes.bool,
};
AddInstrumentation.defaultProps = {
  onChange: () => {},
  preSelected: null,
  isListing: false,
};
export default AddInstrumentation;
