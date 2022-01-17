const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const vegeTags = [
  '85f14ac3-8299-423d-bd45-23eef4ca7c10',
  '8990d4fe-32f1-4012-9f73-0ddd80aaaca1',
];

export function recommendDiner(data, criteria) {
  // dietary preference
  const numOfNonVeg = 3;
  const numVegetarian = 4;

  // starches
  const numRice = 3;
  const numPotato = 2;
  const numBread = 1;
  const numKasza = 1;
  const numOther = 1;

  const selection = [];
  const selectionIds = new Set();

  // filter past two weeks recipes
  const previousRecipes = [];
  data.filter((item) => previousRecipes.includes(item.id));

  // Vegan
  const veganRecipes = filterBaseOnConditions(data, ['diner', 'vegetarian']);
  const nonVeganRecipes = filterBaseOnConditions(
    data,
    ['diner'],
    ['vegetarian', 'vegan']
  );

  console.log(veganRecipes);
  console.log(nonVeganRecipes);

  for (let i = 0; i < numVegetarian; i++) {
    const { result, error } = getRecipe(veganRecipes, selectionIds);
    if (result) {
      selection.push(result);
      selectionIds.add(result.id);
    }
  }

  for (let i = 0; i < 7 - numVegetarian; i++) {
    const { result, error } = getRecipe(nonVeganRecipes, selectionIds);
    if (result) {
      selection.push(result);
      selectionIds.add(result.id);
    }
  }

  return selection;
}

export function getRecipe(data, selectionIds = new Set(), noResults) {
  let recipe;
  recipe = getRandom(data);
  if (noResults) {
    return { result: null, error: 'no results' };
  } else if (selectionIds.size && selectionIds.has(recipe.id)) {
    return getRecipe(data, true);
  } else {
    return { result: recipe, error: null };
  }
}

export function filterBaseOnConditions(
  arr,
  conditions = [],
  antiCondition = []
) {
  const list = arr.filter((item) => {
    return (
      conditions.every((condition) => item.tags.includes(condition)) &&
      antiCondition.every((condition) => !item.tags.includes(condition))
    );
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

export function formatRecipeData(data) {
  const result = data.map((item) => ({
    ...item,
    title: item.properties.Title.title[0].plain_text,
    tags: item.properties.Tags.multi_select.map((tag) => tag.name),
  }));

  return result;
}
