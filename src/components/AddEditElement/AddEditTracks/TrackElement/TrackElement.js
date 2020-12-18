import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { ListItem } from 'musiklernplattform-components';
import PropTypes from 'prop-types';
import MusicIcon from '@iconify/icons-ion/musical-notes-outline';
import VideoIcon from '@iconify/icons-ion/film-outline';
import ListItemContent from '~/components/Generic/ListItemContent';

const style = {
  listStyle: 'none',
  padding: 0,
};

// from example https://react-dnd.github.io/react-dnd/examples/sortable/simple
const TrackElement = ({
  id, text, index, moveTrackElement, sorting,
  tracksSetNewSorting, item, onClickHandler,
}) => {
  const ref = useRef(null);
  const [opacity, setOpacity] = useState(1);
  const [, drop] = useDrop({
    accept: 'trackElement',
    hover(hoveritem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = hoveritem.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        // if(opacity > 0.5) setOpacity(0.5);
        setOpacity(0.5);
        return;
      }
      setOpacity(1);
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveTrackElement(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      hoveritem.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'trackElement', id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => { setOpacity(1); tracksSetNewSorting(); },
  });
  drag(drop(ref));
  useEffect(() => {
    setOpacity(1);
  }, [text, sorting]);
  return (
    <ul ref={ref} style={{ ...style, opacity:opacity }}>
      <ListItem
        icon={item.isVideo ? VideoIcon : MusicIcon}
      >
        <ListItemContent
          onClickHandler={() => onClickHandler(item)}
          name={item.title}
          value={item.filePath}
          style={!item.filePath ? { opacity: 0.5 } : {}}
          noneText="Keine Datei hinterlegt; Element wird im Player ausgeblendet."
        />
      </ListItem>
    </ul>
  );
};

export default TrackElement;
