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