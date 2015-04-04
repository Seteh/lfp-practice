window["module"]("Функции высшего порядка. Часть 1.");

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
