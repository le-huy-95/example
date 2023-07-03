import './Warehouse_staff.scss'

import SidebarStaff from "../sidebar/sidebar staff"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import { getDataSearchByEmplyer, createNotification, getDataSortByWarehouse, updateWarehouseInProject } from "../services/ProjectService"
import ReactPaginate from 'react-paginate';
import ModalChatWithCutomer from "./modalChatWithCutomer"
import { toast } from 'react-toastify'
import moment from "moment"
import _, { debounce } from "lodash"
import { useTranslation, Trans } from 'react-i18next';
import { NotificationContext } from "../../contexApi/NotificationContext"

const WarehouseNoStatus = (props) => {
    const { t, i18n } = useTranslation();
    const { list, getALlListNotification, listStaff } = React.useContext(NotificationContext);

    let history = useHistory()
    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [ListProjectbyStaffWarehouse, setListProjectbyStaffWarehouse] = useState([])
    const [listProjectbyuserStaff, setListProjectbyuserStaff] = useState([])
    const [listProjectSearch, setListProjectSearch] = useState([])
    const [isSearch, SetIsSearch] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [currentLimit, setCurrentLimit] = useState(1)
    const [isLoading, SetIsLoading] = useState(false)
    const [totalPage, setTotalPage] = useState(0)
    const [showModal, setShowModal] = useState(false)
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
                let data = res.DT.filter(item => item.statuswarehouseId === 0 && item.statuspickupId === 2)
                setListProjectSearch(data)
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
            }

        } else {
            SetIsSearch(false)
            await fetchProjectUser()
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
        }

    }, 200)


    const updateWArehouse = async (item) => {
        if (!item.User_Warehouse && !item.Number_Warehouse) {

            let res = await updateWarehouseInProject(item.id, +user.account.shippingUnit_Id, "", user.account.username, user.account.phone, 1, new Date(), "")
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "đơn hàng đã nhập kho", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUser()
                    await HandleSearchData()
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


    const fetchProjectUser = async () => {

        let res = await getDataSortByWarehouse(+user.account.shippingUnit_Id, 0)
        if (res && +res.EC === 0) {
            let data = res.DT.filter(item => item.statuspickupId === 2)
            setListProjectbyStaffWarehouse(data)
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
        }
    }


    useEffect(() => {
        fetchProjectUser();
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }

    }, [currentPage])
    return (
        <div className='employer-warehouse-container '>
            <div className='left-employer-warehouse  '>
                <SidebarStaff collapsed={collapsed} />

            </div>
            <div className='right-employer-warehouse  '>
                <div className='btn-toggle-employer-warehouse'>
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
                            <div className='location-path-employer-warehouse col'>
                                <Link to="/"> Home</Link>

                                <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                </span>
                                <Link to="/Warehouse_staff">Warehouse</Link>
                            </div>
                            <div className='col search-employer-warehouse'>
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
                                            <div className='col-3 content-warehouse' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Warehouse_staff" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Warehouse-employer.Two')}
                                                </Link>
                                            </div>
                                            <div className='col-3 my-2 content-warehouse ' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}>
                                                {t('Warehouse-employer.Three')}
                                            </div>

                                            <div className='col-3 content-warehouse' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Warehouse_status_one" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Warehouse-employer.Four')}
                                                </Link>
                                            </div>
                                            <div className='col-3 content-warehouse' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Warehouse_status_two" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Warehouse-employer.Five')}
                                                </Link>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {isSearch === false &&
                                    <div className='table-wrapper-employer-warehouse-One my-5'>
                                        <div className='container'>
                                            <div className='title-employer-warehouse-One my-3'>
                                                {t('Warehouse-employer.Six')} ({ListProjectbyStaffWarehouse.length})
                                            </div>
                                            <hr />
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
                                                {ListProjectbyStaffWarehouse && ListProjectbyStaffWarehouse.length > 0
                                                    ?
                                                    ListProjectbyStaffWarehouse.map((item, index) => {
                                                        return (
                                                            <tbody key={`item-${index}`}>

                                                                <tr>
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
                                }
                                {isSearch === true &&
                                    <div className='table-wrapper-employer-warehouse-One my-5'>
                                        <div className='container'>
                                            <div className='title-employer-warehouse-One my-3'>
                                                {t('Warehouse-employer.Body.Nineteen')} ({listProjectSearch.length})
                                            </div>
                                            <hr />
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
                                                {listProjectSearch && listProjectSearch.length > 0
                                                    ?
                                                    listProjectSearch.map((item, index) => {
                                                        return (
                                                            <tbody key={`item-${index}`}>

                                                                <tr>
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

export default WarehouseNoStatus;