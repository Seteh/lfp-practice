window["module"]("Рекурсия и типы данных. Часть 1.");

// возвращает 1*1 + 2*2 + ... + n*n
// требования: использовать рекурсию
function sumsq(n) {
    if(n === 1)
        return n;

    return n * n + sumsq(n - 1);
}

test("Сумма квадратов", function() {
    var n = 5;
    equal(sumsq(n), n * (n+1) * (2 * n + 1) / 6);
});

// вычисляет n-е чисто Fibonacci
function fib(n) {
    if(n < 3)
        return 1;

    return fib(n - 1) + fib(n - 2);
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
    var nextFactor = function(k, n) {
        if(n % k === 0)
            return k;

        return nextFactor(k + 1, n);
    };

    if(n === 1)
        return 1;

    return nextFactor(2, n);
}

// подсчиталь количество делителей n в диапазоне 1..n.
function numFactor(n) {
    var numFactorCore = function(i, n) {
        if(n < i)
            return 0;

        if(n % i === 0)
            return 1 + numFactorCore(i + 1, n);

        return numFactorCore(i + 1, n);
    };

    return numFactorCore(1, n);
}

test("Делители", function() {
    equal(smallestFactor(14), 2);
    equal(smallestFactor(15), 3);

    equal(numFactor(7), 2);
    equal(numFactor(15), 4);
});

// Перемножает все элементы массива между собой.
function multiply(array) {
    return array.reduce(function(prev, current) { return prev * current; }, 1);
}

test("Умножение элементов массива", function() {
    equal(multiply([1, 2, 3, 4, 5]), 120);
});