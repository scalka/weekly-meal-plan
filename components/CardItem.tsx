import { Draggable } from 'react-beautiful-dnd';

// CardItem - recipe card
const CardItem = ({ cardItem, index }) => {
  return (
    <Draggable draggableId={cardItem.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="shadow-md rounded-md border-slate-200 p-2 bg-white"
          /* isDragging={snapshot.isDragging} */
        >
          <div className="">{cardItem.title}</div>
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
