import './MessageSendForm.scss'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

export default class MessageSendForm extends Component {
    constructor() {
        super();
        GameStore.subscribe(() => this.setState());
    }

    get value() {
        return this.refs.text.value.trim();
    }

    set value(newVal) {
        this.refs.text.value = newVal;
    }

    _onSubmit(ev) {
        ev.preventDefault();
        if (this.value === '') return;

        this.props.onSubmit(ev);
    }

    render() {
        return (
            <form className="MessageSendForm"
                disabled={ this.props.disabled }
                onSubmit={ ev => this._onSubmit(ev) }>
                <input className="MessageSendForm__text"
                    type="text"
                    ref="text"
                    disabled={ this.props.disabled }
                    placeholder="input message..."/>
                <input className="MessageSendForm__submit"
                    disabled={ this.props.disabled }
                    type="submit"
                    value="send" />
            </form>
        );
    }
}

MessageSendForm.propTypes = {
    disabled: PropTypes.boolean,
    onSubmit: PropTypes.func.isRequired
};
