window["module"]("Рекурсия и типы данных. Часть 1.");

// возвращает 1*1 + 2*2 + ... + n*n
// требования: использовать рекурсию
function sumsq(n) {
    // здесь должен быть ваш код
}

test("Сумма квадратов", function() {
    var n = 5;
    equal(sumsq(n), n * (n+1) * (2 * n + 1) / 6);
});

// вычисляет n-е чисто Fibonacci
function fib(n) {
    // здесь должен быть ваш код
}

test("Числа Фибоначчи", function() {
    equal(fib(1), 1);
    equal(fib(2), 1);
    equal(fib(3), 2);
    equal(fib(4), 3);
    equal(fib(5), 5);
    equal(fib(6), 8);
});

// Простое число p имеет только 2 делителя, 1 и p. Все остальные числа разкладываются более чем на 2 множителя.
// возвращает наименьший делитель числа n больший 1.
// подсказка: используйте вспомогательную функцию nextFactor k n которая возвращает ниаменьший делитель n больший k. smallestFactor использует nextFactor, и nextFactor рекурсивен.
function smallestFactor(n) {
    // здесь должен быть ваш код
}

// подсчиталь количество делителей n в диапазоне 1..n.
function numFactor(n) {
    // здесь должен быть ваш код
}

test("Делители", function() {
    equal(smallestFactor(14), 2);
    equal(smallestFactor(15), 3);

    equal(numFactor(7), 2);
    equal(numFactor(15), 4);
});

// Перемножает все элементы массива между собой.
function multiply(array) {
    // здесь должен быть ваш код
}

test("Умножение элементов массива", function() {
    equal(multiply([1, 2, 3, 4, 5]), 120);
});

