import React, { useState } from 'react';
import { Button, Col, Row, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import TagsInput from 'react-tagsinput'
import Dexie from "dexie";

import FacilityTime from './facilityTime';

export default function LocationForm(props) {

    const db = new Dexie("Location");
    db.version(1).stores({
        user: "locationName, city, phoneNumber"
    })
    db.open().catch((err) => {
        console.log(err.stack || err)
    })

    const [number, setNumber] = useState('');
    const [tags, setTags] = useState([]);
    const [locationName, setLocation] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [timezone, setTimezone] = useState('');
    const [facilityModal, setFacilityModal] = useState(false);

    const facilityTimeModal = () => {
        setFacilityModal(!facilityModal)
    }

    const usFormat = () => {
        var cleaned = ('' + number).replace(/\D/g, '')
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
        if (match) {
            setNumber('(' + match[1] + ') ' + match[2] + '-' + match[3]);
        }
        else alert('enter valid number');
    }

    const saveData = (e) => {
        e.preventDefault();
        if (locationName !== "" && city !== "" && number !== "") {
            let user = {
                locationName: locationName,
                city: city,
                phoneNumber: number
            }
            db.user.add(user)
                .then(async () => {
                    let data = await db.user.toArray();
                    props.addData(data);
                    setTags([]);
                    setCity('');
                    setState('');
                    setZipcode('');
                    setTimezone('');
                    setNumber('');
                    setLocation('');
                })
                .catch(err => console.error(err))

        } else { alert('Fill required fields !!') }
    }

    return (
        <div>
            <Modal isOpen={props.modal} className="formModal">
                <ModalHeader className="b-0">Add Location</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Location Name *</Label>
                            <Input type="text" value={locationName} onChange={e => setLocation(e.target.value)} />
                        </FormGroup>

                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>City *</Label>
                                    <Input type="text" value={city} onChange={e => setCity(e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label>State</Label>
                                    <UncontrolledDropdown setActiveFromChild>
                                        <DropdownToggle tag="a" className="nav-link dropdownBtn" caret>
                                            {state !== '' ? state : 'Select'}
                                        </DropdownToggle>
                                        <DropdownMenu onClick={e => setState(e.target.value)}>
                                            <DropdownItem value="Option1">Option 1</DropdownItem>
                                            <DropdownItem value="Option 2">Option 2</DropdownItem>
                                            <DropdownItem value="Option 3">Option 3</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <FormGroup>
                                    <Label>Zip Code</Label>
                                    <Input type="text" value={zipcode} onChange={e => setZipcode(e.target.value)} onBlur={e => setZipcode(e.target.value.split(" ").join(""))} />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Time Zone</Label>
                                    <UncontrolledDropdown setActiveFromChild>
                                        <DropdownToggle tag="a" className="nav-link dropdownBtn" caret>
                                            {timezone !== '' ? timezone : 'Select'}
                                        </DropdownToggle>
                                        <DropdownMenu onClick={e => setTimezone(e.target.value)}>
                                            <DropdownItem value="Option1">Option 1</DropdownItem>
                                            <DropdownItem value="Option 2">Option 2</DropdownItem>
                                            <DropdownItem value="Option 3">Option 3</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Phone Number *</Label>
                                    <Input type="text" value={number} onChange={e => setNumber(e.target.value)} onBlur={usFormat} />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Facility Times</Label>
                                    <Input type="text" placeholder="Click to open" onClick={facilityTimeModal} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Appointment Pool</Label>
                                    <TagsInput value={tags} onChange={e => setTags(e)} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>

                <ModalFooter className="b-0">
                    <Button color="danger" onClick={props.toggle}>Cancel</Button>
                    <Button color="info" onClick={saveData}>Save</Button>
                </ModalFooter>
            </Modal>
            <FacilityTime facilityModal={facilityModal} facilityTimeModal={facilityTimeModal} />
        </div>
    )
}