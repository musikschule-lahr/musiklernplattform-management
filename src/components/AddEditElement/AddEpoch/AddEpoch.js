/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  GET_EPOCHS, ADD_EPOCH, UPDATE_EPOCH, REMOVE_EPOCH,
} from '~/constants/gql/lib';
import {
  validationFunctions,
} from '~/constants/util';
import AddElement from '../AddElement';
import AddElementWithoutModal from '../AddElement/AddElementWithoutModal';

const AddEpoch = ({ onChange, preSelected, isListing }) => {
  const epochProps = {
    title: 'Epoche',
    getQuery: GET_EPOCHS,
    addQuery: ADD_EPOCH,
    updateQuery: UPDATE_EPOCH,
    removeQuery: REMOVE_EPOCH,
    addTitleValues: {
      title: 'Neue Epoche hinzufügen',
      submitTitle: 'Epoche hinzufügen',
    },
    editTitleValues: {
      title: 'Epochen bearbeiten',
      submitTitle: 'Epoche bearbeiten',
    },
    getDisplayedLabel: (epoch) => (epoch.code ? `${
      epoch.code}: (${epoch.description})` : 'Keine Epoche'),
    elementFields: [{
      valueName: 'code',
      label: 'Kürzel',
      errorFunc: validationFunctions.isRequiredFunc,
    }, {
      valueName: 'description',
      label: 'Beschreibung',
      errorFunc: validationFunctions.isRequiredFunc,
    },
    ],
    idField: 'idEpoch',
    addElementTitle: 'Epoche hinzufügen',
    removeText: 'Epoche entfernen',
    removeMsg: (e) => (`Sicher, dass die Epoche ${
      e.code}: ${
      e.description} entfernt werden soll?`),
  };
  if (!isListing) {
    return (
      <>
        <AddElement
          {...epochProps}
          onChange={onChange}
          getError={(epoch) => (epoch.code ? null
            : 'Eine Epoche muss ausgewählt werden')}
          preSelected={preSelected}
        />
      </>
    );
  }
  return (
    <AddElementWithoutModal
      disallowSelectingItems
      {...epochProps}
    />
  );
};
AddEpoch.propTypes = {
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  preSelected: PropTypes.object,
  isListing: PropTypes.bool,
};
AddEpoch.defaultProps = {
  onChange: () => {},
  preSelected: null,
  isListing: false,
};
export default AddEpoch;
