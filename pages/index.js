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

  const handleSaveWeeklyPlan = () => {
    initialBoardData.columnOrderTypesDays.forEach((dayId) => {
      console.log(dayId);
      currColumnsWithIds[dayId].recipeIds.forEach((id) => {
        console.log(id + 'klsjfklsj');
        updateWeeklyPlan(currColumnsWithIds[dayId], normalizedRecipes.byId[id]);
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
      >
        Send to Notion
      </button>
    </main>
  );
}

export async function getStaticProps(context) {
  //const records = await getAllRecipes();
  //const lastWeekMealIds = await getWeeklyPlan();
  const lastWeekMealIds = mockData.lastWeekMealIds;
  const records = formatRecipeData(mockData.results, lastWeekMealIds);
  const { columnsWithIds, normalizedRecipes } = recommendDiner(records);
  //const test = await updateWeeklyPlan();

  return {
    props: {
      data: records,
      columnsWithIds: columnsWithIds,
      normalizedRecipes: normalizedRecipes,
    },
  };
}
