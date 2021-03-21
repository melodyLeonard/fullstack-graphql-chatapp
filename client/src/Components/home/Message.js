import React, { useContext, useState } from 'react';
import {
  Tooltip,
  OverlayTrigger,
  Button,
  Popover,
} from 'react-bootstrap';
import { AuthStateContext } from '../../context/authentication/authContext';
import classNames from 'classnames';
import moment from 'moment';
import { FiSmile } from 'react-icons/fi';
import { useMutation } from '@apollo/client';
import { REACT_TO_MESSAGE } from '../../Apollo/mutations/reaction';

const Message = ({ message }) => {
  const authStateContext = useContext(AuthStateContext);
  const { user } = authStateContext;

  const [showReactions, setShowReactions] = useState(false);

  const sent = message.from === user.username;
  const received = !sent;

  const reactions = [
    '❤️',
    '😆',
    '😯',
    '😢',
    '😡',
    '👍',
    '👎',
  ];

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => {
      setShowReactions(false);
    },
  });

  const react = (reaction) => {
    reactToMessage({
      variables: { uuid: message.uuid, content: reaction },
    });
  };

  const reactButton = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={showReactions}
      onToggle={setShowReactions}
      transition={false}
      rootClose
      overlay={
        <Popover className="react-button-popover">
          <Popover.Content>
            {reactions.map((reaction) => (
              <Button
                variant="link"
                key={reaction}
                onClick={() => react(reaction)}
                className="reaction-icon-button"
              >
                {reaction}
              </Button>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="link" className="px-2 reaction-icon">
        <FiSmile />
      </Button>
    </OverlayTrigger>
  );

  return (
    <div
      className={classNames('d-flex my-3', {
        'ml-auto': sent,
        'mr-auto': received,
      })}
    >
      {sent && reactButton}
      <OverlayTrigger
        placement={sent ? 'left' : 'right'}
        overlay={
          <Tooltip>
            {moment(message.createdAt).format(
              'MMM DD, YYYY @ h:mm: a'
            )}
          </Tooltip>
        }
        transition={false}
        rootClose
      >
        <div
          className={classNames('message-bubble', {
            'sent-message': sent,
            'received-message': received,
          })}
        >
          <p
            className={classNames({
              'text-white  pr-3 ': sent,
              ' pr-3': received,
            })}
            key={message.uuid}
          >
            {message.content}
          </p>
          <p
            className={classNames('chat-date', {
              'text-left': received,
              'text-right': sent,
            })}
          >
            {moment(message.createdAt).fromNow()}
          </p>
        </div>
      </OverlayTrigger>
      {received && reactButton}
    </div>
  );
};

export default Message;
