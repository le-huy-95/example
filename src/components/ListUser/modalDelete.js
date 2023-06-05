import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const ModalDelete = (props) => {
    const { show, handleCloseModal, dataModelDelete, handleDeleteUser } = props

    return (
        <>


            <Modal show={show} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title> Confirm Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, Are you sure to delete this user :<b>{dataModelDelete.email}</b> ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={show}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleDeleteUser()}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default ModalDelete