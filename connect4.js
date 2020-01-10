/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	//  set "board" to empty HEIGHT x WIDTH matrix array
	for (let h = 0; h < HEIGHT; h++) {
		let inner = [];
		for (let w = 0; w < WIDTH; w++) {
			inner.push(null);
		}
		board.push(inner);
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// get "htmlBoard" variable from the item in HTML w/ID of "board"
	const htmlBoard = document.querySelector("#board");
	// This portion creates the top row and adds click functionality
	let top = document.createElement("tr");
	top.setAttribute("id", "column-top");
	top.addEventListener("click", handleClick);

	for (let x = 0; x < WIDTH; x++) {
		let headCell = document.createElement("td");
		headCell.setAttribute("id", x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	//This portion adds rows and columns below the top row for the grid
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement("tr");
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement("td");
			cell.setAttribute("id", `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	let y = HEIGHT - 1;

	for (let y = board.length - 1; y >= 0; y--) {
		if (board[y][x] === null) {
			return y;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	let div = document.createElement("div");
	div.classList.add("piece");
	div.classList.add(`p${currPlayer}`);

	let square = document.getElementById(`${y}-${x}`);
	square.append(div);
}

/** endGame: announce game end */

function endGame(msg) {
	alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	//Update in-memory board
	console.log("COORDINATES: ", y, x);
	board[y][x] = currPlayer;

	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		setTimeout(function() {
			return endGame(`Player ${currPlayer} won!`);
		}, 0);
	}

	// check for tie
	if (board.flat().every((slot) => slot !== null)) {
		endGame("gameOver!!!");
	}
	// switch players
	currPlayer = currPlayer === 1 ? 2 : 1;


}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	// checks across the entire board to detremine if the current player formed 4 consecutive pieces. If so, current player is the winner.

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
