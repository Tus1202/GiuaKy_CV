const board = document.getElementById("board");

const chessBoard = [
    ["r","n","b","q","k","b","n","r"],
    ["p","p","p","p","p","p","p","p"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["P","P","P","P","P","P","P","P"],
    ["R","N","B","Q","K","B","N","R"]
];

const pieces = {
    K: "images/pieces/whiteKing.png",
    Q: "images/pieces/whiteQueen.png",
    R: "images/pieces/whiteRook.png",
    B: "images/pieces/whiteBishop.png",
    N: "images/pieces/whiteKnight.webp",
    P: "images/pieces/whitePawn.png",

    k: "images/pieces/blackKing.png",
    q: "images/pieces/blackQueen.png",
    r: "images/pieces/blackRook.png",
    b: "images/pieces/blackBishop.png",
    n: "images/pieces/blackKnight.png",
    p: "images/pieces/blackPawn.png"
};

let selected = null;
let legalMoves = [];
let currentTurn = "white";

function renderBoard(){

    board.innerHTML = "";

    for(let row = 0; row < 8; row++){

        for(let col = 0; col < 8; col++){

            const square = document.createElement("div");

            square.classList.add("square");
            square.classList.add((row + col) % 2 === 0 ? "light" : "dark");

            square.dataset.row = row;
            square.dataset.col = col;

            square.addEventListener("click", selectPiece);

            // Ô đang được chọn
            if(
                selected &&
                selected.row === row &&
                selected.col === col
            ){
                square.classList.add("selected");
            }

            // Quân cờ
            const piece = chessBoard[row][col];

            if(piece !== ""){

                const img = document.createElement("img");

                img.src = pieces[piece];
                img.classList.add("piece");
                img.draggable = false;

                square.appendChild(img);

            }

            // Ô có thể đi
            const canMove = legalMoves.some(move =>
                move.row === row &&
                move.col === col
            );

            if(canMove){

                if(chessBoard[row][col] === ""){

                    const dot = document.createElement("div");
                    dot.classList.add("move-dot");
                    square.appendChild(dot);

                }else{

                    const ring = document.createElement("div");
                    ring.classList.add("capture-dot");
                    square.appendChild(ring);

                }

            }

            board.appendChild(square);

        }

    }

}
function selectPiece(event){
    
    const row = Number(event.currentTarget.dataset.row);
    const col = Number(event.currentTarget.dataset.col);

    const piece = chessBoard[row][col];

    // Đang có quân được chọn
    if(selected){

        // Click lại chính quân đang chọn -> bỏ chọn
        if(
            selected.row === row &&
            selected.col === col
        ){
            selected = null;
            legalMoves = [];

            renderBoard();
            return;
        }

        // Click vào ô hợp lệ -> di chuyển
        const canMove = legalMoves.some(move =>
            move.row === row &&
            move.col === col
        );

        if(canMove){
            // Đi thử
            movePiece(
                selected.row,
                selected.col,
                row,
                col
            );

    selected = null;
    legalMoves = [];

    renderBoard();
    return;
}

        // Click vào quân cùng màu -> đổi quân đang chọn
        if(piece !== ""){

            const sameColor =
                (currentTurn === "white" && piece === piece.toUpperCase()) ||
                (currentTurn === "black" && piece === piece.toLowerCase());

            if(sameColor){

                selected = {
                    row,
                    col,
                    piece
                };

                legalMoves = getLegalMoves(row, col);

                renderBoard();
                return;
            }

        }

        // Click chỗ khác -> bỏ chọn
        selected = null;
        legalMoves = [];

        renderBoard();
        return;

    }

    // Chưa chọn quân

    if(piece === ""){
        return;
    }

    const correctTurn =
        (currentTurn === "white" && piece === piece.toUpperCase()) ||
        (currentTurn === "black" && piece === piece.toLowerCase());

    if(!correctTurn){
        return;
    }

    selected = {
        row,
        col,
        piece
    };

    legalMoves = getLegalMoves(row, col);

    renderBoard();

}
function getLegalMoves(row, col){

    const piece = chessBoard[row][col];

    switch(piece){

        case "P":
            return getPawnMoves(row, col);

        case "p":
            return getPawnMoves(row, col);
        case "N":
            return getKnightMoves(row, col);
        case "n":
            return getKnightMoves(row, col);
        case "B":
            return getBishopMoves(row, col);
        case "b":
            return getBishopMoves(row, col);
        case "R":
            return getRookMoves(row, col);
        case "r":
            return getRookMoves(row, col);
        case "Q":
            return getQueenMoves(row, col);
        case "q":
            return getQueenMoves(row, col);
        case "K":
            return getKingMoves(row, col);
        case "k":
            return getKingMoves(row, col);

        default:
            return [];

    }

}
renderBoard();