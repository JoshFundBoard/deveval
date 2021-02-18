/* eslint-disable react/no-array-index-key */
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faFileUpload,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import Logo from './imgs/FundBoard_Logo.svg';
import store from './app/store';
import * as types from './app/actionTypes';
import { capitalizeFirstLetter } from './app/utils';

library.add(
  fab,
  faExclamationTriangle,
  faFileUpload,
  faSave,
);

function App() {
  const [selectedDesserts, setSelectedDesserts] = useState({});
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const getStatus = useSelector(state => state.get_status);
  const postStatus = useSelector(state => state.post_status);
  const desserts = useSelector(state => state.desserts) || [];
  console.log(desserts); // just here so eslint doesn't complain. And handy for debugging.

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.AIRTABLE_GET_REQUESTED,
    });
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => setError(''), 5000);
    return () => { clearTimeout(timer); };
  }, [error]);

  const onClickDesserts = ({ target: { value } }, key) => {
    if (selectedDesserts[key]) {
      const { [key]: _, ...rest } = selectedDesserts;
      setSelectedDesserts(rest);
      setError('');
    } else if (Object.keys(selectedDesserts).length < 3) {
      setSelectedDesserts({ ...selectedDesserts, [key]: value });
      setError('');
    } else {
      setError('You can only select up to 3 choices.');
    }
  };

  const onSubmit = () => {
    dispatch({
      type: types.POST_CHOICES_REQUESTED,
      payload: { name, choices: Object.values(selectedDesserts) },
    });
  };

  const requestState = status => {
    switch (status) {
      case 'pending': return {
        color: 'secondary', icon: faFileUpload,
      };
      case 'succeeded': return {
        color: 'success', icon: faSave,
      };
      default: return { color: 'danger', icon: faExclamationTriangle };
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
              {error && (
              <div className="mb-2 text-danger">
                {error}
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
              )}
              <div className="d-flex flex-wrap">
                {desserts.sort().map((dessert, key) => (
                  dessert && (
                  <Button
                    key={key}
                    value={dessert}
                    variant={selectedDesserts[key] ? 'secondary' : 'info'}
                    className="w-100 btnNoMax mb-2"
                    onClick={e => onClickDesserts(e, key)}
                  >
                    {capitalizeFirstLetter(dessert)}
                  </Button>
                  )
                ))}
              </div>
              <InputGroup className="mb-2 p-1">
                <FormControl
                  type="text"
                  value={name}
                  placeholder="Enter your name"
                  aria-label="Enter your name"
                  onChange={({ target: { value } }) => { setName(value); setError(''); }}
                />
              </InputGroup>
              <div className="d-flex justify-content-between align-items-center">
                <Button variant="primary" onClick={onSubmit} disabled={postStatus === 'pending'}>
                  Save
                </Button>
                {postStatus && (
                <div className={`text-${requestState(postStatus).color}`}>
                  {`${postStatus} `}
                  <FontAwesomeIcon icon={requestState(postStatus).icon} />
                </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </main>
    </Provider>
  );
}

export default App;
