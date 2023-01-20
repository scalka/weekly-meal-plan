import PropTypes from 'prop-types';
import { useContext } from 'react';

import { DragDropContext } from 'react-beautiful-dnd';
import Context from 'state/Context';

import defaultState from 'state/defaultState';
import Column from 'components/Column';

// Drag and drop board with columns and recipes in correct columns
const DragAndDrop = ({ columnsWithIds, updateData }) => {
  const {
    state: { normalizedPlanned, normalizedRecipes },
  } = useContext(Context);

  // logic for handling board items when drag ends
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
    // todo: fix bug on reordering in new column for planning
    if (start === finish) {
      const newRecipeIds = Array.from(start.recipeIds);
      newRecipeIds.splice(source.index, 1);
      newRecipeIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        recipeIds: newRecipeIds,
      };

      updateData({
        ...columnsWithIds,
        [newColumn.id]: newColumn,
      });
      return;
    }

    // Moving items to another column
    const startRecipeIds = Array.from(start.recipeIds);
    startRecipeIds.splice(source.index, 1);
    const newStart = {
      ...start,
      recipeIds: startRecipeIds,
    };

    const finishRecipeIds = Array.from(finish.recipeIds);
    finishRecipeIds.splice(source.index, 0, draggableId);
    const newFinish = {
      ...finish,
      recipeIds: finishRecipeIds,
    };

    updateData({
      ...columnsWithIds,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });
    return;
  };
  return (
    <div className="grid gap-6 overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-7 gap-2">
          {defaultState.columnsOrderFood.map((columnId) => {
            const column = columnsWithIds[columnId];
            const columnItems = column.recipeIds.map(
              (taskId) => normalizedRecipes.byId[taskId]
            );

            return (
              <Column
                key={column.id}
                column={column}
                columnItems={columnItems}
                type="primary"
              />
            );
          })}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {defaultState.columnsOrderDays.map((columnId) => {
            const column = columnsWithIds[columnId];
            const columnItems = column.recipeIds.map(
              (recipeId) => normalizedRecipes.byId[recipeId]
            );
            const alreadyPlanned = column.plannedIds.map((plannedId) => {
              // recipe id comes before $, after $ sign is the information about multi day planned recipe
              const idParts = plannedId.split('$');
              const plannedRecipe = normalizedPlanned.byId[idParts[0]];
              return {
                ...plannedRecipe,
                status: idParts[1]
                  ? 'planned multi-day'
                  : plannedRecipe?.status,
                id: plannedId,
                isDragDisabled: true,
              };
            });
            return (
              <Column
                key={column.id}
                column={column}
                columnItems={[...alreadyPlanned, ...columnItems]}
                type="secondary"
              />
            );
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
