// todo: check TypeScript errors in this file
// todo: handle if the database in Notion is removed
// @ts-nocheck
import { Client } from '@notionhq/client';
import { weekAgo } from 'state/defaultState';
import { formatPlannedMealData } from 'helpers/helpers';
import { normalize } from 'helpers/helpers';

let notion;

export function initNotionClient(user_api_key) {
  notion = new Client({ auth: user_api_key });
}

export async function getWeeklyPlan(mealPlanDatabaseId) {
  try {
    const response = await notion.databases.query({
      database_id: mealPlanDatabaseId,
      filter: {
        or: [
          {
            property: 'Date',
            date: {
              after: weekAgo,
            },
          },
        ],
      },
    });
    const lastWeekMealIds = response.results.reduce(function (arr, item) {
      if (item?.properties['Recipe link']?.relation?.length) {
        arr.push(item.properties['Recipe link'].relation[0].id);
      }
      return arr;
    }, []);

    const results = formatPlannedMealData(response.results);
    const normalizedPlanned = normalize(results, 'id');
    return { normalizedPlanned, results, lastWeekMealIds };
  } catch (error) {
    throw error;
  }
}

export async function getRecipesDatabaseId() {
  try {
    const { results } = await notion.search({
      query: 'Meals database',
      filter: {
        value: 'database',
        property: 'object',
      },
    });
    console.log(results);
    if (results.length === 0 || results[0].archived) {
      console.log('Recipes database not found');
    }
    return results[0]?.id;
  } catch (error) {
    throw error;
  }
}

export async function getMealPlanDatabaseId() {
  try {
    const { results } = await notion.search({
      query: 'Meal plan',
      filter: {
        value: 'database',
        property: 'object',
      },
    });
    if (results.length === 0 || results[0].archived) {
      console.log('Meal database not found');
    }
    return results[0]?.id;
  } catch (error) {
    throw error;
  }
}

export async function getAllRecipes(recipesDatabaseId) {
  try {
    const response = await notion.databases.query({
      database_id: recipesDatabaseId,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function updateWeeklyPlan(
  body,
  provider_token,
  mealPlanDatabaseId
) {
  if (!notion) {
    initNotionClient(provider_token);
  }

  await notion.pages.create({
    parent: {
      database_id: mealPlanDatabaseId,
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
