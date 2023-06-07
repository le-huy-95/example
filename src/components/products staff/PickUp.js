import './PickUp.scss'

import SidebarStaff from "../sidebar/sidebar staff"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import { getProjectWithPaginationWithEmployerPickUp, getProjectWithPaginationWithEmployerPickUp_user, updatePickupInProject, getDataSearchByEmplyer, createNotification } from "../services/ProjectService"
import ReactPaginate from 'react-paginate';
import ModalChatWithCutomer from "./modalChatWithCutomer"
import moment from "moment"
import { toast } from 'react-toastify'
import _, { debounce } from "lodash"

const Pickup = (props) => {
    let history = useHistory()
    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [listProjectbyStaffPickup, setListProjectbyStaffPickup] = useState([])
    const [listProjectbyuserStaff, setListProjectbyuserStaff] = useState([])
    const [listProjectSearch, setListProjectSearch] = useState([])
    const [isSearch, SetIsSearch] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [currentLimit, setCurrentLimit] = useState(5)
    const [isLoading, SetIsLoading] = useState(false)
    const [totalPage, setTotalPage] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [valueSearch, setvalueSearch] = useState("")

    const handleShowModal = () => {
        setShowModal(!showModal)
    }



    const HandleSearchData = debounce(async (value) => {
        let data = value
        setvalueSearch(value)

        if (data) {
            SetIsSearch(true)
            let res = await getDataSearchByEmplyer(data, user.account.Position, +user.account.shippingUnit_Id)
            if (res && +res.EC === 0) {
                setListProjectSearch(res.DT)
            }

        } else {
            SetIsSearch(false)
            await fetchProjectUserWithUsername()
            await fetchProjectUser()

        }

    }, 200)

    const updatePickup = async (item) => {
        if (!item.User_PickUp && !item.Number_PickUp) {
            let res = await updatePickupInProject(+user.account.shippingUnit_Id, item.id, user.account.username, user.account.phone, 1, new Date(), "")
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "đơn hàng đang lấy hàng", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUserWithUsername()
                    await fetchProjectUser()
                    await HandleSearchData(valueSearch)
                } else {
                    await fetchProjectUserWithUsername()
                    await fetchProjectUser()
                    await HandleSearchData(valueSearch)
                }



            } else {
                toast.error(res.EM)
            }
        }
        if (item.User_PickUp && item.Number_PickUp) {
            let res = await updatePickupInProject(+user.account.shippingUnit_Id, item.id, null, null, 0, "", "")
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "đơn hàng trì hoãn", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUserWithUsername()
                    await fetchProjectUser()
                    await HandleSearchData(valueSearch)
                } else {
                    await fetchProjectUserWithUsername()
                    await fetchProjectUser()
                    await HandleSearchData(valueSearch)
                }

            } else {
                toast.error(res.EM)
            }
        }

    }
    const completePickup = async (item) => {
        let res = await updatePickupInProject(+user.account.shippingUnit_Id, item.id, user.account.username, user.account.phone, 2, item.pickup_time, new Date())
        if (res && +res.EC === 0) {
            let abc = await createNotification(item.id, item.order, "đơn hàng đã lấy thành công", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 0, item.shippingUnit_Id)
            if (abc && +abc.EC === 0) {

                await fetchProjectUserWithUsername()
                await fetchProjectUser()
                await HandleSearchData(valueSearch)
            } else {
                await fetchProjectUserWithUsername()
                await fetchProjectUser()
                await HandleSearchData(valueSearch)
            }

        } else {
            toast.error(res.EM)
        }
    }


    const fetchProjectUserWithUsername = async () => {
        let res = await getProjectWithPaginationWithEmployerPickUp_user(+user.account.shippingUnit_Id, user.account.username, user.account.phone)
        if (res && +res.EC === 0) {
            setListProjectbyuserStaff(res.DT)
        } else {
            toast.error(res.EM)
        }

    }

    const fetchProjectUser = async () => {

        let res = await getProjectWithPaginationWithEmployerPickUp(currentPage, currentLimit, +user.account.shippingUnit_Id)
        if (res && +res.EC === 0) {
            setTotalPage(+res.DT.totalPage)
            if (res.DT.totalPage > 0 && res.DT.dataProject.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await getProjectWithPaginationWithEmployerPickUp(+res.DT.totalPage, currentLimit, +user.account.shippingUnit_Id)
            }
            if (res.DT.totalPage > 0 && res.DT.dataProject.length > 0) {
                let data = res.DT.dataProject

                if (data) {
                    setListProjectbyStaffPickup(data)
                }
            }
            if (res.DT.totalPage === 0 && res.DT.dataProject.length === 0) {
                let data = res.DT.dataProject
                setListProjectbyStaffPickup(data)

            }
        }
    }
    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1)
    }

    useEffect(() => {
        fetchProjectUser();
        fetchProjectUserWithUsername()
    }, [currentPage])
    return (
        <div className='employer-pickup-container '>
            <div className='left-employer-pickup  '>
                <SidebarStaff collapsed={collapsed} />

            </div>
            <div className='right-employer-pickup  '>
                <div className='btn-toggle-employer-pickup'>
                    <span onClick={() => setCollapsed(!collapsed)} className=" d-sm-block ">
                        {collapsed === false ?
                            <i className="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
                            :
                            <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>

                        }
                    </span>
                </div>
                <div className='right-body-employer-pickup'>
                    <div className='container'>
                        <div className='header-employer-pickup'>
                            <div className='location-path-employer-pickup col'>
                                <Link to="/"> Home</Link>

                                <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                </span>
                                <Link to="/Pickup_staff">Pick up</Link>
                            </div>
                            <div className='col search-employer-pickup'>
                                <div className='search-icon-employer-pickup'>
                                    <i className="fa fa-search" aria-hidden="true"></i>

                                </div>
                                <input
                                    type="text"
                                    placeholder='Search infomation'
                                    onChange={(event) => HandleSearchData(event.target.value)}

                                />
                            </div>
                        </div>
                        <div className='body-employer-pickup'>
                            <div className="container">
                                <div className='name-page-employer-pickup'>
                                    <h4> List Pick-up </h4>
                                    <div className='more-employer-pickup'>
                                        <b>{user?.account?.nameUnit?.NameUnit}</b>


                                    </div>
                                    <span>{user?.account?.Position}</span>
                                </div>
                                <div className='sort_pickup my-3'>
                                    <div className='container my-3'>
                                        <div className='row mx-3'>
                                            <div className='col-3 my-2 content-pickup ' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}> Tất cả đơn  </div>
                                            <div className='col-3 content-pickup' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Pick_up_no_status" style={{ textDecoration: "none", color: "#474141" }}>Đơn chưa lấy hàng </Link>
                                            </div>
                                            <div className='col-3 content-pickup' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Pick_up_status_one" style={{ textDecoration: "none", color: "#474141" }}> Đơn đang lấy hàng </Link>
                                            </div>
                                            <div className='col-3 content-pickup' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Pick_up_status_two" style={{ textDecoration: "none", color: "#474141" }}> Đơn đã lấy hàng </Link>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {isSearch === false &&
                                    <>
                                        <div className='table-wrapper-employer-pickup my-5'>
                                            <div className='container'>
                                                <div className='title-employer-pickup my-3'>Tất cả đơn hàng ({listProjectbyStaffPickup.length})</div>
                                                <hr />
                                                <div className='sub-title-employer-pickup'>
                                                    <div className='sub-left '>
                                                        <div className=' mx-3' style={{ color: "red" }}><i class="fa fa-flag" aria-hidden="true"></i>
                                                        </div>
                                                        <div className='NameColor'> Đơn gấp</div>

                                                    </div>
                                                    <div className='sub-title-employer-pickup-right ' >
                                                        < ReactPaginate
                                                            nextLabel="next >"
                                                            onPageChange={handlePageClick}
                                                            pageRangeDisplayed={2}
                                                            marginPagesDisplayed={3}
                                                            pageCount={totalPage}
                                                            previousLabel="< previous"
                                                            pageClassName="page-item"
                                                            pageLinkClassName="page-link"
                                                            previousClassName="page-item"
                                                            previousLinkClassName="page-link"
                                                            nextClassName="page-item"
                                                            nextLinkClassName="page-link"
                                                            breakLabel="..."
                                                            breakClassName="page-item"
                                                            breakLinkClassName="page-link"
                                                            containerClassName="pagination"
                                                            activeClassName="active"
                                                            renderOnZeroPageCount={null}
                                                            forcePage={+currentPage - 1}

                                                        />
                                                    </div>

                                                </div>
                                                <table class="table table-bordered table-body-employer-pickup">
                                                    <thead>
                                                        <tr className='table-secondary'>
                                                            <th scope="col"></th>

                                                            <th scope="col">No</th>
                                                            <th scope="col">Id</th>

                                                            <th scope="col">Mã đơn</th>
                                                            <th scope="col">Mặt hàng</th>
                                                            <th scope="col">Số lượng </th>
                                                            <th scope="col">Thời gian tạo</th>
                                                            <th scope="col">Trạng thái đơn hàng</th>

                                                            <th scope="col" style={{ width: "200px" }}>Địa chỉ lấy hàng</th>
                                                            <th scope="col" >Thời gian nhận đơn</th>
                                                            <th scope="col" >Thời gian Hoàn thành</th>
                                                            <th scope="col">Người nhận đơn</th>
                                                            {/* <th scope="col">Thời gian nhận đơn</th>
                                                            <th scope="col">Thời gian hoàn thành</th> */}

                                                            <th scope="col">Thao tác</th>


                                                        </tr>
                                                    </thead>
                                                    {listProjectbyStaffPickup && listProjectbyStaffPickup.length > 0
                                                        ?

                                                        listProjectbyStaffPickup.map((item, index) => {
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

                                                                        <td >{(currentPage - 1) * currentLimit + index + 1}</td>

                                                                        <td>{item.id}</td>
                                                                        <td>{item.order}</td>

                                                                        <td>
                                                                            {item?.Warehouse?.product}</td>
                                                                        <td>{item.quantity}</td>
                                                                        <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                                        <td>
                                                                            <span style={{ color: "red", fontWeight: "700" }}>
                                                                                {item?.Status_Pickup?.status ? item?.Status_Pickup?.status : "chưa lấy hàng"}
                                                                            </span>

                                                                        </td>
                                                                        <td>{item?.Detail_Place_of_receipt},{item?.Address_Ward.name},{item?.Address_District.name},{item?.Address_Province.name}</td>



                                                                        <td>{item?.pickup_time ? moment(`${item?.pickup_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        <td>{item?.pickupDone_time ? moment(`${item?.pickupDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        <td>
                                                                            {item?.User_PickUp ? item?.User_PickUp : "chưa ai nhận đơn"}
                                                                            -
                                                                            {item?.Number_PickUp ? item?.Number_PickUp : ""}

                                                                        </td>
                                                                        {!item?.User_PickUp &&
                                                                            <td>
                                                                                <button className='btn btn-danger' onClick={() => updatePickup(item)}> Nhận đơn</button>
                                                                            </td>
                                                                        }
                                                                        {+item?.statuspickupId === 1 &&
                                                                            <td>
                                                                                <button className='btn btn-info' > Đang lấy hàng</button>
                                                                            </td>
                                                                        }
                                                                        {+item?.statuspickupId === 2 &&
                                                                            <td>
                                                                                <button className='btn btn-success' > lấy hàng thành công</button>
                                                                            </td>
                                                                        }
                                                                    </tr>
                                                                </tbody>
                                                            )
                                                        })
                                                        :

                                                        <tr class="table-info">
                                                            <td colSpan={14}>
                                                                <div className='d-flex align-item-center justify-content-center'>

                                                                    <h5> Đơn hàng  đã được xử lý hết và chưa phát sinh đơn hàng mới</h5>

                                                                </div>

                                                            </td>

                                                        </tr>
                                                    }



                                                </table>
                                            </div>


                                        </div>
                                        <div className='table-wrapper-employer-pickup-One my-5'>
                                            <div className='container'>
                                                <div className='title-employer-pickup-One my-3'>Đơn bạn đã nhận ({listProjectbyuserStaff.length})</div>
                                                <hr />
                                                <table class="table table-bordered table-body-employer-pickup-One">
                                                    <thead>
                                                        <tr className='table-secondary'>

                                                            <th scope="col"></th>
                                                            <th scope="col">Id</th>

                                                            <th scope="col">Mã đơn</th>
                                                            <th scope="col">Mặt hàng</th>
                                                            <th scope="col">Số lượng </th>
                                                            <th scope="col">Thời gian tạo</th>
                                                            <th scope="col">Trạng thái đơn hàng</th>

                                                            <th scope="col" style={{ width: "200px" }}>Địa chỉ lấy hàng</th>
                                                            <th scope="col" >Thời gian nhận đơn</th>
                                                            <th scope="col" >Thời gian Hoàn thành</th>

                                                            <th scope="col">Người nhận đơn</th>

                                                            <th scope="col">Thao tác</th>


                                                        </tr>
                                                    </thead>
                                                    {listProjectbyuserStaff && listProjectbyuserStaff.length > 0
                                                        ?

                                                        listProjectbyuserStaff.map((item, index) => {
                                                            return (
                                                                <tbody key={`item-${index}`}>

                                                                    <tr class="table-primary">
                                                                        {item?.flag === 1 ?
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
                                                                        <td>{item.quantity}</td>
                                                                        <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                                        <td>
                                                                            {item?.Status_Pickup?.status ? item?.Status_Pickup?.status : "chưa lấy hàng"}
                                                                        </td>
                                                                        <td>{item?.Detail_Place_of_receipt},{item?.Address_Ward.name},{item?.Address_District.name},{item?.Address_Province.name}</td>
                                                                        <td>{item?.pickup_time ? moment(`${item?.pickup_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        <td>{item?.pickupDone_time ? moment(`${item?.pickupDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>

                                                                        <td> {item?.User_PickUp ? item?.User_PickUp : "chưa ai nhận đơn"}- {item?.Number_PickUp ? item?.Number_PickUp : "0"}</td>
                                                                        {item?.statuspickupId === 1 ?

                                                                            <td>
                                                                                <button className='btn btn-info mx-3 my-1' onClick={() => completePickup(item)}> Hoàn thành</button>
                                                                                <br />
                                                                                <button className='btn btn-warning mx-3 my-1' onClick={() => updatePickup(item)}>Hủy nhận đơn</button>

                                                                            </td>
                                                                            :
                                                                            <td>
                                                                                <button className='btn btn-success mx-3 my-1' > Đã hoàn thành</button>

                                                                            </td>
                                                                        }
                                                                    </tr>
                                                                </tbody>
                                                            )
                                                        })
                                                        :

                                                        <tr class="table-info">
                                                            <td colSpan={14}>
                                                                <div className='d-flex align-item-center justify-content-center'>

                                                                    <h5> Bạn chưa nhận đơn hàng nào</h5>

                                                                </div>

                                                            </td>

                                                        </tr>
                                                    }



                                                </table>
                                            </div>


                                        </div>
                                    </>
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
                                                        <th scope="col">Số lượng </th>
                                                        <th scope="col">Thời gian tạo</th>
                                                        <th scope="col">Trạng thái đơn hàng</th>

                                                        <th scope="col" style={{ width: "200px" }}>Địa chỉ lấy hàng</th>
                                                        <th scope="col" >Thời gian nhận đơn</th>
                                                        <th scope="col" >Thời gian Hoàn thành</th>

                                                        <th scope="col">Người nhận đơn</th>

                                                        <th scope="col">Thao tác</th>

                                                    </tr>
                                                </thead>
                                                {listProjectSearch && listProjectSearch.length > 0
                                                    ?

                                                    listProjectSearch.map((item, index) => {
                                                        return (
                                                            <tbody key={`item-${index}`}>

                                                                <tr class="table-primary">

                                                                    <td>{item.id}</td>
                                                                    <td>{item.order}</td>
                                                                    <td> {item?.Warehouse?.product}</td>
                                                                    <td>{item.quantity}</td>
                                                                    <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                                    <td>
                                                                        {item?.Status_Pickup?.status ? item?.Status_Pickup?.status : "chưa lấy hàng"}
                                                                    </td>
                                                                    <td>{item?.Detail_Place_of_receipt},{item?.Address_Ward.name},{item?.Address_District.name},{item?.Address_Province.name}</td>
                                                                    <td>{item?.pickup_time ? moment(`${item?.pickup_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                    <td>{item?.pickupDone_time ? moment(`${item?.pickupDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>

                                                                    <td> {item?.User_PickUp ? item?.User_PickUp : "chưa ai nhận đơn"}- {item?.Number_PickUp ? item?.Number_PickUp : "0"}</td>
                                                                    {!item?.User_PickUp &&
                                                                        <td>
                                                                            <button className='btn btn-danger' onClick={() => updatePickup(item)}> Nhận đơn</button>
                                                                        </td>
                                                                    }
                                                                    {item?.statuspickupId === 1 &&

                                                                        <td>
                                                                            <button className='btn btn-info mx-3 my-1' onClick={() => completePickup(item)}> Hoàn thành</button>
                                                                            <br />
                                                                            <button className='btn btn-warning mx-3 my-1' onClick={() => updatePickup(item)}>Hủy nhận đơn</button>

                                                                        </td>

                                                                    }
                                                                    {+item?.statuspickupId === 2 &&
                                                                        <td>
                                                                            <button className='btn btn-success' > lấy hàng thành công</button>
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

                <ModalChatWithCutomer
                    showModal={showModal}
                    handleShowModal={handleShowModal}
                />
            </div >

        </div >




    )


}

export default Pickup;