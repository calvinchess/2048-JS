let solverActivated = false;

let currentSolver = undefined;

let movesAhead = 8;
let averageCount = 20;

let cornerModifier = 3;
let snakeModifier = 10;
let whiteSpaceModifier = 60;
let highestModifier = 7;
let earlyMoveModifier = 1;

function InitializeSolverValues()
{
	document.getElementById("moves-ahead-box").value = movesAhead + "";
	document.getElementById("average-count-box").value = averageCount + "";

	document.getElementById("corner-modifier-box").value = cornerModifier + "";
	document.getElementById("snake-modifier-box").value = snakeModifier + "";
	document.getElementById("whitespace-modifier-box").value = whiteSpaceModifier + "";
	document.getElementById("highest-modifier-box").value = highestModifier + "";
}

function ChangeSolverValues()
{
	movesAhead = parseInt(document.getElementById("moves-ahead-box").value);
	averageCount = parseInt(document.getElementById("average-count-box").value);

	cornerModifier = parseInt(document.getElementById("corner-modifier-box").value);
	snakeModifier = parseInt(document.getElementById("snake-modifier-box").value);
	whiteSpaceModifier = parseInt(document.getElementById("whitespace-modifier-box").value);
	highestModifier = parseInt(document.getElementById("highest-modifier-box").value);

	testMode = document.getElementById("test-mode-box").value;
}

function ToggleSolver() {
	solverActivated = !solverActivated;

	let toggleButton = document.getElementById("toggle-solver-button");

	if (solverActivated) {
		toggleButton.classList.add("color-64");
		toggleButton.innerHTML = "Deactivate Solver";

		currentSolver = setInterval(RunSolver, 1);
	}
	else 
	{
		toggleButton.classList.remove("color-64");
		toggleButton.innerHTML = "Activate Solver";

		clearInterval(currentSolver);
	}
}

function RunSolver()
{
	let bestMove = AverageOutBestMove(mainGame, movesAhead, averageCount);

	console.log("Best Move: " + bestMove);

	if(bestMove != -1)
	{
		MoveGrid(mainGame, bestMove);
		UpdateMainGrid();
	}
	else
	{
		SetUpGame();
	}
}

function copyGrid(grid) {
	newGrid = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];

	for(let i = 0;i < 4; i++)
	{
		for(let x = 0; x < 4;x ++)
		{
			newGrid[i][x] = grid[i][x] + 0;
		}
	}

	return newGrid;
}

function ScoreCurrentGrid()
{
	let CornerScore = CornerFunction(mainGame) * cornerModifier;
	let SnakeScore = SnakeFunction(mainGame) * snakeModifier;
	let WhiteSpaceScore = WhiteSpaceFunction(mainGame) * whiteSpaceModifier;
	//let HighestScore = HighestFunction(mainGame) * highestModifier;

	console.log("Corner Score: " + CornerScore);
	console.log("Snake Score: " + SnakeScore);
	console.log("White Space Score: " + WhiteSpaceScore);
	//console.log("Highest Score: " + HighestScore);

	console.log("Total Score: " + (CornerScore + SnakeScore + WhiteSpaceScore));
}

function calculateGridScore(grid)
{
	let totalScore = 0;

	totalScore += CornerFunction(grid) * cornerModifier;
	totalScore += SnakeFunction(grid) * snakeModifier;
	totalScore += WhiteSpaceFunction(grid) * whiteSpaceModifier;
	//totalScore += HighestFunction(grid) * highestModifier;

	return totalScore;
}

function HighestFunction(grid)
{
	let highest = 0;
	for(let i = 0; i < grid.length;i++)
	{
		for(let x = 0; x < grid[i].length; x++)
		{
			if(grid[i][x] > highest) 
			{
				highest = grid[i][x];
			}
		}
	}

	return highest;
}

function WhiteSpaceFunction(grid)
{
	let count = 0;
	for(let i = 0; i < grid.length;i++)
	{
		for(let x = 0; x < grid[i].length; x++)
		{
			if(grid[i][x] == 0) count++;
		}
	}

	return count;
}

