window["module"]("Каррирование");

function sum(a, b) {
    return a + b;
}

function currySum(a) {
    return function(b) {
        // в этом вызове аргумент a заменён на переданное в функцию curry значение
        return sum(a, b);
    };
}

test("Каррироваине одного аргумента функции", function() {
    var inc = currySum(1);
    //console.log(inc(5)); // 6
    equal(inc(5), 6);

    var dec = currySum(-1);
    //console.log(dec(3)); // 2
    equal(dec(3), 2);

    var plusFive = currySum(5);
    //console.log(plusFive(5)); // 10
    equal(plusFive(5), 10);
});

function sayTwoWords(word1, word2) {
    return word1 + " " + word2;
}

function curryFunc(func, a) {
    return function(b) {
        return func(a, b);
    };
}

test("Функция в качестве аргумента", function() {
    var sayHelloTo = curryFunc(sayTwoWords, "Hello");
    equal(sayHelloTo("Bob"), "Hello Bob");
    equal(sayHelloTo("Mary"), "Hello Mary");

    var sayGoodbyeTo = curryFunc(sayTwoWords, "Goodbye");
    equal(sayGoodbyeTo("Bob"), "Goodbye Bob");
    equal(sayGoodbyeTo("Mary"), "Goodbye Mary");

    var minusThree = curryFunc(sum, -3);
    console.log(minusThree(13)); // 10
    equal(minusThree(13), 10);
});

function curry(func) {
    var args = arguments, curryArgs = [];

    if(typeof func !== 'function') {
        throw new Error('The first arguments must be function!');
    }

    for(var i = 1; i < args.length; i++) {
        curryArgs[i - 1] = args[i];
    }

    return function() {
        // convert arguments to array
        var argsArr = Array.prototype.slice.call(arguments, 0);

        curryArgs = curryArgs.concat(argsArr);
        return func.apply(this, curryArgs);
    }
}

test("Каррироваине произвольного числа аргументов функции", function() {
    var func = function(a, b, c, d) {
        return a + b + c + d;
    }

    var five = curry(func, 5);
    equal(five(2, 3, 4), 14);

    var fiveAndSix = curry(func, 5, 6);
    equal(fiveAndSix(2, 3), 16);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

test('сложение двух чисел', function() {
    var add = function(a, b) {
        return a + b;
    };

    equal(add(2, 3), 5);
});

test('применение каррирования add(num1)(num2)', function() {
    var add = function(a) {
        return function(b) {
            return a + b;
        };
    };

    equal(add(2)(3), 5);
});

test('сложение произвольного числа слагаемых', function() {
    var add = function(a) {
        var sum = a;
        var inner = function(b) {
            if(b) {
                sum += b;
                return inner;
            } else {
                return sum;
            }
        };
        return inner;
    };

    equal(add(2)(3)(), 5);
    equal(add(2)(3)(6)(), 11);
});

test('надо избавиться от пустых скобок в конце - промежуточная версия', function() {
    var add = function(a) {
        var sum = a;
        var inner = function(b) {
            sum += b;
            return inner;
        };
        inner.valueOf = function() {
            return sum;
        };
        return inner;
    };

    equal(add(3)(4), 7);
    equal(add(3)(5), 8);
    equal(add(9)(-5), 4);
    equal(add(1)(2)(3), 6);

    // раскомменитровать, эти тесты не пройдут
    //var add2 = add(2);
    //equal(add2(6)(), 8);
    //equal(add2(10)(), 12);
});

test('надо избавиться от пустых скобок в конце', function() {
    var add = function(orig) {
        var inner = function(val) {
            return add(parseInt(val + '', 10) == val ? inner.captured + val : inner.captured);
        };
        inner.captured = orig;
        inner.valueOf = function() { return inner.captured; };
        return inner;
    };

    equal(add(3)(4), 7);
    equal(add(3)(4)('aa')(5)(), 12);

    var three = add(3);
    var four = add(4);
    equal(three, 3);
    equal(four, 4);
    equal(three(5), 8);
    equal(three(6), 9);
    equal(three(four), 7);
    equal(three(four)(three(four)), 14);
});

test('финальная версия', function() {
    var add = function(orig) {
        var inner = function(val) {
            return add(parseInt(val + '', 10) == val ? orig + val : orig);
        };
        inner.valueOf = function() { return orig; };
        return inner;
    };

    equal(add(3)(4), 7);
    equal(add(3)(4)('aa')(5)(), 12);

    var three = add(3);
    var four = add(4);
    equal(three, 3);
    equal(four, 4);
    equal(three(5), 8);
    equal(three(6), 9);
    equal(three(four), 7);
    equal(three(four)(three(four)), 14);
});