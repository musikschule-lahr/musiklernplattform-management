/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  GET_CATEGORIES, ADD_CATEGORY, UPDATE_CATEGORY, REMOVE_CATEGORY,
} from '~/constants/gql/lib';
import {
  validationFunctions,
} from '~/constants/util';
import AddElement from '../AddElement';
import AddElementWithoutModal from '../AddElement/AddElementWithoutModal';

const AddCategories = ({
  onChange, preSelected, isNotRequired, isListing,
}) => {
  const getCategoriesLabel = (categories) => {
    if (!categories) return 'Keine Kategorien';
    if (!Array.isArray(categories)) return categories.name;
    return categories.map((category) => (`${category.name}`)).join(', ');
  };
  const categoriesProps = {
    title: 'Kategorie',
    getQuery: GET_CATEGORIES,
    addQuery: ADD_CATEGORY,
    updateQuery: UPDATE_CATEGORY,
    removeQuery: REMOVE_CATEGORY,
    addTitleValues: {
      title: 'Neuen Kategorie hinzufügen',
      submitTitle: 'Kategorie hinzufügen',
    },
    editTitleValues: {
      title: 'Kategorie bearbeiten',
      submitTitle: 'Kategorie hinzufügen',
    },
    getDisplayedLabel: getCategoriesLabel,
    elementFields: [{
      valueName: 'name',
      label: 'Name',
      errorFunc: validationFunctions.isRequiredFunc,
    },
    ],
    idField: 'idCategory',
    addElementTitle: 'Kategorie hinzufügen',
    removeText: 'Kategorie entfernen',
    removeMsg: (e) => (`Sicher, dass die Kategorie ${
      e.name} entfernt werden soll?`),
  };
  if (!isListing) {
    return (
      <>
        <AddElement
          {...categoriesProps}
          onChange={onChange}
          canPickMultiple
          getError={(category) => (isNotRequired || category[0] ? null
            : 'Es wurde keine Kategorie ausgewählt.')}
          preSelected={preSelected}
        />
      </>
    );
  }
  return (
    <AddElementWithoutModal
      disallowSelectingItems
      {...categoriesProps}
    />
  );
};
AddCategories.propTypes = {
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  preSelected: PropTypes.object,
  isNotRequired: PropTypes.bool,
  isListing: PropTypes.bool,
};
AddCategories.defaultProps = {
  onChange: () => {},
  preSelected: null,
  isNotRequired: false,
  isListing: false,
};
export default AddCategories;