function CornerFunction(grid)
{
	let highestNum = 0;
	for(let i = 0; i < grid.length;i++)
	{
		for(let x = 0; x < grid[i].length; x++)
		{
			if(highestNum < grid[i][x])
			{
				highestNum = grid[i][x];
			}
		}
	}

	if(grid[0][0] == highestNum || grid[0][3] == highestNum || grid[3][0] == highestNum || grid[3][3] == highestNum) return highestNum;
	return 0;
}

function SnakeFunction(grid)
{
	let uniqueNums = [];

	for(let i = 0; i < 4;i++)
	{
		for(let x = 0; x < 4; x++)
		{
			let notInList = true;
			for(let y = 0; y < uniqueNums.length;y++)
			{
				if(grid[i][x] == uniqueNums[y]) notInList = false;
			}

			if(notInList) uniqueNums.push(grid[i][x]);
		}
	}

	uniqueNums.sort(compareFunction);
	uniqueNums.reverse();

	let highestLength = 0;

	for(let i = 0; i < 4; i++)
	{
		for(let x = 0; x < 4;x++)
		{
			if(grid[i][x] == uniqueNums[0])
			{
				let snakeLength = CalculateSnakeLength(grid, uniqueNums, i, x);

				if(snakeLength > highestLength)
				{
					highestLength = snakeLength;
				}
			}
		}
	}

	return highestLength;
}

