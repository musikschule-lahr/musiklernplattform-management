/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  GET_COMPOSERS, ADD_COMPOSER, UPDATE_COMPOSER, REMOVE_COMPOSER,
} from '~/constants/gql/lib';
import {
  validationFunctions,
} from '~/constants/util';
import AddElement from '../AddElement';
import AddElementWithoutModal from '../AddElement/AddElementWithoutModal';

const AddComposer = ({
  onChange, preSelected, isNotRequired, onRemoveSelection, isListing,
}) => {
  const composerProps = {
    title: 'Komponist',
    getQuery: GET_COMPOSERS,
    addQuery: ADD_COMPOSER,
    updateQuery: UPDATE_COMPOSER,
    removeQuery: REMOVE_COMPOSER,
    addTitleValues: {
      title: 'Neuen Komponisten hinzufügen',
      submitTitle: 'Komponist hinzufügen',
    },
    editTitleValues: {
      title: 'Komponisten bearbeiten',
      submitTitle: 'Komponist bearbeiten',
    },
    getDisplayedLabel: (composer) => (
      composer.firstname || composer.lastname ? `${
        composer.firstname} ${composer.lastname}` : 'Kein Komponist'),
    elementFields: [{
      valueName: 'firstname',
      label: 'Vorname',
      errorFunc: validationFunctions.isRequiredFunc,
    }, {
      valueName: 'lastname',
      label: 'Nachname',
      errorFunc: validationFunctions.isRequiredFunc,
    }, {
      valueName: 'yearOfBirth',
      label: 'Geburtsdatum',
      isNumber: true,
      errorFunc: validationFunctions.isRequiredYearFunc,
    }, {
      valueName: 'yearOfDeath',
      label: 'Todesdatum',
      isNumber: true,
      errorFunc: validationFunctions.isNotRequiredYearFunc,
    },
    ],
    idField: 'idComposer',
    addElementTitle: 'Komponist hinzufügen',
    removeText: 'Komponist entfernen',
    removeMsg: (e) => (`Sicher, dass der Komponist ${
      e.firstname} ${
      e.lastname} entfernt werden soll?`),
  };
  if (!isListing) {
    return (
      <>
        <AddElement
          {...composerProps}
          onChange={onChange}
          getError={(composer) => (isNotRequired || composer.firstname || composer.lastname ? null
            : 'Es ist kein Komponist ausgewählt.')}
          preSelected={preSelected}
          onRemoveSelection={onRemoveSelection}
        />
      </>
    );
  }
  return (
    <AddElementWithoutModal
      disallowSelectingItems
      {...composerProps}
    />
  );
};
AddComposer.propTypes = {
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  preSelected: PropTypes.object,
  isNotRequired: PropTypes.bool,
  isListing: PropTypes.bool,
  onRemoveSelection: PropTypes.func,
};
AddComposer.defaultProps = {
  onChange: () => {},
  preSelected: null,
  isNotRequired: false,
  isListing: false,
  onRemoveSelection: null,
};
export default AddComposer;
