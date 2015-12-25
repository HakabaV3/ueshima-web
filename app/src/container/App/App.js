import './App.scss'

import React, { Component } from 'react'

import GameList from 'components/GameList/GameList'
import GameCreateForm from 'components/GameCreateForm/GameCreateForm'
import LoginForm from 'components/LoginForm/LoginForm'
import GameBoard from 'components/GameBoard/GameBoard'

import UserStore from 'store/UserStore'
import GameStore from 'store/GameStore'

export default class App extends Component {

    constructor() {
        super();

        this.state = {
            selectedGame: null
        };

        UserStore.subscribe(() => this._onUserStoreUpdate());
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
                    <GameBoard game={ this.state.selectedGame }/>
                </div>

                { !UserStore.state.username ? <LoginForm /> : null }
            </div>
        );
    }
}
