export async function getDivination(text, start, position) {
  let phrases = text.split(/(?<=[?!.])/g).filter((phrase) => phrase !== '.');

  let fromTop = true;
  let fromBottom = false;

  if (position.search(/снизу/g) !== -1) {
    fromTop = false;
    fromBottom = true;
  }

  if (start > phrases.length) {
    start = phrases.length;
  }

  if (fromTop) {
    return phrases[start - 1].trim();
  }

  if (fromBottom) {
    return phrases[phrases.length - start].trim();
  }
}
