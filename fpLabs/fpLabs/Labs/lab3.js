window["module"]("Функции высшего порядка");

// перестановка списка это другой список с такими же элементами, только в другом порядке
// возвращает True, если аргументы являются перестановками друг друга
function isPermutation(list1, list2) {
    // здесь должен быть ваш код
}

test("Перестановки", function() {
    equal(isPermutation([1, 2, 1], [2, 1, 1]), true);
    equal(isPermutation([1, 2, 1], [2, 2, 1]), false);
});

function inc(n) {
    return n + 1;
}

// возвращает f (f (... (f (x)))), уровень вложенности n
function iter(n, func, x ) {
    // здесь должен быть ваш код
}

test("Вложенные функции", function() {
    equal(iter(0, inc, 1), 1);
    equal(iter(0, inc, 3), 3);
    equal(iter(5, inc, 3), 8);
});

// возвращает композицию функций из входного массива
function composeList(funcList) {
    // здесь должен быть ваш код
}

test("Композиция функций", function() {
    equal(composeList([])(), undefined);
    equal(composeList([succ, function(n) { return n - 1; }])(2), 2);
});

// возвращает длину массива
// требования: использовать функции map и sum
function lenght(array) {
    // здесь должен быть ваш код
}

test("Длина массива", function() {
    equal(composeList([]), 0);
    equal(composeList([1, 2, 0, 3 ]), 4);
});


// возвращает массив из n элементов, каждый из которых сгенерирован функцией gen
function listOf(n, gen) {
    // здесь должен быть ваш код
}

// напишите функцию gen, создающую список элементов заданной длины с одинаковыми заданными значениями
function gen(n, value) {
    // здесь должен быть ваш код
}

test("Генерация массива", function() {
    equal(listOf(3, function() { gen(2, 5); }), [[5, 5], [5, 5], [5, 5]]);
});

// напишите функцию gen, создающую список элементов заданной длины с возрастающими значениями
function genOrdered(n) {
    // здесь должен быть ваш код
}

test("Генерация упорядоченного массива", function() {
    equal(listOf(3, function() { genOrdered(2); }), [[0, 1], [0, 1], [0, 1]]);
});
