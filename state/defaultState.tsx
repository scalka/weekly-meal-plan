const vegetarianTags = ['vegetarian', 'vegan'];
const doughTags = [
  'burger',
  'wraps',
  'dough',
  'bread',
  'naan',
  'pizza',
  'bread',
];
const riceTags = ['rice', 'risotto'];
const potatoTags = ['potato', 'sweet potato', 'gnocchi'];
const grainsTags = ['kasza', 'couscus', 'quinoa'];
const pastaTags = ['pasta', 'noodles'];
const soupTags = ['soup'];

const today = new Date();
const weekAgo = new Date();
weekAgo.setDate(today.getDate() - 7);

const ISOdates = [];
const stringDates = [];

const options: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'numeric',
  day: 'numeric',
};

for (let i = 1; i <= 14; i++) {
  const currDate = new Date();
  currDate.setDate(today.getDate() + i);
  ISOdates.push(currDate.toISOString());
  stringDates.push(new Intl.DateTimeFormat('en-GB', options).format(currDate));
}

const dateColumns = [];
let dateColumnsData = {};

stringDates.map((date, i) => {
  dateColumns.push(`col-in-${i + 1}-days`);
  dateColumnsData = {
    ...dateColumnsData,
    [`col-in-${i + 1}-days`]: {
      id: `col-in-${i + 1}-days`,
      title: date,
      plannedIds: [],
      recipeIds: [],
      duplicatedIds: [],
      date: ISOdates[i],
    },
  };
  return;
});

const defaultState = {
  status: '',
  normalizedRecipes: {},
  normalizedPlanned: {},
  columns: {
    dough: {
      id: 'dough',
      title: 'dough',
      recipeIds: [],
      relatedTags: doughTags,
      max: 3,
    },
    rice: {
      id: 'rice',
      title: 'rice',
      recipeIds: [],
      relatedTags: riceTags,
      max: 3,
    },
    potato: {
      id: 'potato',
      title: 'potato',
      recipeIds: [],
      relatedTags: potatoTags,
      max: 3,
    },
    grains: {
      id: 'grains',
      title: 'grains',
      recipeIds: [],
      relatedTags: grainsTags,
      max: 3,
    },
    pasta: {
      id: 'pasta',
      title: 'pasta',
      recipeIds: [],
      relatedTags: pastaTags,
      max: 3,
    },
    soup: {
      id: 'soup',
      title: 'soup',
      recipeIds: [],
      relatedTags: soupTags,
      max: 3,
    },
    extraVegan: {
      id: 'extraVegan',
      title: 'extraVegan',
      recipeIds: [],
      relatedTags: vegetarianTags,
      max: 3,
    },
    ...dateColumnsData,
  },
  columnsOrderFood: [
    'dough',
    'rice',
    'potato',
    'grains',
    'pasta',
    'soup',
    'extraVegan',
  ],
  columnsOrderDays: dateColumns,
};

export { defaultState as default, vegetarianTags, weekAgo };
