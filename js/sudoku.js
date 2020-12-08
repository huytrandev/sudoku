'use strict';
var reset = '';

var seconds = 0;
var minutes = 0;
var displaySeconds = 0;
var displayMinutes = 0;
//Define var to hold setInterval() function
var interval = null;
//Define var to hold stopwatch status
var statusClock = 'stopped';

var countCheck = 0;


const defaultMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];
var matrix = defaultMatrix.slice();

function generate() {
    var templates = [
        '004300209005009001070060043006002087190007400050083000600000105003508690042910300',
        '600120384008459072000006005000264030070080006940003000310000050089700000502000190',
        '000000657702400100350006000500020009210300500047109008008760090900502030030018206',
        '065370002000001370000640800097004028080090001100020940040006700070018050230900060',
        '850420370003000010000170009000500602029304000010000438046090805005000900702840003',
        '680905000003000508402108703390720800000000010045006900060804002001002075700013000',
        '020980040030047601019006080700490000800023907000605000904800006001000300350014020',
        '290041000470302050000060208039400005100000070504100603613200704000003080005900100',
        '431800006000300010000006205609134070020000040000570089003659020500080104807000003',
        '503070190000006750047190600400038000950200300000010072000804001300001860086720005',
        '900084060604005207030070080760001500053000001000409603105026090002040000800003710',
        '205040003001009000046001587004607090802000056090020340170008200000500800500903001',
        '065370002000001370000640800097004028080090001100020940040006700070018050230900060',
        '700084005300701020080260401624109038803600010000000002900000000001005790035400006',
        '497200000100400005000016098620300040300900000001072600002005870000600004530097061',
        '807000000610005430400690000002800709003007820900051046000009670054000000200403018',
        '107008000650100000300060072060030250480009700001407009000000800003980015040203060',
        '980046025000090700700300004008023010045070008000105006014800900506000307090002600',
        '270600050000070406006059030040005600081000040029006173390000002000097800807140005',
        '206597403080103000507000009000004210028006500409010060700305000001200000300480902',
        '080000032400006500000030100003605400100000006004807900009050000008700009620000080',
    ];
    // Random the templates above
    var matrixTemplate = templates[Math.floor(Math.random() * templates.length)];

    // Save the original templates for reset the game puzzle
    reset = matrixTemplate;

    var value = '';
    // Insert value to screen
    for (var i = 0; i < 81; i++) {
        // Insert value to display
        if (matrixTemplate[i] == '0') value = '';
        else value = matrixTemplate[i];

        document.getElementById('cell-' + i).value = value;

        // Display to the screen and disable cell which has a value
        if (value != '') {
            document.getElementById('cell-' + i).disabled = true;
            document.getElementById('cell-' + i).style.color = 'black';
        } else {
            document.getElementById('cell-' + i).disabled = false;
            document.getElementById('cell-' + i).style.color = '#BDBDBD';
        }
    }

    matrix = defaultMatrix.slice(); // Set matrix to default matrix
    matrix = getCurrentSudoku(); // Insert current value into matrix

    // Set time to default
    timeReset();
    interval = window.setInterval(timeStart, 1000);
    statusClock = 'started';
    document.getElementById('pause').src = './img/pause.svg';

    //clear color
    clearColor('relative-cell');
    clearColor('selected-cell');
    clearColor('duplicated-child');
    clearColor('duplicated-row');
    clearColor('duplicated-col');
    clearColor('disabled-cell');

    // clear hint
    document.getElementById('intro').innerHTML = "Let's try "+"Hint"+" if you can not find any answers";
    document.getElementById('hint-elements').innerHTML = '';
}

// Is the Sudoku Board solved?
function isSolved(matrix) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (matrix[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

// Solve the matrix
function solve(matrix) {
    if (isSolved(matrix)) {
        return matrix;
    } else {
        const possibilites = nextMatrixes(matrix);
        const isValidMatrixes = keepOnlyValid(possibilites);
        return searchForSolution(isValidMatrixes);
    }
}

function searchForSolution(matrixes) {
    if (matrixes.length < 1) {
        return false;
    } else {
        var first = matrixes.shift();
        const tryPath = solve(first);
        if (tryPath != false) {
            return tryPath;
        } else {
            return searchForSolution(matrixes);
        }
    }
}

function nextMatrixes(matrix) {
    var res = [];
    const firstEmpty = findEmptyCell(matrix);
    if (firstEmpty != 0) {
        const y = firstEmpty[0];
        const x = firstEmpty[1];
        for (var i = 1; i <= 9; i++) {
            var newMatrix = matrix.slice();
            var row = newMatrix[y].slice();
            row[x] = i;
            newMatrix[y] = row;
            res.push(newMatrix);
        }
    }
    return res;
}

function findEmptyCell(matrix) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (matrix[i][j] == 0) {
                return [i, j];
            }
        }
    }
}

