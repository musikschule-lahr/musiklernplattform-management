/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

const ListItemContent = ({
  name, value, onClickHandler, noneText, style,
}) => (
  <span
    role="link"
    tabIndex="0"
    onKeyPress={onClickHandler}
    onClick={onClickHandler}
    style={style}
  >
    <b>
      {name}
      :
    </b>
    {' '}
    {value || noneText}
  </span>
);
ListItemContent.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onClickHandler: PropTypes.func,
  noneText: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};
ListItemContent.defaultProps = {
  name: '',
  value: null,
  onClickHandler: null,
  noneText: 'Kein Datensatz hinterlegt.',
  style: {},
};

export default ListItemContent;
