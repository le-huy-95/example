import './manageproducts.scss'

import SidebarStaff from "../sidebar/sidebar staff"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import { getProjectWithPaginationWithALlStatusDelivery, getAllStatusProductWithEmployer, getDataSearchByEmplyer } from "../services/ProjectService"
import ReactPaginate from 'react-paginate';
import ModalChatWithCutomer from "./modalChatWithCutomer"
import moment from "moment"
import { toast } from 'react-toastify'
import _, { debounce } from "lodash"
import { useTranslation, Trans } from 'react-i18next';

const ManageproductsDeliveryStatusThree = (props) => {
    const { t, i18n } = useTranslation();
    let history = useHistory()
    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [listProjectbyUnit, setListProjectbyUnit] = useState([])
    const [listProjectbyUnitLenght, setListProjectbyUnitLenghtt] = useState([])
    const [isSearch, SetIsSearch] = useState(false)
    const [listProjectSearch, setListProjectSearch] = useState([])

    const [currentPage, setCurrentPage] = useState(
        localStorage.getItem("infomation Page employer ten") ? localStorage.getItem("infomation Page employer ten") : 1

    )
    const [currentLimit, setCurrentLimit] = useState(4)
    const [totalPage, setTotalPage] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [dataChatOne, setDataChatOnet] = useState([])
    const [dataNumber, setdataNumber] = useState([])


    const HandleSearchData = debounce(async (value) => {
        let data = value
        if (data) {
            SetIsSearch(true)
            let res = await getDataSearchByEmplyer(data, "", +user.account.shippingUnit_Id)
            if (res && +res.EC === 0) {
                let data = res.DT.filter(item => item.statusDeliveryId === 3)
                setListProjectSearch(data)
            }

        } else {
            SetIsSearch(false)
            await fetchAllNumberProject()

        }

    }, 200)

    const handleShowModal = (item) => {
        setShowModal(!showModal)
        setDataChatOnet(item)
    }

    const fetchAllNumberProject = async () => {
        let res = await getAllStatusProductWithEmployer(+user.account.shippingUnit_Id)
        if (res && +res.EC === 0) {
            setdataNumber(res.DT[0])
        } else {
            toast.error(res.EM)
        }

    }


    const fetchProjectUser = async () => {

        let res = await getProjectWithPaginationWithALlStatusDelivery(currentPage, currentLimit, +user.account.shippingUnit_Id, 3
        )
        if (res && +res.EC === 0) {
            setTotalPage(+res.DT.totalPage)
            if (res.DT.totalPage > 0 && res.DT.dataProject.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await getProjectWithPaginationWithALlStatusDelivery(+res.DT.totalPage, currentLimit, +user.account.shippingUnit_Id, 3
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
    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1)
        localStorage.setItem("infomation Page employer ten", +event.selected + 1)
    }


    useEffect(() => {
        fetchAllNumberProject()
        fetchProjectUser();
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('page', currentPage);
        currentUrlParams.set("limit", currentLimit);

        history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }, [currentPage])
    const fetchProjectUserAfterRefesh = async () => {
        let currentPagelocalStorage = +localStorage.getItem("infomation Page employer ten")
        let res = await getProjectWithPaginationWithALlStatusDelivery(+currentPagelocalStorage, currentLimit, +user.account.shippingUnit_Id, 3
        )
        if (res && +res.EC === 0) {
            setTotalPage(+res.DT.totalPage)
            if (res.DT.totalPage > 0 && res.DT.dataProject.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await getProjectWithPaginationWithALlStatusDelivery(+res.DT.totalPage, currentLimit, +user.account.shippingUnit_Id, 3
                )
            }
            if (res.DT.totalPage > 0 && res.DT.dataProject.length > 0) {
                let data = res.DT.dataProject

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
    useEffect(() => {
        window.history.pushState('', '', `?page=${localStorage.getItem("infomation Page employer ten")}&limit=${currentLimit}`);

        fetchProjectUserAfterRefesh()
    }, [window.location.reload])

    return (
        <div className='employer-container '>
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
                                    <h4>
                                        {t('Manage-employer.One')}
                                    </h4>
                                    <div className='more-employer'>
                                        <b>{user?.account?.nameUnit?.NameUnit}</b>
                                    </div>
                                </div>
                                <div className='sort my-3'>
                                    <div className='container my-3'>
                                        <div className='row mx-3'>
                                            <div className='col-4 my-2 content ' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/order-processing" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Manage-employer.Three')} ({dataNumber.allNum})
                                                </Link>
                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_No_Pickup" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Manage-employer.Four')} ({dataNumber.no_pick_up})
                                                </Link>
                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_Picking" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Manage-employer.Five')} ({dataNumber.picking_up})
                                                </Link>
                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_pick_ok" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Manage-employer.Six')} ({dataNumber.pickupOk})
                                                </Link>
                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_No_Warehouse" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Manage-employer.Seven')}({dataNumber.no_warehouse})
                                                </Link>

                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_Warehouse_status_one" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Manage-employer.Eight')} ({dataNumber.warehouseStatusOne})
                                                </Link>

                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_Warehouse_status_two" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Manage-employer.thirteen')} ({dataNumber.warehouseStatusTwo})
                                                </Link>

                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_No_delivery" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Manage-employer.Night')} ({dataNumber.No_delivery})
                                                </Link>

                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_delivery_One" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Manage-employer.Ten')} ({dataNumber.deliveryStatusOne})
                                                </Link>

                                            </div>
                                            <div className='col-4 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Manageproducts_delivery_Two" style={{ textDecoration: "none", color: "#474141" }}
                                                >{t('Manage-employer.Eleven')} ({dataNumber.delivery_ok})
                                                </Link>

                                            </div>
                                            <div className='col-4 content' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}>
                                                {t('Manage-employer.Twele')} ({dataNumber.delivery_cancel})

                                            </div>



                                        </div>
                                    </div>
                                </div>
                                {isSearch === false &&
                                    <div className='table-wrapper-employer-one'>
                                        <div className='container'>
                                            <div className='title-employer-one my-3'>
                                                {t('Manage-employer.Body.Tittle-twentySix')} ({listProjectbyUnitLenght})
                                            </div>
                                            <hr />
                                            <div className='sub-tittle'>
                                                <div className='sub-left '>
                                                    <div className=' mx-3' style={{ color: "red" }}><i class="fa fa-flag" aria-hidden="true"></i>
                                                    </div>
                                                    <div className='NameColor'>
                                                        {t('Manage-employer.Body.Tittle-One')}                                                        </div>

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
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Two')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Three')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Four')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Five')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Six')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Seven')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Eight')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Night')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Ten')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Eleven')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Twele')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-thirteen')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-fourteen')}
                                                        </th>




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
                                                                        <span >
                                                                            {item?.Status_Pickup?.status ? item?.Status_Pickup?.status : "chưa lấy hàng"}
                                                                        </span>
                                                                        <br />
                                                                        {item.User_PickUp && item.Number_PickUp &&
                                                                            <span>
                                                                                {t('Manage-employer.Body.Tittle-fifteen')}
                                                                                <br />
                                                                                <b>{item.User_PickUp}-{item.Number_PickUp}</b>
                                                                            </span>

                                                                        }


                                                                    </td>

                                                                    <td>

                                                                        <span >
                                                                            {item?.Status_Warehouse?.status ? item?.Status_Warehouse?.status : "chưa xử lý"}
                                                                        </span>
                                                                        <br />
                                                                        {item.User_Warehouse && item.Number_Warehouse
                                                                            &&
                                                                            <span>
                                                                                {t('Manage-employer.Body.Tittle-fifteen')}
                                                                                <br />
                                                                                <b>{item.User_Warehouse}-{item.Number_Warehouse}</b>
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
                                                                            <span>
                                                                                {t('Manage-employer.Body.Tittle-fifteen')}
                                                                                <br />

                                                                                <b>{item.User_Delivery}-{item.Number_Delivery}</b>
                                                                            </span>

                                                                        }


                                                                    </td>
                                                                    <td>
                                                                        <span >
                                                                            {item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "chưa thanh toán "}
                                                                        </span>
                                                                        <br />
                                                                        {item.User_Overview && item.Number_Overview &&
                                                                            <span>
                                                                                {t('Manage-employer.Body.Tittle-fifteen')}
                                                                                <br />
                                                                                <b>{item.User_Overview}-{item.Number_Overview} </b>
                                                                            </span>
                                                                        }
                                                                    </td>
                                                                    <td>{item.createdBy}</td>
                                                                    <td>

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

                                                                <h5>
                                                                    {t('Manage-employer.Body.Tittle-sixteen')}
                                                                </h5>


                                                            </div>

                                                        </td>

                                                    </tr>
                                                }

                                            </table>
                                        </div>

                                    </div>
                                }

                                {isSearch === true &&
                                    <div className='table-wrapper-employer-one'>
                                        <div className='container'>
                                            <div className='title-employer-one my-3'>
                                                {t('Manage-employer.Body.Tittle-seventeen')} ({listProjectSearch.length})</div>
                                            <hr />


                                            <table class="table table-bordered">

                                                <thead>
                                                    <tr className='table-secondary'>

                                                        <th></th>

                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Three')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Four')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Five')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Six')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Seven')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Eight')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Night')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Ten')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Eleven')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-Twele')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-thirteen')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Manage-employer.Body.Tittle-fourteen')}
                                                        </th>


                                                    </tr>
                                                </thead>
                                                {listProjectSearch && listProjectSearch.length > 0
                                                    ?
                                                    listProjectSearch.map((item, index) => {
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
                                                                    <td>{item.id}</td>

                                                                    <td>{item.order}</td>
                                                                    <td> {item?.Warehouse?.product}</td>
                                                                    <td>{item.quantity}</td>
                                                                    <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                                    <td> {item?.name_customer}</td>
                                                                    <td>
                                                                        <span >
                                                                            {item?.Status_Pickup?.status ? item?.Status_Pickup?.status : "chưa lấy hàng"}
                                                                        </span>
                                                                        <br />
                                                                        {item.User_PickUp && item.Number_PickUp &&
                                                                            <span>
                                                                                {t('Manage-employer.Body.Tittle-fifteen')}
                                                                                <br />
                                                                                <b>{item.User_PickUp}-{item.Number_PickUp}</b>
                                                                            </span>

                                                                        }


                                                                    </td>

                                                                    <td>

                                                                        <span >
                                                                            {item?.Status_Warehouse?.status ? item?.Status_Warehouse?.status : "chưa xử lý"}
                                                                        </span>
                                                                        <br />
                                                                        {item.User_Warehouse && item.Number_Warehouse
                                                                            &&
                                                                            <span>
                                                                                {t('Manage-employer.Body.Tittle-fifteen')}
                                                                                <br />
                                                                                <b>{item.User_Warehouse}-{item.Number_Warehouse}</b>
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
                                                                            <span>
                                                                                {t('Manage-employer.Body.Tittle-fifteen')}
                                                                                <br />

                                                                                <b>{item.User_Delivery}-{item.Number_Delivery}</b>
                                                                            </span>

                                                                        }


                                                                    </td>
                                                                    <td>
                                                                        <span >
                                                                            {item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "chưa thanh toán "}
                                                                        </span>
                                                                        <br />
                                                                        {item.User_Overview && item.Number_Overview &&
                                                                            <span>
                                                                                {t('Manage-employer.Body.Tittle-fifteen')}
                                                                                <br />
                                                                                <b>{item.User_Overview}-{item.Number_Overview} </b>
                                                                            </span>
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {item?.createdByName}
                                                                        <br />
                                                                        {item?.createdBy}
                                                                    </td>
                                                                    <td>

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

                                                                <h5>
                                                                    {t('Manage-employer.Body.Tittle-eighteen')}
                                                                </h5>

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

export default ManageproductsDeliveryStatusThree;