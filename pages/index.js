import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import Context from 'state/Context';

import {
  getAllRecipes,
  getWeeklyPlan,
  updateWeeklyPlan,
} from '../lib/notion-api';
import { recommendDiner, formatRecipeData } from 'helpers/helpers';
import mockData from '../data/mockData.json';
import initialBoardData from 'data/initialBoardData';

import DragAndDrop from '../components/DragAndDrop';

export default function Home({ columnsWithIds, serverPlanned, serverRecipes }) {
  const {
    state: { normalizedRecipes },
    dispatch,
  } = useContext(Context);
  const router = useRouter();

  const [currColumnsWithIds, setCurrColumnsWithIds] = useState(null);

  useEffect(() => {
    setCurrColumnsWithIds(columnsWithIds);
    dispatch({ type: 'UPDATE_ALL_RECIPES', payload: serverRecipes });
    dispatch({ type: 'UPDATE_ALL_PLANNED', payload: serverPlanned });
  }, [columnsWithIds, serverRecipes, serverPlanned, dispatch]);

  const updatePlan = async (requests) => {
    return Promise.all(
      requests.map(async (request) => {
        const response = await fetch(`/api/planner`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });
        console.log('response');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
      })
    );
  };

  const handleSaveWeeklyPlan = async () => {
    const requests = [];
    // map recipes from column
    initialBoardData.columnOrderTypesDays.forEach((dayId) => {
      return currColumnsWithIds[dayId].recipeIds.forEach(async (id) => {
        const column = currColumnsWithIds[dayId];
        const recipe = normalizedRecipes.byId[id];

        requests.push({
          recipeLinkId: recipe.id,
          name: recipe.title,
          date: column.date,
        });
      });
    });
    // save new recipes to the weekly plan
    await updatePlan(requests);
    // refresh the data from server after saving new planned meals
    refreshData();
  };

  // refresh the data from server
  const refreshData = () => {
    router.replace(router.asPath);
  };

  return (
    <main className="static">
      {currColumnsWithIds && (
        <DragAndDrop
          columnsWithIds={currColumnsWithIds}
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
  //const allRecipes = await getAllRecipes();
  const allRecipes = mockData;
  const { lastWeekMealIds, results, normalizedPlanned } = await getWeeklyPlan();
  //const lastWeekMealIds = mockData.lastWeekMealIds;
  const records = formatRecipeData(allRecipes.results, lastWeekMealIds);
  const { columnsWithIds, normalizedRecipes } = recommendDiner(records);

  // add to the board already planned recipes
  initialBoardData.columnOrderTypesDays.forEach((dayId) => {
    const plannedMeals = results
      .filter(
        (item) =>
          new Date(item.date).getDate() ===
          new Date(columnsWithIds[dayId].date).getDate()
      )
      .map((item) => item.id);

    columnsWithIds[dayId].plannedIds = [...plannedMeals];
    return;
  });

  return {
    props: {
      data: records,
      columnsWithIds: columnsWithIds,
      serverRecipes: normalizedRecipes,
      serverPlanned: normalizedPlanned,
    },
  };
}
