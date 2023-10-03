let mainGame = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];

function SetUpGame() {
	mainGame = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];

	for(let i = 0; i < 4;i++)
	{
		for(let x = 0; x < 4;x++)
		{
			mainGame[i][x] = 0;
		}
	}

	GenerateRandomSquare(mainGame);
	GenerateRandomSquare(mainGame);
}

/*
First, chooses a random square, and ensures its empty
then randomly chooses a 4 or 2 to generate, with a 4 having a 10% chance of occuring, and fills it in.
*/
function GenerateRandomSquare(grid) {
	let alreadyFilled = true;
	while(alreadyFilled == true)
	{
		let rowIndex = RandomNum(4);
		let columnIndex = RandomNum(4);

		if(grid[rowIndex][columnIndex] != 0) continue;

		alreadyFilled = false;

		let twoChance = RandomNum(10);
		
		if(twoChance == 0) grid[rowIndex][columnIndex] = 4;
		else grid[rowIndex][columnIndex] = 2;
	}
}

// generates a random num from 0 to (range - 1)
function RandomNum(range) {
	return Math.floor(Math.random() * range);
}

class MovementReturn {
	constructor(didMove, scoreGained) {
		this.didMove = didMove;
		this.scoreGained = scoreGained;
	}
}

//DIRECTIONS: 1 = UP, 2 = DOWN, 3 = LEFT, 4 = RIGHT
function MoveGrid(grid, direction) {
	let scoreGained = 0;
	let movedSquare = false;
	if (direction == 1) 
	{
		for (let i = 0 ;i < 4;i++) 
		{
			let combinedVal = -1;
			for (let x = 1; x < 4; x++)
			{
				for (let y = x; y > 0; y--)
				{
					if(grid[y][i] == 0 || !(grid[y - 1][i] == 0 || grid[y - 1][i] == grid[y][i]) || y - 1 == combinedVal) break;

					movedSquare = true;
					
					if(grid[y - 1][i] == grid[y][i]) {
						grid[y - 1][i] = grid[y - 1][i] * 2;
						grid[y][i] = 0;
						combinedVal = y - 1;
						scoreGained += grid[y - 1][i];
						break;
					}
					else {
						let temp = grid[y][i] + 0;
						grid[y][i] = grid[y - 1][i] + 0;
						grid[y - 1][i] = temp;
					}
				}
			}
		}
	}
	else if (direction == 2) 
	{
		for (let i = 0;i < 4;i++) 
		{
			let combinedVal = -1;
			for (let x = 2; x >= 0; x--)
			{
				for (let y = x; y < 3; y++)
				{
					if(grid[y][i] == 0 || !(grid[y + 1][i] == 0 || grid[y + 1][i] == grid[y][i]) || y + 1 == combinedVal) break;

					movedSquare = true;
					
					if(grid[y + 1][i] == grid[y][i]) {
						grid[y + 1][i] = grid[y + 1][i] * 2;
						grid[y][i] = 0;
						combinedVal = y + 1;
						scoreGained += grid[y + 1][i];
						break;
					}
					else {
						let temp = grid[y][i] + 0;
						grid[y][i] = grid[y + 1][i] + 0;
						grid[y + 1][i] = temp;
					}
				}
			}
		}
	}
	else if(direction == 3)
	{
		for (let i = 0 ;i < 4;i++) 
		{
			let combinedVal = -1;
			for (let y = 1; y < 4; y++)
			{
				for (let x = y; x > 0; x--)
				{
					if(grid[i][x] == 0 || !(grid[i][x - 1] == 0 || grid[i][x - 1] == grid[i][x]) || x - 1 == combinedVal) break;

					movedSquare = true;
					
					if(grid[i][x - 1] == grid[i][x]) {
						grid[i][x - 1] = grid[i][x - 1] * 2;
						grid[i][x] = 0;
						combinedVal = x - 1;
						scoreGained += grid[i][x - 1];
						break;
					}
					else {
						let temp = grid[i][x] + 0;
						grid[i][x] = grid[i][x - 1] + 0;
						grid[i][x - 1] = temp;
					}
				}
			}
		}
	}
	else if(direction == 4)
	{
		for (let i = 0 ;i < 4;i++) 
		{
			let combinedVal = -1;
			for (let y = 2; y >= 0; y--)
			{
				for (let x = y; x < 3; x++)
				{
					if(grid[i][x] == 0 || !(grid[i][x + 1] == 0 || grid[i][x + 1] == grid[i][x]) || x + 1 == combinedVal) break;

					movedSquare = true;
					
					if(grid[i][x + 1] == grid[i][x]) {
						grid[i][x + 1] = grid[i][x + 1] * 2;
						grid[i][x] = 0;
						combinedVal = x + 1;
						scoreGained += grid[i][x + 1];
						break;
					}
					else {
						let temp = grid[i][x] + 0;
						grid[i][x] = grid[i][x + 1] + 0;
						grid[i][x + 1] = temp;
					}
				}
			}
		}
	}

	if(movedSquare) GenerateRandomSquare(grid);

	return new MovementReturn(movedSquare, scoreGained);
}