function GameBoard(){
    const size = 9;
    let gameBoard = [];

    for(let i = 0; i < size; i++){
        gameBoard.push(Cell());
    }

    function restart(){
        for(let i = 0; i < size; i++){
            gameBoard[i] = Cell();
        }
    }


    const getBoard = () => gameBoard;

    const  dropToken = (cellNum, player) => {
        if(gameBoard[cellNum-1].getValue() != 0){
            return ;
        }
        gameBoard[cellNum-1].addToken(player);
    }

    // const WinningPaths = [[0,1,2],[3,4,5],[6,7,8],
    //                     [0,3,6],[1,4,7],[2,5,8],
    //                     [0,4,8],[2,4,6]];

    return {getBoard, dropToken, restart};
}


function Cell(){
    let value = 0;
    function addToken(player){
        value = player;
    }
    function getValue(){
        return value;
    }
    return {getValue,addToken};
}


function gameController(PlayerOne, PlayerTwo){
    const board = GameBoard();
    const reset = () => {
        board.restart();
        activePlayer = player[0];
    }

    let player = [
        {
            name: PlayerOne, 
            token: 1
        },
        {
            name: PlayerTwo, 
            token: 2
        }
    ];


    let activePlayer = player[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayers = ()=>{
        activePlayer = activePlayer == player[0]? player[1]: player[0];
    }

    const playRound = (cellNum) => {
        board.dropToken(cellNum, getActivePlayer().token); 
        switchPlayers();
    }

    const GameINFO = () => {
        return `${getActivePlayer().name}'s turn`;
    }

    // i know that funcion is so fucking weird and unreadable
    // i'm just try it maybe someday i will reconstruct it 

    const anyBodyWins = () =>{
        const TheWinner = getActivePlayer() == player[0]? player[1]:player[0];
        //check all the rows
        for(let i=0; i<9; i+=3){
            if(board.getBoard()[i].getValue() == board.getBoard()[i+1].getValue() && board.getBoard()[i+1].getValue() == board.getBoard()[i+2].getValue()  && board.getBoard()[i+1].getValue() != 0){
                return [true, `${TheWinner.name}  is the Winner`];
            }
        } // checks all the columns
        for(let i=0; i<3; i++){
            if(board.getBoard()[i].getValue() == board.getBoard()[i+3].getValue() && board.getBoard()[i+3].getValue() ==  board.getBoard()[i+6].getValue() && board.getBoard()[i+3].getValue() != 0){
                return [true, `${TheWinner.name}  is the Winner`];
            }
        }
        // diagonal by diagonal
        if(board.getBoard()[0].getValue() == board.getBoard()[4].getValue() && board.getBoard()[4].getValue() == board.getBoard()[8].getValue() && board.getBoard()[4].getValue() != 0){
            return [true, `${TheWinner.name}  is the Winner`];
        }
        if(board.getBoard()[2].getValue() == board.getBoard()[4].getValue()  && board.getBoard()[4].getValue() == board.getBoard()[6].getValue() && board.getBoard()[4].getValue() != 0){
            return [true, `${TheWinner.name}  is the Winner`];
        }
        //check if there is any draw
        for(let i = 0; i < board.getBoard().length; i++){
            if(board.getBoard()[i].getValue() == 0){
                return [false,"فمّا حاجة"];
            }
        }
        return [true, `it's a draw`];
    }

    return {playRound,getActivePlayer,anyBodyWins,GameINFO,reset};

}

function ScreenController(){
     
    const TheClickedCell = document.querySelectorAll('[data-btn]');
    const gameINFO = document.querySelector('.game-info');
    const TheBoard = document.querySelector('.board');
    // const TheGameBoard = document.querySelector('.game-board');
    const player1Name = document.querySelector('.player1-name');
    const player2Name = document.querySelector('.player2-name');

    const PlayerOneName = player1Name.value;
    const PlayerTwoName = player2Name.value;

    if(PlayerOneName == "" || PlayerTwoName == "" || PlayerOneName == PlayerTwoName){
        TheGameBoardDiv.classList.remove('active');
        return;
    }

    const game = new gameController();
    gameINFO.textContent = game.GameINFO(PlayerOneName,PlayerTwoName);

    TheClickedCell.forEach(CellClick => {
        CellClick.addEventListener('click',()=>{
            const CellNum = CellClick.dataset.btn;

            if(CellClick.textContent == ""){
                game.playRound(CellNum);
                CellClick.textContent = game.getActivePlayer().token == 1 ? "O" : "X";
                gameINFO.textContent = game.GameINFO();
            }

            if(game.anyBodyWins()[0]){
                displayTheWinner(game.anyBodyWins()[1]);
            }
            
        });
        
    });

    function displayTheWinner(theWinner){

        gameINFO.innerHTML = theWinner;
        gameINFO.classList.add('active');
        TheBoard.classList.add('disapper');

        const restartBtn = document.createElement('button');
        restartBtn.setAttribute('id', 'restart-btn');
        restartBtn.innerHTML = 'restart';

        TheGameBoardDiv.appendChild(restartBtn);

        restartBtn.addEventListener('click', ()=>{
            TheGameBoardDiv.classList.remove('active');
            gameINFO.classList.remove('active');
            TheBoard.classList.remove('disapper');
            restartBtn.remove();
            ClearButtonsValues();
            location.reload();

        });
    }

    function ClearButtonsValues(){
        game.reset();
        TheClickedCell.forEach(Clicked => {
            Clicked.innerHTML = "";
        });
    }
}

const startButton = document.querySelector('.btn-start');
const TheGameBoardDiv = document.querySelector('.game-board');

startButton.addEventListener('click',()=>{
    TheGameBoardDiv.classList.add('active');
    new ScreenController();
});