function download() {
    var filename = "Sudoku.txt";
    var element = document.createElement("a");
    var file = "";

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            file += matrix[i][j] + " ";

            if (j == 8) {
                file += "\n";
            }
        }
    }

    element.style.display = "none";

    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(file));

    element.setAttribute("download", filename);
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
