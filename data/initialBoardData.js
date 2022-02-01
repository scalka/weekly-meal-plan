const vegetarianTags = ['vegetarian', 'vegan'];
const doughTags = ['burger', 'wrap', 'pizza', 'bread', 'naan'];
const riceTags = ['rice', 'risotto'];
const potatoTags = ['potato', 'sweetpotato'];
const grainsTags = ['kasza', 'couscus', 'quinoa'];
const pastaTags = ['pasta'];

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
    'col-monday': {
      id: 'col-monday',
      title: 'Monday',
      recipeIds: [],
    },
    'col-tuesday': {
      id: 'col-tuesday',
      title: 'Tuesday',
      recipeIds: [],
    },
    'col-wednesday': {
      id: 'col-wednesday',
      title: 'Wednesday',
      recipeIds: [],
    },
    'col-thursday': {
      id: 'col-thursday',
      title: 'Thursday',
      recipeIds: [],
    },
    'col-friday': {
      id: 'col-friday',
      title: 'Friday',
      recipeIds: [],
    },
    'col-saturday': {
      id: 'col-saturday',
      title: 'Saturday',
      recipeIds: [],
    },
    'col-sunday': {
      id: 'col-sunday',
      title: 'Sunday',
      recipeIds: [],
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
    'col-monday',
    'col-tuesday',
    'col-wednesday',
    'col-thursday',
    'col-friday',
    'col-saturday',
    'col-sunday',
  ],
};

export { initialBoardData as default, vegetarianTags };
