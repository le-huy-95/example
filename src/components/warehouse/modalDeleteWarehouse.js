import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useImmer } from "use-immer";
import { UserContext } from "../../contexApi/UserContext"
import { updateWarehouse } from "../services/ProjectService"
import { NotificationContext } from "../../contexApi/NotificationContext"

const ModalDeleteWarehouse = (props) => {
    const { showModalDeleteWarehouse, handleShowhideModalDelteWarehouse, dataWarehouseDelete, fetchProjectUser, action } = props;
    const { user } = React.useContext(UserContext);
    const { list, getALlListNotification, listStaff } = React.useContext(NotificationContext);

    const [listdata, setListdata] = useImmer({
        id: "",
        image: "",
        Product: "",
        Product_Prince: "",
        Number: "",
        Suppliers: "",
        Suppliers_address: "",
        Suppliers_phone: "",
        product_statusId: "",
        createdBy: user.account.phone
    })
    const handleDelete = async () => {
        setListdata(draft => {

            draft.product_statusId = 3;

        })
        let res = await updateWarehouse(listdata)

        if (res && +res.EC === 0) {
            window.location.reload()
            await fetchProjectUser()
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
            handleShowhideModalDelteWarehouse()

        } else {
            toast.error(res.EM)
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }

        }
    }

    useEffect(() => {
        if (action === "Delete" && dataWarehouseDelete) {


            setListdata(draft => {
                draft.id = dataWarehouseDelete.id
                draft.Product = dataWarehouseDelete.product;
                draft.Product_Prince = dataWarehouseDelete.product_cost;
                draft.Number = dataWarehouseDelete.product_number;
                draft.Suppliers = dataWarehouseDelete.Suppliers;
                draft.Suppliers_address = dataWarehouseDelete.Suppliers_address;
                draft.Suppliers_phone = dataWarehouseDelete.Suppliers_phone;
                draft.image = dataWarehouseDelete.image;
                draft.product_statusId = 3;

            })

        }
    }, [action])

    return (
        <>
            <Modal show={showModalDeleteWarehouse} onHide={handleShowhideModalDelteWarehouse} animation={false} size='l' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex align-item-center ' style={{ fontSize: "20px" }}>
                        Are you sure to delete product   <b>{dataWarehouseDelete?.product}</b>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleShowhideModalDelteWarehouse}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleDelete()}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    );
}

export default ModalDeleteWarehouse;