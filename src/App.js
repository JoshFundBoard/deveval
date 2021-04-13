import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux';
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
import * as types from './app/actionTypes';

library.add(
  fab,
  faExclamationTriangle,
  faFileUpload,
  faSave,
);

function App() {
  const [choices, setChoices] = useState([]);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [name, setName] = useState('');

  const getStatus = useSelector(state => state.get_status);
  const postStatus = useSelector(state => state.post_status);
  const desserts = useSelector(state => state.desserts) || [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.AIRTABLE_GET_REQUESTED,
    });
  }, [dispatch]);

  const handleClick = (dessert, isSelected) => {
    setErrorMessage(undefined);
    if (isSelected) {
      const newSelected = choices.filter(el => el !== dessert);
      setChoices(newSelected);
    } else if (choices.length >= 3) {
      setErrorMessage('You have already selected the maximum number of desserts');
    } else {
      setChoices([...choices, dessert]);
    }
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
              <div className="mb-2">
                {errorMessage}
              </div>
              <div className="d-flex flex-wrap">
                {desserts.map(dessert => {
                  const isSelected = choices.includes(dessert);
                  return (
                    <Button
                      key={dessert}
                      variant={isSelected ? 'secondary' : 'info'}
                      className="w-100 btnNoMax mb-2"
                      onClick={() => handleClick(dessert, isSelected)}
                    >
                      {dessert}
                    </Button>
                  );
                })}
              </div>
              <InputGroup className="mb-2 p-1">
                <FormControl
                  type="text"
                  defaultValue=""
                  placeholder="Enter your name"
                  aria-label="Enter your name"
                  onChange={e => setName(e.target.value)}
                />
              </InputGroup>
              <Button
                variant="primary"
                disabled={choices.length !== 3 || !name}
                onClick={() => {
                  setErrorMessage(undefined);
                  dispatch({
                    type: types.POST_DESSERT_DATA_REQUESTED,
                    name,
                    choices,
                  });
                }}
              >
                Save
              </Button>
              <div className="mb-2">
                {`Post Status: ${postStatus}`}
              </div>
            </Col>
          </Row>
        </div>
      </main>
    </Provider>
  );
}

export default App;
