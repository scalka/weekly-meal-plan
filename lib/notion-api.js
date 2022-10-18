// todo: check TypeScript errors in this file
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
}

export async function getRecipesDatabaseId() {
  const { results } = await notion.search({
    query: 'database',
    filter: {
      value: 'database',
      property: 'object',
    },
  });
  return results[0].id;
}

export async function getMealPlanDatabaseId() {
  const { results } = await notion.search({
    query: 'plan',
    filter: {
      value: 'database',
      property: 'object',
    },
  });
  return results[0].id;
}

export async function getAllRecipes(recipesDatabaseId) {
  const response = await notion.databases.query({
    database_id: recipesDatabaseId,
  });
  return response;
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
