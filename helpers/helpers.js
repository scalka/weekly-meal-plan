//@ts-check;
import initialBoardData, { vegetarianTags } from 'data/initialBoardData';

// dietary preference
const numVegetarian = 4;

export function normalize(data, idKey) {
  const byId = data.reduce(
    (acc, item) => ({
      ...acc,
      [item[idKey]]: item,
    }),
    {}
  );

  const allIds = data.map((item) => item[idKey]);

  return {
    byId,
    allIds,
  };
}

export function recommendDiner(data) {
  const columnOrderTypes = initialBoardData.columnOrderTypes;
  const selection = [];
  let columnsWithIds = initialBoardData.columns;

  const selectionIds = new Set();

  columnOrderTypes.forEach((columnId) => {
    const categorySelected = new Set();
    const { id, relatedTags, max } = columnsWithIds[columnId];
    const filteredRecipes = filterBaseOnConditions(data, relatedTags);
    for (let i = 0; i <= max; i++) {
      const { result, error } = getRecipe(filteredRecipes, selectionIds);

      if (result) {
        selection.push(result);
        selectionIds.add(result.id);
        categorySelected.add(result.id);
      }
    }
    columnsWithIds[columnId].recipeIds = Array.from(categorySelected);
  });

  const countVegan = filterBaseOnConditions(selection, vegetarianTags);
  let extraVeganRecipes = [];
  // get extra vegan meals if not enough to choose from
  if (countVegan.length < numVegetarian) {
    extraVeganRecipes = filterBaseOnConditions(data, vegetarianTags);
    for (let i = 0; i <= numVegetarian - countVegan.length; i++) {
      const { result, error } = getRecipe(extraVeganRecipes, selectionIds);
      if (result) {
        selection.push(result);
        columnsWithIds = {
          ...columnsWithIds,
          extraVegan: [...columnsWithIds.extraVegan, result],
        };
        selectionIds.add(result.id);
      }
    }
  }
  const normalizedRecipes = normalize(selection, 'id');
  return { columnsWithIds, normalizedRecipes };
}

export function getRecipe(data, selectionIds = new Set(), noResults) {
  let recipe;
  recipe = getRandom(data);
  //console.log(recipe);
  if (noResults) {
    // return getRecipe(data, selectionIds, true);
    return { result: null, error: 'no results' };
  } else if (selectionIds.size && selectionIds.has(recipe?.id)) {
    return getRecipe(data, selectionIds, true);
  } else {
    return { result: recipe, error: null };
  }
}

export function filterBaseOnConditions(
  arr,
  category,
  conditions = [],
  antiCondition = []
) {
  const list = arr.filter((item) => {
    return category.some((condition) => item.tags.includes(condition));
    /* && conditions.every((condition) => item.tags.includes(condition)) &&
      antiCondition.every((condition) => !item.tags.includes(condition)) */
  });

  return list;
}

export function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function formatRecipeData(data, pastMeals) {
  const filterPastWeek = data.filter((item) => !pastMeals.includes(item.id));

  const result = filterPastWeek.map((item) => ({
    ...item,
    title: item.properties.Title.title[0].plain_text,
    tags: item.properties.Tags.multi_select.map((tag) => tag.name),
  }));

  return result;
}

export function formatPlannedMealData(data) {
  const result = data.map((item) => ({
    ...item,
    date: new Date(item.properties.Date.date.start).toISOString(),
    title: item.properties.Name.title[0].plain_text,
    recipeLinkId: item.properties['Recipe link']?.relation[0]?.id || null,
    tags: ['planned'],
  }));

  return result;
}
