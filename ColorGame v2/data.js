// 1. Initialize 2D-array boxes and store 0 to all elements
(function initBoxArray() {
	boxes = new Array();
	for (var i = 0; i < maxRows; i++) {
		boxes[i] = new Array();
		for (var j = 0; j < maxColumns; j++)
			boxes[i][j] = 0;
	}
})();

// 2. Select random values to color frequencies
(function randFreqColors() {
	map = new Array();
	for (var i = 1; i <= maxColors; i++)
		map[i] = 0;
	var diff = difficultyPercentage*maxRows*maxColumns/100;
	while (diff-- != 0)
		map[Math.floor(Math.random()*maxColors)+1]++;
})();

// 3. Shuffle
shuffleBox();

//Methods Used:

function shuffleBox() {
	for (var i = 0; i < maxRows; i++)
		for (var j = 0; j < maxColumns; j++)
			boxes[i][j] = 0;
	for (var i = 1; i <= maxColors; i++) {
		j = map[i];
		while (j > 0) {
			var randNum = Math.floor(Math.random()*maxRows*maxColumns);
			var a = Math.floor(randNum/maxColumns), b = randNum%maxColumns;
			if (boxes[a][b] == 0) {
				boxes[a][b] = i;
				j--;
			}
		}
	}
	applyGravity();
	syncColorScore();
}

function applyGravity() {
	//Vertical Gravity
	for (var i = 0; i < maxColumns; i++) {
		var c = maxRows-1;
		for (var j = maxRows-1; j >= 0; j--) {
			if (boxes[j][i] != 0) {
				boxes[c][i] = boxes[j][i];
				c--;
			}
		}
		while (c >= 0) {
			boxes[c][i] = 0;
			c--;
		}
	}
	//Horizontal Gravity
	var j = 0;
	for (var i = 0; i < maxColumns; i++) {
		if (boxes[maxRows-1][i] != 0) {
			if (i != j)
				for (var k = 0; k < maxRows; k++)
					boxes[k][j] = boxes[k][i];
			j++;
		}
	}
	while (j != maxColumns) {
		for (var i = 0; i < maxRows; i++)
			boxes[i][j] = 0;
		j++;
	}
}