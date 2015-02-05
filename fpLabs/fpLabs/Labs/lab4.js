window["module"]("Рекурсивные типы данных");


//Expr = Num
//      | Add Expr Expr
//      | Mul Expr Expr
// возвращает результат вычисления выражения expr
function expr(expr) {
    // здесь должен быть ваш код
}

test("Вычисление выражения", function() {
    equal(expr({ op: 'Add', left: 3, right: { op: 'Mul', left: 6, right: 4 } }), 27);
});

// Расширьте функцию expr
//Expr = Num
//      | Add Expr Expr
//      | Mul Expr Expr
//      | Del Expr Expr
//      | Div Expr Expr
test("Вычисление выражения (расширенное)", function() {
    equal(expr({ op: 'Add', left: 3, right: { op: 'Div', left: 6, right: 2 } }), 6);
    equal(expr({ op: 'Add', left: 3, right: { op: 'Div', left: 6, right: 0 } }), NaN);
});

//Tree = Leaf Num
//      | Node Tree Tree
// возвращает массив всех чисел из листовых вершин дерева в том порядке, в котором они встречаются
function collapse(tree) {
    // здесь должен быть ваш код
}

test("Дерево -> список", function() {
    equal(collapse({ left: { left: 4, right: { left: 1, right: 5 } }, right: { left: 6, right: 2 } }), [4, 1, 5, 6, 2]);
});

// возвращает зеркальное отображение дерева
function mirror(tree) {
    // здесь должен быть ваш код
}

test("Зеркальное отображение дерева", function() {
    equal(collapse({ left: { left: 4, right: { left: 1, right: 5 } }, right: { left: 6, right: 2 } }),
        { left: { left: 6, right: 2 }, right: { left: { left: 5, right: 1 }, right: 4 } });
});


//diff (Num n)   x = Num 0
//diff (Add a b) x = Add (diff a x) (diff b x)
//diff (Mul a b) x = Add (Mul a (diff b x)) (Mul b (diff a x))
//diff (Var y)   x
//  | x == y       = Num 1
//  | otherwise    = Num 0
// возвращает производную от функции по заданной переменной
function diff(expr, x) {
    // здесь должен быть ваш код
}

test("Вычисление производной функции", function() {
    equal(diff({ op: 'Add', left: 3, right: { op: 'Mul', left: 6, right: 'x' } }, 'x'), 6);
    equal(diff({ op: 'Add', left: { op: 'Mul', left: 3, right: 'x' }, right: { op: 'Mul', left: 'x', right: 'x' } }, 'x'),
        { op: 'Add', left: 3, right: 'x' });
});

// возвращает упрощенное выражение
// требование: в упрощенном выражении не должно быть вырожденных под-выражений вида
//Mul (Num 0) b
//Add a a
function simplify(expr) {
    // здесь должен быть ваш код
}

test("Упрощение выражений", function() {
    equal(
        simplify({
            op: 'Add',
            left: { op: 'Add', left: 6, right: { op: 'Mul', left: 2, right: 'x' } },
            right: { op: 'Add', left: 5, right: { op: 'Mul', left: 3, right: 'x' } }
        }),
        { op: 'Add', left: 11, right: { op: 'Mul', left: 5, right: 'x' } }
    );
    equal(
        simplify({
            op: 'Del',
            left: { op: 'Add', left: 6, right: { op: 'Mul', left: 3, right: 'x' } },
            right: { op: 'Add', left: 6, right: { op: 'Mul', left: 3, right: 'x' } }
        }),
        0
    );
    equal(
        simplify({
            op: 'Del',
            left: { op: 'Add', left: 7, right: { op: 'Mul', left: 3, right: 'x' } },
            right: { op: 'Add', left: 6, right: { op: 'Mul', left: 3, right: 'x' } }
        }),
        1
    );
    equal(
        simplify({
            op: 'Del',
            left: { op: 'Add', left: 6, right: { op: 'Mul', left: 4, right: 'x' } },
            right: { op: 'Add', left: 6, right: { op: 'Mul', left: 3, right: 'x' } }
        }),
        'x'
    );
});

//DirectoryItem = File Name Data
//      | Folder Name DirectoryItem[]
// возвращает полный путь к искомому файлу
function find(fileName, root) {
    // здесь должен быть ваш код
}

test("Поиск файла в каталогах", function() {
    var root1 = {
        name: 'a',
        items: [
            {
                name: 'd',
                items: [{
                    name: 'test',
                    data: null
                }
                ]
            },
            {
                name: 'b',
                items: [{
                        name: 'test',
                        data: null
                    }
                ]
            }
        ]
    };
    equal(find("test", root1), ["a/d/test", "a/b/test"]);
    var root2 = {
        name: 'a',
        items: [
            {
                name: 'd',
                items: [{
                    name: 'test1',
                    data: null
                }
                ]
            },
            {
                name: 'b',
                items: [{
                    name: 'test',
                    data: null
                }
                ]
            }
        ]
    };
    equal(find("test", root2), "a/b/test");
});

// возвращает результат абсциссу нуля функции func на интервале [x0, x1]
function solve0(func, x0, x1) {
    // здесь должен быть ваш код
}

test("Поиск нуля функции", function() {
    equal(solve0(function(x) { return x * x - 10; }, 1, 10), 3.16);
    equal(solve0(function(x) { return x * x * x; }, 1, 1), "No solution!");
    equal(solve0(Math.cos, 2, 5), 4.71);
});
