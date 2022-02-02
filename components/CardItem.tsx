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
          {cardItem.status && <div className='inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1'>{cardItem.status}</div>}
          <div className="text-sm pb-1">{cardItem.title}</div>
          {cardItem.tags && <div> {cardItem.tags.map((tag: string, i: number) => <div key={i} className='inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1'>{tag}</div>)}</div>}
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
