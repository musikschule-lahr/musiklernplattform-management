/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  GET_INSTRUMENTS, ADD_INSTRUMENT, UPDATE_INSTRUMENT, REMOVE_INSTRUMENT,
} from '~/constants/gql/lib';
import {
  validationFunctions,
} from '~/constants/util';
import AddElement from '../AddElement';
import AddElementWithoutModal from '../AddElement/AddElementWithoutModal';

const AddInstrument = ({
  onChange, preSelected, isNotRequired, isListing,
}) => {
  const getInstrumentLabel = (instruments) => {
    if (!instruments) return 'Kein Instrument';
    if (!Array.isArray(instruments)) return instruments.name;
    return instruments.map((instrument) => (`${instrument.name}`)).join(', ');
  };
  const instrumentProps = {
    title: 'Instrumente',
    getQuery: GET_INSTRUMENTS,
    addQuery: ADD_INSTRUMENT,
    updateQuery: UPDATE_INSTRUMENT,
    removeQuery: REMOVE_INSTRUMENT,
    addTitleValues:
     {
       title: 'Neues Instrument hinzufügen',
       submitTitle: 'Instrument hinzufügen',
     },
    editTitleValues:
      {
        title: 'Instrument bearbeiten',
        submitTitle: 'Instrument bearbeiten',
      },
    getDisplayedLabel: getInstrumentLabel,
    elementFields: [
      {
        valueName: 'name',
        label: 'Name',
        errorFunc: validationFunctions.isRequiredFunc,
      }, {
        valueName: 'instrumentGroup',
        label: 'Instrumentengruppe',
      },
    ],
    idField: 'idInstrument',
    addElementTitle: 'Instrument hinzufügen',
    removeText: 'Instrument entfernen',
    removeMsg: (e) => (`Sicher, dass das Instrument ${e.name}, entfernt werden soll?`),
  };
  if (!isListing) {
    return (
      <>
        <AddElement
          {...instrumentProps}
          onChange={onChange}
          canPickMultiple
          getError={(instrument) => (isNotRequired || instrument[0] ? null
            : 'Es ist kein Instrument ausgewählt.')}
          preSelected={preSelected}
        />
      </>
    );
  }
  return (
    <AddElementWithoutModal
      disallowSelectingItems
      {...instrumentProps}
    />
  );
};
AddInstrument.propTypes = {
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  preSelected: PropTypes.object,
  isNotRequired: PropTypes.bool,
  isListing: PropTypes.bool,
};
AddInstrument.defaultProps = {
  onChange: () => {},
  preSelected: null,
  isNotRequired: false,
  isListing: false,
};
export default AddInstrument;
