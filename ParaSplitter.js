function ParaSplitter(para) {
  const data = {};
  const pF = (e) => parseFloat(e);

  // Create a hidden container to measure text width
  const measureContainer = document.createElement('div');
  Object.assign(measureContainer.style, {
    position: 'absolute',
    visibility: 'hidden',
    height: 'auto',
    width: 'auto',
    whiteSpace: 'nowrap'
  });
  document.body.appendChild(measureContainer);

  // Get the computed styles of the paragraph
  const pStyles = window.getComputedStyle(para);
  const Pfs = parseFloat(pStyles.fontSize); // Font size
  const Pw = parseFloat(pStyles.width); // Width of the paragraph
  const Plh = (pStyles.lineHeight === 'normal') ? Pfs * 1.2 : parseFloat(pStyles.lineHeight); // Line height
  const paraHeight = para.clientHeight; // Height of the paragraph
  const paraLines = Math.round(paraHeight / Plh); // Total number of lines

  // Split the paragraph text into individual words
  const words = para.textContent.split(' ');
  const widthArray = [];

  // Measure the width of each word
  words.forEach(word => {
    const span = document.createElement('span');
    span.textContent = word + '\u00A0'; // Add a non-breaking space to the word
    span.style.fontSize = Pfs + 'px';
    measureContainer.appendChild(span);
    widthArray.push(span.offsetWidth); // Store the width of the word
    measureContainer.removeChild(span);
  });
  document.body.removeChild(measureContainer);

  // Store initial data
  data.words = [...words];
  data.width_of_each_word = [...widthArray];
  data.total_no_of_words = words.length;
  data.total_no_lines = paraLines;

  // Initialize variables for line calculation
  let monitor = 0;
  const wordsArray = [];
  let line = [];

  // Iterate through the words and group them into lines based on their widths
  for (let i = 0; i < words.length; i++) {
    const w = widthArray[i];

    // Check if adding the current word exceeds the paragraph width
    if ((monitor + w) > para.clientWidth) {
      wordsArray.push(line); // Add the current line to the wordsArray
      line = []; // Start a new line
      monitor = 0; // Reset the monitor width
    }

    line.push(words[i]); // Add the word to the current line
    monitor += w; // Update the monitor width
  }

  // Push the last line if it has any words
  if (line.length > 0) {
    wordsArray.push(line);
  }

  // Store the final data
  data.words_in_each_line = wordsArray;
  data.words_in_each_line_Including_Space = wordsArray.map(line => line.map(word => word + ' '));
  
  return data;
}