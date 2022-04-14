import cleanUrl from 'helpers/cleanUrl';
import { useEffect, useState } from 'react';

const RecipeLink = ({ url, label = '' }) => {
  const [shortLabel, setShortLabel] = useState('');
  useEffect(() => {
    setShortLabel(cleanUrl(url));
  }, [url, label]);

  return (
    <a href={url} target="_blank" rel="noreferrer">
      {shortLabel}
    </a>
  );
};

export default RecipeLink;
