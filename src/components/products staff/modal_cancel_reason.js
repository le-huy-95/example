import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { UserContext } from "../../contexApi/UserContext"
import { toast } from 'react-toastify'
import { updateDeliveryInProject, createNotification } from "../services/ProjectService"
import moment from "moment"
import { NotificationContext } from "../../contexApi/NotificationContext"

const ModalCancelReason = (props) => {
    const { user } = React.useContext(UserContext);

    const { showModal, handleShowModal, dataCancel, dataAgain, action, fetchProjectUser, fetchProjectUserWithUsername } = props
    const [input, setInput] = useState("")
    const [Notification, setNotification] = useState("")
    const { list, getALlListNotification, listStaff } = React.useContext(NotificationContext);

    const complete = async () => {
        if (action === "Cancel") {

            // id, unitId, status_delivery, username, phone, text, textOne, Delivery_time, DeliveryDone_time
            let res = await updateDeliveryInProject(dataCancel.id, +user.account.shippingUnit_Id, 3, user.account.username, user.account.phone, input, "", dataCancel.Delivery_time, new Date(), Notification)
            if (res && +res.EC === 0) {
                let abc = await createNotification(dataCancel.id, dataCancel.order, "đơn hàng hủy giao", `${user.account.username}-${user.account.phone}`, dataCancel.createdBy, 0, 1, dataCancel.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUserWithUsername()
                    await fetchProjectUser()
                    handleShowModal()
                    setInput("")
                    if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupWithRound?.name === "Dev") {
                        await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                    }
                }
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
        if (action === "Again") {
            let res = await updateDeliveryInProject(dataAgain.id, +user.account.shippingUnit_Id, 1, user.account.username, user.account.phone, "", input, dataAgain.Delivery_time, "")
            if (res && +res.EC === 0) {
                let abc = await createNotification(dataAgain.id, dataAgain.order, "đơn hàng giao lại", `${user.account.username}-${user.account.phone}`, dataAgain.createdBy, 0, 1, dataAgain.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUserWithUsername()
                    await fetchProjectUser()
                    handleShowModal()
                    setInput("")
                    if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupWithRound?.name === "Dev") {
                        await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                    }
                }

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
    }
    useEffect(() => {
        setNotification(`Sản phẩm đã mang về kho ${dataCancel?.Address_District?.name}, ${dataCancel?.Address_Province?.name} ,
        quý khách vui lòng qua kho lấy sản phẩm và đóng tiền ship ${dataCancel?.shipping_Cost}-${dataCancel?.unit_money} ,
         phí lưu kho là 10000-${dataCancel?.unit_money}/ngày 
         tiền kho tính từ ngày ${moment(moment().add(1, 'days')).format("DD/MM/YYYY ")
            }
         `)
    }, [showModal])

    return (
        <>
            <Modal show={showModal} onHide={handleShowModal} animation={false} size='l' >
                <Modal.Header closeButton>
                    <Modal.Title> {action === "Cancel" ? "Lý do giao hàng thất bại" : "Lý do giao lại"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex align-item-center ' style={{ fontSize: "20px" }}>
                        <input type="text"
                            placeholder={action === "Cancel" ? "Lý do giao hàng thất bại" : "Lý do giao lại"}
                            className='form-control col-12'
                            onChange={(event) => setInput(event.target.value)}
                            value={input}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleShowModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => complete()}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    );
}

export default ModalCancelReason;