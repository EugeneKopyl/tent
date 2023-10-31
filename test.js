//  const longestWordString = "Задача на поиск самого длинного слова в строке Напишите функцию findLongestWord которая принимает строку и возвращает самое длинное слово из этой строки"

const string =
  'Задача на поиск самого длинного find12ngestWord слова в строке Напишите функцию findLongestWord которая принимает строку и возвращает самое длинное слово из этой строки';

function findLongestWord(string) {
  const words = string.split(' ')
  const longestLength = words
    .sort((a, b) => b.length - a.length)[0].length;
  return words.filter((w) => w.length === longestLength);
}

console.log(findLongestWord(string));
