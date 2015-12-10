window["module"]("Рекурсия и типы данных. Часть 2.");

// возвращает True если аргумент содержит повторяющиеся элементы.
function duplicates(array) {
    var impl = function(i, array) {
        if(i >= array.length)
            return false;

        if(array.lastIndexOf(array[i]) > i)
            return true;

        return impl(i + 1, array);
    };

    return impl(0, array);
}

// возвращает массив уникальных элементов из переданного массива.
function removeDuplicates(array) {
    var impl = function(array, i, accumulator) {
        if(i >= array.length)
            return accumulator;

        if(accumulator.indexOf(array[i]) > -1)
            return impl(array, i + 1, accumulator);

        accumulator.push(array[i]);
        return impl(array, i + 1, accumulator);
    };

    return impl(array, 0, []);
}

test("Повторяющиеся элементы", function() {
    equal(duplicates([1, 2, 3, 4, 5]), false);
    equal(duplicates([1, 2, 3, 2]), true);

    deepEqual(removeDuplicates([1, 2, 3, 2, 4, 5, 4, 4]), [1, 2, 3, 4, 5]);
});

// Пересечение двух массивов A и B — это массив только с теми элементами A и B, которые одновременно принадлежат обоим массивам, без дублей.
function intersection(array1, array2) {
    var impl = function(left, right, i, accumulator) {
        if(i == left.length)
            return accumulator;

        if(accumulator.indexOf(left[i]) > -1)
            return impl(left, right, i + 1, accumulator);

        if(right.indexOf(left[i]) > -1)
            accumulator.push(left[i]);

        return impl(left, right, i + 1, accumulator);
    };

    return impl(array2, array1, 0, impl(array1, array2, 0, []));
}

test("Пересечение массивов", function() {
    deepEqual(intersection ([1,2,3,7,9],[4,5,7,2,1,5]), [1,2,7]);
});

// Разность двух массивов A и B — это массив с элементами A, не совпадающими с элементами B, без дублей.
function arr_diff(array1, array2) {
    var impl = function(left, right, i, accumulator) {
        if(i == left.length)
            return accumulator;

        if(accumulator.indexOf(left[i]) < 0 && right.indexOf(left[i]) < 0)
            accumulator.push(left[i]);

        return impl(left, right, i + 1, accumulator);
    };

    return impl(array1, array2, 0, []);
}

test("Разность массивов", function() {
    deepEqual(arr_diff([1,2,3,7,9],[4,5,7,2,1,5]), [3,9]);
    deepEqual(arr_diff([4,5,7,2,1,5], [1,2,3,7,9]), [4,5]);
});

// Объединение двух массивов A и B — это массив с элементами A и элементы массива B, без дублей.
function arr_sum(array1, array2) {
    var impl = function(array, i, accumulator) {
        if(i === array.length)
            return accumulator;

        if(accumulator.indexOf(array[i]) < 0)
            accumulator.push(array[i]);

        return impl(array, i + 1, accumulator);
    };

    return impl(array2, 0, impl(array1, 0, []));
}

test("Объединение массивов", function() {
    deepEqual(arr_sum([1, 2, 3, 7, 9], [4, 5, 7, 2, 1, 5]), [1, 2, 3, 7, 9, 4, 5]);
    deepEqual(arr_sum([4, 5, 7, 2, 1, 5], [1, 2, 3, 7, 9]), [4, 5, 7, 2, 1, 5, 3, 9]);
});

// Симметрическая разность двух массивов A и B — это такой массив, куда входят все те элементы первого массива, которые не входят во второй массив, а также те элементы второго массива, которые не входят в первый массив.
function symmetricDiff(array1, array2) {
    // здесь будет код
}

test("Симметрическая разность массивов", function() {
    deepEqual(symmetricDiff([1, 2, 3, 7, 9], [4, 5, 7, 2, 1, 5]), [3, 9, 4, 5]);
    deepEqual(symmetricDiff([1, 2, 3, 4, 5], [3, 4, 5, 6, 7]), [1, 2, 6, 7]);
});

