import './manageproducts.scss'

import SidebarStaff from "../sidebar/sidebar staff"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import {
    getProjectWithPaginationWithEmployer, updateFlagInProject,
    getAllStatusProductWithEmployer, getDataSearchByEmplyer, createNotification
} from "../services/ProjectService"
import ReactPaginate from 'react-paginate';
import ModalChatWithCutomer from "./modalChatWithCutomer"
import moment from "moment"
import { toast } from 'react-toastify'
import _, { debounce } from "lodash"
const Manageproducts = (props) => {
    let history = useHistory()
    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [listProjectbyUnit, setListProjectbyUnit] = useState([])
    const [listProjectbyUnitLenght, setListProjectbyUnitLenghtt] = useState([])
    const [listProjectSearch, setListProjectSearch] = useState([])


    const [currentPage, setCurrentPage] = useState(
        localStorage.getItem("infomation Page employer") ? localStorage.getItem("infomation Page employer") : 1

    )
    const [currentLimit, setCurrentLimit] = useState(7)
    const [isSearch, SetIsSearch] = useState(false)
    const [totalPage, setTotalPage] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [dataChatOne, setDataChatOnet] = useState([])
    const [dataNumber, setdataNumber] = useState([])

    const handleShowModal = (item) => {
        setShowModal(!showModal)
        setDataChatOnet(item)
    }

    const HandleSearchData = debounce(async (value) => {
        let data = value
        if (data) {
            SetIsSearch(true)
            let res = await getDataSearchByEmplyer(data, "", +user.account.shippingUnit_Id)
            if (res && +res.EC === 0) {
                setListProjectSearch(res.DT)
            }

        } else {
            SetIsSearch(false)
            await fetchAllNumberProject()

        }

    }, 200)


    const fetchAllNumberProject = async () => {
        let res = await getAllStatusProductWithEmployer(+user.account.shippingUnit_Id)
        if (res && +res.EC === 0) {
            setdataNumber(res.DT[0])
        } else {
            toast.error(res.EM)
        }

    }
    const updateFlag = async (item) => {
        if (item.flag == 1) {
            let res = await updateFlagInProject(item.id, +user.account.shippingUnit_Id, 0)
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "nhân viên chuyển trạng tái sang bình thường", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUser()
                }
            } else {
                toast.error(res.EM)
            }
        }
        if (item.flag == 0) {
            let res = await updateFlagInProject(item.id, +user.account.shippingUnit_Id, 1)
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "nhân viên chuyển trạng tái sang gấp", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUser()
                }
            } else {
                toast.error(res.EM)
            }
        }

    }


    const fetchProjectUser = async () => {

        let res = await getProjectWithPaginationWithEmployer(currentPage, currentLimit, +user.account.shippingUnit_Id
        )
        if (res && +res.EC === 0) {
            setTotalPage(+res.DT.totalPage)
            if (res.DT.totalPage > 0 && res.DT.dataProject.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await getProjectWithPaginationWithEmployer(+res.DT.totalPage, currentLimit, +user.account.shippingUnit_Id
                )
            }
            if (res.DT.totalPage > 0 && res.DT.dataProject.length > 0) {
                let data = res.DT.dataProject
                console.log("data", data)
                if (data) {
                    setListProjectbyUnitLenghtt(res.DT.totalProject)
                    setListProjectbyUnit(data)

                }
            }
            if (res.DT.totalPage === 0 && res.DT.dataProject.length === 0) {
                let data = res.DT.dataProject
                setListProjectbyUnitLenghtt(res.DT.totalProject)

                setListProjectbyUnit(data)

            }
        }
    }
    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1)
        localStorage.setItem("infomation Page employer", +event.selected + 1)
    }


    useEffect(() => {
        fetchProjectUser();
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('page', currentPage);
        currentUrlParams.set("limit", currentLimit);

        history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }, [currentPage])
    const fetchProjectUserAfterRefesh = async () => {
        let currentPagelocalStorage = +localStorage.getItem("infomation Page employer")
        let res = await getProjectWithPaginationWithEmployer(+currentPagelocalStorage, currentLimit, +user.account.shippingUnit_Id
        )
        if (res && +res.EC === 0) {
            setTotalPage(+res.DT.totalPage)
            if (res.DT.totalPage > 0 && res.DT.dataProject.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await getProjectWithPaginationWithEmployer(+res.DT.totalPage, currentLimit, +user.account.shippingUnit_Id
                )
            }
            if (res.DT.totalPage > 0 && res.DT.dataProject.length > 0) {
                let data = res.DT.dataProject

                if (data) {
                    setListProjectbyUnitLenghtt(res.DT.totalProject)
                    setListProjectbyUnit(data)
                    console.log("res.DT", res.DT.dataProject)

                }
            }
            if (res.DT.totalPage === 0 && res.DT.dataProject.length === 0) {
                let data = res.DT.dataProject
                setListProjectbyUnitLenghtt(res.DT.totalProject)

                setListProjectbyUnit(data)

            }
        }
    }
    useEffect(() => {
        window.history.pushState('', '', `?page=${localStorage.getItem("infomation Page employer")}&limit=${currentLimit}`);

        fetchProjectUserAfterRefesh()
    }, [window.location.reload])
    useEffect(() => {

        fetchAllNumberProject()
    }, [])


    return (
        <div className='employer-container' >
            <div className='left-employer  '>
                <SidebarStaff collapsed={collapsed} />

            </div>
            <div className='right-employer  '>
                <div className='btn-toggle-employer'>
                    <span onClick={() => setCollapsed(!collapsed)} className=" d-sm-block ">
                        {collapsed === false ?
                            <i className="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
                            :
                            <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>

                        }
                    </span>
                </div>
                <div className='right-body-employer'>
                    <div className='container'>
                        <div className='header-employer'>
                            <div className='location-path-employer col'>
                                <Link to="/"> Home</Link>

                                <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                </span>
                                <Link to="/order-processing">Order-processing </Link>
                            </div>
                            <div className='col search-employer'>
                                <div className='search-icon-employer'>
                                    <i className="fa fa-search" aria-hidden="true"></i>

                                </div>
                                <input
                                    type="text"
                                    placeholder='Search infomation'
                                    onChange={(event) => HandleSearchData(event.target.value)}

                                />
                            </div>
                        </div>
                        <div className='body-employer'>
                            <div className="container">
                                <div className='name-page-employer'>
                                    <h4> Order processing </h4>
                                    <div className='more-employer'>
                                        <b>{user?.account?.nameUnit?.NameUnit}</b>
                                    </div>
                                </div>
                                <div className='sort my-3'>
                                    <div className='container my-3'>
                                        <div className='row mx-3'>
                                            <div className='col-4 my-2 content ' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}>Tất cả đơn hàng ({dataNumber.allNum}) </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_No_Pickup" style={{ textDecoration: "none", color: "#474141" }}>Đơn chưa lấy hàng ({dataNumber.no_pick_up})</Link>
                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_Picking" style={{ textDecoration: "none", color: "#474141" }}> Đơn đang lấy hàng ({dataNumber.picking_up})</Link>
                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_pick_ok" style={{ textDecoration: "none", color: "#474141" }}>Đơn đã lấy hàng ({dataNumber.pickupOk})</Link>
                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_No_Warehouse" style={{ textDecoration: "none", color: "#474141" }}>Đơn chưa nhập kho ({dataNumber.no_warehouse}) </Link>


                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_Warehouse_status_one" style={{ textDecoration: "none", color: "#474141" }}>Đơn đã nhập kho ({dataNumber.warehouseStatusOne})</Link>

                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_Warehouse_status_two" style={{ textDecoration: "none", color: "#474141" }}>Đơn đã xuất kho ({dataNumber.warehouseStatusTwo})</Link>

                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_No_delivery" style={{ textDecoration: "none", color: "#474141" }}> Đơn chưa giao hàng ({dataNumber.No_delivery})</Link>

                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_delivery_One" style={{ textDecoration: "none", color: "#474141" }}>Đơn đang giao hàng ({dataNumber.deliveryStatusOne})</Link>

                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_delivery_Two" style={{ textDecoration: "none", color: "#474141" }}>Đơn giao thành công ({dataNumber.delivery_ok})</Link>

                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_delivery_Three" style={{ textDecoration: "none", color: "#474141" }}>Đơn huỷ giao hàng ({dataNumber.delivery_cancel})</Link>

                                            </div>




                                        </div>
                                    </div>
                                </div>
                                {isSearch === false
                                    &&
                                    <>


                                        <div className='table-wrapper-employer-one'>
                                            <div className='container'>
                                                <div className='title-employer-one my-3'>Tất cả đơn hàng ({listProjectbyUnitLenght})</div>
                                                <hr />
                                                <div className='sub-tittle'>
                                                    <div className='sub-left '>
                                                        <div className=' mx-3' style={{ color: "red" }}><i class="fa fa-flag" aria-hidden="true"></i>
                                                        </div>
                                                        <div className='NameColor'> Đơn gấp</div>

                                                    </div>
                                                    <div className='sub-right'>
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
                                                <table class="table table-bordered">

                                                    <thead>
                                                        <tr className='table-secondary'>
                                                            <th></th>
                                                            <th scope="col">No</th>
                                                            <th scope="col">id</th>

                                                            <th scope="col">Mã đơn</th>
                                                            <th scope="col">Mặt hàng</th>
                                                            <th scope="col">Số lượng</th>
                                                            <th scope="col">Thời gian tạo</th>
                                                            <th scope="col">Người nhận</th>
                                                            <th scope="col">T/T lấy hàng</th>
                                                            <th scope="col">T/T Nhập kho</th>
                                                            <th scope="col">T/T Giao hàng</th>
                                                            <th scope="col">T/T Thanh toán</th>
                                                            <th scope="col">SĐT người tạo đơn</th>
                                                            <th scope="col">Thao tác</th>


                                                        </tr>
                                                    </thead>
                                                    {listProjectbyUnit && listProjectbyUnit.length > 0
                                                        ?
                                                        listProjectbyUnit.map((item, index) => {
                                                            return (

                                                                <tbody key={`item-${index}`}>
                                                                    <tr class="table-info">

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
                                                                        <td> {item?.Warehouse?.product}</td>
                                                                        <td>{item.quantity}</td>
                                                                        <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                                        <td> {item?.name_customer}</td>
                                                                        <td>
                                                                            <span style={{ color: "red" }}>
                                                                                {item?.Status_Pickup?.status ? item?.Status_Pickup?.status : "chưa lấy hàng"}
                                                                            </span>
                                                                            <br />
                                                                            {item.User_PickUp && item.Number_PickUp &&
                                                                                <span>Nhân viên :
                                                                                    <br />

                                                                                    <b>{item.User_PickUp}-{item.Number_PickUp} </b>

                                                                                </span>

                                                                            }

                                                                        </td>

                                                                        <td>

                                                                            <span style={{ color: "red" }}>
                                                                                {item?.Status_Warehouse?.status ? item?.Status_Warehouse?.status : "chưa xử lý"}
                                                                            </span>
                                                                            <br />
                                                                            {item.User_Warehouse && item.Number_Warehouse
                                                                                &&
                                                                                <span>Nhân viên :
                                                                                    <br />

                                                                                    <b>{item.User_Warehouse}-{item.Number_Warehouse} </b>
                                                                                </span>

                                                                            }


                                                                        </td>
                                                                        <td>
                                                                            <span style={{ color: "red" }}>
                                                                                {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "chưa giao hàng"}
                                                                            </span>
                                                                            <br />
                                                                            {item?.Cancel_reason &&
                                                                                (<span style={{ fontWeight: "800", color: "black" }}>{item?.Cancel_reason}</span>)
                                                                            }
                                                                            <br />
                                                                            {item.User_Delivery && item.Number_Delivery &&
                                                                                <span>Nhân viên :
                                                                                    <br />

                                                                                    <b>{item.User_Delivery}-{item.Number_Delivery}</b>
                                                                                </span>

                                                                            }


                                                                        </td>
                                                                        <td>
                                                                            <span style={{ color: "red" }}>
                                                                                {item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "chưa thanh toán "}
                                                                            </span>
                                                                            <br />
                                                                            {item.User_Overview && item.Number_Overview &&
                                                                                <span>Nhân viên :
                                                                                    <br />
                                                                                    <b>{item.User_Overview}-{item.Number_Overview} </b>
                                                                                </span>
                                                                            }
                                                                        </td>
                                                                        <td>{item.createdBy}</td>

                                                                        <td>
                                                                            <span className='mx-2' style={{ color: "blue", cursor: "pointer" }} title='chuyển trang thái đơn hàng gấp' onClick={() => updateFlag(item)}>
                                                                                <i class="fa fa-toggle-off" aria-hidden="true"></i>

                                                                            </span>
                                                                            <span className='mx-2' style={{ color: "blue", cursor: "pointer" }} title='Nhắn tin với Người tạo đơn' onClick={() => handleShowModal(item)}>
                                                                                <i class="fa fa-comments" aria-hidden="true"></i>

                                                                            </span>
                                                                        </td>
                                                                    </tr>

                                                                </tbody>
                                                            )
                                                        })
                                                        :
                                                        <tr class="table-info">
                                                            <td colSpan={14}>
                                                                <div className='d-flex align-item-center justify-content-center'>

                                                                    <h5> Đơn hàng ở trạng thái bình thường đã được xử lý hết và chưa phát sinh đơn hàng mới</h5>

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
                                    <div className='table-wrapper-employer my-5'>

                                        <div className='container'>
                                            <div className='title-employer my-3'>Kết quả tìm kiếm ({listProjectSearch.length})</div>
                                            <hr />
                                            <table class="table table-bordered table-body-employer">
                                                <thead>
                                                    <tr className='table-secondary'>
                                                        <th scope="col">id</th>

                                                        <th scope="col">Mã đơn</th>
                                                        <th scope="col">Mặt hàng</th>
                                                        <th scope="col">Số lượng</th>
                                                        <th scope="col">Thời gian tạo</th>
                                                        <th scope="col">Người nhận</th>
                                                        <th scope="col" style={{ width: "150px" }}>T/T lấy hàng</th>
                                                        <th scope="col" style={{ width: "150px" }}>T/T Nhập kho</th>
                                                        <th scope="col" style={{ width: "150px" }}>T/T Giao hàng</th>
                                                        <th scope="col" style={{ width: "150px" }}>T/T Thanh toán </th>
                                                        <th scope="col">Người tạo đơn</th>
                                                        <th scope="col">Thao tác</th>

                                                    </tr>
                                                </thead>
                                                {listProjectSearch && listProjectSearch.length > 0
                                                    ?

                                                    listProjectSearch.map((item, index) => {
                                                        return (
                                                            <tbody key={`list-${index}`}>

                                                                <tr >
                                                                    <td>{item.id}</td>
                                                                    <td>{item.order}</td>
                                                                    <td>{item?.Warehouse?.product}</td>
                                                                    <td>{item.quantity}</td>
                                                                    <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                                    <td> {item?.name_customer}</td>
                                                                    <td>
                                                                        <span style={{ color: "red" }}>
                                                                            {item?.Status_Pickup?.status ? item?.Status_Pickup?.status : "chưa lấy hàng"}
                                                                        </span>
                                                                        <br />
                                                                        {item.User_PickUp && item.Number_PickUp &&
                                                                            <span>Nhân viên :
                                                                                <br />

                                                                                <b>{item.User_PickUp}-{item.Number_PickUp} </b>

                                                                            </span>

                                                                        }

                                                                    </td>

                                                                    <td>

                                                                        <span style={{ color: "red" }}>
                                                                            {item?.Status_Warehouse?.status ? item?.Status_Warehouse?.status : "chưa xử lý"}
                                                                        </span>
                                                                        <br />
                                                                        {item.User_Warehouse && item.Number_Warehouse
                                                                            &&
                                                                            <span>Nhân viên :
                                                                                <br />

                                                                                <b>{item.User_Warehouse}-{item.Number_Warehouse} </b>
                                                                            </span>

                                                                        }


                                                                    </td>
                                                                    <td>
                                                                        <span style={{ color: "red" }}>
                                                                            {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "chưa giao hàng"}
                                                                        </span>
                                                                        <br />
                                                                        {item.User_Delivery && item.Number_Delivery &&
                                                                            <span>Nhân viên :
                                                                                <br />

                                                                                <b>{item.User_Delivery}-{item.Number_Delivery}</b>
                                                                            </span>

                                                                        }

                                                                    </td>
                                                                    <td>
                                                                        <span style={{ color: "red" }}>
                                                                            {item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "chưa thanh toán "}
                                                                        </span>
                                                                        <br />
                                                                        {item.User_Overview && item.Number_Overview &&
                                                                            <span>Nhân viên :
                                                                                <br />
                                                                                <b>{item.User_Overview}-{item.Number_Overview} </b>
                                                                            </span>
                                                                        }
                                                                    </td>
                                                                    <td>{item.createdBy}</td>
                                                                    <td>
                                                                        {/* <span className='mx-2' style={{ color: "red", cursor: "pointer" }} title='chuyển trang thái đơn hàng bình thường' onClick={() => updateFlag(item)}>
                                                                                <i class="fa fa-toggle-on" aria-hidden="true"></i>

                                                                            </span> */}


                                                                        <br />
                                                                        <span className='mx-2' style={{ color: "red", cursor: "pointer" }} title='Nhắn tin với Người tạo đơn' onClick={() => handleShowModal(item)}>
                                                                            <i class="fa fa-comments" aria-hidden="true"></i>

                                                                        </span>
                                                                    </td>
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
                    dataChatOne={dataChatOne}
                />
            </div >

        </div >




    )


}

export default Manageproducts;