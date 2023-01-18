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
          className="shadow-md outline-l-2 outline-b-2 rounded-md p-2 bg-white text-rp-text relative"
          /* isDragging={snapshot.isDragging} */
        >
          {cardItem.status && (
            <Tag colorClass="bg-rp-green-30 text-rp-green-80">
              {cardItem.status}
            </Tag>
          )}
          <div className="text-sm pb-1">{cardItem.title}</div>

          {cardItem.displayTags && (
            <div>
              {cardItem.displayTags.map((tag: string, i: number) => (
                <Tag colorClass="bg-rp-yellow-20" key={i}>
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
