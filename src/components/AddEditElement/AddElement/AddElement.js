/* eslint-disable react/forbid-prop-types */
import React, { useState, useRef, useEffect } from 'react';
import {
  Input, IconButton, TextButton,
} from 'musiklernplattform-components';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/client';
import AddIcon from '@iconify/icons-ion/add-circle';
import ElementModal from './ElementModal';
import AddElementModal from './AddElementModal';
import ChoiceModal from '~/components/Generic/ChoiceModal';

const AddElement = ({
  title, onChange, getQuery, addQuery, updateQuery, removeQuery, addTitleValues, editTitleValues, getDisplayedLabel,
  elementFields, idField, getError, addElementTitle, removeText, removeMsg, preSelected, disallowSelectingItems,
  canPickMultiple,
}) => {
  const client = useApolloClient();
  const [showElementDialog, setShowElementDialog] = useState(false);
  const [showAddElement, setShowAddElement] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selected, setSelected] = useState({});
  const addeditProps = useRef(null);
  const openedRef = useRef(null);

  useEffect(() => {
    if (preSelected) {
      setSelected(preSelected);
    }
  }, [preSelected]);

  const submitNewElement = (variables) => {
    client.mutate({
      mutation: addQuery,
      variables,
    }).then(() => {
      setShowAddElement(false);
      setShowElementDialog(true);
    });
  };

  const addElementComponent = useRef(<TextButton
    onClickHandler={() => {
      setShowElementDialog(false);
      addeditProps.current = {
        ...addTitleValues,
        elementFields,
        onSubmit: submitNewElement,
      };
      setShowAddElement(true);
    }}
    title={addTitleValues.title}
  />);

  const editElement = (variables) => {
    const { id, ...rest } = variables;
    client.mutate({
      mutation: updateQuery,
      variables: {
        ...rest,
        id: parseInt(id, 10),
      },
    }).then(() => {
      setShowAddElement(false);
      setShowElementDialog(true);
    });
  };

  const onElementEdit = (element) => {
    setShowElementDialog(false);
    const currentElementFields = elementFields.map((elementField) => ({
      ...elementField,
      value: element[elementField.valueName],
    }));
    const newAddEditProps = {
      title: editTitleValues.title,
      id: element[idField],
      submitTitle: editTitleValues.submitTitle,
      onSubmit: editElement,
      elementFields: currentElementFields,
    };

    addeditProps.current = newAddEditProps;
    setShowAddElement(true);
  };

  const onElementDelete = (element) => {
    openedRef.current = element;
    setShowElementDialog(false);
    setShowRemoveModal(true);
  };

  const onElementSubmit = (element) => {
    if (canPickMultiple) {
      setSelected(element);
      setShowElementDialog(false);
      onChange(element);
      return;
    }
    setSelected(element || {});
    setShowElementDialog(false);
    onChange(element || null);
  };
  const onRemoveSelect = () => {
    if (!canPickMultiple) {
      setSelected({});
      onChange(null);
    } else {
      let idx = -1;
      const curr = [...selected];
      if (openedRef.current) {
        if (selected.some((e, index) => {
          idx = index;
          return e[idField] === openedRef.current[idField];
        })) {
          if (idx > -1) {
            curr.splice(idx, 1);
            setSelected(curr);
            onChange(curr);
          }
        }
      } else {
        setSelected([]);
        onChange([]);
      }
    }
  };
  const removeElement = () => {
    client.mutate({
      mutation: removeQuery,
      variables: {
        id: parseInt(openedRef.current[idField], 10),
      },
    }).then(() => {
      onRemoveSelect();
      openedRef.current = null;
      setShowRemoveModal(false);
      setShowElementDialog(true);
    });
  };
  return (
    <>
      {showElementDialog && (
      <ElementModal
        disallowSelectingItems={disallowSelectingItems}
        preSelected={selected}
        idField={idField}
        onClose={() => setShowElementDialog(false)}
        onSubmit={onElementSubmit}
        title={addElementTitle}
        dataQuery={getQuery}
        onEdit={onElementEdit}
        onDelete={onElementDelete}
        newComponent={addElementComponent.current}
        getDisplayedLabel={getDisplayedLabel}
        removeSelectFunc={onRemoveSelect}
        canPickMultiple={canPickMultiple}
      />
      )}
      {showAddElement
      && (
      <AddElementModal
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...addeditProps.current}
        onClose={() => { setShowAddElement(false); setShowElementDialog(true); }}
      />
      )}
      {showRemoveModal
      && (
      <ChoiceModal
        headerMsg={removeText}
        message={removeMsg(openedRef.current)}
        onClose={() => { setShowRemoveModal(false); setShowElementDialog(true); }}
        onSubmit={removeElement}
        submitText="OK"
        closeText="Abbrechen"
      />
      )}
      <label key={`libElem_${addElementTitle}`}>
        {title}
        <br />
        <Input
          value={getDisplayedLabel(selected)}
          disabled
          readOnly
          error={getError(selected)}
        />
        <IconButton
          icon={AddIcon}
          className="flex-row"
          label={addElementTitle}
          onClickHandler={() => setShowElementDialog(true)}
        />
        <br />
      </label>
    </>
  );
};
AddElement.propTypes = {
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  getQuery: PropTypes.object.isRequired,
  addQuery: PropTypes.object.isRequired,
  updateQuery: PropTypes.object.isRequired,
  removeQuery: PropTypes.object.isRequired,
  addTitleValues: PropTypes.shape({
    title: PropTypes.string.isRequired,
    submitTitle: PropTypes.string.isRequired,
  }).isRequired,
  editTitleValues: PropTypes.shape({
    title: PropTypes.string.isRequired,
    submitTitle: PropTypes.string.isRequired,
  }).isRequired,
  getDisplayedLabel: PropTypes.func.isRequired,
  elementFields: PropTypes.arrayOf(PropTypes.shape({
    valueName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isNumber: PropTypes.bool,
    errorFunc: PropTypes.func.isRequired,
  })).isRequired,
  idField: PropTypes.string.isRequired,
  getError: PropTypes.func,
  addElementTitle: PropTypes.string.isRequired,
  removeText: PropTypes.string.isRequired,
  removeMsg: PropTypes.func.isRequired,
  preSelected: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  canPickMultiple: PropTypes.bool,
  disallowSelectingItems: PropTypes.bool,
};
AddElement.defaultProps = {
  preSelected: null,
  canPickMultiple: false,
  disallowSelectingItems: false,
  getError: () => {},
};
export default AddElement;
