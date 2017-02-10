/* GLOBAL VARIABLES
	table -> table in HTML
	maxRows & maxCols -> maximum number of rows & columns in the table
	boxes -> to store the value of content of the table (2D array)
	score -> Total score by the player
	diff -> Number of boxes colored initially (difficulty level)
	numColors -> Number of colors available
	shuffleCount -> Number of shuffles (limit 3)
	map -> Track number of each colors used
*/
var table, maxRows = 10, maxCols = 10, boxes, score = 0, diff = 70, numColors = 3, shuffleCount = 3, map;
var colors = ["#555555","#ff0000","#00ff00","#0000ff"];

// 1. Initialize array boxes and store 0 to all elements & colors to 0
initBoxArray();

// 2. Apply random values to required number of boxes
applyRandVals();

// 3. Apply gravity to all columns
applyGravity();

// 4. Print Table
printTable();

// 5. Paint Color and print score to the screen
syncColorScore();

//6. Implement shuffle function

//7. Implement clickables

//Methods Used:

function initBoxArray() {
	boxes = new Array();
	for (var i = 0; i < maxRows; i++) {
		boxes[i] = new Array();
		for (var j = 0; j < maxCols; j++)
			boxes[i][j] = 0;
	}
	map = new Array();
	for (var i = 1; i <= numColors; i++)
		map[i] = 0;
}

function applyRandVals() {
	var count = 0;
	while (count < diff) {
		var randNum = Math.floor(Math.random()*maxRows*maxCols);
		var a = Math.floor(randNum/maxCols), b = randNum%maxCols;
		if (boxes[a][b] == 0) {
			boxes[a][b] = Math.floor(Math.random()*numColors)+1;
			map[boxes[a][b]]++;
			count++;
		}
	}
}

function applyGravity() {
	for (var i = 0; i < maxCols; i++) {
		var c = maxRows-1;
		for (var j = maxRows-1; j >= 0; j--) {
			if (boxes[j][i]!=0) {
				boxes[c][i] = boxes[j][i];
				c--;
			}
		}
		while (c >= 0) {
			boxes[c][i] = 0;
			c--;
		}
	}
}

function printTable() {
	var tableDiv = document.getElementById("workspace");
	table = document.createElement("table");
	table.id = "tableMain"
	table.border = '1';
	var tBody = document.createElement('tbody');
	table.appendChild(tBody);
	for (var i = 0; i < maxRows; i++) {
		var tr = document.createElement('tr');
		tBody.appendChild(tr);
		for (var j = 0; j < maxCols; j++) {
			var td = document.createElement('td');
			td.height = '40';
			td.width = '40';
			td.addEventListener("click",clicked);
			td.appendChild(document.createTextNode(' '));
			tr.appendChild(td);
		}
	}
	tableDiv.appendChild(table);
}

function syncColorScore() {
	var div = document.getElementById('score');
	div.innerHTML = "Score = " + score;
	for (var i = 0; i < maxRows; i++)
		for(var j = 0; j < maxCols; j++)
			table.rows[i].cells[j].style.backgroundColor = colors[boxes[i][j]];
}

function shuffleBox() {
	for (var i = 0; i < maxRows; i++)
		for (var j = 0; j < maxCols; j++)
			boxes[i][j] = 0;
	for (var i = 1; i <= numColors; i++) {
		j = map[i];
		while (j > 0) {
			var randNum = Math.floor(Math.random()*maxRows*maxCols);
			var a = Math.floor(randNum/maxCols), b = randNum%maxCols;
			if (boxes[a][b] == 0) {
				boxes[a][b] = i;
				j--;
			}
		}
	}
	applyGravity();
	syncColorScore();
}

function endGame() {
	for (var i = 0; i < maxRows; i++) {
		for (var j = 0; j < maxCols; j++) {
			if (boxes[i][j] == 0) score+=100;
			else boxes[i][j] = 0;
		}
	}
	syncColorScore();
}

function checkCell(a, b, from, to, pts) {
	boxes[a][b] = to;
	pts += 10;
	if (a+1 < maxRows && boxes[a+1][b] == from) pts = checkCell(a+1,b,from,to,pts);
	if (a-1 >= 0 && boxes[a-1][b] == from) pts = checkCell(a-1,b,from,to,pts);
	if (b+1 < maxCols && boxes[a][b+1] == from) pts = checkCell(a,b+1,from,to,pts);
	if (b-1 >= 0 && boxes[a][b-1] == from) pts = checkCell(a,b-1,from,to,pts);
	return pts;
}

function gameOver() {
	for (var i = 1; i <= numColors; i++) {
		if (map[i] >= 3) return 0;
	}
	return 1;
}

function stuck() {
	for (var i = 0; i < maxRows; i++) {
		for (var j = 0; j < maxCols; j++) {
			if (boxes[i][j] != 0) {
				var initFrom = boxes[i][j], pts;
				pts = checkCell(i,j,initFrom,-1,0);
				checkCell(i,j,-1,initFrom,0);
				if (pts >= 30) return 0;
			}
		}
	}
	return 1;
}

function clicked() {
	var a = this.parentNode.rowIndex, b = this.cellIndex, c, initFrom = boxes[a][b], pts;
	pts = checkCell(a,b,initFrom,-1,0);
	if (pts < 30) {
		checkCell(a,b,-1,initFrom,0);
	} else {
		score += pts;
		map[initFrom] -= pts/10;
		checkCell(a,b,-1,0,0);
		applyGravity();
		syncColorScore();
		if (stuck()) {
			if (gameOver() == 0 && shuffleCount > 0) {
				shuffleCount--;
				do {
					shuffleBox();
				} while (stuck());
				alert("You're stuck!!\nBoxes shuffled.\nShuffles Left : " + shuffleCount);
			} else {
				endGame();
				alert("Game Over.\nYour score: " + score);
			}
		}
	}
}