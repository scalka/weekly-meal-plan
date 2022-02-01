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
          <div> {cardItem.tags.map(tag => <div className='inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1'>{tag}</div>)}</div>
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
