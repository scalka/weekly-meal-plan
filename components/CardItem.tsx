import { Draggable } from 'react-beautiful-dnd';
import Tag from 'components/Tag';
import RecipeLink from './RecipeLink';

// CardItem - recipe card
const CardItem = ({ cardItem, index }) => {
  if (!cardItem) {
    return null;
  }

  return (
    <Draggable
      draggableId={cardItem.id}
      index={index}
      isDragDisabled={cardItem.isDragDisabled}
    >
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="shadow-md border border-rp-text rounded-md border-slate-200 p-2 bg-white relative"
          /* isDragging={snapshot.isDragging} */
        >
          {cardItem.status && (
            <Tag colorClass="bg-rp-green-light text-rp-green-dark">
              {cardItem.status}
            </Tag>
          )}
          <div className="text-sm pb-1">{cardItem.title}</div>

          {cardItem.displayTags && (
            <div>
              {cardItem.displayTags.map((tag: string, i: number) => (
                <Tag colorClass="bg-yellow" key={i}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
          {cardItem.book && <span className="text-xs">{cardItem.book}</span>}
          {cardItem.website && <RecipeLink url={cardItem.website} />}
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
