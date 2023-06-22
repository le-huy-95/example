import React, { useState } from 'react';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './notification-create-success.js.scss'
import { Link, NavLink, useHistory } from "react-router-dom"
import { FindUserWithphone } from "../services/userService"
import { UserContext } from "../../contexApi/UserContext"
import { assignProfectIdAndUserId } from "../services/ProjectService"

const NotificationSuccessModal = (props) => {
    const { showNotificationCreateSuccess, handleShowNotificationCreateSuccess, projectId, productAfterCreate } = props
    let history = useHistory()
    const { user } = React.useContext(UserContext);

    let id = productAfterCreate.id
    const handleViewProduct = (id) => {

        history.push(`/detailProduct/${id}`)
    }
    const handleSaveUserIdAndProjectid = async () => {
        console.log("user.account.phone", user.account.phone)
        let datafind = await FindUserWithphone(user.account.phone)
        if (datafind && +datafind.EC === 0) {
            let userId = datafind.DT.id
            await assignProfectIdAndUserId(+projectId, +userId)
        }
    }





    return (
        <>


            <Modal show={showNotificationCreateSuccess}
                onHide={handleShowNotificationCreateSuccess}
                centered
                size="xl"

            >

                <Modal.Body>
                    <div className='container-modal'>
                        <div className='container'>
                            <div className='d-flex  flex-column my-3 '>
                                <div className='row'>

                                    <div className='d-flex align-item-center justify-content-center my-3 image-item'>
                                        <img src="https://tranthinhlam.com/wp-content/uploads/2019/09/icon-tick-xanh-fb.png"
                                            alt=""

                                        />
                                    </div>
                                    <h2 className='d-flex align-item-center justify-content-center '>
                                        Tạo đơn thành công
                                    </h2>
                                    <span className='d-flex align-item-center justify-content-center my-3'>Đơn vị Vận chuyển { } sẽ sớm liên hệ với quý khách để lấy hàng </span>

                                    <div className='row d-flex align-item-center justify-content-center button'>
                                        <button className='btn btn-primary col-4' onClick={() => { handleShowNotificationCreateSuccess(); handleSaveUserIdAndProjectid() }}> Quay lại</button>
                                        <div className='col-1'></div>
                                        <button className='btn btn-primary col-4' onClick={() => { handleViewProduct(id); handleSaveUserIdAndProjectid() }}> Xem chi tiết đơn hàng </button>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

            </Modal >
        </>
    );
}
export default NotificationSuccessModal
