window["module"]("Трансдьюсеры");

function mapFilterTake(coll, mapFn, filterFn) {
    return coll.map(mapFn).filter(filterFn).take(5);
}

// служебная функция append()
function append(coll, item) {
    return coll.concat([item]);
}

// любая операция над коллекциями может быть выражена через reduce
var newColl = coll.reduce(function(result, item) {
    return append(result, mapFn(item));
}, []);

// аналогичный код через map
var newColl = coll.map(mapFn);

// выразим filter через reduce
var newColl = coll.reduce(function(result, item) {
    if (filterFn(item)) {
        return append(result, item);
    } else {
        return result;
    }
}, []);

// аналогичный код через filter
var newColl = coll.filter(filterFn);

// функции, передаваемые в reduce:
//function(result, item) {
//    return append(result, mapFn(item));
//}

//function(result, item) {
//    if (filterFn(item)) {
//        return append(result, item);
//    } else {
//        return result;
//    }
//}

// Давайте вытащим append()
// Мы завернули каждую из этих функций в дополнительную функцию, которая принимает некую функцию step(), и возвращает уже готовый обработчик для reduce
//function(step) {
//    return function(result, item) {
//        return step(result, mapFn(item));
//    }
//}
//function(step) {
//    return function(result, item) {
//        if (filterFn(item)) {
//            return step(result, item);
//        } else {
//            return result;
//        }
//    }
//}

var mapT = function(step) {
    return function(result, item) {
        return step(result, mapFn(item));
    }
}

var filterT = function(step) {
    return function(result, item) {
        if(filterFn(item)) {
            return step(result, item);
        } else {
            return result;
        }
    }
}

var newColl = coll.reduce(mapT(append), []);
var newColl = coll.reduce(filterT(append), []);

///////////////////////////////////////////////////////////////////////////////////

function map(fn) {
    return function(step) {
        return function(result, item) {
            return step(result, fn(item));
        }
    }
}

function filter(predicate) {
    return function(step) {
        return function(result, item) {
            if(predicate(item)) {
                return step(result, item);
            } else {
                return result;
            }
        }
    }
}

test("Трансдьюсеры map и filter", function() {
    // теперь можно писать так
    var addOneT = map(function(x) { return x + 1 });
    var lessTnan4T = filter(function(x) { return x < 4 });

    [1, 2, 3, 4].reduce(addOneT(append), []);      // => [2, 3, 4, 5]
    [2, 3, 4, 5].reduce(lessTnan4T(append), []);   // => [2, 3]});

    var addOne_lessTnan4 = function(step) {
        return addOneT(lessTnan4T(step));
    }

    // или, что вообще замечательно, можно использовать функцию _.compose
    //var addOne_lessTnan4 = _.compose(addOneT, lessTnan4T);

    // и, конечно, можно использовать наш новый трансдьюсер
    [1, 2, 3, 4].reduce(addOne_lessTnan4(append), []);    // => [2, 3]

    // Мы можем использовать другой тип данных. Чтобы получить на выходе не массив, а например объект, достаточно заменить функцию append, и начальное значение [].
    [1, 2, 3, 4].reduce(addOne_lessTnan4(function(result, item) {
        result[item] = true;
        return result;
    }), {});    // => {2: true, 3: true}

});

function flatten() {
    return function(step) {
        return function(result, item) {
            for(var i = 0; i < item.length; i++) {
                result = step(result, item[i]);
            }
            return result;
        }
    }
}

test("Трансдьюсер flatten", function() {
    var flattenT = flatten();

    [[1, 2], [], [3]].reduce(flattenT(append), []); // => [1, 2, 3]
});

// Преждевременное завершение

function Reduced(wrapped) {
    this._wrapped = wrapped;
}
Reduced.prototype.unwrap = function() {
    return this._wrapped;
}
Reduced.isReduced = function(obj) {
    return (obj instanceof Reduced);
}

function take(n) {
    return function(step) {
        var count = 0;
        return function(result, item) {
            if(count++ < n) {
                return step(result, item);
            } else {
                return new Reduced(result);
            }
        }
    }
}

var first5T = take(5);

// Но функция .reduce уже не сможет обрабатывать такую версию трансдьюсеров. Придется написать новую.
function reduce(coll, fn, seed) {
    var result = seed;
    for (var i = 0; i < coll.length; i++) {
        result = fn(result, coll[i]);
        if (Reduced.isReduced(result)) {
            return result.unwrap();
        }
    }
    return result;
}

// Теперь можно применить трансдьюсер first5T.
test("Трансдьюсер first/take", function() {
    reduce([1, 2, 3, 4, 5, 6, 7], first5T(append), []);    // => [1, 2, 3, 4, 5]
});

// Состояние
function transduce(transducer, append, seed, coll) {
    var step = transducer(append);  // В момент вызова этой функции создаются состояния.
    // step содержит в себе счетчик,
    // и его (step) следует использовать только в рамках
    // этого цикла обработки коллекции, после чего уничтожить.
    return reduce(coll, step, seed);
}

transduce(first5T, append, [], [1, 2, 3, 4, 5, 6, 7]);    // => [1, 2, 3, 4, 5]

// Завершение

function step(result, item) {
    if(arguments.length === 2) { // обычный вызов
        // возвращаем step(result, item) или что вам нужно
    }
    if(arguments.length === 1) { // завершительный вызов
        // Здесь необходимо вызвать step c одним аргументом, чтобы передать завершающий сигнал дальше.
        // Но если мы хотим что-то добавить в коллекцию в конце,
        // то мы должны сначала вызвать step с двумя аргументами, а потом с одним.

        // ничего не добавляем
        return step(result);

        // что-то добавляем
        result = step(result, что - то);
        return step(result);
    }
}

function transduce(transducer, append, seed, coll) {
    var step = transducer(append);
    var result = reduce(coll, step, seed);
    return step(result);
}

function append(result, item) {
    if(arguments.length === 2) {
        return result.concat([item]);
    }
    if(arguments.length === 1) {
        return result;
    }
}

function partition(n) {
    if(n < 1) {
        throw new Error('n должен быть не меньше 1');
    }
    return function(step) {
        var cur = [];
        return function(result, item) {
            if(arguments.length === 2) {
                cur.push(item);
                if(cur.length === n) {
                    result = step(result, cur);
                    cur = [];
                    return result;
                } else {
                    return result;
                }
            }
            if(arguments.length === 1) {
                if(cur.length > 0) {
                    result = step(result, cur);
                }
                return step(result);
            }
        }
    }
}

var by3ItemsT = partition(3);

transduce(by3ItemsT, append, [], [1, 2, 3, 4, 5, 6, 7, 8]);   // => [[1,2,3], [4,5,6], [7,8]]

// Инициализация

// Обновим функции transduce() и append()
function transduce(transducer, append, coll) {
    var step = transducer(append);
    var seed = step();
    var result = reduce(coll, step, seed);
    return step(result);
}

function append(result, item) {
    if (arguments.length === 2) {
        return result.concat([item]);
    }
    if (arguments.length === 1) {
        return result;
    }
    if (arguments.length === 0) {
        return [];
    }
}

// И перепишем для примера генератор трансдьюсеров map.
function map(fn) {
    return function(step) {
        return function(result, item) {
            if (arguments.length === 2) {
                return step(result, fn(item));
            }
            if (arguments.length === 1) {
                return step(result);
            }
            if (arguments.length === 0) {
                return step();
            }
        }
    }
}

