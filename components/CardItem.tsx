import { Draggable } from 'react-beautiful-dnd';
import Tag from 'components/Tag';
import RecipeLink from './RecipeLink';

// CardItem - recipe card
const CardItem = ({ cardItem, index }) => {
  if (!cardItem) {
    return null;
  }

  return (
    <Draggable draggableId={cardItem.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="shadow-md rounded-md border-slate-200 p-2 bg-white relative"
          /* isDragging={snapshot.isDragging} */
        >
          {cardItem.status && <Tag colorClass="bg-pink">{cardItem.status}</Tag>}
          <div className="text-sm pb-1">{cardItem.title}</div>
          {cardItem.book && (
            <Tag colorClass="bg-indigo-200">{cardItem.book}</Tag>
          )}
          {cardItem.website && (
            <Tag colorClass="bg-indigo-100">
              <RecipeLink url={cardItem.website} />{' '}
            </Tag>
          )}

          {cardItem.tags && (
            <div>
              {' '}
              {cardItem.tags.map((tag: string, i: number) => (
                <Tag colorClass="bg-yellow" key={i}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
