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
        let games = Array.from(GameStore.state.games.values())
            .map(game => {
                return (
                    <li className={classNames({
                            'GameList__item': true,
                            'is-selected': game.id === this.state.selectedId
                        })}
                        key={ game.id }
                        onClick={ () => this._onSelect(game) }>
                        { game.players.join(' vs ') }
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