// Filter valid matrix
function keepOnlyValid(matrixes) {
    return matrixes.filter(m => isValidMatrix(m));
}

function isValidMatrix(matrix) {
    return (isValidRows(matrix) && isValidCols(matrix) && isValidChildMatrix(matrix));
}

function isValidRows(matrix) {
    for (var i = 0; i < 9; i++) {
        var current = [];
        for (var j = 0; j < 9; j++) {
            if (current.includes(matrix[i][j])) {
                return false;
            } else if (matrix[i][j] != 0) {
                current.push(matrix[i][j]);
            }
        }
    }
    return true;
}

function isValidCols(matrix) {
    for (var i = 0; i < 9; i++) {
        var current = [];
        for (var j = 0; j < 9; j++) {
            if (current.includes(matrix[j][i])) {
                return false;
            } else if (matrix[j][i] != 0) {
                current.push(matrix[j][i]);
            }
        }
    }
    return true;
}

function isValidChildMatrix(matrix) {
    const childMatrixCoordinates = [
        [0, 0], [0, 1], [0, 2],
        [1, 0], [1, 1], [1, 2],
        [2, 0], [2, 1], [2, 2]
    ];

    for (var y = 0; y < 9; y += 3) {
        for (var x = 0; x < 9; x += 3) {
            var current = [];
            for (var i = 0; i < 9; i++) {
                var coordinates = childMatrixCoordinates[i].slice();
                coordinates[0] += y;
                coordinates[1] += x;
                if (current.includes(matrix[coordinates[0]][coordinates[1]])) {
                    return false;
                } else if (matrix[coordinates[0]][coordinates[1]] != 0) {
                    current.push(matrix[coordinates[0]][coordinates[1]]);
                }

            }
        }
    }
    return true;
}

// Get current the Sudoku in the screen
function getCurrentSudoku() {
    var currentMatrix = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    var cell = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var value = document.getElementById('cell-' + cell).value;
            if (value != '') currentMatrix[i][j] = parseInt(value);
            cell++;
        }
    }
    return currentMatrix;
}

function fillAllSudoku() {
    var current = getCurrentSudoku();
    var cell = 0;
    if (isValidMatrix(current)) {
        var currentSolved = solve(current);
        if (currentSolved != false) {
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    document.getElementById('cell-' + cell).value = currentSolved[i][j];
                    if (matrix[i][j] != current[i][j]) {
                        document.getElementById('cell-' + cell).style.color = '#000';
                    }

                    if (currentSolved[i][j] != current[i][j]) {
                        document.getElementById('cell-' + cell).style.color = '#1976D2';
                    }

                    document.getElementById('cell-' + cell).disabled = true;

                    cell++;
                }
            }
            matrix = currentSolved;

            document.getElementById('hint').disabled = true;
            document.getElementById('solve').disabled = true;
            document.getElementById('pause').disabled = true;
            document.getElementById('reload').disabled = true;
            document.getElementById('clear').disabled = false;

            document.getElementById('pause').src = './img/play.svg';
        } else {
            alert("Can't not solve Sudoku with values which you fill in!!!");
        }
    } else {
        var currentSolved = solve(matrix);
        if (currentSolved != false) {
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    document.getElementById('cell-' + cell).value = currentSolved[i][j];
                    if (currentSolved[i][j] !== matrix[i][j]) {
                        document.getElementById('cell-' + cell).style.color = '#1976D2';
                    } else {
                        document.getElementById('cell-' + cell).style.color = 'black';
                    }

                    document.getElementById('cell-' + cell).disabled = true;
                    cell++;
                }
            }
            matrix = currentSolved;

            document.getElementById('hint').disabled = true;
            document.getElementById('solve').disabled = true;
            document.getElementById('pause').disabled = true;
            document.getElementById('reload').disabled = true;
            document.getElementById('clear').disabled = false;

            document.getElementById('pause').src = './img/play.svg';
        } else {
            window.alert('Sudoku này không thể giải. Bạn vui lòng kiểm tra lại đề');
        }
    }

    // clear hint
    document.getElementById('hint-elements').innerHTML = '';

    // stopping time
    window.clearInterval(interval);
    statusClock = 'stopped';
}

