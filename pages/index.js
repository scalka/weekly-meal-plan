import Head from 'next/head';
import Image from 'next/image';

import mockData from '../data/mockData.json';
import { getAllRecipes } from '../lib/notion-api';

import styles from 'styles/Home.module.scss';
import { recommendDiner, formatRecipeData } from 'helpers/helpers';

export default function Home({ data }) {
  console.log(data);

  const formattedRecords = recommendDiner(data);

  return (
    <main>
      <ol className={styles.container}>
        {formattedRecords.map((item) => (
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
      </ol>
    </main>
  );
}

export async function getStaticProps(context) {
  //const records = await getAllRecipes();
  const records = formatRecipeData(mockData.results);

  return {
    props: {
      data: records,
    },
  };
}
