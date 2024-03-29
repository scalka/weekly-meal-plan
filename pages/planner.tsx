import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import {
  createServerSupabaseClient,
  User,
} from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import Layout from 'components/layout';

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
import Chat from 'components/Chat';
import AddNewEntry from 'components/AddNewEntry';

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
  }, [columnsWithIds, serverRecipes, serverPlanned]);

  const updatePlan = async (requests) => {
    return Promise.all(
      requests.map(async (request) => {
        const response = await fetch('/api/planner', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response?.status}`);
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
            recipeLinkId: recipe.status !== 'new' ? recipe.id : null,
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

  const addNewCard = () => {
    console.log(currColumnsWithIds);
  };

  return (
    <Layout isLoggedIn={true}>
      <div className="static p-5">
        <h1 className="text-md font-bold">Recipy</h1>{' '}
        <div className="flex justify-start gap-4 pb-5">
          <p>
            Drag and drop recipes into days of the week. Once you are ready,
            send the planning to Notion.
          </p>
        </div>
        {currColumnsWithIds && (
          <DragAndDrop
            columnsWithIds={currColumnsWithIds}
            updateData={setCurrColumnsWithIds}
          />
        )}
        <Button
          onClick={refreshData}
          customStyle="fixed bottom-3 left-3 "
          variation="secondary"
        >
          Refresh suggestions
        </Button>
        <Button
          onClick={handleSaveWeeklyPlan}
          customStyle="fixed bottom-3 right-3 "
          type="submit"
        >
          Send to Notion
        </Button>
      </div>
      {/* <div className="flex justify-center gap-10">
        <Chat />
        <AddNewEntry
          updateData={setCurrColumnsWithIds}
          columnsWithIds={currColumnsWithIds}
        />
      </div> */}
    </Layout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.provider_token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const provider_token = session.provider_token;
  initNotionClient(provider_token);

  function delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  // Get ids for databases
  await delay(1000);
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

    columnsWithIds[dayId].plannedIds = plannedMeals;
    return;
  });

  return {
    props: {
      columnsWithIds: columnsWithIds,
      serverRecipes: normalizedRecipes,
      serverPlanned: normalizedPlanned,
      mealPlanDatabaseId,
      //email: user?.email,
      initialSession: session,
      user: session.user,
    },
  };
};
