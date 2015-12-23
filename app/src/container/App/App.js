import './App.scss'

import React, { Component } from 'react'

import GameList from 'components/GameList/GameList'
import GameCreateForm from 'components/GameCreateForm/GameCreateForm'
import LoginForm from 'components/LoginForm/LoginForm'

import UserStore from 'store/UserStore'

export default class App extends Component {

    constructor() {
        super();
        UserStore.subscribe(() => this.setState());
    }
    _onSelectGame(selectedGame) {
        console.log(selectedGame);
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
                    <input type="button"
                        value="Log Out"
                        onClick={ ev => this._onLogoutClick(ev) } />
                </div>
                <div className="App__MainColumn">
                    &nbsp;
                </div>

                <div className="App__accountBox">
                    { UserStore.state.username }
                </div>
                { !UserStore.state.username ? <LoginForm /> : null }
            </div>
        );
    }
}
