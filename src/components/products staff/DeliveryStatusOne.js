import './Delivery_staff.scss'

import SidebarStaff from "../sidebar/sidebar staff"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import { getDataSearchByEmplyer, updateDeliveryInProject, getDataSortByDelivery, getProjectWithPaginationWithEmployerDelivery_user, createNotification } from "../services/ProjectService"
import ReactPaginate from 'react-paginate';
import ModalChatWithCutomer from "./modalChatWithCutomer"
import { toast } from 'react-toastify'
import moment from "moment"
import _, { debounce } from "lodash"
import ModalCancelReason from "./modal_cancel_reason"

const DeliveryStatusOne = (props) => {
    let history = useHistory()
    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [isSearch, SetIsSearch] = useState(false)
    const [listProjectbyStaffDelivery, setListProjectbyStaffDelivey] = useState([])
    const [listProjectbyuserStaff, setListProjectbyuserStaff] = useState([])

    const [listProjectSearch, setListProjectSearch] = useState([])
    const [valueSearch, setvalueSearch] = useState("")
    const [showModal, SetshowModal] = useState(false)
    const [action, setAction] = useState(0)
    const [dataCancel, setDataCancel] = useState([])
    const [dataAgain, setDataAgain] = useState([])

    const handleShowModal = (item) => {
        SetshowModal(!showModal)
        setAction("Cancel")
        setDataCancel(item)
    }
    const handleShowModalAgain = (item) => {
        SetshowModal(!showModal)
        setAction("Again")
        setDataAgain(item)

    }

    const HandleSearchData = debounce(async (value) => {
        let data = value
        setvalueSearch(value)
        if (data) {
            SetIsSearch(true)
            let res = await getDataSearchByEmplyer(data, user.account.Position, +user.account.shippingUnit_Id)
            if (res && +res.EC === 0) {
                let data = res.DT.filter(item => item.statusDeliveryId === 1)

                setListProjectSearch(data)
            }

        } else {
            SetIsSearch(false)
            await fetchProjectUser()

        }

    }, 200)



    const complete = async (item) => {
        let res = await updateDeliveryInProject(item.id, +user.account.shippingUnit_Id, 2, user.account.username, user.account.phone, "", "", item.Delivery_time, new Date(), "")
        if (res && +res.EC === 0) {
            let abc = await createNotification(item.id, item.order, "đơn hàng giao xong", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 0, item.shippingUnit_Id)
            if (abc && +abc.EC === 0) {
                await fetchProjectUser()
            }
        } else {
            toast.error(res.EM)
        }
    }
    const updateDelivery = async (item) => {

        if (!item.User_Delivery && !item.Number_Delivery) {
            let res = await updateDeliveryInProject(item.id, +user.account.shippingUnit_Id, 1, user.account.username, user.account.phone, "", "", new Date(), "", "")
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "đơn hàng đang giao", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUser()
                    await HandleSearchData(valueSearch)
                }
            } else {
                toast.error(res.EM)
            }
        }
        if (item.User_Delivery && item.Number_Delivery) {

            let res = await updateDeliveryInProject(item.id, +user.account.shippingUnit_Id, 0, "", "", "", "", "", "")
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "đơn hàng trì hoãn giao", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUser()
                    await HandleSearchData(valueSearch)
                }

            } else {
                toast.error(res.EM)
            }
        }
    }

    const fetchProjectUser = async () => {

        let res = await getDataSortByDelivery(+user.account.shippingUnit_Id, 1)
        if (res && +res.EC === 0) {
            let data = res.DT.filter(item => item.Notice_Delivery === "")

            setListProjectbyStaffDelivey(data)
        }
    }
    const fetchProjectUserWithUsername = async () => {
        let res = await getProjectWithPaginationWithEmployerDelivery_user(+user.account.shippingUnit_Id, user.account.username, user.account.phone)
        if (res && +res.EC === 0) {

        } else {
            toast.error(res.EM)
        }

    }

    useEffect(() => {
        fetchProjectUser();


    }, [])
    return (
        <div className='employer-Delivery-container '>
            <div className='left-employer-Delivery  '>
                <SidebarStaff collapsed={collapsed} />

            </div>
            <div className='right-employer-Delivery  '>
                <div className='btn-toggle-employer-Delivery'>
                    <span onClick={() => setCollapsed(!collapsed)} className=" d-sm-block ">
                        {collapsed === false ?
                            <i className="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
                            :
                            <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>

                        }
                    </span>
                </div>
                <div className='right-body-employer-Delivery'>
                    <div className='container'>
                        <div className='header-employer-Delivery'>
                            <div className='location-path-employer-Delivery col'>
                                <Link to="/"> Home</Link>

                                <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                </span>
                                <Link to="/Delivery_staff">Delivery</Link>
                            </div>
                            <div className='col search-employer-Delivery'>
                                <div className='search-icon-employer-Delivery'>
                                    <i className="fa fa-search" aria-hidden="true"></i>

                                </div>
                                <input
                                    type="text"
                                    placeholder='Search infomation'
                                    onChange={(event) => HandleSearchData(event.target.value)}

                                />
                            </div>
                        </div>
                        <div className='body-employer-Delivery'>
                            <div className="container">
                                <div className='name-page-employer-Delivery'>
                                    <h4> List Delivery </h4>
                                    <div className='more-employer-pickup'>
                                        <b>{user?.account?.nameUnit?.NameUnit}</b>


                                    </div>
                                    <span>{user?.account?.Position}</span>

                                </div>
                                <div className='sort_Delivery my-3'>
                                    <div className='container my-3'>
                                        <div className='row mx-3'>
                                            <div className='col-3 content-Delivery' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Delivery_staff" style={{ textDecoration: "none", color: "#474141" }}>Tất cả đơn </Link>
                                            </div>

                                            <div className='col-3 content-Delivery' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Delivery_no_status" style={{ textDecoration: "none", color: "#474141" }}> Đơn chưa giao hàng </Link>
                                            </div>
                                            <div className='col-3 my-2 content-Delivery ' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}> Đơn đang giao hàng </div>

                                            <div className='col-3 content-Delivery' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Delivery_status_two" style={{ textDecoration: "none", color: "#474141" }}> Đơn đã giao hàng </Link>
                                            </div>
                                            <div className='col-3 content-Delivery' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Delivery_status_four" style={{ textDecoration: "none", color: "#474141" }}> Đơn giao lại </Link>
                                            </div>
                                            <div className='col-3 content-Delivery' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Delivery_status_three" style={{ textDecoration: "none", color: "#474141" }}> Đơn huỷ giao hàng </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {isSearch === false &&
                                    <div className='table-wrapper-employer-Delivery my-5'>
                                        <div className='container'>
                                            <div className='title-employer-Delivery my-3'>Tất cả đơn hàng ({listProjectbyStaffDelivery.length})</div>
                                            <hr />
                                            <div className='sub-title-employer-Delivery'>
                                                <div className='sub-left '>
                                                    <div className=' mx-3' style={{ color: "red" }}><i class="fa fa-flag" aria-hidden="true"></i>
                                                    </div>
                                                    <div className='NameColor'> Đơn gấp</div>

                                                </div>
                                                <div className='sub-title-employer-pickup-right ' >

                                                </div>

                                            </div>

                                            <table class="table table-bordered table-body-employer-Delivery">
                                                <thead>
                                                    <tr className='table-secondary' >
                                                        <th></th>
                                                        <th scope="col">Id</th>

                                                        <th scope="col">Mã đơn</th>
                                                        <th scope="col">Mặt hàng</th>
                                                        <th scope="col">Người nhận </th>
                                                        <th scope="col"> Số ĐT người nhận </th>
                                                        <th scope="col"> Trạng thái đơn hàng </th>

                                                        <th scope="col">Địa chỉ giao hàng </th>
                                                        <th scope="col"> Nhân viên giao hàng</th>
                                                        <th scope="col"> Số tiền phải thu</th>

                                                        <th scope="col">Thao tác</th>


                                                    </tr>
                                                </thead>
                                                {listProjectbyStaffDelivery && listProjectbyStaffDelivery.length > 0
                                                    ?
                                                    listProjectbyStaffDelivery.map((item, index) => {
                                                        return (
                                                            <tbody key={`item-${index}`}>

                                                                <tr >
                                                                    {item?.flag === true ?
                                                                        <td>
                                                                            <span style={{ fontSize: "20px", color: "red" }}>
                                                                                <i class="fa fa-flag" aria-hidden="true"></i>
                                                                            </span>
                                                                        </td>
                                                                        :
                                                                        <td></td>

                                                                    }

                                                                    <td>{item.id}</td>
                                                                    <td>{item.order}</td>
                                                                    <td> {item?.Warehouse?.product}</td>
                                                                    <td> {item?.name_customer}</td>
                                                                    <td> {item?.phoneNumber_customer}</td>
                                                                    <td>
                                                                        <span style={{ color: "red", fontWeight: "700" }}>
                                                                            {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "chưa giao hàng"}

                                                                        </span>
                                                                    </td>

                                                                    <td>{item.addressDetail},{item?.Ward_customer?.name},{item?.District_customer?.name},{item?.Province_customer?.name}  </td>
                                                                    <td>
                                                                        {item?.User_Delivery ? item?.User_Delivery : "chưa ai nhận đơn"}
                                                                        <br />
                                                                        {item?.Number_Delivery ? item?.Number_Delivery : ""}

                                                                    </td>
                                                                    <td>{item.totalWithShippingCost} VNĐ</td>
                                                                    {item.statusDeliveryId === 1 && item.User_Delivery === user.account.username && item.Number_Delivery === user.account.phone
                                                                        &&
                                                                        <td>

                                                                            <div className='d-flex align-item-center justify-content-center flex-column'>
                                                                                <button className='btn btn-success  ' onClick={() => complete(item)} >
                                                                                    thành công
                                                                                </button>
                                                                                <br />
                                                                                <button className='btn btn-danger  my-1' onClick={() => handleShowModal(item)}>
                                                                                    thất bại
                                                                                </button>
                                                                                <br />
                                                                                <button className='btn btn-primary my-1' onClick={() => handleShowModalAgain(item)}>
                                                                                    giao lại
                                                                                </button>
                                                                                <br />
                                                                                <button className='btn btn-warning ' onClick={() => updateDelivery(item)} >Hủy </button>

                                                                            </div>
                                                                        </td>

                                                                    }

                                                                </tr>
                                                            </tbody>
                                                        )
                                                    })
                                                    :
                                                    <tr class="table-danger">
                                                        <td colSpan={15}>
                                                            <div className='d-flex align-item-center justify-content-center'>

                                                                <h5> Đơn hàng  đã được xử lý hết và chưa phát sinh đơn hàng mới</h5>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                }


                                            </table>



                                        </div>


                                    </div>
                                }
                                {isSearch === true &&
                                    <div className='table-wrapper-employer-search my-5'>

                                        <div className='container'>
                                            <div className='title-employer-search my-3'>Kết quả tìm kiếm ({listProjectSearch.length})</div>
                                            <hr />
                                            <table class="table table-bordered table-body-employer-search">
                                                <thead>
                                                    <tr className='table-secondary'>
                                                        <th scope="col">Id</th>
                                                        <th scope="col">Mã đơn</th>
                                                        <th scope="col">Mặt hàng</th>
                                                        <th scope="col">Người nhận </th>
                                                        <th scope="col"> Số ĐT người nhận </th>
                                                        <th scope="col"> Trạng thái đơn hàng </th>

                                                        <th scope="col">Địa chỉ giao hàng </th>
                                                        <th scope="col"> Nhân viên giao hàng</th>
                                                        <th scope="col"> Số tiền phải thu</th>


                                                        <th scope="col">Thao tác</th>

                                                    </tr>
                                                </thead>
                                                {listProjectSearch && listProjectSearch.length > 0
                                                    ?

                                                    listProjectSearch.map((item, index) => {
                                                        return (
                                                            <tbody key={`item-${index}`}>

                                                                <tr>

                                                                    <td>{item.id}</td>
                                                                    <td>{item.order}</td>
                                                                    <td> {item?.Warehouse?.product}</td>
                                                                    <td> {item?.name_customer}</td>
                                                                    <td> {item?.phoneNumber_customer}</td>
                                                                    <td>
                                                                        <span style={{ color: "red", fontWeight: "700" }}>
                                                                            {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "chưa giao hàng"}

                                                                        </span>
                                                                    </td>
                                                                    <td>{item.addressDetail},{item?.Ward_customer?.name},{item?.District_customer?.name},{item?.Province_customer?.name}  </td>
                                                                    <td>
                                                                        {item?.User_Delivery ? item?.User_Delivery : "chưa ai nhận đơn"}
                                                                        <br />
                                                                        {item?.Number_Delivery ? item?.Number_Delivery : ""}

                                                                    </td>
                                                                    <td>{item.totalWithShippingCost} VNĐ</td>
                                                                    {item.statusDeliveryId === 1 && item.User_Delivery === user.account.username && item.Number_Delivery === user.account.phone
                                                                        &&
                                                                        <td>

                                                                            <div className='d-flex align-item-center justify-content-center flex-column'>
                                                                                <button className='btn btn-success  ' onClick={() => complete(item)} >
                                                                                    thành công
                                                                                </button>
                                                                                <br />
                                                                                <button className='btn btn-danger  my-1' onClick={() => handleShowModal(item)}>
                                                                                    thất bại
                                                                                </button>
                                                                                <br />
                                                                                <button className='btn btn-primary my-1' onClick={() => handleShowModalAgain(item)}>
                                                                                    giao lại
                                                                                </button>
                                                                                <br />
                                                                                <button className='btn btn-warning ' onClick={() => updateDelivery(item)} >Hủy </button>

                                                                            </div>
                                                                        </td>

                                                                    }




                                                                </tr>
                                                            </tbody>
                                                        )

                                                    }


                                                    )
                                                    :
                                                    <tr class="table-danger">
                                                        <td colSpan={14}>
                                                            <div className='d-flex align-item-center justify-content-center'>

                                                                <h5> Không tìm thấy</h5>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                }

                                            </table>
                                        </div>


                                    </div>
                                }

                            </div>

                        </div>

                    </div>

                </div>


            </div >
            <ModalCancelReason
                showModal={showModal}
                handleShowModal={handleShowModal}
                dataCancel={dataCancel}
                dataAgain={dataAgain}
                action={action}
                fetchProjectUser={fetchProjectUser}
                fetchProjectUserWithUsername={fetchProjectUserWithUsername}
            />
        </div >




    )


}
export default DeliveryStatusOne;