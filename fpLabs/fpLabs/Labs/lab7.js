window["module"]("Рекурсивные типы данных. Часть 1.");

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