function isBlankSudoku(matrix) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (matrix[i][j] != 0) return false;
        }
    }
    return true;
}

function check() {
    var current = getCurrentSudoku();
    countCheck++;

    // if (isBlankSudoku(current)) alert("The Sudoku is blank");
    changeColorDuplicated(current);
    // if (!isValidMatrix(current)) {
    //     changeColorDuplicated(current);
    // }
}

// Reload the game board
function reload() {
    if (reset != '') {
        var value = '';
        var cell = 0;
        matrix = defaultMatrix.slice();
        for (var i = 0; i < 81; i++) {
            if (reset[i] == '0') value = '';
            else value = reset[i];

            document.getElementById('cell-' + i).value = value;

            if (value != '') {
                document.getElementById('cell-' + i).disabled = true;
                document.getElementById('cell-' + i).style.color = 'black';
            }
            else {
                document.getElementById('cell-' + i).disabled = false;
                document.getElementById('cell-' + i).style.color = '#BDBDBD';
            }
        }

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                value = document.getElementById('cell-' + cell).value;

                if (value != '' && value != NaN) {
                    matrix[i][j] = parseInt(value);
                }

                cell++;
            }
        }
    } else if (!isBlankSudoku(matrix)) {
        var cell = 0;
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var element = document.getElementById('cell-' + cell);
                if (matrix[i][j] != 0) {
                    element.value = matrix[i][j];
                    element.disabled = true;
                    element.style.color = 'black';
                } else {
                    element.value = '';
                    element.disabled = false;
                    element.style.color = '#BDBDBD';
                }
                cell++;
            }
        }
    } else {
        for (var i = 0; i < 81; i++) {
            document.getElementById('cell-' + i).value = '';
        }
    }


    // Set time to default
    timeReset();
    clearColor('duplicated-child');
    clearColor('duplicated-row');
    clearColor('duplicated-col');
    interval = window.setInterval(timeStart, 1000);
    statusClock = 'started';
    document.getElementById('pause').src = './img/pause.svg';
    document.getElementById('intro').innerHTML = "Let's try "+"Hint"+" if you can not find any answers";
    document.getElementById('hint-elements').innerHTML = "";
}

function clear() {
    matrix = defaultMatrix.slice();
    reset = '';

    for (var i = 0; i < 81; i++) {
        document.getElementById('cell-' + i).value = '';
        document.getElementById('cell-' + i).disabled = false;
        document.getElementById('cell-' + i).style.color = 'black';
    }

    clearColor('relative-cell');
    clearColor('selected-cell');
    clearColor('duplicated-child');
    clearColor('duplicated-row');
    clearColor('duplicated-col');
    clearColor('disabled-cell');

    timeReset();

    // change time icon
    document.getElementById('pause').src = './img/play.svg';
    document.getElementById('intro').innerHTML = "Let's try "+"Hint"+" if you can not find any answers";
    document.getElementById('hint-elements').innerHTML = '';
}

function storeDisabledElement() {
    var allCell = document.querySelectorAll('.board-game td input');
    var disabledCell = [];
    var enabledCell = [];

    for (var i = 0; i < allCell.length; i++) {
        if (allCell[i].disabled) {
            disabledCell.push(i);
        } else {
            enabledCell.push(i);
        }
    };

    return [disabledCell, enabledCell];
}

// Start the time
function timeStart() {
    seconds++;

    if (seconds / 60 == 1) {
        seconds = 0;
        minutes++;
    }

    if (seconds < 10) displaySeconds = '0' + seconds;
    else displaySeconds = seconds;

    if (minutes < 10) displayMinutes = '0' + minutes;
    else displayMinutes = minutes;

    // display time
    document.getElementById('stop-watch').innerHTML = displayMinutes + ':' + displaySeconds;
}

function timePause() {
    if (statusClock == 'stopped') {
        interval = window.setInterval(timeStart, 1000);
        statusClock = 'started';
        document.getElementById('pause').src = './img/pause.svg';
    } else {
        window.clearInterval(interval);
        statusClock = 'stopped';
        document.getElementById('pause').src = './img/play.svg';
    }

    return statusClock;
}

