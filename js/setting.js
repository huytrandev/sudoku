'use strict';
window.onload = function () {
    var idCell = '';

    document.getElementById('pause').disabled = true;
    document.getElementById('clear').disabled = true;

    document.getElementById('generate').addEventListener('click', function () {
        idCell = '';
        for (var i = 0; i < 81; i++) {
            document.getElementById('cell-' + i).disabled = false;
        }
        generate();
        document.getElementById('hint').disabled = false;
        document.getElementById('solve').disabled = false;
        document.getElementById('pause').disabled = false;
        document.getElementById('reload').disabled = false;
        document.getElementById('start').disabled = false;
        document.getElementById('start').disabled = true;
        document.getElementById('clear').disabled = false;

    }, false);

    document.getElementById('download').addEventListener('click', function () {
        download();
    }, false);

    document.getElementById('start').addEventListener('click', function () {
        start();
        document.getElementById('start').disabled = true;
        document.getElementById('pause').disabled = false;
        document.getElementById('clear').disabled = false;
    }, false);

    document.getElementById('pause').addEventListener('click', function () {
        timePause();
        // document.getElementById('solve').disabled = true;
        // document.getElementById('reload').disabled = true;
        // for (var i = 0; i < 81; i++) {
        //     document.getElementById('cell-' + i).disabled = true;
        // }
    }, false);

    document.getElementById('solve').addEventListener('click', function () {
        fillAllSudoku();
        document.getElementById('intro').innerHTML = 'Bạn sẽ cảm thấy thích thú hơn nếu tự mình giải trò chơi đấy';
    }, false);

    document.getElementById('check').addEventListener('click', function () {
        check();
    }, false);

    document.getElementById('reload').addEventListener('click', function () {
        reload();
    }, false);

    document.getElementById('clear').addEventListener('click', function () {
        clear();
        document.getElementById('hint').disabled = false;
        document.getElementById('solve').disabled = false;
        document.getElementById('pause').disabled = false;
        document.getElementById('reload').disabled = false;
        document.getElementById('start').disabled = false;
    }, false);

    document.getElementById('hint').addEventListener('click', function () {
        hint(idCell);
    }, false);

    for (var i = 0; i < 81; i++) {
        document.getElementById('cell-' + i).addEventListener('click', function () {
            idCell = this.id;
            changeColor(idCell);
        });

        document.getElementById('cell-' + i).addEventListener('change', function () {
            var current = getCurrentSudoku();
            var time = document.getElementById('stop-watch').textContent;
            // check();
            if (isSolved(current) && validMatrix(current)) {
                timePause();
                document.getElementById('intro').innerHTML = 'Bạn đã hoàn thành trò chơi trong ' + time;
                for (var i = 0; i < 81; i++) {
                    document.getElementById('cell-' + i).disabled = true;
                }
            }
        });

        setInputFilter(document.getElementById('cell-' + i), function (value) {
            return /^\d*$/.test(value) && (value == '' || (parseInt(value) <= 9 && parseInt(value) >= 1));
        });

        $('#myModal').on('shown.bs.modal', function () {
            $('#myInput').trigger('focus')
        })
    }
}
