import { useState, useEffect } from 'react';

import {
  getAllRecipes,
  getWeeklyPlan,
  updateWeeklyPlan,
} from '../lib/notion-api';
import { recommendDiner, formatRecipeData } from 'helpers/helpers';
import mockData from '../data/mockData.json';
import initialBoardData from 'data/initialBoardData';

import DragAndDrop from '../components/DragAndDrop';

export default function Home({ columnsWithIds, normalizedRecipes, test }) {
  const [isBrowser, setIsBrowser] = useState(false);
  const [currColumnsWithIds, setCurrColumnsWithIds] = useState(columnsWithIds);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleSaveWeeklyPlan = async () => {
    initialBoardData.columnOrderTypesDays.forEach((dayId) => {
      currColumnsWithIds[dayId].recipeIds.forEach(async (id) => {
        const column = currColumnsWithIds[dayId];
        const recipe = normalizedRecipes.byId[id];

        const response = await fetch(`/api/planner`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipeLinkId: recipe.id,
            name: recipe.title,
            date: column.date,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
      });
    });
  };

  return (
    <main className="static">
      {isBrowser && (
        <DragAndDrop
          columnsWithIds={currColumnsWithIds}
          normalizedRecipes={normalizedRecipes}
          updateData={setCurrColumnsWithIds}
        ></DragAndDrop>
      )}
      <button
        className="fixed bottom-3 right-3 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSaveWeeklyPlan}
        type="submit"
      >
        Send to Notion
      </button>
    </main>
  );
}

export async function getServerSideProps({ req, res }) {
  const allRecipes = await getAllRecipes();
  const lastWeekMealIds = await getWeeklyPlan();
  //const lastWeekMealIds = mockData.lastWeekMealIds;
  const records = formatRecipeData(allRecipes.results, lastWeekMealIds);
  const { columnsWithIds, normalizedRecipes } = recommendDiner(records);

  return {
    props: {
      data: records,
      columnsWithIds: columnsWithIds,
      normalizedRecipes: normalizedRecipes,
    },
  };
}
