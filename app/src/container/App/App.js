import './App.scss'

import React, { Component } from 'react'

import GameList from 'components/GameList/GameList'
import GameCreateForm from 'components/GameCreateForm/GameCreateForm'
import LoginForm from 'components/LoginForm/LoginForm'
import GameBoard from 'components/GameBoard/GameBoard'
import MessageForm from 'components/MessageForm/MessageForm'

import UserStore from 'store/UserStore'
import GameStore from 'store/GameStore'

export default class App extends Component {

    constructor() {
        super();

        this.state = {
            selectedGame: null
        };

        UserStore.subscribe(() => this._onUserStoreUpdate());
        GameStore.subscribe(() => this._onGameStoreUpdate());
        this._onUserStoreUpdate();
    }

    _onUserStoreUpdate() {
        if (UserStore.state.username) {
            GameStore.startIntervalRequest();
        } else {
            GameStore.stopIntervalRequest();
        }
        this.setState();
    }

    _onGameStoreUpdate() {
        if (this.state.selectedGame) {
            this.setState({
                selectedGame: GameStore.state.games.get(this.state.selectedGame.id)
            });
        }
    }

    _onSelectGame(selectedGame) {
        this.setState({
            selectedGame: selectedGame
        });
    }

    _onLogoutClick(ev) {
        UserStore.logOut();
    }

    render() {
        return (
            <div className="App">
                <div className="App__SideColumn">
                    <GameCreateForm />
                    <GameList
                        ref="gameList"
                        onSelect={ game => this._onSelectGame(game) }/>
                    <footer>
                        <span>
                            { UserStore.state.username }
                        </span>
                        <input type="button"
                            value="Log Out"
                            onClick={ ev => this._onLogoutClick(ev) } />
                    </footer>
                </div>
                <div className="App__MainColumn">
                    <div className="App__GameWrapper">
                        <GameBoard game={ this.state.selectedGame }/>
                    </div>
                    <MessageForm game={ this.state.selectedGame }/>
                </div>

                { !UserStore.state.username ? <LoginForm /> : null }
            </div>
        );
    }
}
