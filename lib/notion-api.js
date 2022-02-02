import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const databaseId = process.env.NOTION_DATABASE_ID;
const weeklyPlanDbId = process.env.NOTION_WEEKLY_PLAN_DB_ID;

export async function getWeeklyPlanTest() {
  const response = await notion.databases.query({
    database_id: weeklyPlanDbId,
    filter: {
      or: [
        {
          property: 'Date',
          date: {
            after: '2022-01-25',
          },
        },
      ],
    },
  }); /* 
  const formattedResponse = response.results.reduce((arr, item) => {
    return item.properties['Recipe link'].relation.length
      ? arr.push(item.properties['Recipe link'].relation[0])
      : arr;
  }, []); */

  return response;
}

export async function getWeeklyPlan() {
  const response = await notion.databases.query({
    database_id: weeklyPlanDbId,
    filter: {
      or: [
        {
          property: 'Date',
          date: {
            after: '2022-01-25',
          },
        },
      ],
    },
  }); /* 
  const formattedResponse = response.results.reduce((arr, item) => {
    return item.properties['Recipe link'].relation.length
      ? arr.push(item.properties['Recipe link'].relation[0])
      : arr;
  }, []); */

  const lastWeekMealIds = response.results.reduce(function (arr, item) {
    if (item.properties['Recipe link'].relation.length) {
      arr.push(item.properties['Recipe link'].relation[0].id);
    }
    return arr;
  }, []);

  return lastWeekMealIds;
}

export async function getAllRecipes() {
  const response = await notion.databases.query({
    database_id: databaseId,
    /* filter: {
      or: [
        {
          property: 'In stock',
          checkbox: {
            equals: true,
          },
        },
        {
          property: 'Cost of next trip',
          number: {
            greater_than_or_equal_to: 2,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Last ordered',
        direction: 'ascending',
      },
    ], */
  });

  //console.log(response);
  return response;
}

export async function updateWeeklyPlan(body) {
  const response = await notion.pages.create({
    parent: {
      database_id: weeklyPlanDbId,
    },
    properties: {
      Type: {
        type: 'multi_select',
        multi_select: [{ name: 'dinner' }],
      },
      Priority: {
        type: 'number',
        number: 3,
      },
      Date: {
        type: 'date',
        date: {
          start: body.date,
          end: null,
          time_zone: null,
        },
      },
      Restaurant: {
        type: 'select',
        select: null,
      },
      'Recipe link': {
        type: 'relation',
        relation: [{ id: body.recipeLinkId }],
      },
      Name: {
        title: [
          {
            text: {
              content: body.name,
            },
          },
        ],
      },
    },
    children: [],
  });
}
