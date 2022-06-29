import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className={"square"} style={props.isWinner ? { backgroundColor: '#1b9e3e', color: 'white' } : { backgroundColor: 'white' }} onClick={props.onClick}>
                {props.value}
                      {console.log("" + props.isWinner)}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                isWinner={this.props.line_winner && this.props.line_winner.indexOf(i) >= 0}
            />
        );
    }

    render() {
        let row = [];
        for (let i = 0; i < 3; ++i) {
            let col = [];
            for (let j = 0; j < 3; ++j) {
                col.push(this.renderSquare(j + 3 * i));
            }
            row.push(<div key={"board-" + i} className="board-row">{col}</div>);
        }
        return (
            <div>{row}</div>
        );
    }
}

class ToggleButton extends React.Component {

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                Trier par ordre décroissant
                <label className="switch">
                    <input type="checkbox" onChange={this.props.toggleClick} />
                    <span className="slider round"></span>
                </label>

            </form>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coords: Array(2).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
            isAscending: true, 
            isDraw: false
        };
    }

    handleClick(i) {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        const y = getY(i);
        const x = getX(i, y);
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                coords: [x, y]
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            isDraw: computeIsDraw(squares)
        });
        console.log("handle" + this.state.isDraw);
        console.log("handle compute" + computeIsDraw(squares));
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    toggleClick() {
        this.setState({
            isAscending: !this.state.isAscending
        });
    }

    render() {
        let history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const resultGame = calculateWinner(current.squares);
        const winner = resultGame ? resultGame[0] : null;
        const line_winner = resultGame ? resultGame[1] : null;
        const moves = history.map((step, move) => {
            move = this.state.isAscending ? move : history.length - 1 - move;
            const desc = move ?
                'Revenir au tour n°' + move :
                'Revenir au début de la partie';
            return (
                <li key={move} className={move === this.state.stepNumber ? "current_elt_history" : ""}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button><span>{history[move].coords[0] !== null ? `(${history[move].coords[0]}, ${history[move].coords[1]})` : ""}</span>
                </li>
            )
        });

        let status;
        console.log("render" + this.state.isDraw);
        if (winner && !this.state.isDraw) {
            status = 'Gagnant : ' + winner;
        } else if (this.state.isDraw) {
            status = 'Draw';
        } else {
            status = 'Prochain joueur : ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        line_winner={line_winner}
                    />
                </div>
                <div className="game-info">
                    <ToggleButton
                        toggleClick={() => this.toggleClick()}
                    />
                    <div>{status}</div>
                    <ul>{moves}</ul>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
            return [squares[a], lines[i]];
        }
    }
    return null;
}

function getX(i, y) {
    return Math.round((i - y) / 3) + 1;
}

function getY(i) {
    return i % 3 + 1;
}

function computeIsDraw(squares) {
    console.log(squares);
    let isDraw = true
    squares.forEach((elt) => {
        console.log(elt);
        if (elt === null) {
            isDraw = false;
        }}
    );
    return isDraw;
}