window.onload = function () {
    document.getElementById("stop").disabled = true;
    document.getElementById("clear").disabled = true;

    document.getElementById("generate").addEventListener("click", function () {
        idCell = "";
        for (var i = 0; i < 81; i++) {
            document.getElementById("cell-" + i).disabled = false;
        }
        generate();
        document.getElementById("hint").disabled = false;
        document.getElementById("solve").disabled = false;
        document.getElementById("stop").disabled = false;
        document.getElementById("reload").disabled = false;
        document.getElementById("start").disabled = false;
        document.getElementById("start").disabled = true;
        document.getElementById("clear").disabled = false;

    }, false);

    document.getElementById("download").addEventListener("click", function () {
        download();
    }, false);

    document.getElementById("start").addEventListener("click", function () {
        start();
        document.getElementById("start").disabled = true;
    }, false);

    document.getElementById("stop").addEventListener("click", function () {
        stop();
        document.getElementById("solve").disabled = true;
        document.getElementById("reload").disabled = true;
        for (var i = 0; i < 81; i++) {
            document.getElementById("cell-" + i).disabled = true;
        }
    }, false);

    document.getElementById("solve").addEventListener("click", function () {
        fillAllSudoku();
    }, false);

    document.getElementById("check").addEventListener("click", function () {
        check();
    }, false);

    document.getElementById("reload").addEventListener("click", function () {
        reload();
    }, false);

    document.getElementById("clear").addEventListener("click", function () {
        clear();
        document.getElementById("hint").disabled = false;
        document.getElementById("solve").disabled = false;
        document.getElementById("stop").disabled = false;
        document.getElementById("reload").disabled = false;
        document.getElementById("start").disabled = false;
    }, false);

    document.getElementById("hint").addEventListener("click", function () {
        hint(idCell);
    }, false);

    for (var i = 0; i < 81; i++) {
        document.getElementById("cell-" + i).addEventListener("click", function () {
            idCell = this.id;
            // this.style.backgroundColor = "lightgrey";
        });

        document.getElementById("cell-" + i).addEventListener("input", function () {
            var current = getCurrentSudoku();
            var time = document.getElementById("seconds").value;
            if (isSolved(current) && validMatrix(current)) {
                stop();
                window.alert("Chúc mừng, bạn đã hoàn thành trò chơi trong " + time + " giây");
                for (var i = 0; i < 81; i++) {
                    document.getElementById("cell-" + i).disabled = true;
                }
            }
        });

        setInputFilter(document.getElementById("cell-" + i), function (value) {
            return /^\d*$/.test(value) && (value == "" || (parseInt(value) <= 9 && parseInt(value) >= 1));
        });

        $('#myModal').on('shown.bs.modal', function () {
            $('#myInput').trigger('focus')
        })
    }
}