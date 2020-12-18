import React, {
} from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  TextButton,
} from 'musiklernplattform-components';

const ChoiceModal = ({
  headerMsg, message, onClose, onSubmit, submitText, closeText, children,
}) => (
  <Dialog onClose={onClose}>
    <DialogHeader className="choice-modal-header">
      <h4 style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        {headerMsg}
      </h4>
    </DialogHeader>
    <DialogBody className="dialog-centered">
      <p style={{ whiteSpace: 'pre-wrap' }}>
        {message}
        {children}
      </p>
      <TextButton
        className="centered"
          // eslint-disable-next-line react/jsx-no-bind
        onClickHandler={onSubmit}
        title={submitText}
      />
      <TextButton
        className="centered"
          // eslint-disable-next-line react/jsx-no-bind
        onClickHandler={onClose}
        title={closeText}
      />
    </DialogBody>
  </Dialog>
);

ChoiceModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
  closeText: PropTypes.string.isRequired,
  headerMsg: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  children: PropTypes.node,
};

ChoiceModal.defaultProps = {
  children: null,
};

export default ChoiceModal;
