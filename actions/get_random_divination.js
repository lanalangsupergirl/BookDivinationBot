import { getMaxPage } from './get_max_page.js';
import { getPageText } from './get_page_text.js';
import { generateRandom } from '../utils.js';

export async function getRandomDivination(id) {
  let maxPage = await getMaxPage(id);
  // console.log(maxPage);

  let randomPage = await generateRandom(1, maxPage[0].max);
  // console.log(randomPage);

  let pageText = await getPageText(id, randomPage);

  let text = pageText[0].page.split(/(?<=[?!.])/g).filter((phrase) => phrase !== '.');

  let randomPhraseNumber = Math.floor(Math.random() * text.length);

  return text[randomPhraseNumber].trim();
}
