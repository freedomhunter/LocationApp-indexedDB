import React, { useState, useEffect } from 'react';
import { Button, Table, Container, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Dexie from "dexie";
import Pagination from "react-js-pagination";

import LocationForm from './component/locationForm';
import Nodata from './component/noData';

function App() {
  const db = new Dexie("Location");
  db.version(1).stores({
    user: "locationName, city, phoneNumber"
  })

  const [locationData, setLocationData] = useState([]);
  const [modal, setModal] = useState(false);
  const [activePage, setPage] = useState(1);
  const [updateModal, setUpdateModal] = useState(false);
  const [updateValue, setUpdateValue] = useState('');
  const [updateCity, setCity] = useState('');
  const [updateNumber, setNumber] = useState('');

  useEffect(() => {
    db.open().then(async () => {
      let data = await db.user.toArray();
      setLocationData(data);
    }).catch((err) => {
      console.log(err.stack || err)
    })
  }, [])

  useEffect(() => {
    console.log('location data', locationData)
  }, [locationData])

  const toggle = () => {
    setModal(!modal)
  }

  const usFormat = () => {
    var cleaned = ('' + updateNumber).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      setNumber('(' + match[1] + ') ' + match[2] + '-' + match[3]);
    }
    else alert('enter valid number');
  }


  const handlePageChange = (pagenumber) => {
    setPage(pagenumber);
  }

  const addData = (data) => {
    setLocationData(data);
    setModal(!modal);
  }

  const updateData = (name) => {
    if (name) {
      setUpdateValue(name);
    }
    if (updateValue !== '' && updateNumber !== '' && updateCity !== '') {
      let user = {
        city: updateCity,
        phoneNumber: updateNumber
      }
      db.user.update(updateValue, user)
        .then(async () => {
          let data = await db.user.toArray()
          setLocationData(data);
        })
        .catch(err => console.error(err))
    }
    setUpdateModal(!updateModal)
  }

  const deleteData = async (key) => {
    db.user.delete(key);
    let alldata = await db.user.toArray();
    setLocationData(alldata);
  }

  return (
    <div className="d-flex flex-column">
      <div className="fade-color d-flex justify-content-between w-100 p-3">
        <h4>Location</h4>
        <Button color="primary" className="addsBtn" onClick={toggle}>+ Add Location</Button>
      </div>
      {
        locationData.length === 0 ? <Nodata /> :
          <Container className="mt-3">
            <Table className="dashboard-table">
              <thead>
                <tr>
                  <th className="flexdot4">#</th>
                  <th>Location Name</th>
                  <th>City</th>
                  <th>Phone No.</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {
                  locationData.map((item, i) =>
                    <tr key={i}>
                      <td className="flexdot4"><span className="tableId">{i + 1}</span></td>
                      <td>{item.locationName}</td>
                      <td>{item.city}</td>
                      <td>{item.phoneNumber}</td>
                      <td>
                        <div className="d-flex justify-content-around">
                          <i className="fas fa-edit light-blue" onClick={updateData.bind(this, item.locationName)} />
                          <i className="far fa-trash-alt color-red" onClick={deleteData.bind(this, item.locationName)} />
                        </div>
                      </td>
                    </tr>)
                }
              </tbody>
            </Table>
            <div className="d-flex justify-content-center">
              <Pagination
                activePage={activePage}
                itemsCountPerPage={5}
                totalItemsCount={locationData.length}
                pageRangeDisplayed={3}
                onChange={handlePageChange}
              />
              <small className="fade-color align-self-center">Total data: {locationData.length}</small>
            </div>
          </Container>
      }
      
      <LocationForm modal={modal} toggle={toggle} addData={addData} />

      <Modal isOpen={updateModal}>
        <ModalHeader className="align-self-center">Enter New Details</ModalHeader>
        <ModalBody className="w-50 m-auto">
          <Form>
            <FormGroup>
              <Label>Enter City</Label>
              <Input type="text" value={updateCity} onChange={e => setCity(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Enter Number</Label>
              <Input type="text" value={updateNumber} onChange={e => setNumber(e.target.value)} onBlur={usFormat} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="primary" onClick={updateData.bind(this)}>Save</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}


export default App;
