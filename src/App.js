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

library.add(fab, faExclamationTriangle, faFileUpload, faSave);

function App() {
  const getStatus = useSelector(state => state.get_status);
  const desserts = useSelector(state => state.desserts) || [];
  console.log(desserts); // just here so eslint doesn't complain. And handy for debugging.

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.AIRTABLE_GET_REQUESTED,
    });
  }, [dispatch]);

  const [selected, setSelected] = useState([]);

  const addToSelected = validDessert => {
    setSelected([...selected, validDessert]);
  };
  console.log(selected);

  const validDesserts = desserts
    .filter(dessert => dessert !== undefined)
    .sort();

  const buttonList = validDesserts.map(validDessert => (
    <div className="container p-0">
      <ul className="list-group">
        <li key={validDessert.substring(0, 3)} className="list-group-item p-0">
          {console.log(validDessert.substring(0, 3))}
          <Button
            onClick={() => addToSelected(validDessert)}
            variant={selected ? 'info' : 'secondary'}
            className="w-100 btnNoMax mb-2 list-group-item"
          >
            {validDessert}
          </Button>
        </li>
      </ul>
    </div>
  ));

  const selectionLength = selected.length > 3;

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
                <h1 className="text-center">Choose a Dessert</h1>
                <p className="text-center">Choose up to 3 desserts.</p>
                <p className="text-center">{selectionLength ? 'You Have Already 3 Desserts' : `Please Select ${3 - selected.length} Desserts`}</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <div className="mb-2">{`Get Status: ${getStatus}`}</div>
              <div className="d-flex flex-wrap">
                {buttonList}
                <Button variant="secondary" className="w-100 btnNoMax mb-2">
                  Example selected button
                </Button>
              </div>
              <InputGroup className="mb-2 p-1">
                <FormControl
                  type="text"
                  value=""
                  placeholder="Enter your name"
                  aria-label="Enter your name"
                />
              </InputGroup>
              <Button variant="primary">Save</Button>
            </Col>
          </Row>
        </div>
      </main>
    </Provider>
  );
}

export default App;
