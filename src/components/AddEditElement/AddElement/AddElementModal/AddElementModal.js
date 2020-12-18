import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogNormalHeader,
  DialogNormalBody, DialogButtonRow, DialogNormalContentRow,
  TextButton, Button,
  Input,
} from 'musiklernplattform-components';
import PropTypes from 'prop-types';
import LoadingIndicator from '~/components/Generic/LoadingIndicator';

const AddElementModal = ({
  title, submitTitle, onSubmit, onClose, id, elementFields,
}) => {
  const [values, setValues] = useState(null);
  useEffect(() => {
    const newValues = { id };
    elementFields.forEach((e) => {
      newValues[e.valueName] = e.value || '';
    });
    setValues(newValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onFormSubmit = () => {
    const checked = { ...values };
    elementFields.forEach((element) => {
      const item = values[element.valueName];
      if (element.isNumber) checked[element.valueName] = parseInt(checked[element.valueName], 10);
      if (item.length < 1)checked[element.valueName] = null;
    });
    onSubmit(checked);
  };

  const onChangeValue = (value, valueName) => {
    const newValues = { ...values };
    newValues[valueName] = value;
    setValues(newValues);
  };

  const isDisabled = () => {
    let returnValue = false;
    elementFields.some((element, idx) => {
      if (element.errorFunc) {
        if (element.errorFunc(values[elementFields[idx].valueName] || '') !== null) {
          returnValue = true;
          return true;
        }
      }
    });
    return returnValue;
  };
  if (!values) return <LoadingIndicator />;
  return (
    <Dialog onClose={onClose}>
      <DialogNormalHeader>
        <h4>{title}</h4>
        <TextButton title="Schließen" onClickHandler={onClose} />
      </DialogNormalHeader>
      <DialogNormalBody className="dialog-small flex-column">
        {elementFields.map((element) => (
          <DialogNormalContentRow key={element.label}>
            <label>
              {element.label}
              <br />
              <Input
                value={values[element.valueName]}
                clearButton
                name={`${element.valueName}_input`}
                onChangeHandler={(value) => onChangeValue(value, element.valueName)}
                onClearHandler={() => onChangeValue('', element.valueName)}
                error={(() => (element.errorFunc ? element.errorFunc(values[element.valueName] || '') : null))()}
              />
            </label>
          </DialogNormalContentRow>

        ))}
        <DialogButtonRow>
          <Button
            onClickHandler={onFormSubmit}
            title={submitTitle}
            disabled={isDisabled()}
          />
        </DialogButtonRow>
      </DialogNormalBody>
    </Dialog>
  );
};

AddElementModal.propTypes = {
  title: PropTypes.string.isRequired,
  submitTitle: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.number,
  elementFields: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    errorFunc: PropTypes.func,
    valueName: PropTypes.string.isRequired,
  })).isRequired,

};
AddElementModal.defaultProps = {
  id: null,
};
export default AddElementModal;
