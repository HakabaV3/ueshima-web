import './GameCreateForm.scss';

import React, { Component, PropTypes } from 'react';
import GameStore from 'store/GameStore';
self.GameStore = GameStore;

export default class GameCreateForm extends Component {
    constructor() {
        super();
        this.state = {
            value: ''
        };
    }

    _onChange(ev) {
        this.setState({
            value: ev.target.value
        });
    }

    _onSubmit(ev) {
        ev.preventDefault();

        GameStore.pCreate(this.state.value)
            .then(game => {
                this.setState({
                    value: ''
                });
            })
            .catch(err => console.error(err));
    }

    render() {
        return (
            <form className="GameCreateForm"
                onSubmit={ ev => this._onSubmit(ev) }>
                <input className="GameCreateBox__input"
                    type="text"
                    value={ this.state.value }
                    onChange={ ev => this._onChange(ev) }
                    placeholder="username" />
                <input className="GameCreateBox__submit"
                    type="submit"
                    value="open" />
            </form>
        );
    }
}

GameCreateForm.propTypes = {
};
