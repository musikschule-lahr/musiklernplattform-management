/* eslint-disable react/no-array-index-key */
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogNormalHeader,
  DialogNormalBody, DialogButtonRow,
  TextButton, Button,
} from 'musiklernplattform-components';
import PropTypes from 'prop-types';
import ElementList from './ElementList';

const ElementModal = ({
  onClose, onSubmit, title, dataQuery, getDisplayedLabel,
  newComponent, onEdit, onDelete, preSelected, idField,
  removeSelectFunc, canPickMultiple, disallowSelectingItems,
}) => {
  const [values, setValues] = useState([]);

  const lastSelected = useRef(null);

  const onFormSubmit = () => {
    if (canPickMultiple) {
      onSubmit(lastSelected.current);
    } else if (lastSelected.current !== null || !canPickMultiple) onSubmit(values[lastSelected.current]);
    else onSubmit(null);
  };
  const onRemoveSelect = () => {
    const newValues = [...values];
    if (canPickMultiple) {
      lastSelected.current.forEach((e) => {
        newValues[e.index].selected = false;
      });
      lastSelected.current = [];
    } else if (lastSelected.current !== null) {
      newValues[lastSelected.current].selected = false;
      lastSelected.current = null;
    }
    setValues(newValues);
    removeSelectFunc(null);
  };

  const setNewValues = (newValues) => {
    setValues(newValues);
  };
  const setNewLastSelected = (newValues) => {
    lastSelected.current = newValues;
  };
  return (
    <Dialog onClose={() => onClose()}>
      <DialogNormalHeader>
        <h4>{title}</h4>
        <TextButton title="Schließen" onClickHandler={() => onClose()} />
      </DialogNormalHeader>
      <DialogNormalBody className="flex-column">
        <ElementList
          newComponent={newComponent}
          preSelected={preSelected}
          setNewValues={setNewValues}
          setNewLastSelected={setNewLastSelected}
          dataQuery={dataQuery}
          getDisplayedLabel={getDisplayedLabel}
          onEdit={onEdit}
          onDelete={onDelete}
          idField={idField}
          canPickMultiple={canPickMultiple}
          disallowSelectingItems={disallowSelectingItems}
        />
        <DialogButtonRow>
          <Button
            onClickHandler={onFormSubmit}
            title="Fertig"
          />
          <Button
            onClickHandler={onRemoveSelect}
            title="Auswahl entfernen"
          />
        </DialogButtonRow>
      </DialogNormalBody>
    </Dialog>
  );
};
ElementModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  dataQuery: PropTypes.object.isRequired,
  getDisplayedLabel: PropTypes.func.isRequired,
  newComponent: PropTypes.node.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disallowSelectingItems: PropTypes.bool.isRequired,
  preSelected: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  idField: PropTypes.string.isRequired,
  removeSelectFunc: PropTypes.func,
  canPickMultiple: PropTypes.bool,
};
ElementModal.defaultProps = {
  preSelected: null,
  removeSelectFunc: () => {},
  canPickMultiple: false,
};
export default ElementModal;
