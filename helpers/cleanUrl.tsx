export default function cleanUrl(url) {
  const newUrl = url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '', '')
    .split('/')[0];

  return newUrl;
}
