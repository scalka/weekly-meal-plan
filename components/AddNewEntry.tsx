import { useContext, useState, useEffect } from 'react';
import Context from 'state/Context';

import { generateUniqueId } from 'helpers/generateUniqueId';

import Button from 'components/Button';

const AddNewEntry = ({ updateData, columnsWithIds }) => {
  const [messageInput, setMessageInput] = useState('');
  const {
    state: { normalizedPlanned, normalizedRecipes },
    dispatch,
  } = useContext(Context);

  const addNewEntry = () => {
    const newRecipe = {
      id: generateUniqueId(), // generate a unique id for the new recipe,
      title: messageInput, // use the entered title from the input field
      status: 'new',
      displayTags: [],
      book: '',
      website: '',
    };

    dispatch({
      type: 'UPDATE_ALL_RECIPES',
      payload: {
        byId: { ...normalizedRecipes.byId, [newRecipe.id]: newRecipe },
        allIds: [...normalizedRecipes.allIds, newRecipe.id],
      },
    });
    setMessageInput('');
    updateData({
      ...columnsWithIds,
      newInputs: {
        ...columnsWithIds.newInputs,
        recipeIds: [...columnsWithIds.newInputs.recipeIds, newRecipe.id],
      },
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addNewEntry();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="recipeTitle"
        >
          Add new recipe title
        </label>
        <input
          className="appearance-none bg-gray-200 border-none w-full text-gray-700 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="recipeTitle"
          name="recipeTitle"
          type="text"
          placeholder="Enter a recipe title"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
      </div>
      <Button type="submit" variation="primary">
        Add new recipe
      </Button>
    </form>
  );
};

export default AddNewEntry;
