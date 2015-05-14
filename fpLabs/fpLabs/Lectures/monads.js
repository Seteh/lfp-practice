window["module"]("Монады");

var sine = function(x) { return Math.sin(x) };
var cube = function(x) { return x * x * x };
var sineCubed = cube(sine(x));

var compose = function(f, g) {
    return function(x) {
        return f(g(x));
    };
};

var sineOfCube = compose(sine, cube);
var y = sineOfCube(x);

var cube = function(x) {
    console.log('cube was called.');
    return x * x * x;
};

var sine = function(x) {
    return [Math.sin(x), 'sine was called.'];
};
var cube = function(x) {
    return [x * x * x, 'cube was called.'];
};

cube(3) // -> [27, 'cube was called.']
compose(sine, cube)(3) // -> [NaN, 'sine was called.']

// Ожидаемое
compose(sine, cube)(3)
// -> [0.956, 'cube was called.sine was called.']

// Новый композитор
var composeDebuggable = function(f, g) {
    return function(x) {
        var gx = g(x),      // e.g. cube(3) -> [27, 'cube was called.']
            y = gx[0],     //                 27
            s = gx[1],     //                 'cube was called.'
            fy = f(y),      //     sine(27) -> [0.956, 'sine was called.']
            z = fy[0],     //                 0.956
            t = fy[1];     //                 'sine was called.'

        return [z, s + t];
    };
};

composeDebuggable(sine, cube)(3)
// -> [0.956, 'cube was called.sine was called.']

var bind = function(f) {
    return function(tuple) {
        var x = tuple[0],
            s = tuple[1],
            fx = f(x),
            y = fx[0],
            t = fx[1];

        return [y, s + t];
    };
};

var f = compose(bind(sine), bind(cube));
f([3, '']) // -> [0.956, 'cube was called.sine was called.']

// unit :: Number -> (Number,String)
var unit = function(x) { return [x, ''] };
var f = compose(bind(sine), bind(cube));
f(unit(3)) // -> [0.956, 'cube was called.sine was called.']
// or ...
compose(f, unit)(3) // -> [0.956, 'cube was called.sine was called.']

// round :: Number -> Number
var round = function(x) { return Math.round(x) };
// roundDebug :: Number -> (Number,String)
var roundDebug = function(x) { return unit(round(x)) };

// lift :: (Number -> Number) -> (Number -> (Number,String))
var lift = function(f) {
    return function(x) {
        return unit(f(x));
    };
};
// or, more simply:
var lift = function(f) { return compose(unit, f) };
// Давайте проверим как она работает с нашими функциями:
var round = function(x) { return Math.round(x) };
var roundDebug = lift(round);
var f = compose(bind(roundDebug), bind(sine));
f(unit(27)) // -> [1, 'sine was called.']

// Эти абстракции (на самом деле, только bind и unit), определяют монаду.

////////////////////////////////////////////////////////////////////////////////////////////

// children :: HTMLElement -> [HTMLElement]
var children = function(node) {
    var children = node.childNodes, ary = [];
    for(var i = 0, n = children.length; i < n; i++) {
        ary[i] = children[i];
    }
    return ary;
};
// e.g.
var heading = document.getElementsByTagName('h3')[0];
children(heading)
// -> [
//      "Translation from Haskell to JavaScript...",
//      <span class=​"edit">​…​</span>​
//    ]

var grandchildren = compose(children, children);

// grandchildren :: HTMLElement -> [HTMLElement]
var grandchildren = function(node) {
    var output = [], childs = children(node);
    for(var i = 0, n = childs.length; i < n; i++) {
        output = output.concat(children(childs[i]));
    }
    return output;
};

// unit :: a -> [a]
var unit = function(x) { return [x] };
// bind :: (a -> [a]) -> ([a] -> [a])
var bind = function(f) {
    return function(list) {
        var output = [];
        for (var i = 0, n = list.length; i < n; i++) {
            output = output.concat(f(list[i]));
        }
        return output;
    };
};
// Теперь мы можем композировать children:
var div = document.getElementsByTagName('div')[0];
var grandchildren = compose(bind(children), bind(children));

grandchildren(unit(div));
// -> [<h1>…</h1>, <p>…</p>, ...]

////////////////////////////////////////////////////////////////////////////////////////////

// Монады в JavaScript

var stack = [];

stack.push(4);
stack.push(5);
stack.pop(); // 5
stack.pop(); // 4

// Стек с явной обработкой состояния

// .concat() и .slice() - два метода массива, которые не изменяют объект, для которого они были вызваны, а возвращают новый массив
var push = function(element, stack) {
    var newStack = [element].concat(stack);

    return newStack;
};

var pop = function(stack) {
    var value = stack[0];
    var newStack = stack.slice(1);

    return { value: value, stack: newStack };
};

var stack0 = [];

var stack1 = push(4, stack0);
var stack2 = push(5, stack1);
var result0 = pop(stack2);        // {value: 5, stack: [4]}
var result1 = pop(result0.stack); // {value: 4, stack: []}

// заставим push возвращать undefined:

var push = function(element, stack) {
    var value = undefined;
    var newStack = [element].concat(stack);

    return { value: value, stack: newStack };
};

var pop = function(stack) {
    var value = stack[0];
    var newStack = stack.slice(1);

    return { value: value, stack: newStack };
};

var stack0 = [];

var result0 = push(4, stack0);
var result1 = push(5, result0.stack);
var result2 = pop(result1.stack); // {value: 5, stack: [4]}
var result3 = pop(result2.stack); // {value: 4, stack: []}

// Перепишем код в стиле передачи продолжения

var bind = function(value, continuation) {
    return continuation(value);
};

var stack0 = [];

