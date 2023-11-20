// Напишите функцию, которая принимает на вход массив чисел и возвращает новый массив, содержащий только нечетные числа в порядке убывания. Например:
const numbers = [6, 1, 9, 2, 3, 4, 5, 7, 8];
// Ожидаемый результат: [9, 7, 5, 3, 1]

function rebuild(nums) {
  return nums.filter((a) => a%2 === 1).sort((a,b) => b - a)
}

console.log(rebuild(numbers));
