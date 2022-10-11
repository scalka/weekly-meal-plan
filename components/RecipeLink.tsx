import cleanUrl from 'helpers/cleanUrl';
import { useEffect, useState } from 'react';

const RecipeLink = ({ url, label = '' }) => {
  const [shortLabel, setShortLabel] = useState('');
  useEffect(() => {
    setShortLabel(cleanUrl(url));
  }, [url, label]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="underline decoration-indigo-500/30 hover:decoration-indigo-500/100"
    >
      {shortLabel}
    </a>
  );
};

export default RecipeLink;
