
var mainGame = {
	winner: '',
	XGoes: true,
	firstTurn: true,
	innerGames: [],
	prevMove: 	{},
	canMove: false

};

window.onload = setup;

function setup() {
	var gameContainer = document.getElementsByClassName("gameContainer")[0];
	mainGame.gameStatus = initializeBoardState();
	let count = 0;
	mainGame.outerGames = new Array();
	//board[i] = new Array();
	for(let i=0;i<3;i++){
		var mainGameRow = document.createElement("div");
		mainGameRow.classList.add("row");
		mainGame.outerGames[i] = new Array();
		for(j=0;j<3;j++){
			var mainGameCell = document.createElement("div");
			mainGameCell.classList.add("cell");
			mainGameCell = setCellCSSRow(mainGameCell, i);
			mainGameCell = setCellCSSCol(mainGameCell, j);
			mainGameCell.classList.add("mainGame");
			mainGame.outerGames[i][j]= mainGameCell;
			var insideGame = createSmallGame(count, i, j);
			//Set for regular count
			mainGame.innerGames.push(insideGame);
			mainGameCell.appendChild(insideGame);
			mainGameRow.appendChild(mainGameCell);
			count++;
		}
		gameContainer.append(mainGameRow);
	}
}

function testFunction(){
	//console.log(mainGame.gameStatus[2][2][2][2]);
	//console.log(mainGame.innerGames[8]);
	console.log(mainGame.outerGames);
}

function initializeBoardState(){
	var board = new Array();
	for(let i = 0;i<3;i++){
		board[i] = new Array();
		for(let j=0;j<3;j++){
			board[i][j] = new Array();
			for(let k=0;k<3;k++){
				board[i][j][k] = new Array();
				for(let l = 0;l<3;l++){
					board[i][[j]][k][l] = '';
				}
			}
		}
	}
	return board; 
}

function createSmallGame(count, boardRow, boardCol){
	var currSmallGame = document.createElement("div");
	currSmallGame.setAttribute("class", "smallGame");
	currSmallGame.setAttribute("id", count);

	var transparentContainer = document.createElement("div");
	transparentContainer.setAttribute("class", "transparent");

	for(let i=0;i<3;i++){//Row
		var thisRow = document.createElement("div");
		thisRow.classList.add("row");
		for(let j=0;j<3;j++){//Column
			var thisCell = document.createElement("div");
			thisCell.classList.add("cell");
			thisCell.classList.add("smallGame");


			thisCell= setCellCSSRow(thisCell, i);
			thisCell= setCellCSSCol(thisCell, j);

			thisCell.addEventListener('click',
				function(){playerMove(boardRow, boardCol, i, j)});

			let textWrapper = document.createElement("div");
			textWrapper.classList.add("blank");

			var firstText = document.createTextNode("N");
			textWrapper.appendChild(firstText);
			thisCell.appendChild(textWrapper);

			thisRow.appendChild(thisCell); 

			//Sets Status to main cell
			mainGame.gameStatus[boardRow][boardCol][i][j] = thisCell; 
		}

		transparentContainer.appendChild(thisRow);
		currSmallGame.appendChild(transparentContainer);
	}
	return currSmallGame;
}


function setCellCSSRow(thisCell, row){
	if(row==0){
		thisCell.classList.add("top");
	}
	else if(row==1){
		thisCell.classList.add("mid");
	}
	else{
		thisCell.classList.add("bottom");
	}

	return thisCell;
}

function setCellCSSCol(thisCell, col){
	if(col==0){
		thisCell.classList.add("left");
	}
	else if(col==1){
		thisCell.classList.add("center");
	}
	else{
		thisCell.classList.add("right");
	}

	return thisCell;
}

//MAIN GAME
//Buttons
function playerChoice(letter){
	var allPlayerButtons = document.getElementsByClassName("playerChoice");
	//alert("Player chose "+letter);

	// if(letter!=="X"){
	// 	mainGame.XGoes= false;
	// }
	
	for(let i=0;i<allPlayerButtons.length;i++){
		allPlayerButtons[i].disabled = true;
	}

	let gameMsg = document.getElementById("inGameAnnouncement");
	let newText = document.createElement("h3");
	newText.style.setProperty("color", "red");
	newText.innerHTML = "X's turn."; 
	gameMsg.appendChild(newText);
	console.log(gameMsg);
	mainGame.canMove=true;
}


