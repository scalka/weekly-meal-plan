import { useState, useEffect } from 'react';

import { getAllRecipes, getWeeklyPlan } from '../lib/notion-api';
import { recommendDiner, formatRecipeData } from 'helpers/helpers';
import mockData from '../data/mockData.json';

import DragAndDrop from '../components/DragAndDrop';

export default function Home({ columnsWithIds, normalizedRecipes }) {
  console.log(columnsWithIds);
  console.log(normalizedRecipes);
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  return (
    <main>
      {isBrowser && (
        <DragAndDrop
          columnsWithIds={columnsWithIds}
          normalizedRecipes={normalizedRecipes}
        ></DragAndDrop>
      )}
    </main>
  );
}

export async function getStaticProps(context) {
  //const records = await getAllRecipes();
  //const lastWeekMealIds = await getWeeklyPlan();
  const records = formatRecipeData(mockData.results, []);
  const { columnsWithIds, normalizedRecipes } = recommendDiner(records);
  return {
    props: {
      data: records,
      columnsWithIds: columnsWithIds,
      normalizedRecipes: normalizedRecipes,
    },
  };
}
