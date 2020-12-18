/* eslint-disable react/no-array-index-key */
import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  Option,
  List, ListItem, IconButton,
} from 'musiklernplattform-components';
import TrashIcon from '@iconify/icons-ion/trash-outline';
import EditIcon from '@iconify/icons-ion/create-outline';
import PropTypes from 'prop-types';

const ElementList = ({
  dataQuery, getDisplayedLabel,
  onEdit, onDelete, preSelected, idField, setNewValues,
  canPickMultiple, disallowSelectingItems,
  setNewLastSelected, newComponent,
}) => {
  const [values, _setValues] = useState([]);

  const setValues = (newValues) => {
    _setValues(newValues);
    if (setNewValues) setNewValues(newValues);
  };

  const lastSelected = useRef(null);
  const setPreselected = useRef(null);

  useQuery(dataQuery, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => setValues(JSON.parse(JSON.stringify(data[Object.keys(data)[0]]))),
  });

  useEffect(() => {
    if (preSelected && values.length > 0 && !setPreselected.current) {
      const newValues = [...values];
      setPreselected.current = true;
      let count = 0;
      if (canPickMultiple) {
        if (!Array.isArray(preSelected)) {
          lastSelected.current = [];
          setValues(newValues);
          setNewLastSelected([]);
          return;
        }
        const newPreSelected = [...JSON.parse(JSON.stringify(preSelected))];
        values.some((value, idx) => {
          const foundIdx = newPreSelected.findIndex(
            (preSelectedValue) => preSelectedValue[idField] === value[idField],
          );
          if (foundIdx > -1) {
            newPreSelected[foundIdx].index = idx;
            newValues[idx].selected = true;
            count += 1;
            // newPreSelected.splice(foundIdx, 1);
          }
          return newPreSelected.length === count;
        });
        lastSelected.current = [...newPreSelected];
      } else {
        const foundIdx = values.findIndex((value) => preSelected[idField] === value[idField]);
        if (foundIdx < 0) return;
        newValues[foundIdx].selected = true;
        lastSelected.current = foundIdx;
      }
      setNewLastSelected(lastSelected.current);
      setValues(newValues);
    }
  }, [preSelected, values, idField, canPickMultiple]);

  const editFunc = (element) => {
    onEdit(element);
  };

  const selectItem = (element, idx) => {
    const newValue = [...values];
    newValue[idx].selected = !newValue[idx].selected;
    if (!canPickMultiple) {
      if (lastSelected.current)newValue[lastSelected.current].selected = false;
      if (newValue[idx].selected)lastSelected.current = idx;
      else lastSelected.current = null;
    }
    if (canPickMultiple) {
      const all = [...lastSelected.current];
      let idxSome = null;
      if (all.some((e, index) => {
        idxSome = index;
        return e[idField] === element[idField];
      })) {
        if (idxSome === null) return;
        all.splice(idxSome, 1);
      } else all.push({ ...element, index: idx });
      lastSelected.current = all;
    }
    setNewLastSelected(lastSelected.current);
    setValues(newValue);
  };

  const removeFunc = (element, index) => {
    onDelete(element);
  };

  const renderList = () => values.map((element, index) => (
    <ListItem key={`value_${index}`} className="height-auto">

      <div style={{
        display: 'flex', flexDirection: 'row', width: '100%',
      }}
      >
        <ul
          style={{ padding: 0 }}
          className="margin-right-auto"
        >
          {/* wrapped in ul because option is li element */}
          {disallowSelectingItems ? (
            <li>
              {' '}
              <b>
                {getDisplayedLabel(element)}
              </b>
            </li>
          ) : (
            <Option
              className="element-modal-option height-auto"
              key={`value_${index}_option`}
              selected={element.selected}
              onClickHandler={() => selectItem(element, index)}
            >
              <b>
                {getDisplayedLabel(element)}
              </b>
            </Option>
          ) }

        </ul>
        <IconButton
          icon={EditIcon}
          className="flex-row"
          onClickHandler={() => editFunc(element, index)}
        />
        <IconButton
          icon={TrashIcon}
          className="flex-row"
          onClickHandler={() => removeFunc(element, index)}
        />
      </div>

    </ListItem>
  ));

  return (
    <>
      {newComponent}
      <List className="scrollable-list">
        {renderList()}
      </List>
    </>

  );
};
ElementList.propTypes = {
  preSelected: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  idField: PropTypes.string.isRequired,
  setNewValues: PropTypes.func,
  canPickMultiple: PropTypes.bool,
  setNewLastSelected: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  dataQuery: PropTypes.object.isRequired,
  getDisplayedLabel: PropTypes.func.isRequired,
  newComponent: PropTypes.node.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disallowSelectingItems: PropTypes.bool.isRequired,
};
ElementList.defaultProps = {
  preSelected: null,
  setNewValues: () => {},
  canPickMultiple: false,
  setNewLastSelected: () => {},
};
export default ElementList;
