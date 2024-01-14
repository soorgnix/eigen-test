const sentence = 'Saya sangat senang mengerjakan soal algoritma'

function longest(sentence) {
  const splittedSentence = sentence.split(' ');
  let longestNumber = 0;
  let longestSentence;
  for (i = 0; i < splittedSentence.length; i++) {
    if (longestNumber < splittedSentence[i].length) {
      longestNumber = splittedSentence[i].length;
      longestSentence = splittedSentence[i];
    }
  }
  return longestSentence;
}

console.log(longest(sentence));