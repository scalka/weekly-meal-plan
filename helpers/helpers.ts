import defaultState from 'state/defaultState';

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

export function recommendDiner(allRecipes, lastWeekMealIds) {
  const data = formatRecipeData(allRecipes.results, lastWeekMealIds);
  const columnsOrderFood = defaultState.columnsOrderFood;
  const selection = [];
  let columnsWithIds = defaultState.columns;
  const selectionIds = new Set();

  columnsOrderFood.forEach((columnId) => {
    const categorySelected = new Set();
    const { id, relatedTags, max } = columnsWithIds[columnId];
    const filteredRecipes = filterBaseOnConditions(data, relatedTags);
    for (let i = 0; i <= max; i++) {
      const { result, error } = getRecipe(filteredRecipes, selectionIds, false);

      if (result) {
        selection.push(result);
        selectionIds.add(result.id);
        categorySelected.add(result.id);
      }
    }
    columnsWithIds[columnId].recipeIds = Array.from(categorySelected);
  });

  const normalizedRecipes = normalize(selection, 'id');
  return { columnsWithIds, normalizedRecipes };
}

export function getRecipe(data, selectionIds = new Set(), noResults) {
  let recipe;
  recipe = getRandom(data);
  if (noResults) {
    return { result: null, error: 'no results' };
  } else if (selectionIds.size && selectionIds.has(recipe?.id)) {
    return getRecipe(data, selectionIds, true);
  } else {
    return { result: recipe, error: null };
  }
}

export function filterBaseOnConditions(arr, category) {
  const list = arr.filter((item) => {
    return category.some((condition) => item.tags.includes(condition));
  });

  return list;
}

export function getRandom(arr) {
  // Shuffle the recipes again to keep variety
  arr.sort(() => Math.random() - 0.5);
  
  return arr[Math.floor(Math.random() * arr.length)];
}

export function formatRecipeData(data, pastMeals) {
  const filterPastWeek = data.filter((item) => !pastMeals.includes(item.id));
  const result = filterPastWeek.map((item) => {
    const tags = item.properties.Tags.multi_select.map((tag) => tag.name);
    return {
      ...item,
      title: item.properties.Title.title[0].plain_text,
      tags: tags,
      displayTags: tags.filter(
        (tag) => !['diner', 'soup', 'potato', 'rice'].includes(tag)
      ),
      book: item.properties.Book.select?.name || '',
      website: item.properties.Link?.url || '',
    };
  });

  return result;
}

export function formatPlannedMealData(data) {
  const result = data.map((item) => {
    const startDate = new Date(item.properties.Date.date.start);
    const endDate = new Date(item.properties.Date.date.end);
    const hasEndDate = item.properties.Date?.date?.end === 'string';
    const daysDiff = typeof hasEndDate
      ? Math.round(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

    return {
      ...item,
      date: startDate.toISOString(),
      daysDiff: daysDiff,
      title: item.properties.Name.title[0]?.plain_text || '',
      recipeLinkId: item.properties['Recipe link']?.relation[0]?.id || null,
      status: 'planned',
      tags: [],
    };
  });

  return result;
}
