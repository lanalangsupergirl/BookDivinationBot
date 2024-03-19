export async function getDivination(text, start, position) {
  let phrases = text.split(/(?<=[?!.])/g).filter((phrase) => phrase !== '.');
  // console.log('length', phrases.length);
  console.log('start', start);
  console.log('position', position);
  // console.log('phrases', phrases);

  if (position.search(/сверху/g) === -1 && position.search(/снизу/g) === -1) {
    position = 'сверху';
    // console.log('position-1', position);
  }

  if (start > phrases.length) {
    start = phrases.length;
    console.log('start_in', start);
  }

  if (position.search(/сверху/g) === 0) {
    // console.log('above', phrases);
    return phrases[start - 1].trim()
  }

  if (position.search(/снизу/g) === 0) {
    let reversed = phrases.reverse();

    // console.log('below', reversed);
    return reversed[start - 1].trim()
  }
}