function playerMove(mainRow, mainCol, smallRow, smallCol){
	//Sets false so no other clicking
	// can happen until after move function done
	if(mainGame.canMove){
		let gameMsg = document.getElementById("inGameAnnouncement").children[0];
		let currCell = mainGame.gameStatus[mainRow][mainCol][smallRow][smallCol];
		let thisText = currCell.childNodes[0];

		var thisPos = {
			boardRow: mainRow,
			boardCol: mainCol,
			innerRow: smallRow,
			innerCol: smallCol, 
		}
		mainGame.canMove=false;
		if(!mainGame.firstTurn){
			//console.log("not the first turn");
			if(thisText.innerHTML!=='N'){
				mainGame.canMove=true;
				return;
			}
			//Valid move check
			else if (!validMove(thisPos)){
				//alert("Your move was invalid");
				gameMsg.innerHTML = "Invalid move in the wrong local board";
				gameMsg.style.color="black";
				mainGame.canMove=true;
				return; 
			}
			else{
				let test = currCell.parentElement.parentElement.parentElement;
				test.classList.remove("blink_me");
			}

		}
		mainGame.prevMove = thisPos;
		//First TURN STUFF		
		mainGame.firstTurn=false;
		let playerLetter='';
		//Set the board 
		if(mainGame.XGoes){
			thisText.innerHTML = "X";
			thisText.classList.add("X");
			playerLetter='X';
			gameMsg.innerHTML = "O's turn.";
			gameMsg.style.color="blue";

		}
		else{
			thisText.innerHTML = "O";
			thisText.classList.add("O");
			playerLetter='O';
			gameMsg.innerHTML = "X's turn.";
			gameMsg.style.color="red";
		}

		//Toggle hidden area
		thisText.classList.toggle("blank");
		//Blink/focus on cell div
		let nextBoard = mainGame.gameStatus[thisPos.innerRow][thisPos.innerCol][0][0].parentElement.parentElement.parentElement;
		nextBoard.classList.toggle("blink_me");
		//console.log("CHECKING WINNER");
		let innerGame = mainGame.gameStatus[thisPos.boardRow][thisPos.boardCol];
		let parentDiv = innerGame[thisPos.innerRow][thisPos.innerCol].parentElement.parentElement.parentElement;
		if(checkWinner(true, parentDiv,innerGame, thisPos.innerRow, thisPos.innerCol, playerLetter)){
			//change board to correct color: 
			if(mainGame.XGoes){
				parentDiv.classList.add("XWinner");
				parentDiv.classList.add("completed");
				parentDiv.parentElement.classList.add("X");
			}
			if(!mainGame.XGoes){
				parentDiv.classList.add("OWinner");
				parentDiv.classList.add("completed");
				parentDiv.parentElement.classList.add("O");
			}

			console.log("inner game won check ");
			// console.log(outerGame);
			//	completednsole.log(mainGame.gameStatus[thisPos.boardRow][thisPos.boardCol]);

			if(checkWinner(false, parentDiv, mainGame.outerGames, thisPos.boardRow, thisPos.boardCol, playerLetter)){
				mainGame.canMove = false;
				nextBoard.classList.toggle("blink_me");
				endGame(gameMsg);
				return;
			}
		}
		//switch player - toggles between X and O
		mainGame.XGoes=!mainGame.XGoes; 
		mainGame.canMove=true;
		}
}

function endGame(container){
	container.innerHTML = mainGame.winner + " wins!";
	if(mainGame.winner === "X"){
		container.style.color="red";
	}
	else if(mainGame.winner==="O"){
		container.style.color = "blue";

	}
	console.log("END GAME");
	let end = document.getElementById("Ending");
	//let finalText = document.createElement("h3");
	//finalText.innerHTML = mainGame.winner+ " wins!"; 
	let restart = document.createElement("p");
	restart.innerHTML = "Restart the page to replay";
	//end.appendChild(finalText);
	end.appendChild(restart);
};

function validMove(currPos){
	if( 
		(
		mainGame.prevMove.boardRow===currPos.boardRow &&
		mainGame.prevMove.boardCol===currPos.boardCol &&
		mainGame.prevMove.innerRow===currPos.innerRow &&
		mainGame.prevMove.innerCol===currPos.innerCol) ||
		!(mainGame.prevMove.innerRow === currPos.boardRow &&
		mainGame.prevMove.innerCol === currPos.boardCol)
	){
		return false;
	}
	else{
		return true;
	}
}


