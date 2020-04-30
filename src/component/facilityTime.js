import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Input, Modal, ModalHeader, ModalBody } from 'reactstrap';

export default function FacilityTime(props) {

    const [days, setDays] = useState({
        Sun: { from: '', to: '' },
        Mon: { from: '', to: '' },
        Tue: { from: '', to: '' },
        Wed: { from: '', to: '' },
        Thur: { from: '', to: '' },
        Fri: { from: '', to: '' },
        Sat: { from: '', to: '' }
    })

    const [checkBox, setCheckbox] = useState([]);

    const valueEnter = (value, key, e) => {
        let obj = days;
        obj[value][key] = e.target.value;
        setDays(obj);
    }

    function readCheckbox(item) {
        const arr = checkBox;
        if (!checkBox.includes(item)) {
            arr.push(item);
            setCheckbox(arr)
        } else {
            const index = arr.indexOf(item);
            arr.splice(index, 1);
            setCheckbox(arr)
        }
    }

    const setTimeFormat = (value, key, e) => {
        let obj = days;
        let time = e.target.value;
        if (time.includes(':')) {
            let colonIndex = time.indexOf(':');
            let hour = time.slice(0, colonIndex);
            if (hour > 12 && hour < 24) {
                time = (hour - 12) + time.slice(colonIndex, time.length)
                obj[value][key] = time;
                document.getElementById(value + key).value = time;
                setDays(obj);
            } else if (hour > 24) {
                alert('invalid Format');
            }
        } else {alert('invalid format')}
    }

    function clickme() {
        if (checkBox.length > 1) {
            let from, to;
            checkBox.forEach(item => {
                if (days[item]['from'] !== '' && days[item]['to'] !== '') {
                    from = days[item]['from'];
                    to = days[item]['to'];
                }
            })
            if(from && to) {
                checkBox.forEach(item => {
                    let obj = days;
                    obj[item]['from'] = from;
                    obj[item]['to'] = to;
                    document.getElementById(item + 'from').value = from;
                    document.getElementById(item + 'to').value = to;
                    setDays(obj);
                })
            } else {alert('fields missing')}
        }
    }

    useEffect(() => {
        console.log('state values after edit object', days)
    }, [days])

    return (
        <Modal isOpen={props.facilityModal}>
            <ModalHeader toggle={props.facilityTimeModal} className="b-0">Facility Time</ModalHeader>
            <ModalBody>
                <table className="flexTable">
                    <thead>
                        <tr className="mb-2">
                            <th className="flexdot4" />
                            <th className="fw400 fs-dot9">From</th>
                            <th className="fw400 fs-dot9">To</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(days).map((item, i) => <tr key={i} className="mb-3">
                                <td className="flexdot4 align-self-center">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input" id={"customCheck" + i} name="example1" onChange={readCheckbox.bind(this, item)} />
                                        <label className="custom-control-label" htmlFor={"customCheck" + i}>{item}</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex">
                                        <Input id={item + 'from'} className="mr-1 h100" placeholder="hh:mm" type="text" onChange={valueEnter.bind(this, item, 'from')} onBlur={setTimeFormat.bind(this, item, 'from')} />
                                        <ButtonGroup>
                                            <Button type="button" size="sm" color="primary">AM</Button>
                                            <Button type="button" size="sm" color="secondary">PM</Button>
                                        </ButtonGroup>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex">
                                        <Input id={item + 'to'} className="mr-1 h100" placeholder="hh:mm" type="text" onChange={valueEnter.bind(this, item, 'to')} onBlur={setTimeFormat.bind(this, item, 'to')} />
                                        <ButtonGroup>
                                            <Button type="button" size="sm" color="secondary">AM</Button>
                                            <Button type="button" size="sm" color="primary">PM</Button>
                                        </ButtonGroup>
                                    </div>
                                </td>
                                <td><Button outline color="primary" size="sm" onClick={clickme}>Apply to All Checked</Button></td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>
            </ModalBody>
        </Modal>
    )
}