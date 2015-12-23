import './GameList.scss'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

import GameStore from 'store/GameStore'
self.GameStore = GameStore;

export default class GameList extends Component {
    constructor() {
        super();
        this.state = {
            selectedId: null
        };
        GameStore.subscribe(() => this.setState());
    }

    _onSelect(game) {
        this.setState({
            selectedId: game.id
        });
        this.props.onSelect(game);
    }

    render() {
        let username = UserStore.state.username,
            games = Array.from(GameStore.state.games.values())
            .map(game => {
                let isMyTurn = game.turn === username;
                return (
                    <li className={classNames({
                            'GameList__item': true,
                            'is-myturn': isMyTurn,
                            'is-selected': game.id === this.state.selectedId
                        })}
                        key={ game.id }
                        onClick={ () => this._onSelect(game) }>
                        <p className="GameList__itemTitle">
                            { game.players.join(' vs ') }
                        </p>
                        <p className="GameList__itemState">
                            { isMyTurn ? 'your turn' : 'pending...'}
                        </p>
                    </li>
                );
            });

        return (
            <ul className="GameList">
                { games }
            </ul>
        );
    }
}

GameList.propTypes = {
    onSelect: PropTypes.func.isRequired
};
