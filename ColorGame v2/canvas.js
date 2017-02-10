var boxes, map; // boxes -> To represent 2D array, map -> To represent frequency of each colors
var maxRows = 10, maxColumns = 10, maxColors = 3, score = 0, difficultyPercentage = 70, shuffleCount = 3; // Initial Values

function syncColorScore() {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var colors = ["#555555","#ff0000","#00ff00","#0000ff"];
	document.getElementById('score').innerHTML = "Score = " + score;
	for (var i = 0; i < maxRows; i++)
		for(var j = 0; j < maxColumns; j++) {
			context.fillStyle = colors[boxes[i][j]];
			context.fillRect(10 + j * 50,10 + i *50,50,50);
			context.strokeStyle = "#000000";
			context.strokeRect(10 + j * 50,10 + i *50,50,50);
		}
	canvas.addEventListener('click', function(event) {
		var a = Math.floor((event.pageY - 10 - canvas.offsetTop)/50);
		var b = Math.floor((event.pageX - 10 - canvas.offsetLeft)/50);
		var c, initFrom = boxes[a][b], pts;
		pts = checkCell(a,b,initFrom,-1,0);
		if (pts < 30 || initFrom == 0) {
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
	});
}