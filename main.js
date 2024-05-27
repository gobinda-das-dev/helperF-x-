const $ = (e, p = document) => p.querySelector(e);
const $$ = (e, p = document) => p.querySelectorAll(e);
const C = (e) => document.createElement(e);
const pF = (e) => parseFloat(e);

// Create a detached container for measuring
function getWidth(para) {
  const data = {};
  
  const measureContainer = C('div');
  Object.assign(measureContainer.style, {
    position: 'absolute',
    visibility: 'hidden',
    height: 'auto',
    width: 'auto',
    whiteSpace: 'nowrap'
  });
  document.body.appendChild(measureContainer);

  let pStyles = window.getComputedStyle(para);
  const Pfs = pF(pStyles.fontSize);
  const Pw = pF(pStyles.width);
  const Plh = (pStyles.lineHeight === 'normal') ? Pfs * 1.2 : pF(pStyles.lineHeight);
  const paraHeight = para.clientHeight;
  const paraLines = Math.round(paraHeight / Plh);

  const words = para.textContent.split(' ');
  const widthArray = [];

  words.forEach(word => {
    const span = C('span');
    span.textContent = word + '\u00A0';
    span.style.fontSize = Pfs + 'px';
    measureContainer.appendChild(span);
    widthArray.push(span.offsetWidth);
    measureContainer.removeChild(span);
  });
  document.body.removeChild(measureContainer);
  data.words = [...words];
  data.width_of_each_word = [...widthArray];
  data.total_no_of_words = [...widthArray].length;
  data.total_no_lines = paraLines;


  let monitor = 0;
  const wordsArray = [];

  while (words.length) {
    for (let i = 0; i < widthArray.length; i++) {
      const w = widthArray[i];
      if ((monitor + w) > para.clientWidth) {
        wordsArray.push(words.splice(0, i));
        widthArray.splice(0, i);
        monitor = 0;
        break;
      }
      monitor += w;

      if (i === widthArray.length - 1) {
        wordsArray.push(words.splice(0, i + 1));
        widthArray.splice(0, i + 1);
        monitor = 0;
      }
    }
  }

  data.words_in_each_line = [...wordsArray];
  data.words_in_each_line_Including_Space = [...wordsArray].map(wi => wi.map(w => w + ' '));
  return data;
}