function timeReset() {
    window.clearInterval(interval);
    seconds = 0;
    minutes = 0;
    document.getElementById('stop-watch').innerHTML = '00:00';
}

function start() {
    // Set time to default
    timeReset();
    interval = window.setInterval(timeStart, 1000);
    statusClock = 'started';
    document.getElementById('pause').src = './img/pause.svg';

    // clear hint
    document.getElementById('intro').innerHTML = "Let's try "+"Hint"+" if you can not find any answers";
    document.getElementById('hint-elements').innerHTML = '';

    // clear color
    clearColor('relative-cell');
    clearColor('selected-cell');

    matrix = getCurrentSudoku();

    for (var i = 0; i < 81; i++) {
        var cell = document.getElementById('cell-' + i);
        if (cell.value != '') {
            cell.disabled = true;
            cell.style.color = 'black';
        } else {
            cell.disabled = false;
            cell.style.color = '#BDBDBD';
        }
    }
}

function getCoordinateById(id) {
    var cell = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var idCell = 'cell-' + cell;
            if (idCell === id) {
                return [i, j];
            }
            cell++;
        }
    }
}

function nextMatrixesByCoordinate(matrix, id) {
    var res = [];
    const cell = getCoordinateById(id);
    if (cell != 0) {
        const y = cell[0];
        const x = cell[1];
        for (var i = 1; i <= 9; i++) {
            var newMatrix = matrix.slice();
            var row = newMatrix[y].slice();
            row[x] = i;
            newMatrix[y] = row;
            res.push(newMatrix);
        }
    }
    return res;
}


function hint(id) {
    if (id != '') {
        var current = getCurrentSudoku();
        const possibilites = nextMatrixesByCoordinate(current, id);
        const isValidMatrixes = keepOnlyValid(possibilites);
        var res = [];

        isValidMatrixes.forEach(function (item) {
            current = getCurrentSudoku();
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (current[i][j] != item[i][j]) res.push(item[i][j]);
                }
            }
        })

        document.getElementById('intro').innerHTML = 'Hints is below';
        document.getElementById('hint-elements').innerHTML = '';
        res.forEach(function(item) {
            document.getElementById('hint-elements').innerHTML += item;
        })
    } else {
        window.alert('Vui lòng chọn 1 ô !?!');
    }
}

function clearColor(className) {
    var allCell = document.querySelectorAll('.board-game td input');

    for (var i = 0; i < allCell.length; i++) {
        if (allCell[i].classList.contains(className)) {
            allCell[i].classList.remove(className);
        }
    }
}

function getNumericID(id) {
    return parseInt(id.slice(5));
}

function changeColor(id) { // id: 'cell-'
    // clear all color
    clearColor('relative-cell');
    clearColor('selected-cell');

    var cellID = getNumericID(id); // get only numeric cell id

    // get coordinate by ID cell
    var rowCoordinate = parseInt(cellID / 9);
    var colCoordinate = cellID % 9;
    var x = 0;
    var y= 0;

    // get start position of board child: row
    if (rowCoordinate >= 0 && rowCoordinate <= 2) x = 0;
    else if (rowCoordinate >= 3 && rowCoordinate <= 5) x = 3;
    else if (rowCoordinate >= 6 && rowCoordinate <= 8) x = 6;

    // get start position of board child: column
    if (colCoordinate >= 0 && colCoordinate <= 2) y = 0;
    else if (colCoordinate >= 3 && colCoordinate <= 5) y = 3;
    else if (colCoordinate >= 6 && colCoordinate <= 8) y = 6;

    // convert coordinate: [row, col] to ID
    var cellStartChild = (x * 9) + y;

    document.getElementById('cell-' + cellID).classList.add('selected-cell');

    // change color row and column
    for (var i = 0; i < 9; i++) {
        if (((rowCoordinate * 9) + i) != cellID) {
            document.getElementById('cell-' + ((rowCoordinate * 9) + i)).classList.add('relative-cell');
        }

        if ((colCoordinate + (9 * i)) != cellID) {
            document.getElementById('cell-' + (colCoordinate + (9 * i))).classList.add('relative-cell');
        }
    }

    // change color 9x9
    for (var i = 0; i <= 18; i += 9) {
        for (var j = 0; j < 3; j++) {
            if ((cellStartChild + i + j) != cellID) {
                document.getElementById('cell-' + (cellStartChild + i + j)).classList.add('relative-cell');
            }
        }
    }
}

