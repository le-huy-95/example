import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteProject } from "../services/ProjectService"
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom"
import { getNumberProductinWarehouse, updateNumberProductInWarehouse } from "../services/ProjectService"

const DeleteProduct = (props) => {
    let history = useHistory()
    const [numberProduct, setNumberProduct] = useState("")

    const { showDeleteProduct, handleShowDeleteModal, ProductId, order, projects } = props



    const handleDeleteModal = async () => {
        let res = await getNumberProductinWarehouse(+projects.ProductId)
        if (res && +res.EC === 0) {
            let resOne = await updateNumberProductInWarehouse(+projects.ProductId, +res.DT?.product_number + +projects.quantity)
            if (resOne && +resOne.EC === 0) {


                let resTwo = await deleteProject(projects.id)
                if (resTwo && +resTwo.EC === 0) {
                    history.push("/Products")
                    toast.success(resTwo.EM)
                } else {
                    toast.error(resTwo.EM)
                }
            }
        }

    }


    return (
        <>


            <Modal
                show={showDeleteProduct}
                onHide={
                    handleShowDeleteModal
                }
                backdrop="static"
                size="xl"

                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Project</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: "25px" }}>
                    Bạn có chắc chắn muốn xóa đơn hàng <b>{order}</b>  ????
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleShowDeleteModal()} >
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleDeleteModal(ProductId)}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteProduct 