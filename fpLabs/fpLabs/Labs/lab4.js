window["module"]("Списки и массивы. Часть 2.");

// функция определяет - является ли n простым числом
function isPrime(n) {
    // здесь должен быть ваш код
}

// функция определяет - является ли n суммой двух простых чисел
function isSumOfPrimes(n) {
    // здесь должен быть ваш код
}

test("Простые числа", function () {
    equal(isPrime(47), true);
    equal(isPrime(45), false);
    equal(isSumOfPrimes(5), true);
    equal(isSumOfPrimes(8), false);
});

// функция преобразует итерируемый объект в массив пар значение - количество вхождений
function bag(n) {
    // здесь должен быть ваш код
}

test("Сумка", function () {
    deepEqual(bag("hello", [['h', 1], ['e', 1], ['l', 2], ['o', 1]]));
});

// функция удаляет n-ное входжение символа letter в строке list
function removeItem(n, letter, list) {
    // здесь должен быть ваш код
}

test("Элементы и позиции", function () {
    equal(removeItem(1, "l", "hello"), "helo");
});

// влзвращает True, если list2 начинается с list1
function isPrefixOf(list1, list2) {
    // здесь должен быть ваш код
}

test("Префикс", function() {
    equal(isPrefixOf([], []), true);
    equal(isPrefixOf([], [1]), true);
    equal(isPrefixOf([], [1]), true);
    equal(isPrefixOf([1], []), false);
    equal(isPrefixOf([1, 2], [1]), false);
    equal(isPrefixOf([1, 2], [1, 2, 3]), true);
});

// возвращает массив степеней 2-ки, сумма которых дает value
// подсказка: использовать рекурсию
function getBits(value) {
    // здесь должен быть ваш код
}

test("Разложение на степени двойки", function() {
    deepEqual(getBits(129), [1, 128]);
    deepEqual(getBits(77), [1, 4, 8, 64]);
});
