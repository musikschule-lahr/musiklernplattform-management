/* eslint-disable react/no-array-index-key */
import React from 'react';

import PropTypes from 'prop-types';
import ElementList from './ElementList';

const ElementListWithoutModal = ({
  title, dataQuery, getDisplayedLabel,
  newComponent, onEdit, onDelete, idField,
  disallowSelectingItems,
}) => (
  <ElementList
    newComponent={newComponent}
    dataQuery={dataQuery}
    getDisplayedLabel={getDisplayedLabel}
    onEdit={onEdit}
    onDelete={onDelete}
    title={title}
    idField={idField}
    disallowSelectingItems={disallowSelectingItems}
  />

);
ElementListWithoutModal.propTypes = {
  idField: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  dataQuery: PropTypes.object.isRequired,
  getDisplayedLabel: PropTypes.func.isRequired,
  newComponent: PropTypes.node.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disallowSelectingItems: PropTypes.bool.isRequired,
};

export default ElementListWithoutModal;
