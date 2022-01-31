//@ts-check;
const vegetarianTags = ['vegetarian', 'vegan'];
const doughTags = ['burger', 'wrap', 'pizza', 'bread', 'naan'];
const riceTags = ['rice', 'risotto'];
const potatoTags = ['potato', 'sweetpotato'];
const grainsTags = ['kasza', 'couscus', 'quinoa'];
const pastaTags = ['pasta'];

const queryConditions = [
  { id: 'dough', starchTags: doughTags, max: 1 },
  { id: 'rice', starchTags: riceTags, max: 1 },
  { id: 'potato', starchTags: potatoTags, max: 1 },
  { id: 'grains', starchTags: grainsTags, max: 1 },
  { id: 'pasta', starchTags: pastaTags, max: 1 },
];

// dietary preference
const numVegetarian = 4;

export function recommendDiner(data) {
  const selection = [];
  let finalRecipes = {
    dough: [],
    rice: [],
    potato: [],
    grains: [],
    pasta: [],
    extraVegan: [],
  };
  const selectionIds = new Set();

  queryConditions.forEach(({ id, starchTags, max }) => {
    const filteredRecipes = filterBaseOnConditions(data, starchTags);

    for (let i = 0; i <= max; i++) {
      const { result, error } = getRecipe(filteredRecipes, selectionIds);
      if (result) {
        selection.push(result);
        finalRecipes = {
          ...finalRecipes,
          [id]: [...finalRecipes[id], result],
        };
        selectionIds.add(result.id);
      }
    }
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
        finalRecipes = {
          ...finalRecipes,
          extraVegan: [...finalRecipes.extraVegan, result],
        };
        selectionIds.add(result.id);
      }
    }
  }
  return finalRecipes;
}

export function getRecipe(data, selectionIds = new Set(), noResults) {
  let recipe;
  recipe = getRandom(data);
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

/**
 * Group array into object with key value pairs
 * @param {arr} arr - array of objects
 * @param {string} criteria - key on which to group ex. id, categort
 * @returns objects grouped by criteria
 */
export function groupBy(arr, criteria) {
  const newObj = arr.reduce(function (acc, currentValue) {
    if (!acc[currentValue[criteria]]) {
      acc[currentValue[criteria]] = [];
    }
    acc[currentValue[criteria]].push(currentValue);
    return acc;
  }, {});

  return newObj;
}

/**
 * Creates nested groups by object properties.
 * `properties` array nest from highest(index = 0) to lowest level.
 * @param {arr} arr - array of objects
 * @param {String[]} properties
 * @returns {Object}
 */
export function nestedGroupsBy(arr, properties) {
  properties = Array.from(properties);
  if (properties.length === 1) {
    return groupBy(arr, properties[0]);
  }
  const property = properties.shift();
  var grouped = groupBy(arr, property);
  for (let key in grouped) {
    grouped[key] = nestedGroupsBy(grouped[key], Array.from(properties));
  }
  return grouped;
}

export function formatRecipeData(data, pastMeals) {
  console.log(data.length);
  const filterPastWeek = data.filter((item) => !pastMeals.includes(item.id));
  console.log(filterPastWeek.length);
  const result = filterPastWeek.map((item) => ({
    ...item,
    title: item.properties.Title.title[0].plain_text,
    tags: item.properties.Tags.multi_select.map((tag) => tag.name),
  }));

  return result;
}
