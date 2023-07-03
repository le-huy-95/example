import './PickUp.scss'

import SidebarStaff from "../sidebar/sidebar staff"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import { getProjectWithPaginationWithEmployerPickUp, getDataSortByPickup, updatePickupInProject, getDataSearchByEmplyer, createNotification } from "../services/ProjectService"
import ReactPaginate from 'react-paginate';
import ModalChatWithCutomer from "./modalChatWithCutomer"
import moment from "moment"
import { toast } from 'react-toastify'
import _, { debounce } from "lodash"
import { useTranslation, Trans } from 'react-i18next';
import { NotificationContext } from "../../contexApi/NotificationContext"

const PickUpNoStatus = (props) => {
    const { t, i18n } = useTranslation();
    const { list, getALlListNotification, listStaff } = React.useContext(NotificationContext);

    let history = useHistory()
    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [listProjectbyStaffPickup, setListProjectbyStaffPickup] = useState([])
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
                let data = res.DT.filter(item => item.statuspickupId === 0)
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

    const updatePickup = async (item) => {
        if (!item.User_PickUp && !item.Number_PickUp) {
            let res = await updatePickupInProject(+user.account.shippingUnit_Id, item.id, user.account.username, user.account.phone, 1, new Date())
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "đơn hàng đang lấy hàng", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUser()
                    await HandleSearchData(valueSearch)
                    if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupWithRound?.name === "Dev") {
                        await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                    }
                } else {
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




    const fetchProjectUser = async () => {

        let res = await getDataSortByPickup(+user.account.shippingUnit_Id, 0)
        if (res && +res.EC === 0) {
            setListProjectbyStaffPickup(res.DT)
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
                                    <h4>
                                        {t('Pick-up.One')}
                                    </h4>
                                    <div className='more-employer-pickup'>
                                        <b>{user?.account?.nameUnit?.NameUnit}</b>


                                    </div>
                                    <span>{user?.account?.Position}</span>
                                </div>
                                <div className='sort_pickup my-3'>
                                    <div className='container my-3'>
                                        <div className='row mx-3'>
                                            <div className='col-3 content-pickup' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Pickup_staff" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Pick-up.Two')}
                                                </Link>
                                            </div>
                                            <div className='col-3 my-2 content-pickup ' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}>
                                                {t('Pick-up.Three')}
                                            </div>

                                            <div className='col-3 content-pickup' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Pick_up_status_one" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Pick-up.Four')}
                                                </Link>
                                            </div>
                                            <div className='col-3 content-pickup' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Pick_up_status_two" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Pick-up.Five')}
                                                </Link>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {isSearch === false &&
                                    <>
                                        <div className='table-wrapper-employer-pickup my-5'>
                                            <div className='container'>
                                                <div className='title-employer-pickup my-3'>
                                                    {t('Pick-up.Six')} ({listProjectbyStaffPickup.length})
                                                </div>
                                                <hr />
                                                <div className='sub-title-employer-pickup'>
                                                    <div className='sub-left '>
                                                        <div className=' mx-3' style={{ color: "red" }}><i class="fa fa-flag" aria-hidden="true"></i>
                                                        </div>
                                                        <div className='NameColor'>
                                                            {t('Pick-up.Seven')}
                                                        </div>

                                                    </div>

                                                </div>
                                                <table class="table table-bordered table-body-employer-pickup">
                                                    <thead>
                                                        <tr className='table-secondary'>
                                                            <th scope="col"></th>


                                                            <th scope="col">
                                                                {t('Pick-up.Body.Two')}
                                                            </th>

                                                            <th scope="col">
                                                                {t('Pick-up.Body.Three')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Pick-up.Body.Four')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Pick-up.Body.Five')}
                                                            </th>
                                                            <th scope="col" style={{ width: "120px" }}>
                                                                {t('Pick-up.Body.TwentyFive')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Pick-up.Body.Seven')}
                                                            </th>

                                                            <th scope="col" style={{ width: "200px" }}>
                                                                {t('Pick-up.Body.Eight')}
                                                            </th>
                                                            <th scope="col" >
                                                                {t('Pick-up.Body.Night')}
                                                            </th>
                                                            <th scope="col" >
                                                                {t('Pick-up.Body.Ten')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Pick-up.Body.Eleven')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Pick-up.Body.TwentyFour')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Pick-up.Body.Twelve')}
                                                            </th>
                                                        </tr>


                                                    </thead>
                                                    {listProjectbyStaffPickup && listProjectbyStaffPickup.length > 0
                                                        ?

                                                        listProjectbyStaffPickup.map((item, index) => {
                                                            return (
                                                                <tbody>

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

                                                                        <td>
                                                                            {item?.Warehouse?.product}</td>
                                                                        <td>
                                                                            {item.quantity}/{item.unit}
                                                                        </td>
                                                                        <td>

                                                                            {item?.createdByName}
                                                                            <br />
                                                                            {item?.createdBy}
                                                                            <br />
                                                                            <b>{t('Pick-up.Body.Six')}</b>
                                                                            <br />
                                                                            {moment(`${item.createdAt}`).format("DD/MM/YYYY")}

                                                                        </td>
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
                                                                        <td>
                                                                            {item?.Note ? item?.Note : ""}
                                                                            <br />
                                                                            {item?.Notemore ? item?.Notemore : ""}

                                                                        </td>
                                                                        <td>
                                                                            {!item?.User_PickUp &&

                                                                                <button className='btn btn-danger' onClick={() => updatePickup(item)}>
                                                                                    {t('Pick-up.Body.Thirteen')}
                                                                                </button>

                                                                            }


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
                                                                        {t('Pick-up.Body.Sixteen')}
                                                                    </h5>

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
                                            <div className='title-employer-search my-3'>
                                                {t('Pick-up.Body.TwentyTwo')} ({listProjectSearch.length})
                                            </div>
                                            <hr />
                                            <table class="table table-bordered table-body-employer-search">
                                                <thead>
                                                    <tr className='table-secondary'>
                                                        <th scope="col"></th>
                                                        <th scope="col">
                                                            {t('Pick-up.Body.Two')}
                                                        </th>

                                                        <th scope="col">
                                                            {t('Pick-up.Body.Three')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Pick-up.Body.Four')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Pick-up.Body.Five')}
                                                        </th>
                                                        <th scope="col" style={{ width: "120px" }}>
                                                            {t('Pick-up.Body.TwentyFive')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Pick-up.Body.Seven')}
                                                        </th>

                                                        <th scope="col" style={{ width: "200px" }}>
                                                            {t('Pick-up.Body.Eight')}
                                                        </th>
                                                        <th scope="col" >
                                                            {t('Pick-up.Body.Night')}
                                                        </th>
                                                        <th scope="col" >
                                                            {t('Pick-up.Body.Ten')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Pick-up.Body.Eleven')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Pick-up.Body.TwentyFour')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Pick-up.Body.Twelve')}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                {listProjectSearch && listProjectSearch.length > 0
                                                    ?

                                                    listProjectSearch.map((item, index) => {
                                                        return (
                                                            <tbody key={`item-${index}`}>

                                                                <tr class="table-primary">
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

                                                                    <td>
                                                                        {item?.Warehouse?.product}</td>
                                                                    <td>
                                                                        {item.quantity}/{item.unit}
                                                                    </td>
                                                                    <td>

                                                                        {item?.createdByName}
                                                                        <br />
                                                                        {item?.createdBy}
                                                                        <br />
                                                                        <b>{t('Pick-up.Body.Six')}</b>
                                                                        <br />
                                                                        {moment(`${item.createdAt}`).format("DD/MM/YYYY")}

                                                                    </td>
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
                                                                    <td>
                                                                        {item?.Note ? item?.Note : ""}
                                                                        <br />
                                                                        {item?.Notemore ? item?.Notemore : ""}

                                                                    </td>
                                                                    <td>
                                                                        {!item?.User_PickUp &&

                                                                            <button className='btn btn-danger' onClick={() => updatePickup(item)}>
                                                                                {t('Pick-up.Body.Thirteen')}
                                                                            </button>

                                                                        }


                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        )

                                                    }


                                                    )
                                                    :
                                                    <tr class="table-info">
                                                        <td colSpan={14}>
                                                            <div className='d-flex align-item-center justify-content-center'>

                                                                <h5>
                                                                    {t('Pick-up.Body.TwentyThree')}
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

export default PickUpNoStatus;