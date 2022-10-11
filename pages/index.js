import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import Context from 'state/Context';

import { getWeeklyPlan, getAllRecipes } from '../lib/notion-api';
import { recommendDiner } from 'helpers/helpers';
import mockData from '../data/mockData.json';
import defaultState from 'state/defaultState';

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
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
      })
    );
  };

  const handleSaveWeeklyPlan = async () => {
    const requests = [];
    // map recipes from column
    defaultState.columnsOrderDays.forEach((dayId) => {
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
    <main className="static p-5">
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
  const allRecipes = await getAllRecipes();
  //const allRecipes = mockData;
  const { lastWeekMealIds, results, normalizedPlanned } = await getWeeklyPlan();
  //const lastWeekMealIds = mockData.lastWeekMealIds;

  const { columnsWithIds, normalizedRecipes } = recommendDiner(
    allRecipes,
    lastWeekMealIds
  );

  // add to the board already planned recipes
  defaultState.columnsOrderDays.forEach((dayId, currColIndex) => {
    const plannedMeals = results
      .filter(
        (item) =>
          new Date(item.date).getDate() ===
          new Date(columnsWithIds[dayId].date).getDate()
      )
      .map((item) => {
        // add an item to next column as well if it's planned for multiple days
        if (item.daysDiff > 0) {
          for (let i = 1; i <= item.daysDiff; i++) {
            const nextColId = defaultState.columnsOrderDays[currColIndex + i];
            columnsWithIds[nextColId].plannedIds = [
              ...columnsWithIds[nextColId].plannedIds,
              `${item.id}$${nextColId}${i}`,
            ];
          }
        }
        return item.id;
      });

    // todo: understand why the recipes are dublicated on refresh
    // Set removes the duplicates
    columnsWithIds[dayId].plannedIds = [
      ...new Set([...columnsWithIds[dayId].plannedIds, ...plannedMeals]),
    ];
    return;
  });

  return {
    props: {
      columnsWithIds: columnsWithIds,
      serverRecipes: normalizedRecipes,
      serverPlanned: normalizedPlanned,
    },
  };
}
