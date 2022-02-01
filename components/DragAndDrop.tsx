import { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';

import initialBoardData from 'data/initialBoardData';
import Column from 'components/Column';

// Drag and drop board with columns and recipes in correct columns
const DragAndDrop = ({ columnsWithIds, normalizedRecipes }) => {
  const [currColumnsWithIds, setCurrColumnsWithIds] = useState(columnsWithIds);

  // logic for handling board ites when drag ends
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = currColumnsWithIds[source.droppableId];
    const finish = currColumnsWithIds[destination.droppableId];

    // Re-ordering in the same column
    if (start === finish) {
      const newrecipeIds = Array.from(start.recipeIds);
      newrecipeIds.splice(source.index, 1);
      newrecipeIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        recipeIds: newrecipeIds,
      };

      setCurrColumnsWithIds({
          ...currColumnsWithIds,
          [newColumn.id]: newColumn,
      });
      return;
    }

    // Moving items to another column
    const startrecipeIds = Array.from(start.recipeIds);
    startrecipeIds.splice(source.index, 1);
    const newStart = {
      ...start,
      recipeIds: startrecipeIds,
    };

    const finishrecipeIds = Array.from(finish.recipeIds);
    finishrecipeIds.splice(source.index, 0, draggableId);
    const newFinish = {
      ...finish,
      recipeIds: finishrecipeIds,
    };

    setCurrColumnsWithIds({
        ...currColumnsWithIds,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
    });
    return;
  };

  return (
    <div className="flex gap-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 flex-col">
          {initialBoardData.columnOrderTypesDays.map((columnId) => {
            const column = currColumnsWithIds[columnId];
            const columnItems = column.recipeIds.map((taskId) => normalizedRecipes.byId[taskId]);

            return <Column key={column.id} column={column} columnItems={columnItems} />;
          })}
        </div>
        <div className="flex gap-4">
          {initialBoardData.columnOrderTypes.map((columnId) => {
            const column = currColumnsWithIds[columnId];
            const columnItems = column.recipeIds.map((taskId) => normalizedRecipes.byId[taskId]);

            return <Column key={column.id} column={column} columnItems={columnItems} />;
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

const { func, array, node } = PropTypes;

DragAndDrop.propTypes = { listItems: array, reorderCb: func, children: node };

DragAndDrop.defaultProps = { listItems: [], reorderCb: () => {} };

export default DragAndDrop;
