import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faExclamationTriangle,
  faFileUpload,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import Logo from './imgs/FundBoard_Logo.svg';
import store from './app/store';
import { displayWarning } from './app/utils';
import * as types from './app/actionTypes';

library.add(
  fab,
  faExclamationTriangle,
  faFileUpload,
  faSave,
);

function App() {
  const getStatus = useSelector(state => state.getAirtable.get_status);
  const desserts = useSelector(state => state.getAirtable.desserts) || [];
  const chosenDesserts = useSelector(state => state.desserts.chosenDesserts);
  const userName = useSelector(state => state.user.user);

  const messageRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.AIRTABLE_GET_REQUESTED,
    });
  }, [dispatch]);

  const handleButtonClick = e => {
    if (chosenDesserts.indexOf(e.target.value) !== -1) {
      dispatch({
        type: types.REMOVE_DESSERT,
        chosenDessert: e.target.value,
      });
    } else if (chosenDesserts.length < 3) {
      dispatch({
        type: types.ADD_DESSERT,
        chosenDessert: e.target.value,
      });
    } else {
      displayWarning(messageRef);
    }
  };

  const handleNameChange = e => {
    dispatch({
      type: types.SET_NAME,
      user: e.target.value,
    });
  };

  return (
    <Provider store={store}>
      <Navbar className="nav">
        <a href="/" className="navBrand">
          <img className="navLogo" src={Logo} alt="FundBoard Logo" />
          <span className="navName">FundBoard</span>
        </a>
      </Navbar>
      <main id="Main">
        <p className="error-message hide-content" ref={messageRef}>You may only choose 3 desserts.</p>
        <div className="container-xl">
          <Row>
            <Col>
              <div className="mt-4 mb-2">
                <h1 className="text-center">
                  Choose a Dessert
                </h1>
                <p className="text-center">Choose up to 3 desserts.</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <div className="mb-2">
                {`Get Status: ${getStatus}`}
              </div>
              <div className="d-flex flex-wrap">
                {desserts.length && (
                  desserts.sort().map(dessert => (
                    dessert
                      ? (
                        <Button
                          key={uuidv4()}
                          variant={chosenDesserts.indexOf(dessert) === -1 ? 'info' : 'secondary'}
                          onClick={handleButtonClick}
                          value={dessert}
                          className="w-100 btnNoMax mb-w"
                        >
                          {dessert}
                        </Button>
                      )
                      : ''
                  ))
                )}
              </div>
              <InputGroup className="mb-2 p-1">
                <FormControl
                  type="text"
                  onChange={handleNameChange}
                  value={userName}
                  placeholder="Enter your name"
                  aria-label="Enter your name"
                />
              </InputGroup>
              <Button variant="primary">
                Save
              </Button>
            </Col>
          </Row>
        </div>
      </main>
    </Provider>
  );
}

export default App;
