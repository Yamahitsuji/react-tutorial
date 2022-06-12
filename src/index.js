import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  const buttonStyle = { backgroundColor: "red" };
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={props.isMarked ? buttonStyle : {}}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        isMarked={this.props.markSquare === i}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderTable() {
    return [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ].map((row) => {
      return (
        <div className="board-row">
          {row.map((i) => {
            return this.renderSquare(i);
          })}
        </div>
      );
    });
  }

  render() {
    return <div>{this.renderTable()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          point: {
            col: null,
            row: null,
          },
        },
      ],
      stepNumber: 0,
      lastMarked: null,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        { squares: squares, point: { col: i % 3, row: Math.floor(i / 3) } },
      ]),
      stepNumber: history.length,
      lastMarked: i,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const isSelected = this.state.stepNumber === move;
      const desc = move ? "Go to move" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {isSelected ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber === 9) {
      status = "引き分けです。";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            markSquare={!!winner ? this.state.lastMarked : null}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div>
          col: {current.point.col} row: {current.point.row}
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
