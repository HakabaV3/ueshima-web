import './MessageForm.scss'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

import MessageList from 'components/MessageList/MessageList'
import MessageSendForm from 'components/MessageSendForm/MessageSendForm'

import GameStore from 'store/GameStore'

export default class MessageForm extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props) {
        if (props.game && !('chats' in props.game)) {
            props.game.chats = [];
        }
    }

    _onSubmit(ev) {
        let text = this.refs.form.value;
        GameStore.pSendMessage(this.props.game, text)
            .then(() => {
                this.refs.form.value = '';
            });
    }

    render() {
        let chats = this.props.game ? this.props.game.chats : [],
            disabled = !this.props.game;

        return (
            <div className="MessageForm">
                <MessageList
                    chats={ chats }
                    disabled={ disabled }/>
                <MessageSendForm
                    ref="form"
                    onSubmit={ ev => this._onSubmit(ev) }
                    disabled={ disabled }/>
            </div>
        );
    }
}

MessageForm.propTypes = {
    game: PropTypes.obejct,
    onSelect: PropTypes.func.isRequired
};
