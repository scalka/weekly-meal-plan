import Head from 'next/head';
import Image from 'next/image';

import mockData from '../data/mockData.json';
import { getAllRecipes, getWeeklyPlan } from '../lib/notion-api';

import styles from 'styles/Home.module.scss';
import { recommendDiner, formatRecipeData } from 'helpers/helpers';
import React from 'react';

export default function Home({ recipes }) {
  console.log(recipes);

  return (
    <main>
      <ol className={styles.container}>
        {Object.keys(recipes).map((id) => (
          <React.Fragment key={id}>
            <h3>{id}</h3>
            {recipes[id].map((item) => (
              <li key={item.id}>
                <p>
                  {item.title}
                  {item.properties.Tags.multi_select.map((tag) => (
                    <span key={tag.id} className={styles.tag}>
                      {tag.name}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ol>
    </main>
  );
}

export async function getStaticProps(context) {
  //const records = await getAllRecipes();
  const lastWeekMealIds = await getWeeklyPlan();
  const records = formatRecipeData(mockData.results, lastWeekMealIds);
  const recipes = recommendDiner(records);
  return {
    props: {
      data: records,
      recipes: recipes,
      lastWeekMealIds,
    },
  };
}