function CalculateSnakeLength(grid, uniqueNums, startingY, startingX)
{
	let direction = 0;
	let continueLooking = true;

	let currentRow = startingY;
	let currentCol = startingX;

	let uniqueIndex = 1;

	let length = 0;

	//				   2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096+
	let snakeValues = [1, 1, 1,  1,  4,  4,   8,  16,  24,   32,   48, 	  48];

	while(continueLooking)
	{
		let highestNum = 0;
		if(direction == 0)
		{
			if(currentRow != 0 && grid[currentRow - 1][currentCol] <= grid[currentRow][currentCol] && grid[currentRow - 1][currentCol] > highestNum)
			{
				direction = 1;
				highestNum = grid[currentRow - 1][currentCol];
			}
			if(currentRow != 3 && grid[currentRow + 1][currentCol] <= grid[currentRow][currentCol] && grid[currentRow + 1][currentCol] > highestNum)
			{
				direction = 2;
				highestNum = grid[currentRow + 1][currentCol];
			}
			if(currentCol != 0 && grid[currentRow][currentCol - 1] <= grid[currentRow][currentCol] && grid[currentRow][currentCol - 1] > highestNum)
			{
				direction = 3;
				highestNum = grid[currentRow][currentCol - 1];
			}
			if(currentCol != 3 && grid[currentRow][currentCol + 1] <= grid[currentRow][currentCol] && grid[currentRow][currentCol + 1] > highestNum)
			{
				direction = 4;
				highestNum = grid[currentRow][currentCol + 1];
			}
		}

		if(direction == 0) return length;
		let needsToCombine = false;
		if(direction == 1)
		{
			for(let i = currentRow; i > 0; i--)
			{
				if(grid[i - 1][currentCol] < grid[i][currentCol] && grid[i - 1][currentCol] != 0)
				{
					let power = get2Power(grid[i - 1][currentCol]);
					if(power > 11) power = 11;
					length+=snakeValues[power];
				}
				else if(grid[i - 1][currentCol] == grid[i][currentCol])
				{
					length+=1;
					needsToCombine = true;
				}
				else return length;
			}

			if(needsToCombine) return length;

			currentRow = 0;
			
			let highestVal = 0;
			let colIndex = -1;
			if(currentCol != 0 && grid[currentRow][currentCol - 1] <= grid[currentRow][currentCol] && grid[currentRow][currentCol - 1] > highestVal)
			{
				highestVal = grid[currentRow][currentCol - 1];
				colIndex = currentCol - 1;
			}
			if(currentCol != 3 && grid[currentRow][currentCol + 1] <= grid[currentRow][currentCol] && grid[currentRow][currentCol + 1] > highestVal)
			{
				highestVal = grid[currentRow][currentCol + 1];
				colIndex = currentCol + 1;
			}

			if(colIndex != -1)
			{
				if(grid[currentRow][currentCol] == grid[currentRow][colIndex]) return length + 1;

				direction = 2;
				currentCol = colIndex;
				let power = get2Power(grid[currentRow][currentCol]);
				if(power > 11) power = 11;
				length+=snakeValues[power];
			}
			else return length;
		}

		if(direction == 2)
		{
			for(let i = currentRow; i < 3; i++)
			{
				if(grid[i + 1][currentCol] < grid[i][currentCol] && grid[i + 1][currentCol] != 0)
				{
					let power = get2Power(grid[i + 1][currentCol]);
					if(power > 11) power = 11;
					length+=snakeValues[power];
				}
				else if(grid[i + 1][currentCol] == grid[i][currentCol])
				{
					length+=1;
					needsToCombine = true;
				}
				else return length;
			}

			if(needsToCombine) return length;

			currentRow = 3;
			
			let highestVal = 0;
			let colIndex = -1;
			if(currentCol != 0 && grid[currentRow][currentCol - 1] <= grid[currentRow][currentCol] && grid[currentRow][currentCol - 1] > highestVal)
			{
				highestVal = grid[currentRow][currentCol - 1];
				colIndex = currentCol - 1;
			}
			if(currentCol != 3 && grid[currentRow][currentCol + 1] <= grid[currentRow][currentCol] && grid[currentRow][currentCol + 1] > highestVal)
			{
				highestVal = grid[currentRow][currentCol + 1];
				colIndex = currentCol + 1;
			}

			if(colIndex != -1)
			{
				if(grid[currentRow][currentCol] == grid[currentRow][colIndex]) return length + 1;

				direction = 1;
				currentCol = colIndex;
				let power = get2Power(grid[currentRow][currentCol]);
				if(power > 11) power = 11;
				length+=snakeValues[power];
			}
			else return length;
		}

		if(direction == 3)
		{
			for(let i = currentCol; i > 0; i--)
			{
				if(grid[currentRow][i - 1] < grid[currentRow][i] && grid[currentRow][i - 1] != 0)
				{
					let power = get2Power(grid[currentRow][i - 1]);
					if(power > 11) power = 11;
					length+=snakeValues[power];
				}
				else if(grid[currentRow][i - 1] == grid[currentRow][i])
				{
					length+=1;
					needsToCombine = true;
				}
				else return length;
			}

			if(needsToCombine) return length;

			currentCol = 0;
			
			let highestVal = 0;
			let rowIndex = -1;
			if(currentRow != 0 && grid[currentRow - 1][currentCol] <= grid[currentRow][currentCol] && grid[currentRow - 1][currentCol] > highestVal)
			{
				highestVal = grid[currentRow - 1][currentCol];
				rowIndex = currentRow - 1;
			}
			if(currentRow != 3 && grid[currentRow + 1][currentCol] <= grid[currentRow][currentCol] && grid[currentRow + 1][currentCol] > highestVal)
			{
				highestVal = grid[currentRow + 1][currentCol];
				rowIndex = currentRow + 1;
			}

			if(rowIndex != -1)
			{
				if(grid[currentRow][currentCol] == grid[rowIndex][currentCol]) return length + 1;

				direction = 4;
				currentRow = rowIndex;
				let power = get2Power(grid[currentRow][currentCol]);
				if(power > 11) power = 11;
				length+=snakeValues[power];
			}
			else return length;
		}

		if(direction == 4)
		{
			for(let i = currentCol; i < 3; i++)
			{
				if(grid[currentRow][i + 1] < grid[currentRow][i] && grid[currentRow][i + 1] != 0)
				{
					let power = get2Power(grid[currentRow][i + 1]);
					if(power > 11) power = 11;
					length+=snakeValues[power];
				}
				else if(grid[currentRow][i + 1] == grid[currentRow][i])
				{
					length+=1;
					needsToCombine = true;
				}
				else return length;
			}

			if(needsToCombine) return length;

			currentCol = 3;
			
			let highestVal = 0;
			let rowIndex = -1;
			if(currentRow != 0 && grid[currentRow - 1][currentCol] <= grid[currentRow][currentCol] && grid[currentRow - 1][currentCol] > highestVal)
			{
				highestVal = grid[currentRow - 1][currentCol];
				rowIndex = currentRow - 1;
			}
			if(currentRow != 3 && grid[currentRow + 1][currentCol] <= grid[currentRow][currentCol] && grid[currentRow + 1][currentCol] > highestVal)
			{
				highestVal = grid[currentRow + 1][currentCol];
				rowIndex = currentRow + 1;
			}

			if(rowIndex != -1)
			{
				if(grid[currentRow][currentCol] == grid[rowIndex][currentCol]) return length + 1;

				direction = 3;
				currentRow = rowIndex;
				let power = get2Power(grid[currentRow][currentCol]);
				if(power > 11) power = 11;
				length+=snakeValues[power];
			}
			else return length;
		}
	}
}

