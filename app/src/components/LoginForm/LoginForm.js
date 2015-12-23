import './LoginForm.scss'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

import UserStore from 'store/UserStore'
self.UserStore = UserStore;

export default class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            value: ''
        };
        GameStore.subscribe(() => this.setState());
    }

    _onChange(ev) {
        this.setState({
            username: ev.target.value
        });
    }

    _onSubmit(ev) {
        ev.preventDefault();
        UserStore.pCreate(this.state.value)
            .then(user => {
                console.log(user);
            })
            .catch(e => {
                console.error(e);
            })
    }

    render() {
        return (
            <form className="LoginForm"
                onSubmit={ ev => this._onSubmit(ev) }>
                <input
                    onChange={ ev => this._onChange(ev) }
                    value={ this.state.username }
                    type="text"
                    placeholder="your name" />
                <input type="submit" value="Enter" />
            </form>
        );
    }
}

LoginForm.propTypes = {
    onSelect: PropTypes.func.isRequired
};
