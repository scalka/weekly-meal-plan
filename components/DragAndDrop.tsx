import PropTypes from 'prop-types';
import { useContext } from 'react';

import { DragDropContext} from 'react-beautiful-dnd';

import Context from 'state/Context';

import initialBoardData from 'data/initialBoardData';
import Column from 'components/Column';

// Drag and drop board with columns and recipes in correct columns
const DragAndDrop = ({ columnsWithIds, updateData }) => {
  const {
    state: { normalizedPlanned, normalizedRecipes },
    dispatch,
  } = useContext(Context);

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

    const start = columnsWithIds[source.droppableId];
    const finish = columnsWithIds[destination.droppableId];

    // Re-ordering in the same column
    if (start === finish) {
      const newrecipeIds = Array.from(start.recipeIds);
      newrecipeIds.splice(source.index, 1);
      newrecipeIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        recipeIds: newrecipeIds,
      };

      updateData({
          ...columnsWithIds,
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

    updateData({
        ...columnsWithIds,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
    });
    return;
  };

  return (
    <div className="grid grid-rows-2 gap-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-6 gap-4">
          {initialBoardData.columnOrderTypes.map((columnId) => {
            const column = columnsWithIds[columnId];
            const columnItems = column.recipeIds.map((taskId) => normalizedRecipes.byId[taskId]);

            return <Column key={column.id} column={column} columnItems={columnItems} />;
          })}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {initialBoardData.columnOrderTypesDays.map((columnId) => {
            const column = columnsWithIds[columnId];
            const columnItems = column.recipeIds.map((recipeId) => normalizedRecipes.byId[recipeId]);
            const alreadyPlanned = column.plannedIds.map((plannedId) => {
              return normalizedPlanned.byId[plannedId]
            });
            return <Column key={column.id} column={column} columnItems={[...alreadyPlanned, ...columnItems]} color='bg-violet-200'/>;
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