function checkWinner(innerBoard, parent, game, row, col, currMoveLetter){
	console.log("EACH NEW MOMENT");
	if(innerBoard && parent.classList.contains("completed")){
		return false;
	}
	//Check horizontal
	let horizontalWin=true; 
	if(!innerBoard){
		console.log(" HORIZONTAL\n");
	}
	for(let i=0;i<3;i++){
		
		if(!innerBoard){
			console.log(game[i][col]);
			console.log(" horizontal contains ");
			console.log(game[i][col].classList.contains(currMoveLetter));
			console.log(!innerBoard && !game[i][col].classList.contains(currMoveLetter));
			if(!game[i][col].classList.contains(currMoveLetter)){
				horizontalWin=false;
			}
		}
		
		else{
			let checkCellLetter = game[i][col].childNodes[0].innerHTML;
			 if(checkCellLetter !== currMoveLetter){
				horizontalWin=false;
			}
		}
	}
	console.log("horizontal win: "+horizontalWin);
	if(horizontalWin){
		if(!innerBoard && mainGame.winner==''){
			console.log("main winner is");
			mainGame.winner=currMoveLetter;
		}
		return true;
	}
	//Check Vertical
	let verticalWin=true;
	if(!innerBoard){
		console.log("Vertical\n");
	}
	for(let i=0;i<3;i++){
		
		if(!innerBoard){
			console.log(game[row][i]);
			console.log(" vertical contains ");
			console.log(game[row][i].classList.contains(currMoveLetter));
			console.log(!innerBoard && !game[row][i].classList.contains(currMoveLetter));
			if(!game[row][i].classList.contains(currMoveLetter)){
				verticalWin=false;
			}
		}
		else{
			let checkCellLetter = game[row][i].childNodes[0].innerHTML;
			if(checkCellLetter!==currMoveLetter){
			//console.log("it's false");
				verticalWin=false;
			}
		}
	}
	console.log("vertical win: "+verticalWin);
	if(verticalWin){
		if(!innerBoard && mainGame.winner==''){
			console.log("main winner is");
			mainGame.winner=currMoveLetter;
		}
		return true;
	}
	//Check Diagonal
	let diagonalWin= true;
	if(!innerBoard){
		console.log(" diagonal\n");
	}
	//Diagonal
	for(let i=0;i<3;i++){
		if(!innerBoard){
			console.log(game[i][i]);
			console.log(" diagonal contains ");
			console.log(game[i][i].classList.contains(currMoveLetter));
			console.log(!innerBoard && !game[i][i].classList.contains(currMoveLetter));
			if(!game[i][i].classList.contains(currMoveLetter)){
				diagonalWin=false;
			}
		}
		else{
			let checkCellLetter = game[i][i].childNodes[0].innerHTML;
			if(checkCellLetter!==currMoveLetter){
				diagonalWin=false;
			}
		}
	}
	console.log("diagonal win: "+diagonalWin);
	if(diagonalWin){
		if(!innerBoard && mainGame.winner==''){
			console.log("main winner is");
			mainGame.winner=currMoveLetter;
		}
		return true;
	}
	//Anti Diagonal: (0,2)/(1,1)/(2,0)
	let antiDiagonalWin = true;
	if(!innerBoard){
		console.log(" antidiagonal\n");
	}
		for(let i=0;i<3;i++){
			
			if(!innerBoard){
				console.log(game[i][((3-1)-i)]);
				console.log(" antidiagonal contains ");
				console.log(game[i][((3-1)-i)].classList.contains(currMoveLetter));
				console.log(!innerBoard && !game[i][i].classList.contains(currMoveLetter));
				if(!game[i][i].classList.contains(currMoveLetter)){

					antiDiagonalWin=false;
				}
			}
			else{
				let checkCellLetter = game[i][((3-1)-i)].childNodes[0].innerHTML;
				if(checkCellLetter!==currMoveLetter){
					antiDiagonalWin=false;
				}
			}	
		}
	console.log("antidiagonal: "+ antiDiagonalWin);
	if(antiDiagonalWin){
		if(!innerBoard && mainGame.winner==''){
			console.log("main winner is");
			mainGame.winner=currMoveLetter;
		}
		return true;
	}
}



