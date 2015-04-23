window["module"]("Y-комбинатор и рекурсивные функции. Рекурсия через Y-комбинатор.");

// На начальном этапе используем встроенный механизм рекурсии JavaScript.

var fact = function(n) {
    if(n < 2) return 1;
    return n * fact(n - 1);
};

(function(f) {
    f(f);
})(function(f) {
    f(f);
});

/////////////////////////////////////////////////////////////////////////

var fact = (function(f) {
    return function(n) {
        // termination condition
        if(n < 2) return 1;

        // because f returns a function, we have a double function call.
        return n * f(f)(n - 1);
    };
})(function(f) {
    return function(n) {
        // termination condition
        if(n < 2) return 1;

        // because f returns a function, we have a double function call.
        return n * f(f)(n - 1);
    };
});

/////////////////////////////////////////////////////////////////////////

var recur = function(f) {
    return f(f);
};

var fact = recur(function(f) {
    return function(n) {
        if(n < 2) return 1;

        // because f returns a function, we have a double function call.
        return n * f(f)(n - 1);
    };
});

/////////////////////////////////////////////////////////////////////////

var recur = function(f) {
    return f(f);
};

var fact = recur(function(f) {
    var g = function(n) {
        return f(f)(n);
    };

    return function(n) {
        if(n < 2) return 1;

        // no more double call, g is a function which takes a numeric arg
        return n * g(n - 1);
    };
});

/////////////////////////////////////////////////////////////////////////

var recur = function(f) {
    return f(f);
};

var wrap = function(h) {
    return recur(function(f) {
        var g = function(n) {
            return f(f)(n);
        };

        return h(g);
    });
};

var fact = wrap(function(g) {
    return function(n) {
        if(n < 2) return 1;
        return n * g(n - 1);
    };
});

// Давайте встроим определение g внутри wrap так как мы вызываем это только однажды.

var recur = function (f) {
    return f(f);
};

var wrap = function (h) {
    return recur(function (f) {
        return h(function (n) {
            return f(f)(n);
        });
    });
};

var fact = wrap(function (g) {
    return function (n) {
        if (n < 2) return 1;
        return n * g(n - 1);
    };
});

// Теперь если мы также встроим определение функции recur внутри wrap то мы закончим вместе с известным Y-комбинатором.

var Y = function (h) {
    return (function (f) {
        return f(f);
    })(function (f) {
        return h(function (n) {
            return f(f)(n);
        });
    });
};

var fact = Y(function (g) {
    return function (n) {
        if (n < 2) return 1;
        return n * g(n - 1);
    };
});

