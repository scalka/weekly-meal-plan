import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const databaseId = process.env.NOTION_DATABASE_ID;

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

  console.log(response);
  return response;
}

export async function getRecipesDb() {
  const response = await notion.databases.retrieve({ database_id: databaseId });
  console.log(response);
  return response;
}
