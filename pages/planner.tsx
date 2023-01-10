import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';

import Image from 'next/image';
import Context from 'state/Context';

import {
  initNotionClient,
  getWeeklyPlan,
  getAllRecipes,
  getRecipesDatabaseId,
  getMealPlanDatabaseId,
} from '../lib/notion-api';
import { recommendDiner } from 'helpers/helpers';
// import mockData from '../data/mockData.json';
import defaultState from 'state/defaultState';

import DragAndDrop from '../components/DragAndDrop';
import Button from '../components/Button';

export default function Planner({
  columnsWithIds,
  serverPlanned,
  serverRecipes,
  mealPlanDatabaseId,
}) {
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
          body: {
            recipeLinkId: recipe.id,
            name: recipe.title,
            date: column.date,
          },
          mealPlanDatabaseId,
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
      <h1 className="text-md font-bold">Recipy</h1>{' '}
      <p className="pb-8">
        Drag and drop recipes into days of the week. Once you are ready, send
        the planning to Notion.
      </p>
      {currColumnsWithIds && (
        <DragAndDrop
          columnsWithIds={currColumnsWithIds}
          updateData={setCurrColumnsWithIds}
        ></DragAndDrop>
      )}
      <Button
        onClick={handleSaveWeeklyPlan}
        customStyle="fixed bottom-3 right-3 "
        type="submit"
      >
        Send to Notion
      </Button>
    </main>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx, supabase) {
    // Get current session
    const { data } = await supabase.auth.getSession();
    console.log(data);
    const provider_token =
      data.session.provider_token || data.session.refresh_token;
    initNotionClient(provider_token);

    // Get ids for databases
    const recipesDatabaseId = await getRecipesDatabaseId();
    const mealPlanDatabaseId = await getMealPlanDatabaseId();

    // Get all recipes
    const allRecipes = await getAllRecipes(recipesDatabaseId);

    // Get meal plan data
    const { lastWeekMealIds, results, normalizedPlanned } = await getWeeklyPlan(
      mealPlanDatabaseId
    );

    // Generate recommendations
    const { columnsWithIds, normalizedRecipes } = recommendDiner(
      allRecipes,
      lastWeekMealIds
    );

    // Add to the board already planned recipes
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

      // todo: understand why the recipes are duplicated on refresh
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
        mealPlanDatabaseId,
        //email: user?.email,
      },
    };
  },
});
