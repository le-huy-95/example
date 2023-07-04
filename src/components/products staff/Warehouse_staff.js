import './Warehouse_staff.scss'

import SidebarStaff from "../sidebar/sidebar staff"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import { getProjectWithPaginationWithEmployerWarhouse, getDataSearchByEmplyer, getProjectWithPaginationWithEmployerWarehouse_user, updateWarehouseInProject, createNotification } from "../services/ProjectService"
import ReactPaginate from 'react-paginate';
import ModalChatWithCutomer from "./modalChatWithCutomer"
import { toast } from 'react-toastify'
import moment from "moment"
import _, { debounce } from "lodash"
import { useTranslation, Trans } from 'react-i18next';
import { NotificationContext } from "../../contexApi/NotificationContext"

const Warehouse_staff = (props) => {
    const { t, i18n } = useTranslation();
    const { list, getALlListNotification, listStaff } = React.useContext(NotificationContext);
    let history = useHistory()
    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [ListProjectbyStaffWarehouse, setListProjectbyStaffWarehouse] = useState([])
    const [listProjectbyUsernameStaffWarehouse, setlistProjectbyUsernameStaffWarehouse] = useState([])
    const [length, setLength] = useState("")

    const [currentPage, setCurrentPage] = useState(1)
    const [currentLimit, setCurrentLimit] = useState(7)
    const [isSearch, SetIsSearch] = useState(false)
    const [totalPage, setTotalPage] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [listProjectSearch, setListProjectSearch] = useState([])
    const [valueSearch, setvalueSearch] = useState("")

    const handleShowModal = async () => {
        setShowModal(!showModal)
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
    }

    const HandleSearchData = debounce(async (value) => {
        let data = value
        setvalueSearch(value)
        if (data) {
            SetIsSearch(true)
            let res = await getDataSearchByEmplyer(data, user.account.Position, +user.account.shippingUnit_Id)
            if (res && +res.EC === 0) {
                let data = res.DT.filter(item => item.statuspickupId === 2)
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
                setListProjectSearch(data)
            }

        } else {
            SetIsSearch(false)
            await fetchProjectUserWithUsername()
            await fetchProjectUser()
            setvalueSearch("")
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
        }

    }, 200)


    const complete = async (item) => {
        let res = await updateWarehouseInProject(item.id, +user.account.shippingUnit_Id, "", user.account.username, user.account.phone, 2, item.warehouse_time, new Date())
        if (res && +res.EC === 0) {
            let abc = await createNotification(item.id, item.order, "đơn hàng đã xuất kho", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 0, item.shippingUnit_Id)
            if (abc && +abc.EC === 0) {
                await fetchProjectUserWithUsername()
                await fetchProjectUser()
                await HandleSearchData(valueSearch)
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

    const updateWArehouse = async (item) => {
        if (!item.User_Warehouse && !item.Number_Warehouse && !item.Status_product) {
            let res = await updateWarehouseInProject(item.id, +user.account.shippingUnit_Id, "", user.account.username, user.account.phone, 1, new Date(), "")
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "đơn hàng đã nhập kho", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUserWithUsername()
                    await fetchProjectUser()
                    await HandleSearchData(valueSearch)
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
        if (item.User_Warehouse && item.Number_Warehouse) {
            let res = await updateWarehouseInProject(item.id, +user.account.shippingUnit_Id, null, null, null, 0, "", "")
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "đơn hàng trì hoãn nhập kho", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUserWithUsername()
                    await fetchProjectUser()
                    await HandleSearchData(valueSearch)
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


    const fetchProjectUserWithUsername = async () => {
        let res = await getProjectWithPaginationWithEmployerWarehouse_user(+user.account.shippingUnit_Id, user.account.username, user.account.phone)
        if (res && +res.EC === 0) {
            setlistProjectbyUsernameStaffWarehouse(res.DT)
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
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



    const fetchProjectUser = async () => {

        let res = await getProjectWithPaginationWithEmployerWarhouse(currentPage, currentLimit, +user.account.shippingUnit_Id
        )
        if (res && +res.EC === 0) {
            setTotalPage(+res.DT.totalPage)
            if (res.DT.totalPage > 0 && res.DT.dataProject.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await getProjectWithPaginationWithEmployerWarhouse(+res.DT.totalPage, currentLimit, +user.account.shippingUnit_Id
                )
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
            }
            if (res.DT.totalPage > 0 && res.DT.dataProject.length > 0) {
                let data = res.DT.dataProject
                setLength(res.DT.totalProject)
                if (data) {
                    setListProjectbyStaffWarehouse(data)
                    if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupWithRound?.name === "Dev") {
                        await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                    }
                }
            }
            if (res.DT.totalPage === 0 && res.DT.dataProject.length === 0) {
                let data = res.DT.dataProject
                setLength(res.DT.totalProject)
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
                setListProjectbyStaffWarehouse(data)

            }
        }
    }
    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1)
    }

    useEffect(() => {
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
        fetchProjectUser();
        fetchProjectUserWithUsername()
    }, [currentPage])
    return (
        <div className='employer-warehouse-container '>
            <div className='left-employer-warehouse d-none d-lg-block '>
                <SidebarStaff collapsed={collapsed} />

            </div>
            <div className='right-employer-warehouse  '>
                <div className='btn-toggle-employer-warehouse d-none d-lg-block'>
                    <span onClick={() => setCollapsed(!collapsed)} className=" d-sm-block ">
                        {collapsed === false ?
                            <i className="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
                            :
                            <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>

                        }
                    </span>
                </div>
                <div className='right-body-employer-warehouse'>
                    <div className='container'>

                        <div className='header-employer-warehouse'>
                            <div className='container'>
                                <div className='row'>
                                    <div className='location-path-employer-warehouse my-2 col-12 col-lg-6'>
                                        <Link to="/"> Home</Link>

                                        <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                        </span>
                                        <Link to="/Warehouse_staff">Warehouse</Link>
                                    </div>
                                    <div className='search-employer-warehouse my-2 col-12 col-lg-6'>
                                        <div className='search-icon-employer-warehouse'>
                                            <i className="fa fa-search" aria-hidden="true"></i>

                                        </div>
                                        <input
                                            type="text"
                                            placeholder='Search infomation'
                                            onChange={(event) => HandleSearchData(event.target.value)}

                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='body-employer-warehouse'>
                            <div className="container">
                                <div className='name-page-employer-warehouse'>
                                    <h4>
                                        {t('Warehouse-employer.One')}
                                    </h4>
                                    <div className='more-employer-pickup'>
                                        <b>{user?.account?.nameUnit?.NameUnit}</b>


                                    </div>
                                    <span>{user?.account?.Position}</span>

                                </div>
                                <div className='sort_warehouse my-3'>
                                    <div className='container my-3'>
                                        <div className='row mx-3'>
                                            <div className='col-12 col-lg-3 my-2 content-warehouse ' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}>
                                                {t('Warehouse-employer.Two')}
                                            </div>
                                            <div className='col-12 col-lg-3 content-warehouse' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Warehouse_no_status" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Warehouse-employer.Three')}
                                                </Link>
                                            </div>
                                            <div className='col-12 col-lg-3 content-warehouse' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Warehouse_status_one" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Warehouse-employer.Four')}
                                                </Link>
                                            </div>
                                            <div className='col-12 col-lg-3 content-warehouse' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Warehouse_status_two" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Warehouse-employer.Five')}
                                                </Link>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {isSearch === false &&
                                    <>
                                        <div className='table-wrapper-employer-warehouse my-5'>
                                            <div className='container'>

                                                <div className='title-employer-warehouse my-3'>
                                                    {t('Warehouse-employer.Six')} ({length})
                                                </div>
                                                <hr />

                                                <div className='sub-title-employer-warehouse d-none d-lg-block'>
                                                    <div className='container'>
                                                        <div className='row'>
                                                            <div className='sub-left col-3 '>
                                                                <div className=' mx-3' style={{ color: "red" }}><i class="fa fa-flag" aria-hidden="true"></i>
                                                                </div>
                                                                <div className='NameColor'>
                                                                    {t('Warehouse-employer.Seven')}
                                                                </div>

                                                            </div>

                                                            <div className='col-9 d-flex align-item-center justify-content-end'>
                                                                < ReactPaginate
                                                                    nextLabel="next >"
                                                                    onPageChange={handlePageClick}
                                                                    pageRangeDisplayed={1}
                                                                    marginPagesDisplayed={1}
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
                                                    </div>
                                                </div>
                                                <div className='sub-title-employer-warehouse d-block d-lg-none'>
                                                    <div className='container'>

                                                        <div className='row'>
                                                            <div className='sub-left-mobile '>
                                                                <div className=' mx-3' style={{ color: "red" }}><i class="fa fa-flag" aria-hidden="true"></i>
                                                                </div>
                                                                <div className='NameColor'>
                                                                    {t('Warehouse-employer.Seven')}
                                                                </div>

                                                            </div>

                                                            <div className='sub-title-employer-warehouse-right mt-3 ' >
                                                                < ReactPaginate
                                                                    nextLabel="next >"
                                                                    onPageChange={handlePageClick}
                                                                    pageRangeDisplayed={1}
                                                                    marginPagesDisplayed={1}
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
                                                    </div>
                                                </div>

                                                <div style={{ overflow: "auto" }}>
                                                    <table class="table table-bordered table-body-employer-warehouse">
                                                        <thead>
                                                            <tr className='table-secondary'>
                                                                <th></th>
                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.One')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Two')}
                                                                </th>

                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Three')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Four')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Five')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Seven')}
                                                                </th>

                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Eight')}
                                                                </th>
                                                                <th scope="col" >
                                                                    {t('Warehouse-employer.Body.Night')}
                                                                </th>
                                                                <th scope="col" >
                                                                    {t('Warehouse-employer.Body.Ten')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Eleven')}
                                                                </th>


                                                            </tr>
                                                        </thead>
                                                        {ListProjectbyStaffWarehouse && ListProjectbyStaffWarehouse.length > 0
                                                            ?

                                                            ListProjectbyStaffWarehouse.map((item, index) => {
                                                                return (
                                                                    <tbody key={`item-${index}`}>

                                                                        <tr >
                                                                            {item?.flag === 1 ?
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
                                                                            <td>
                                                                                {item.quantity}/{item.unit}
                                                                            </td>
                                                                            <td>
                                                                                <span style={{ color: "red", fontWeight: "500" }}>  {item?.Status_Warehouse?.status ? item?.Status_Warehouse?.status : "chưa nhập kho"}</span>
                                                                            </td>

                                                                            <td>
                                                                                {item?.User_Warehouse ? item?.User_Warehouse : "chưa ai nhận đơn"}
                                                                                <br />
                                                                                {item?.Number_Warehouse ? item?.Number_Warehouse : ""}

                                                                            </td>
                                                                            <td>{item?.warehouse_time ? moment(`${item?.warehouse_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                            <td>{item?.warehouseDone_time ? moment(`${item?.warehouseDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                            {!item?.User_Warehouse && !item?.Number_Warehouse &&
                                                                                < td >
                                                                                    <button className='btn btn-danger' onClick={() => updateWArehouse(item)}>
                                                                                        {t('Warehouse-employer.Body.Twelve')}
                                                                                    </button>
                                                                                </td>
                                                                            }

                                                                            {+item?.statuswarehouseId === 1 &&
                                                                                <td>
                                                                                    <span style={{ color: "blue", fontWeight: "700" }}>
                                                                                        {t('Warehouse-employer.Four')}
                                                                                    </span>
                                                                                </td>
                                                                            }
                                                                            {+item?.statuswarehouseId === 2 &&
                                                                                <td>
                                                                                    <span style={{ color: "green", fontWeight: "700" }} >
                                                                                        {t('Warehouse-employer.Five')}
                                                                                    </span>
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

                                                                        <h5>
                                                                            {t('Warehouse-employer.Body.Sixteen')}
                                                                        </h5>

                                                                    </div>

                                                                </td>

                                                            </tr>
                                                        }


                                                    </table>
                                                </div>
                                            </div>


                                        </div>
                                        <div className='table-wrapper-employer-warehouse-One my-5'>
                                            <div className='container'>
                                                <div className='title-employer-warehouse-One my-3'>
                                                    {t('Warehouse-employer.Body.Fifteen')} ({listProjectbyUsernameStaffWarehouse.length})
                                                </div>
                                                <hr />
                                                <div style={{ overflow: "auto" }}>
                                                    <table class="table table-bordered table-body-employer-warehouse-One">
                                                        <thead>
                                                            <tr className='table-secondary'>
                                                                <th></th>

                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Two')}
                                                                </th>

                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Three')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Four')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Five')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Seven')}
                                                                </th>

                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Eight')}
                                                                </th>
                                                                <th scope="col" >
                                                                    {t('Warehouse-employer.Body.Night')}
                                                                </th>
                                                                <th scope="col" >
                                                                    {t('Warehouse-employer.Body.Ten')}
                                                                </th>
                                                                <th scope="col">
                                                                    {t('Warehouse-employer.Body.Eleven')}
                                                                </th>



                                                            </tr>
                                                        </thead>
                                                        {listProjectbyUsernameStaffWarehouse && listProjectbyUsernameStaffWarehouse.length > 0
                                                            ?
                                                            listProjectbyUsernameStaffWarehouse.map((item, index) => {
                                                                return (
                                                                    <tbody key={`item-${index}`}>

                                                                        <tr>
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
                                                                            <td>
                                                                                {item.quantity}/{item.unit}
                                                                            </td>
                                                                            <td>
                                                                                <span style={{ color: "red", fontWeight: "500" }}>  {item?.Status_Warehouse?.status ? item?.Status_Warehouse?.status : "chưa nhập kho"}</span>
                                                                            </td>

                                                                            <td>
                                                                                {item?.User_Warehouse ? item?.User_Warehouse : "chưa ai nhận đơn"}
                                                                                <br />
                                                                                {item?.Number_Warehouse ? item?.Number_Warehouse : ""}

                                                                            </td>
                                                                            <td>{item?.warehouse_time ? moment(`${item?.warehouse_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                            <td>{item?.warehouseDone_time ? moment(`${item?.warehouseDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                            {item.statuswarehouseId === 2 ?
                                                                                <td>
                                                                                    <span style={{ color: "green", fontWeight: "700" }}>
                                                                                        {t('Warehouse-employer.Five')}
                                                                                    </span>
                                                                                </td>

                                                                                :
                                                                                <td>
                                                                                    <button className='btn btn-success mx-3 my-1' onClick={() => complete(item)}>
                                                                                        {t('Warehouse-employer.Body.Thirteen')}
                                                                                    </button>
                                                                                    <br />
                                                                                    <button className='btn btn-warning mx-3 my-1' onClick={() => updateWArehouse(item)}>
                                                                                        {t('Warehouse-employer.Body.Fourteen')}
                                                                                    </button>

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

                                                                        <h5>
                                                                            {t('Warehouse-employer.Body.Seventeen')}
                                                                        </h5>

                                                                    </div>

                                                                </td>

                                                            </tr>
                                                        }


                                                    </table>
                                                </div>
                                            </div>

                                        </div>
                                    </>

                                }
                                {isSearch === true &&
                                    <div className='table-wrapper-employer-warehouse-One my-5'>
                                        <div className='container'>
                                            <div className='title-employer-warehouse-One my-3'>
                                                {t('Warehouse-employer.Body.Nineteen')} ({listProjectSearch.length})
                                            </div>
                                            <hr />
                                            <div style={{ overflow: "auto" }}>

                                                <table class="table table-bordered table-body-employer-warehouse-One">
                                                    <thead>
                                                        <tr className='table-secondary' >
                                                            <th></th>

                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Two')}
                                                            </th>

                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Three')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Four')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Five')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Seven')}
                                                            </th>

                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Eight')}
                                                            </th>
                                                            <th scope="col" >
                                                                {t('Warehouse-employer.Body.Night')}
                                                            </th>
                                                            <th scope="col" >
                                                                {t('Warehouse-employer.Body.Ten')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Warehouse-employer.Body.Eleven')}
                                                            </th>




                                                        </tr>
                                                    </thead>
                                                    {listProjectSearch && listProjectSearch.length > 0
                                                        ?
                                                        listProjectSearch.map((item, index) => {
                                                            return (
                                                                <tbody key={`item-${index}`}>

                                                                    <tr>
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
                                                                        <td>
                                                                            {item.quantity}/{item.unit}
                                                                        </td>
                                                                        <td>
                                                                            <span style={{ color: "red", fontWeight: "500" }}>  {item?.Status_Warehouse?.status ? item?.Status_Warehouse?.status : "chưa nhập kho"}</span>
                                                                        </td>

                                                                        <td>
                                                                            {item?.User_Warehouse ? item?.User_Warehouse : "chưa ai nhận đơn"}
                                                                            <br />
                                                                            {item?.Number_Warehouse ? item?.Number_Warehouse : ""}

                                                                        </td>
                                                                        <td>{item?.warehouse_time ? moment(`${item?.warehouse_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        <td>{item?.warehouseDone_time ? moment(`${item?.warehouseDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        {item.statuswarehouseId === 0 &&
                                                                            <td>
                                                                                <button className='btn btn-danger mx-3 my-1' onClick={() => updateWArehouse(item)} >
                                                                                    {t('Warehouse-employer.Body.Twelve')}
                                                                                </button>
                                                                            </td>
                                                                        }

                                                                        {item.statuswarehouseId == 1
                                                                            &&
                                                                            user?.account?.phone === item.Number_Warehouse
                                                                            &&
                                                                            <td>
                                                                                <button className='btn btn-success mx-3 my-1' onClick={() => complete(item)}>
                                                                                    {t('Warehouse-employer.Body.Thirteen')}
                                                                                </button>
                                                                                <br />
                                                                                <button className='btn btn-warning mx-3 my-1' onClick={() => updateWArehouse(item)}>
                                                                                    {t('Warehouse-employer.Body.Fourteen')}
                                                                                </button>

                                                                            </td>
                                                                        }
                                                                        {item.statuswarehouseId === 1

                                                                            &&
                                                                            user?.account?.phone !== item.Number_Warehouse

                                                                            &&

                                                                            <td>
                                                                                <span style={{ color: "blue", fontWeight: "700" }} >
                                                                                    {t('Warehouse-employer.Four')}
                                                                                </span>


                                                                            </td>
                                                                        }
                                                                        {item.statuswarehouseId === 2 &&
                                                                            <td>
                                                                                <span style={{ color: "green", fontWeight: "700" }} >
                                                                                    {t('Warehouse-employer.Five')}
                                                                                </span>
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

                                                                    <h5>
                                                                        {t('Warehouse-employer.Body.Eighteen')}
                                                                    </h5>

                                                                </div>

                                                            </td>

                                                        </tr>
                                                    }


                                                </table>
                                            </div>
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

export default Warehouse_staff;