var finalResult = bind(push(4, stack0), function(result0) {
    return bind(push(5, result0.stack), function(result1) {
        return bind(pop(result1.stack), function(result2) {
            return bind(pop(result2.stack), function(result3) {
                var value = result2.value + " : " + result3.value;
                return { value: value, stack: result3.stack };
            });
        });
    });
});

// Каррирование push и pop

var push = function(element) {
    return function(stack) {
        var value = undefined;
        var newStack = [element].concat(stack);

        return { value: value, stack: newStack };
    };
};

var pop = function() {
    return function(stack) {
        var value = stack[0];
        var newStack = stack.slice(1);

        return { value: value, stack: newStack };
    };
};

var stack0 = [];

var finalResult = bind(push(4)(stack0), function(result0) {
    return bind(push(5)(result0.stack), function(result1) {
        return bind(pop()(result1.stack), function(result2) {
            return bind(pop()(result2.stack), function(result3) {
                var value = result2.value + " : " + result3.value;
                return { value: value, stack: result3.stack };
            });
        });
    });
});

// Готовим bind к передаче промежуточных стеков

var bind = function(stackOperation, continuation) {
    return function(stack) {
        return continuation(stackOperation(stack));
    };
};

var stack0 = [];

var finalResult = bind(push(4), function(result0) {
    return bind(push(5), function(result1) {
        return bind(pop(), function(result2) {
            return bind(pop(), function(result3) {
                var value = result2.value + " : " + result3.value;
                return { value: value, stack: result3.stack };
            })(result2.stack);
        })(result1.stack);
    })(result0.stack);
})(stack0);

// Убираем стеки в конце

var bind = function(stackOperation, continuation) {
    return function(stack) {
        var result = stackOperation(stack);
        var newStack = result.stack;
        return continuation(result)(newStack);
    };
};

var computation = bind(push(4), function(result0) {
    return bind(push(5), function(result1) {
        return bind(pop(), function(result2) {
            return bind(pop(), function(result3) {
                var value = result2.value + " : " + result3.value;

                // We need this anonymous function because we changed the protocol
                // of the continuation. Now, each continuation must return a
                // function which accepts a stack.
                return function(stack) {
                    return { value: value, stack: stack };
                };
            });
        });
    });
});

var stack0 = [];
var finalResult = computation(stack0);

// Прячем оставшийся стек

var result = function(value) {
    return function(stack) {
        return { value: value, stack: stack };
    };
};

var computation = bind(push(4), function(result0) {
    return bind(push(5), function(result1) {
        return bind(pop(), function(result2) {
            return bind(pop(), function(result3) {

                return result(result2.value + " : " + result3.value);

            });
        });
    });
});

var stack0 = [];
var finalResult = computation(stack0);

// Делаем состояние внутренним

var bind = function(stackOperation, continuation) {
    return function(stack) {
        var result = stackOperation(stack);
        return continuation(result.value)(result.stack);
    };
};

var computation = bind(push(4), function() {
    return bind(push(5), function() {
        return bind(pop(), function(result1) {
            return bind(pop(), function(result2) {

                return result(result1 + " : " + result2);

            });
        });
    });
});

var stack0 = [];
var finalResult = computation(stack0);

// Выполняем вычисление стека

// Returns both the result and the final state.
var runStack = function(stackOperation, initialStack) {
    return stackOperation(initialStack);
};

// Returns only the computed result.
var evalStack = function(stackOperation, initialStack) {
    return stackOperation(initialStack).value;
};

// Returns only the final state.
var execStack = function(stackOperation, initialStack) {
    return stackOperation(initialStack).stack;
};

var stack0 = [];

console.log(runStack(computation, stack0));
// { value="5 : 4", stack=[]}

console.log(evalStack(computation, stack0));
// 5 : 4

console.log(execStack(computation, stack0));
// []



// Немного сахара для Javascript

var sequence = function(/* monadicActions..., continuation */) {
    var args = [].slice.call(arguments);
    var monadicActions = args.slice(0, -1);
    var continuation = args.slice(-1)[0];

    return function(stack) {
        var initialState = { values: [], stack: stack };

        var state = monadicActions.reduce(function(state, action) {
            var result = action(state.stack);
            var values = state.values.concat(result.value);
            var stack = result.stack;

            return { values: values, stack: stack };
        }, initialState);

        var values = state.values.filter(function(value) {
            return value !== undefined;
        });

        return continuation.apply(this, values)(state.stack);
    };
};

var computation = sequence(
  push(4), // <- programmable commas :)
  push(5),
  pop(),
  pop(),

  function(pop1, pop2) {
      return result(pop1 + " : " + pop2);
  }
);

var initialStack = [];
var result = computation(initialStack); // "5 : 4"


// Монады, как отложенные вычисления

var computation = sequence(
  push(4),
  push(5),
  pop(),
  pop(),

  function (pop1, pop2) {
      return result(pop1 + " : " + pop2);
  }
);


// Этот кусок кода вычисляет что-либо после выполнения? Нет. Необходимо его запустить с помощью runStack, evalStack или execStack.

var initialStack = [];
evalStack(computation, initialStack);

// Легко комбинируемые блоки

var computation1 = sequence(
  push(4),
  push(5),
  pop(),
  pop(),

  function(pop1, pop2) {
      return result(pop1 + " : " + pop2);
  }
);

var computation2 = sequence(
  push(2),
  push(3),
  pop(),
  pop(),

  function(pop1, pop2) {
      return result(pop1 + " : " + pop2);
  }
);

var composed = sequence(
  computation1,
  computation2,

  function(a, b) {
      return result(a + " : " + b);
  }
);

console.log(evalStack(composed, [])); // "5 : 4 : 3 : 2"
