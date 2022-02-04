import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import CardItem from './CardItem';

// Column on the board with column items
const Column = ({ colorClass='bg-indigo-200', column, columnItems }) => {
  return (
    <div className={`p-2.5 ${colorClass}`}>
      <h2 className='font-medium uppercase'>{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className="flex flex-col gap-4 "
            ref={provided.innerRef}
            {...provided.droppableProps}
            /* isDraggingOver={snapshot.isDraggingOver} */
          >
            {columnItems.map((cardItem, index) => (
              <CardItem key={cardItem?.id} cardItem={cardItem} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
