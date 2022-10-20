import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import CardItem from './CardItem';

// Column on the board with column items
const Column = ({ colorClass = 'bg-indigo-200', column, columnItems }) => {
  return (
    <Droppable droppableId={column.id}>
      {(provided, snapshot) => (
        <div
          className={`p-2 border min-h-[200px] ${colorClass} rounded-md ${
            snapshot.isDraggingOver
              ? 'outline-dashed outline-2 outline-offset-2 outline-slate-400'
              : ''
          }`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h2 className="text-lg uppercase pb-2">{column.title}</h2>
          <div className="flex flex-col gap-2">
            {columnItems.map((cardItem, index) => (
              <CardItem key={cardItem.id} cardItem={cardItem} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default Column;
