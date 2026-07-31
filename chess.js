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

let whiteKingMoved = false;
let blackKingMoved = false;

let whiteLeftRookMoved = false;
let whiteRightRookMoved = false;

let blackLeftRookMoved = false;
let blackRightRookMoved = false;

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

            movePiece(
                selected.row,
                selected.col,
                row,
                col
        );

        switchTurn();  
        
        selected = null;
        legalMoves = [];

    renderBoard();
    if(isCheckmate(currentTurn)){

            alert(
                currentTurn === "white"
                ? "Chiếu hết! Đen thắng!"
                : "Chiếu hết! Trắng thắng!"
            );

        }

        else if(isStalemate(currentTurn)){
            alert("Hòa (Stalemate)");
        }   
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

    let moves = [];

    switch(piece){

        case "P":
        case "p":
            moves = getPawnMoves(row, col);
            break;

        case "N":
        case "n":
            moves = getKnightMoves(row, col);
            break;

        case "B":
        case "b":
            moves = getBishopMoves(row, col);
            break;

        case "R":
        case "r":
            moves = getRookMoves(row, col);
            break;

        case "Q":
        case "q":
            moves = getQueenMoves(row, col);
            break;

        case "K":
        case "k":
            moves = getKingMoves(row, col);
            break;

        default:
            return [];

    }

    return moves.filter(move =>
        isLegalMove(
            row,
            col,
            move.row,
            move.col
        )
    );

}
function getPawnMoves(row, col){

    const moves = [];

    const piece = chessBoard[row][col];

    // ==================
    // TỐT TRẮNG
    // ==================
    if(piece === "P"){

        // đi 1 ô
        if(
            row - 1 >= 0 &&
            chessBoard[row-1][col] === ""
        ){

            moves.push({
                row: row-1,
                col: col
            });

            // đi 2 ô khi chưa di chuyển
            if(
                row === 6 &&
                chessBoard[row-2][col] === ""
            ){

                moves.push({
                    row: row-2,
                    col: col
                });

            }

        }

        // ăn trái
        if(
            row-1 >= 0 &&
            col-1 >= 0 &&
            chessBoard[row-1][col-1] !== "" &&
            chessBoard[row-1][col-1] === chessBoard[row-1][col-1].toLowerCase()
        ){

            moves.push({
                row: row-1,
                col: col-1
            });

        }

        // ăn phải
        if(
            row-1 >= 0 &&
            col+1 < 8 &&
            chessBoard[row-1][col+1] !== "" &&
            chessBoard[row-1][col+1] === chessBoard[row-1][col+1].toLowerCase()
        ){

            moves.push({
                row: row-1,
                col: col+1
            });

        }

    }

    // ==================
    // TỐT ĐEN
    // ==================

    if(piece === "p"){

        if(
            row+1 < 8 &&
            chessBoard[row+1][col] === ""
        ){

            moves.push({
                row: row+1,
                col: col
            });

            if(
                row === 1 &&
                chessBoard[row+2][col] === ""
            ){

                moves.push({
                    row: row+2,
                    col: col
                });

            }

        }

        if(
            row+1 < 8 &&
            col-1 >=0 &&
            chessBoard[row+1][col-1] !== "" &&
            chessBoard[row+1][col-1] === chessBoard[row+1][col-1].toUpperCase()
        ){

            moves.push({
                row: row+1,
                col: col-1
            });

        }

        if(
            row+1 < 8 &&
            col+1 < 8 &&
            chessBoard[row+1][col+1] !== "" &&
            chessBoard[row+1][col+1] === chessBoard[row+1][col+1].toUpperCase()
        ){

            moves.push({
                row: row+1,
                col: col+1
            });

        }

    }

    return moves;

}
function getKnightMoves(row, col){

    const moves = [];

    const piece = chessBoard[row][col];

    const offsets = [
        [-2,-1],
        [-2, 1],
        [-1,-2],
        [-1, 2],
        [ 1,-2],
        [ 1, 2],
        [ 2,-1],
        [ 2, 1]
    ];

    for(const [dr, dc] of offsets){

        const newRow = row + dr;
        const newCol = col + dc;

        // Ra ngoài bàn cờ
        if(
            newRow < 0 ||
            newRow >= 8 ||
            newCol < 0 ||
            newCol >= 8
        ){
            continue;
        }

        const target = chessBoard[newRow][newCol];

        // Ô trống
        if(target === ""){

            moves.push({
                row: newRow,
                col: newCol
            });

        }
        // Mã trắng ăn quân đen
        else if(
            piece === piece.toUpperCase() &&
            target === target.toLowerCase()
        ){

            moves.push({
                row: newRow,
                col: newCol
            });

        }
        // Mã đen ăn quân trắng
        else if(
            piece === piece.toLowerCase() &&
            target === target.toUpperCase()
        ){

            moves.push({
                row: newRow,
                col: newCol
            });

        }

    }

    return moves;

}
function getBishopMoves(row, col){

    const moves = [];
    const piece = chessBoard[row][col];

    // 4 hướng chéo
    const directions = [
        [-1, -1], // trên trái
        [-1,  1], // trên phải
        [ 1, -1], // dưới trái
        [ 1,  1]  // dưới phải
    ];

    for(const [dr, dc] of directions){

        let r = row + dr;
        let c = col + dc;

        while(
            r >= 0 &&
            r < 8 &&
            c >= 0 &&
            c < 8
        ){

            const target = chessBoard[r][c];

            // Ô trống
            if(target === ""){

                moves.push({
                    row: r,
                    col: c
                });

            }
            else{

                // Khác màu -> được ăn
                if(
                    (piece === piece.toUpperCase() && target === target.toLowerCase()) ||
                    (piece === piece.toLowerCase() && target === target.toUpperCase())
                ){

                    moves.push({
                        row: r,
                        col: c
                    });

                }

                // Gặp quân thì dừng luôn
                break;
            }

            r += dr;
            c += dc;

        }

    }

    return moves;

}
function getRookMoves(row, col){

    const moves = [];
    const piece = chessBoard[row][col];

    // 4 hướng: lên, xuống, trái, phải
    const directions = [
        [-1, 0], // lên
        [ 1, 0], // xuống
        [ 0,-1], // trái
        [ 0, 1]  // phải
    ];

    for(const [dr, dc] of directions){

        let r = row + dr;
        let c = col + dc;

        while(
            r >= 0 &&
            r < 8 &&
            c >= 0 &&
            c < 8
        ){

            const target = chessBoard[r][c];

            // Ô trống
            if(target === ""){

                moves.push({
                    row: r,
                    col: c
                });

            }
            else{

                // Quân đối phương -> được ăn
                if(
                    (piece === piece.toUpperCase() && target === target.toLowerCase()) ||
                    (piece === piece.toLowerCase() && target === target.toUpperCase())
                ){

                    moves.push({
                        row: r,
                        col: c
                    });

                }

                // Gặp quân thì dừng theo hướng này
                break;

            }

            r += dr;
            c += dc;

        }

    }

    return moves;

}
function getQueenMoves(row, col){

    const moves = [];
    const piece = chessBoard[row][col];

    // 8 hướng
    const directions = [
        [-1, 0], // lên
        [ 1, 0], // xuống
        [ 0,-1], // trái
        [ 0, 1], // phải

        [-1,-1], // trên trái
        [-1, 1], // trên phải
        [ 1,-1], // dưới trái
        [ 1, 1]  // dưới phải
    ];

    for(const [dr, dc] of directions){

        let r = row + dr;
        let c = col + dc;

        while(
            r >= 0 &&
            r < 8 &&
            c >= 0 &&
            c < 8
        ){

            const target = chessBoard[r][c];

            // Ô trống
            if(target === ""){

                moves.push({
                    row: r,
                    col: c
                });

            }
            else{

                // Quân đối phương
                if(
                    (piece === piece.toUpperCase() && target === target.toLowerCase()) ||
                    (piece === piece.toLowerCase() && target === target.toUpperCase())
                ){

                    moves.push({
                        row: r,
                        col: c
                    });

                }

                // Gặp quân thì dừng
                break;

            }

            r += dr;
            c += dc;

        }

    }

    return moves;

}
function getKingMoves(row, col){

    const moves = [];

    const piece = chessBoard[row][col];

    const directions = [
        [-1,-1],
        [-1, 0],
        [-1, 1],

        [ 0,-1],
        [ 0, 1],

        [ 1,-1],
        [ 1, 0],
        [ 1, 1]
    ];

    for(const [dr, dc] of directions){

        const r = row + dr;
        const c = col + dc;

        // Ngoài bàn cờ
        if(
            r < 0 ||
            r >= 8 ||
            c < 0 ||
            c >= 8
        ){
            continue;
        }

        const target = chessBoard[r][c];

        // Ô trống
        if(target === ""){

            moves.push({
                row: r,
                col: c
            });

        }
        // Quân đối phương
        else if(
            (piece === piece.toUpperCase() && target === target.toLowerCase()) ||
            (piece === piece.toLowerCase() && target === target.toUpperCase())
        ){

            moves.push({
                row: r,
                col: c
            });

        }

    }

    return moves;

}
function movePiece(fromRow, fromCol, toRow, toCol){
    const piece = chessBoard[fromRow][fromCol];

    chessBoard[toRow][toCol] = chessBoard[fromRow][fromCol];
    chessBoard[fromRow][fromCol] = "";

    if(piece === "K"){
        whiteKingMoved = true;
    }

    if(piece === "k"){
        blackKingMoved = true;
    }
    if(piece === "R"){

        if(fromRow === 7 && fromCol === 0){
            whiteLeftRookMoved = true;
        }

        if(fromRow === 7 && fromCol === 7){
            whiteRightRookMoved = true;
        }

    }

    if(piece === "r"){

        if(fromRow === 0 && fromCol === 0){
            blackLeftRookMoved = true;
        }

        if(fromRow === 0 && fromCol === 7){
            blackRightRookMoved = true;
        }

    }
     // CASTLING - TRẮNG
     if(
        piece === "K" &&
        fromRow === 7 &&
        fromCol === 4 &&
        toRow === 7 &&
        toCol === 6
    ){

        // Vua e1 -> g1
        // Xe h1 -> f1

        chessBoard[7][5] = "R";
        chessBoard[7][7] = "";

    }
    if(
        piece === "K" &&
        fromRow === 7 &&
        fromCol === 4 &&
        toRow === 7 &&
        toCol === 2
    ){

        // Vua e1 -> c1
        // Xe a1 -> d1

        chessBoard[7][3] = "R";
        chessBoard[7][0] = "";

    }
    // CASTLING - ĐEN
     if(
        piece === "k" &&
        fromRow === 0 &&
        fromCol === 4 &&
        toRow === 0 &&
        toCol === 6
    ){

        // Vua e8 -> g8
        // Xe h8 -> f8

        chessBoard[0][5] = "r";
        chessBoard[0][7] = "";

    }

    if(
        piece === "k" &&
        fromRow === 0 &&
        fromCol === 4 &&
        toRow === 0 &&
        toCol === 2
    ){

        // Vua e8 -> c8
        // Xe a8 -> d8

        chessBoard[0][3] = "r";
        chessBoard[0][0] = "";

    }


}
function switchTurn(){

    currentTurn =
        currentTurn === "white"
        ? "black"
        : "white";

}
function getAttackSquares(row, col){

    const piece = chessBoard[row][col];

    switch(piece){

        case "P":
        case "p":
            return getPawnAttackSquares(row, col);

        case "N":
        case "n":
            return getKnightMoves(row, col);

        case "B":
        case "b":
            return getBishopMoves(row, col);

        case "R":
        case "r":
            return getRookMoves(row, col);

        case "Q":
        case "q":
            return getQueenMoves(row, col);

        case "K":
        case "k":
            return getKingMoves(row, col);

        default:
            return [];

    }

}
function getPawnAttackSquares(row, col){

    const moves = [];

    const piece = chessBoard[row][col];

    if(piece === "P"){

        if(row > 0 && col > 0)
            moves.push({row: row-1, col: col-1});

        if(row > 0 && col < 7)
            moves.push({row: row-1, col: col+1});

    }

    if(piece === "p"){

        if(row < 7 && col > 0)
            moves.push({row: row+1, col: col-1});

        if(row < 7 && col < 7)
            moves.push({row: row+1, col: col+1});

    }

    return moves;

}
function findKing(color){

    const king = color === "white" ? "K" : "k";

    for(let row = 0; row < 8; row++){

        for(let col = 0; col < 8; col++){

            if(chessBoard[row][col] === king){

                return {
                    row,
                    col
                };

            }

        }

    }

    return null;

}
function isSquareAttacked(row, col, attackerColor){

    for(let r = 0; r < 8; r++){

        for(let c = 0; c < 8; c++){

            const piece = chessBoard[r][c];

            if(piece === ""){
                continue;
            }

            const isWhitePiece = piece === piece.toUpperCase();

            // Chỉ xét quân của bên đang tấn công
            if(
                attackerColor === "white" &&
                !isWhitePiece
            ){
                continue;
            }

            if(
                attackerColor === "black" &&
                isWhitePiece
            ){
                continue;
            }

            const attacks = getAttackSquares(r, c);

            const canAttack = attacks.some(square =>
                square.row === row &&
                square.col === col
            );

            if(canAttack){
                return true;
            }

        }

    }

    return false;

}
function isKingInCheck(color){

    const king = findKing(color);

    if(!king){
        return false;
    }

    const enemy =
        color === "white"
        ? "black"
        : "white";

    return isSquareAttacked(
        king.row,
        king.col,
        enemy
    );

}
function isLegalMove(fromRow, fromCol, toRow, toCol){

    const movingPiece = chessBoard[fromRow][fromCol];
    const capturedPiece = chessBoard[toRow][toCol];

    chessBoard[toRow][toCol] = movingPiece;
    chessBoard[fromRow][fromCol] = "";

    const color =
        movingPiece === movingPiece.toUpperCase()
        ? "white"
        : "black";

    const legal = !isKingInCheck(color);

    chessBoard[fromRow][fromCol] = movingPiece;
    chessBoard[toRow][toCol] = capturedPiece;

    return legal;

}
function hasAnyLegalMove(color){

    for(let row = 0; row < 8; row++){

        for(let col = 0; col < 8; col++){

            const piece = chessBoard[row][col];

            if(piece === ""){
                continue;
            }

            const isWhite = piece === piece.toUpperCase();

            if(color === "white" && !isWhite){
                continue;
            }

            if(color === "black" && isWhite){
                continue;
            }

            const moves = getLegalMoves(row, col);

            if(moves.length > 0){
                return true;
            }

        }

    }

    return false;

}
function isCheckmate(color){

    if(!isKingInCheck(color)){
        return false;
    }

    return !hasAnyLegalMove(color);

}
function isStalemate(color){

    if(isKingInCheck(color)){
        return false;
    }

    return !hasAnyLegalMove(color);

}

renderBoard();