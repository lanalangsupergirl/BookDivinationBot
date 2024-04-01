import { getMaxPage } from './get_max_page.js';
import { getPageText } from './get_page_text.js';
import { generateRandom } from '../utils.js';

export async function getRandomDivination(id) {
  let maxPage = await getMaxPage(id);

  let randomPage = generateRandom(1, maxPage);

  let pageText = await getPageText(id, randomPage);

  let text = pageText.split(/(?<=[?!.])/g).filter((phrase) => phrase !== '.');

  let randomPhraseNumber = Math.floor(Math.random() * text.length);

  return text[randomPhraseNumber].trim();
}
