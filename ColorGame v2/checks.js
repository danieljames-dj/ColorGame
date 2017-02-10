function checkCell(a, b, from, to, pts) {
	boxes[a][b] = to;
	pts += 10;
	if (a+1 < maxRows && boxes[a+1][b] == from) pts = checkCell(a+1,b,from,to,pts);
	if (a-1 >= 0 && boxes[a-1][b] == from) pts = checkCell(a-1,b,from,to,pts);
	if (b+1 < maxColumns && boxes[a][b+1] == from) pts = checkCell(a,b+1,from,to,pts);
	if (b-1 >= 0 && boxes[a][b-1] == from) pts = checkCell(a,b-1,from,to,pts);
	return pts;
}

function stuck() {
	for (var i = 0; i < maxRows; i++) {
		for (var j = 0; j < maxColumns; j++) {
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

function gameOver() {
	for (var i = 1; i <= maxColors; i++) {
		if (map[i] >= 3) return 0;
	}
	return 1;
}

function endGame() {
	for (var i = 0; i < maxRows; i++) {
		for (var j = 0; j < maxColumns; j++) {
			if (boxes[i][j] == 0) score+=100;
			else boxes[i][j] = 0;
		}
	}
	syncColorScore();
}