function get2Power(num)
{
	return Math.log(num)/Math.log(2) - 1;
}

function getIndex(list, val)
{
	for(let i = 0; i < list;i++)
	{
		if(list[i] == val) return i;
	}
	return -1;
}

function compareFunction(a, b)
{
	if(a < b) return -1;
	else if(a > b) return 1;
	return 0;
}

class BestFutureMove {
	constructor(direction, score) {
		this.direction = direction;
		this.score = score;
	}
}

function AverageOutBestMove(grid, futures, averageCount)
{
	let totals = [0, 0, 0, 0];
	let counts = [0, 0, 0, 0];
	let gameOver = true;
	for(let i = 0; i < averageCount; i++)
	{
		score = GetBestMove(grid, futures, futures);

		totals[score.direction] += score.score;
		counts[score.direction] += 1;
		if(score.direction >= 0 && score.direction < 4) gameOver = false;
	}

	if(gameOver) return -1;

	console.log("Totals: " + totals);
	console.log("Counts: " + counts);

	let highestIndex = -1;
	let highest = -1;
	for(let i = 0; i < 4; i++)
	{
		if(highest < counts[i])
		{
			highest = counts[i];
			highestIndex = i;
		}
		else if(highest == counts[i] && highestIndex != -1 && totals[highestIndex] < totals[i])
		{
			highest = counts[i];
			highestIndex = i;
		}
	}

	return highestIndex + 1;
}

function GetBestMove(grid, futures, maxFutures)
{
	if(futures == 0) return new BestFutureMove(-1, calculateGridScore(grid) / maxFutures);

	let thisScore = calculateGridScore(grid) * (futures + 1.0) / maxFutures;
	if(futures == maxFutures) thisScore = 0;

	let scores = [0, 0, 0, 0];
	let grids = [copyGrid(grid), copyGrid(grid), copyGrid(grid), copyGrid(grid)];

	//moves each grid in its respective direction
	for(let i = 0; i < 4; i++)
	{
		let moved = MoveGrid(grids[i], i + 1);
		if(moved.didMove) 
		{
			scores[i] = GetBestMove(grids[i], futures - 1, maxFutures);
			scores[i].score += thisScore * earlyMoveModifier * (futures + 1.0) / maxFutures+ (moved.scoreGained * (futures + 1.0) / maxFutures * highestModifier);
		}
		else scores[i] = new BestFutureMove(-1, -1)
	}

	let highest = -1;
	let highestIndex = -1;
	for(let i = 0; i < 4; i++) {
		if(scores[i].score > highest)
		{
			highest = scores[i].score;
			highestIndex = i;
		}
		//console.log((i + 1) + ": " + scores[i].score)
	}

	//console.log("Highest Index: " + (highestIndex + 1) + " Highest: " + highest);

	return new BestFutureMove(highestIndex, highest);
}