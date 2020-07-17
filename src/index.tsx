import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

interface ISquareProps {
    value:string | null
    onClick: Function
}

interface IBoardState{
    squares: Array<string | null>
}

interface IBoardProps {
    squares: Array<string | null>
    onClick: Function
}

interface IGameState {
    history: Array<IBoardState>
    xIsNext: boolean
    stepNumber: number
}
const Square: React.FunctionComponent<ISquareProps> = (props) => {
    
    return (
        <button className="square" onClick= {() => props.onClick()}>
          {props.value}
        </button>
    )
}

const Board: React.FunctionComponent<IBoardProps> = (props) => {
    
    const renderSquare = (i:number) => <Square value={props.squares[i]} onClick={() => props.onClick(i)}/>;

    return (
        <div>
        <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
        </div>
        <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
        </div>
        <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
        </div>
        </div>
    )
} 
  
  
const Game: React.FunctionComponent<object> = () => {
    const [game, setGame] = useState<IGameState>(
            { history: [{squares: Array(9).fill(null),}],
            xIsNext: true,
            stepNumber: 0
        }
    );

    const handleClick = (i:number) => {
        const history = game.history.slice(0, game.stepNumber +1 );
        const current = history[history.length -1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = game.xIsNext ? 'X' : 'O'
        setGame({
            history: history.concat([{squares: squares,}]),
            xIsNext: !game.xIsNext,
            stepNumber: history.length
        })
    }

    const jumpTo = (step: number): void => {
        setGame({
            history: game.history,
            stepNumber: step,
            xIsNext: (step %2) === 0,
        })
        
    }

    const history = game.history;
    const current = history[game.stepNumber]
    const moves = history.map((step, move) => {
        const description = move ? 'Go to move #' + move : 'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        )
    })
    const winner = calculateWinner(current.squares)
    let status;

    if (winner) {
        status = 'Winner' + winner;
    } else {
        status = 'Next player:' + (game.xIsNext ? 'X' : '0');
    }

    return (
        <div className="game">
            <div className="game-board">
            <div className="status">{status}</div>
            <Board 
                squares={current.squares}
                onClick={(i:number) => handleClick(i)}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            </div>
        </div>
        );
}

function calculateWinner(squares:any) {
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
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

