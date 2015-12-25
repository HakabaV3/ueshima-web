import './GameBoard.scss';

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

const CellType = {
    BLACK: -1,
    EMPTY: 0,
    WHITE: 1
};

const DIR = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
];

export default class GameBoard extends Component {
    constructor() {
        super();
        this.state = {
            value: '',
            game: null
        };
        GameStore.subscribe(() => {
            if (this.state.game) {
                let newState = GameStore.state.games.get(this.state.game.id);

                if (newState.moves.length !== this.state.game.moves.length) {
                    this.setState({
                        game: this.parseGame(newState)
                    });
                }
            }
        })
    }

    didComponentMoun() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.game) {
            this.setState({
                game: this.parseGame(nextProps.game)
            });
        }
    }

    parseGame(game) {
        game.board = [];

        for (let x = 0; x <= 9; x++) {
            for (let y = 0; y <= 9; y++) {
                game.board[y*10+x] = CellType.EMPTY;
            }
        }

        game.board[4*10+4] =
            game.board[5*10+5] = CellType.BLACK;

        game.board[4*10+5] =
            game.board[5*10+4] = CellType.WHITE;

        game.moves.forEach(move => {
            this.put(move.x, move.y, game, move.player);
        });

        game.me = game.players[0] === UserStore.state.username ? CellType.BLACK : CellType.WHITE;
        game.enemy = game.me === CellType.WHITE ? CellType.BLACK : CellType.WHITE;

        return game;
    }

    checkIsPuttable(px, py, game=this.state.game, player=UserStore.state.username) {
        const board = game.board;
        const ME = game.players[0] === player ? CellType.BLACK : CellType.WHITE;
        const ENEMY = ME === CellType.BLACK ? CellType.WHITE : CellType.BLACK;

        if (board[py*10+px] !== CellType.EMPTY) return false;
        for (let d = 0; d < DIR.length; d++) {
            let x = px+DIR[d][0],
                y = py+DIR[d][1];

            if (board[y*10+x] !== ENEMY) continue;

            while (true) {
                x += DIR[d][0];
                y += DIR[d][1];

                if (board[y*10+x] === CellType.EMPTY) {
                    break;
                } else if (board[y*10+x] === ME) {
                    return true;
                }
            }
        }

        return false;
    }

    put(px, py, game=this.state.game, player=UserStore.state.username) {
        const board = game.board;
        const ME = game.players[0] === player ? CellType.BLACK : CellType.WHITE;
        const ENEMY = (ME === CellType.BLACK) ? CellType.WHITE : CellType.BLACK;

        board[py*10+px] = ME;

        for (let d = 0; d < DIR.length; d++) {
            let x = px+DIR[d][0],
                y = py+DIR[d][1];

            if (board[y*10+x] !== ENEMY) continue;

            while (true) {
                x += DIR[d][0];
                y += DIR[d][1];

                if (board[y*10+x] === CellType.EMPTY) {
                    break;

                } else if (board[y*10+x] === ME) {
                    while (true) {
                        x -= DIR[d][0];
                        y -= DIR[d][1];
                        if (x === px && y === py) break;

                        board[y*10+x] = ME;
                    }
                    break;
                }
            }
        }

        this.setState();
    }

    onClickCell(x, y) {
        if (!this.checkIsPuttable(x, y)) return false;

        GameStore.pSetMove(this.state.game, x, y)
            .then(() => {
                this.put(x, y);
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        let cells = [],
            statusBar = null,
            game = this.state.game;

        if (game) {
            for (let x = 1; x <= 8; x++) {
                for (let y = 1; y <= 8; y++) {
                    cells.push(
                        <div className={classNames({
                                'GameBoard__cell': true,
                                'is-putable': this.checkIsPuttable(x, y)
                            })}
                            onClick={() => this.onClickCell(x, y)}>
                            <div className={classNames({
                                'GameBoard__cellInner': true,
                                'is-empty': game.board[y*10+x] === CellType.EMPTY,
                                'is-black': game.board[y*10+x] === CellType.BLACK,
                                'is-white': game.board[y*10+x] === CellType.WHITE,
                            })}/>
                        </div>
                    );
                }
            }

            statusBar = (<p>
                You are { game.me === CellType.BLACK ? 'black' : 'white' }
            </p>);
        }

        return (
            <div className="GameBoard">
                <div className="GameBoard__base">
                    {cells}
                </div>
                { statusBar }
            </div>
        );
    }
}
