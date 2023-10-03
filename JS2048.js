let testMode = false;

function ResetGame(){
	SetUpGame();
    UpdateMainGrid();
}

function GenerateSquares(){
    SetUpGame();

	let container = document.getElementById("game-squares");
	for(let row = 1; row <= 4;row++) //six rows
	{
		let rowElement = document.createElement("div");

        rowElement.classList.add("row");

		rowElement.id = "row-" + row;

		container.appendChild(rowElement);

		for(let square = 1;square <=4;square++)
		{
			let squareElement = document.createElement("div");
			squareElement.id = "square-" + row + "-" + square;

            squareElement.setAttribute("onclick", "multiplySquare(" + (row - 1) + "," + (square - 1) + ")");

			rowElement.appendChild(squareElement);

			//squareElement.classList.add("light");
			squareElement.classList.add("anti-dark-border");
			squareElement.classList.add("text-light");
            squareElement.classList.add("cell");
            squareElement.classList.add("game-square-text");
		}
	}

    UpdateMainGrid();
}

function UpdateMainGrid() {
    for(let i = 1; i <= 4; i++)
    {
        for(let x = 1; x <= 4; x++)
        {
            let element = document.getElementById("square-" + i + "-" + x);
            let nums = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
            for(let i = 0; i < nums.length;i++)
            {
                element.classList.remove("color-" + nums[i]);
            }
            if(mainGame[i - 1][x - 1] != 0) 
            {
                element.innerHTML = "" + mainGame[i - 1][x - 1];
                element.classList.add("color-" + mainGame[i - 1][x - 1]);
            }
            else element.innerHTML = "";
        }
    }
}

document.addEventListener('keydown', function (event){
    keyPressed(event.keyCode);
});

function keyPressed(keyCode) {
    //console.log("Key Pressed: " + keyCode);

    //deactivates controls while solver is running
    if(solverActivated) return;

    //UP
    if(keyCode == 87 || keyCode == 38) {
        MoveGrid(mainGame, 1);
    }

    //DOWN
    if(keyCode == 83 || keyCode == 40) {
        MoveGrid(mainGame, 2);
    }

    //LEFT
    if(keyCode == 65 || keyCode == 37) {
        MoveGrid(mainGame, 3);
    }

    //RIGHT
    if(keyCode == 68 || keyCode == 39) {
        MoveGrid(mainGame, 4);
    }

    UpdateMainGrid();
}

function multiplySquare(y, x)
{
    console.log("here");
    if (!testMode) return;

    mainGame[y][x] *= 2;

    if(mainGame[y][x] == 0) mainGame[y][x] = 2;
    UpdateMainGrid();
}
