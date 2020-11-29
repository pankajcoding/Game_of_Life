function clone(array) {
  return JSON.parse(JSON.stringify(array));
}

function prnt(e) {
  console.log(JSON.stringify(e));
}

class Life {
  constructor(seed) {
    this.height = seed.length;
    this.width = seed[0].length;

    this.prevBoard = [];
    this.Board = clone(seed);
  }

  next() {
    this.prevBoard = clone(this.Board);

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        let sum = this.getAliveNeighours(this.prevBoard, row, col);
        let isAlive = !!this.prevBoard[row][col];
        if (isAlive) {
          if (sum < 2 || sum > 3) {
            this.Board[row][col] = 0;
          }
        } else {
          if (sum === 3) {
            this.Board[row][col] = 1;
          }
        }
      }
    }
  }

  getAliveNeighours(board, row, col) {
    let sum = 0;
    let prevRow = board[row - 1] || [];
    let nextRow = board[row + 1] || [];
    let neighbours = [
      prevRow[col - 1],
      prevRow[col],
      prevRow[col + 1],
      board[row][col - 1],
      board[row][col + 1],
      nextRow[col - 1],
      nextRow[col],
      nextRow[col + 1]
    ].forEach((cell, index) => {
      sum += !!cell;
    });

    return sum;
  }

  toString() {
    return "" + this.Board.map((row) => row.join(" ")).join("\n");
  }
}

class LifeView {
  constructor(grid, size) {
    this.grid = grid;
    this.size = size;
    this.checkboxes = [...Array(size)].map((x) => Array(size).fill(0));
    this.initialConf = [...Array(size)].map((x) => Array(size).fill(0));
    this.createGrid();
  }

  createGrid() {
    console.log("dsds", this.grid);
    this.grid.innerHTML = "";
    let fragment = document.createDocumentFragment();

    for (let row = 0; row < this.size; row++) {
      let tableRow = document.createElement("tr");
      this.checkboxes[row] = [];

      for (let col = 0; col < this.size; col++) {
        let cell = document.createElement("td");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        this.checkboxes[row][col] = checkbox;

        checkbox.addEventListener("change", (e) => {
          this.handleCheck(e, row, col);
        });
        cell.appendChild(checkbox);
        tableRow.appendChild(cell);
      }
      fragment.appendChild(tableRow);
    }

    this.grid.appendChild(fragment);
  }

  play() {
    this.game = new Life(this.initialConf);
  }
  next() {
    this.game.next();
    this.initialConf = this.game.Board;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.checkboxes[row][col].checked = this.initialConf[row][col];
      }
    }
    prnt(this.initialConf);
  }

  handleCheck(e, row, col) {
    this.initialConf[row][col] = 0 + !this.initialConf[row][col];
    console.log(JSON.stringify(this.initialConf));
  }
}

console.clear();
// console.log(game.toString());
// game.next();
// console.log(game.toString());
// ]
let lifeview;
function initializeGrid(e) {
  let size = parseInt(document.querySelector("input.grid-size").value);
  console.log(typeof size);
  lifeview = new LifeView(document.querySelector(".grid"), size);
}
function handlePlay(e) {
  lifeview.play();
}
function handleNext(e) {
  lifeview.next();
}
function handleAutoplay(e) {
  lifeview.play();
  setInterval(lifeview.next, 1000);
}

const playBtn = document.querySelector("button.play");
const nextBtn = document.querySelector("button.next");
const createBtn = document.querySelector("button.create");
const autoplayBtn = document.querySelector("button.autoplay");

createBtn.addEventListener("click", initializeGrid);
prnt(lifeview);
playBtn.addEventListener("click", handlePlay);
nextBtn.addEventListener("click", handleNext);
autoplayBtn.addEventListener("click", handleAutoplay);
