const vegetarianTags = ['vegetarian', 'vegan'];
const doughTags = ['burger', 'wraps', 'dough', 'bread', 'naan'];
const riceTags = ['rice', 'risotto'];
const potatoTags = ['potato', 'sweetpotato'];
const grainsTags = ['kasza', 'couscus', 'quinoa'];
const pastaTags = ['pasta'];

const today = new Date();
const weekAgo = new Date();
weekAgo.setDate(today.getDate() - 7)

const ISOdates = [];
const stringDates = [];

const options: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'numeric',
  day: 'numeric',
};

for (let i = 1; i <= 7; i++) {
  const currDate = new Date();
  currDate.setDate(today.getDate() + i);
  ISOdates.push(currDate.toISOString());
  stringDates.push(new Intl.DateTimeFormat('en-GB', options).format(currDate));
}

const initialBoardData = {
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
    extraVegan: {
      id: 'extraVegan',
      title: 'extraVegan',
      recipeIds: [],
      relatedTags: vegetarianTags,
      max: 3,
    },
    'col-in-1-days': {
      id: 'col-in-1-days',
      title: stringDates[0],
      plannedIds: [],
      recipeIds: [],
      date: ISOdates[0],
    },
    'col-in-2-days': {
      id: 'col-in-2-days',
      title: stringDates[1],
      plannedIds: [],
      recipeIds: [],
      date: ISOdates[1],
    },
    'col-in-3-days': {
      id: 'col-in-3-days',
      title: stringDates[2],
      plannedIds: [],
      recipeIds: [],
      date: ISOdates[2],
    },
    'col-in-4-days': {
      id: 'col-in-4-days',
      title: stringDates[3],
      plannedIds: [],
      recipeIds: [],
      date: ISOdates[3],
    },
    'col-in-5-days': {
      id: 'col-in-5-days',
      title: stringDates[4],
      plannedIds: [],
      recipeIds: [],
      date: ISOdates[4],
    },
    'col-in-6-days': {
      id: 'col-in-6-days',
      title: stringDates[5],
      plannedIds: [],
      recipeIds: [],
      date: ISOdates[5],
    },
    'col-in-7-days': {
      id: 'col-in-7-days',
      title: stringDates[6],
      plannedIds: [],
      recipeIds: [],
      date: ISOdates[6],
    },
  },
  columnOrderTypes: [
    'dough',
    'rice',
    'potato',
    'grains',
    'pasta',
    'extraVegan',
  ],
  columnOrderTypesDays: [
    'col-in-1-days',
    'col-in-2-days',
    'col-in-3-days',
    'col-in-4-days',
    'col-in-5-days',
    'col-in-6-days',
    'col-in-7-days',
  ],
};

export { initialBoardData as default, vegetarianTags, weekAgo };