function changeColorDuplicated(matrix) {
    var row = duplicatedOnRow(matrix);
    var col = duplicatedOnCol(matrix);
    var child = duplicatedChild(matrix);

    // on child
    if (child != undefined && child.length != 0) {
        for (var i = 0; i < child.length; i++) {
            var cellStartChild = (child[i][0][0] * 9) + child[i][0][1];

            for (var x = 0; x <= 18; x += 9) {
                for (var y = 0; y < 3; y++) {
                    var element = document.getElementById('cell-' + (cellStartChild + x + y));

                    if (element.classList.contains('duplicated-child')) {
                        if (!child[i][1].includes(parseInt(element.value))) {
                            element.classList.remove('duplicated-child');
                        }
                    } else if (child[i][1].includes(parseInt(element.value))) {
                        element.classList.add('duplicated-child');
                    }
                }
            }
        }
    }

    // on row
    if (row != undefined && row.length != 0) {
        for (var i = 0; i < row.length; i++) {
            for (var j = 0; j < 9; j++) {
                var element = document.getElementById('cell-' + ((row[i][0] * 9) + j));

                if (element.classList.contains('duplicated-row')) {
                    if (!row[i][1].includes(parseInt(element.value))) {
                        element.classList.remove('duplicated-row');
                    }
                } else if (row[i][1].includes(parseInt(element.value))) {
                    element.classList.add('duplicated-row');
                }
            }
        }
    } else {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var element = document.getElementById('cell-' + ((i * 9) + j));

                if (element.classList.contains('duplicated-row')) {
                        element.classList.remove('duplicated-row');
                }
            }
        }
    }

    // on col
    if (col != undefined && col.length != 0) {
        for (var i = 0; i < col.length; i++) {
            for (var j = 0; j < 9; j++) {
                var element = document.getElementById('cell-' + (col[i][0] + (9 * j)));

                if (element.classList.contains('duplicated-col')) {
                    if (!col[i][1].includes(parseInt(element.value))) {
                        element.classList.remove('duplicated-col');
                    }
                } else if (col[i][1].includes(parseInt(element.value))) {
                    element.classList.add('duplicated-col');
                }
            }
        }
    } else {

    }


}

function getDuplicatedValue(array) {
    var current = [];
    var duplicated = [];
    for (var i = 0; i < array.length; i++) {
        if (current.includes(array[i])) {
            duplicated.push(array[i]);
        } else if (array[i] != 0) {
            current.push(array[i]);
        }
    }

    return duplicated;
}

function backTrackingArray(array) {
    var current = [];
    for (var i = 0; i < array.length; i++) {
        if (current.includes(array[i])) {
            return false;
        } else if (array[i] != 0) {
            current.push(array[i]);
        }
    }
    return true;
}

function duplicatedOnRow(matrix) {
    var duplicated = [];
    for (var i = 0; i < matrix.length; i++) {
        if (!backTrackingArray(matrix[i])) {
            duplicated.push([i, getDuplicatedValue(matrix[i])]);
        }
    }
    return duplicated;
}

function duplicatedOnCol(matrix) {
    var duplicated = [];

    for (var i = 0; i < matrix.length; i++) {
        var col = [];

        for (var j = 0; j < matrix.length; j++) {
            col.push(matrix[j][i]);
        }

        if (!backTrackingArray(col)) {
            duplicated.push([i, getDuplicatedValue(col)])
        }
    }

    return duplicated;
}

function duplicatedChild(matrix) {
    var duplicated = [];

    const childMatrixCoordinates = [
        [0, 0], [0, 1], [0, 2],
        [1, 0], [1, 1], [1, 2],
        [2, 0], [2, 1], [2, 2]
    ];

    for (var y = 0; y < 9; y += 3) {
        for (var x = 0; x < 9; x += 3) {
            var child = [];

            for (var i = 0; i < 9; i++) {
                var coordinates = childMatrixCoordinates[i].slice();
                coordinates[0] += y;
                coordinates[1] += x;

                child.push(matrix[coordinates[0]][coordinates[1]]);
            }

            if (!backTrackingArray(child)) {
                duplicated.push([[y, x], getDuplicatedValue(child)]);
            }
        }
    }

    return duplicated;
}

function getCountCheck() {
    return countCheck;
}
