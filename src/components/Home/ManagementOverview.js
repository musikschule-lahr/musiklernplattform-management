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
        onClickHandler={() => goto('/manage/composers')}
      />
      <br />
      <Button
        className="margin-y"
        title="Interpreten verwalten"
        onClickHandler={() => goto('/manage/interpreters')}
      />
      <br />
      <Button
        className="margin-y"
        title="Instrumente verwalten"
        onClickHandler={() => goto('/manage/instruments')}
      />
      <br />
      <Button
        className="margin-y"
        title="Epochen verwalten"
        onClickHandler={() => goto('/manage/epochs')}
      />
      <br />
      <Button
        className="margin-y"
        title="Kategorien verwalten"
        onClickHandler={() => goto('/manage/categories')}
      />
      <br />
      <Button
        className="margin-y"
        title="Besetzungen verwalten"
        onClickHandler={() => goto('/manage/instrumentations')}
      />
    </>
  );
};

export default ManagementOverview;
