import './MessageList.scss'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

export default class MessageList extends Component {
    constructor() {
        super();
    }

    render() {
        let chats = this.props.chats.map(chat => {
            let created = new Date(chat.created*1000),
                hh = ('0' + created.getHours()).substr(-2),
                mm = ('0' + created.getMinutes()).substr(-2);

            return (
                <li className="MessageList__item"
                    key={ chat.id }>
                    <p className="MessageList__userName">
                        { chat.player }
                        <span className="MessageList__time">{ hh }:{ mm }</span>
                    </p>
                    <p className="MessageList__text">{ chat.text }</p>
                </li>
            )
        });

        return (
            <ul className="MessageList">
                { chats }
            </ul>
        );
    }
}

MessageList.propTypes = {
    onSelect: PropTypes.func.isRequired
};
