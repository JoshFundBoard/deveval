import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
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
import { postChoices } from './app/sagas';

library.add(fab, faExclamationTriangle, faFileUpload, faSave);

function App() {
  const getStatus = useSelector(state => state.get_status);
  const desserts = useSelector(state => state.desserts) || [];
  const name = useSelector(state => state.name) || '';
  console.log(desserts); // just here so eslint doesn't complain. And handy for debugging.

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.AIRTABLE_GET_REQUESTED,
    });
  }, [dispatch]);

  const [selected, setSelected] = useState([]);
  const [alertStatus, setAlertStatus] = useState(null);

  const addToSelected = validDessert => {
    if (selected.length <= 2 && !selected.includes(validDessert)) {
      setSelected([...selected, validDessert]);
    } else if (selected.length >= 3) {
      setAlertStatus({
        success: false,
        message: 'Too many desserts selected.',
      });
    }
  };
  console.log(selected);

  const validDesserts = desserts
    .filter(dessert => dessert !== undefined)
    .sort();

  const buttonList = validDesserts.map(validDessert => (
    <div className="container p-0">
      <ul className="list-group">
        <li key={validDessert.substring(0, 3)} className="list-group-item p-0 border-0">
          <Button
            onClick={() => addToSelected(validDessert)}
            variant={selected.includes(validDessert) ? 'secondary' : 'info'}
            className="w-100 btnNoMax mb-2 list-group-item"
          >
            {validDessert}
          </Button>
        </li>
      </ul>
    </div>
  ));

  const handleClick = () => {
    try {
      postChoices({
        name,
        choices: selected,
      });
      setAlertStatus({
        success: true,
        message: `${name} has submitted ${selected.join(', ')}`,
      });
    } catch (e) {
      setAlertStatus({
        success: false,
        message: e.message,
      });
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
            <Col md={{ span: 6, offset: 3 }}>
              <div className="mt-4 mb-2">
                <h1 className="text-center">Choose a Dessert</h1>
                <p className="text-center">Choose up to 3 desserts.</p>
              </div>
              {alertStatus && (
              <div className="container-xxs">
                <Alert className="button mt-3 mb-3 text-center display:inline-block" variant={alertStatus.success ? 'success' : 'danger'} dismissible onClose={() => setAlertStatus(null)}>{alertStatus.message}</Alert>
              </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <div className="mb-2">{`Get Status: ${getStatus}`}</div>
              <div className="d-flex flex-wrap">
                {buttonList}
              </div>
              <InputGroup className="mb-2 p-1">
                <FormControl
                  type="text"
                  value={name}
                  onChange={e => dispatch({ type: types.UPDATE_NAME, payload: e.target.value })}
                  placeholder="Enter your name"
                  aria-label="Enter your name"
                />
              </InputGroup>
              <Button onClick={handleClick} variant="primary">
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
