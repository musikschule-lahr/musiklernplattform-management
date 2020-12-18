import React from 'react';
import {
  List, ListItem, ListDivider, Col, Row, Button,
} from 'musiklernplattform-components';
import { useHistory } from 'react-router-dom';

const ManagementOverview = () => {
  const history = useHistory();

  const goto = (to) => {
    history.push(to);
  };
  return (
    <>
      <Button
        className="margin-y"
        title="Komponisten verwalten"
        onClickHandler={() => goto('/manage/composer')}
      />
    </>
  );
};

export default ManagementOverview;
