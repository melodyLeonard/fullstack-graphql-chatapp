import React, { useContext } from 'react';
import {
  Col,
  Image,
  Form,
  FormControl,
} from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { reduceLastMessage } from '../../libs/reduceLastMessage';
import Spinner from '../Spinner';
import { GET_USER } from '../../Apollo/queries/user';
import {
  MessageDispatchContext,
  MessageStateContext,
} from '../../context/message/messageContext';

import classNames from 'classnames';


const defaultAvatar =
  'https://banner2.cleanpng.com/20180402/ojw/kisspng-united-states-avatar-organization-information-user-avatar-5ac20804a62b58.8673620215226654766806.jpg';
const Users = () => {
  const messageDispatchContext = useContext(
    MessageDispatchContext
  );
  const messageStateContext = useContext(
    MessageStateContext
  );

  const { users } = messageStateContext;
  const {
    setUserDispatch,
    setSelectedUserDispatch,
  } = messageDispatchContext;

  const selectedUser = users?.find(
    (u) => u.selected === true
  )?.username;

  const { loading } = useQuery(GET_USER, {
    onCompleted: (data) => setUserDispatch(data),
    onError: (err) => console.log(err),
  });

  let userMarkup;
  if (!users || loading) {
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner />
    </div>;
  } else if (users.length === 0) {
    <p>No users have joined yet</p>;
  } else if (users.length > 0) {
    userMarkup = users.map((user) => {
      const selected = selectedUser === user.username;
      return (
        <div
          role="button"
          onClick={() => setSelectedUserDispatch(user)}
          className={classNames(
            'user-div d-flex justify-content-center d-flex justify-content-md-start ',
            {
              'bg-secondary': selected,
            }
          )}
          key={user.username}
        >
          <Image
            src={user.imageUrl || defaultAvatar}
            className="user-image m-md-2"
          />
          <div className="d-none d-md-block ml-2">
            <p className="text-success">{user.username}</p>
            <p className="font-weight-lighter">
              {user.latestMessage
                ? reduceLastMessage(
                  user.latestMessage.content
                )
                : `You are now connected with ${user.username}`}
            </p>
          </div>
        </div>
      );
    });
  }
  return (
    <Col
      xs={3}
      md={4}
      className="sidebar-container"
    >
      <Form className="mt-3 mb-3">
        <FormControl type="text" placeholder="Search..." className="mr-sm-2" />

      </Form>
      {userMarkup}
    </Col>
  );
};

export default Users;
