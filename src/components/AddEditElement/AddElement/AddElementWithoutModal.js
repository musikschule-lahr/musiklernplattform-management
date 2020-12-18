/* eslint-disable react/forbid-prop-types */
import React, { useState, useRef } from 'react';
import { TextButton } from 'musiklernplattform-components';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/client';
import ElementListWithoutModal from './ElementModal/ElementListWithoutModal';
import AddElementModal from './AddElementModal';
import ChoiceModal from '~/components/Generic/ChoiceModal';
import LoadingIndicator from '~/components/Generic/LoadingIndicator';

const AddElement = ({
  getQuery, addQuery, updateQuery, removeQuery, addTitleValues, editTitleValues, getDisplayedLabel,
  elementFields, idField, addElementTitle, removeText, removeMsg,

}) => {
  const client = useApolloClient();
  const [showAddElement, setShowAddElement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const addeditProps = useRef(null);
  const openedRef = useRef(null);

  const submitNewElement = (variables) => {
    setLoading(true);
    client.mutate({
      mutation: addQuery,
      variables,
    }).then(() => {
      setLoading(false);
      setShowAddElement(false);
      // setShowElementDialog(true);
    });
  };

  const addElementComponent = useRef(<TextButton
    onClickHandler={() => {
      // setShowElementDialog(false);
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
    setLoading(true);
    const { id, ...rest } = variables;
    client.mutate({
      mutation: updateQuery,
      variables: {
        ...rest,
        id: parseInt(id, 10),
      },
    }).then(() => {
      setShowAddElement(false);
      setLoading(false);
      // setShowElementDialog(true);
    });
  };

  const onElementEdit = (element) => {
    // setShowElementDialog(false);
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
    // setShowElementDialog(false);
    setShowRemoveModal(true);
  };

  const removeElement = () => {
    setLoading(true);
    client.mutate({
      mutation: removeQuery,
      variables: {
        id: parseInt(openedRef.current[idField], 10),
      },
    }).then(() => {
      setShowRemoveModal(false);
      setLoading(false);
    });
  };
  if (loading) return <LoadingIndicator />;
  return (
    <>
      {showAddElement
      && (
      <AddElementModal
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...addeditProps.current}
        onClose={() => { setShowAddElement(false); }} // setShowElementDialog(true); }}
      />
      )}
      {showRemoveModal
      && (
      <ChoiceModal
        headerMsg={removeText}
        message={removeMsg(openedRef.current)}
        onClose={() => { setShowRemoveModal(false); }} // setShowElementDialog(true); }}
        onSubmit={removeElement}
        submitText="OK"
        closeText="Abbrechen"
      />
      )}
      <ElementListWithoutModal
        disallowSelectingItems
        idField={idField}
        title={addElementTitle}
        dataQuery={getQuery}
        onEdit={onElementEdit}
        onDelete={onElementDelete}
        newComponent={addElementComponent.current}
        getDisplayedLabel={getDisplayedLabel}
      />
    </>
  );
};
AddElement.propTypes = {
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
    errorFunc: PropTypes.func,
  })).isRequired,
  idField: PropTypes.string.isRequired,
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
};
export default AddElement;
