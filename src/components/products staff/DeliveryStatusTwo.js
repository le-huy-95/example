import './Delivery_staff.scss'

import SidebarStaff from "../sidebar/sidebar staff"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import { getDataSearchByEmplyer, updateDeliveryInProject, getDataSortByDelivery, getProjectWithPaginationWithEmployerDelivery_user } from "../services/ProjectService"
import ReactPaginate from 'react-paginate';
import ModalChatWithCutomer from "./modalChatWithCutomer"
import { toast } from 'react-toastify'
import moment from "moment"
import _, { debounce } from "lodash"
import ModalCancelReason from "./modal_cancel_reason"
import { useTranslation, Trans } from 'react-i18next';
import { NotificationContext } from "../../contexApi/NotificationContext"

const DeliveryStatusTwo = (props) => {
    const { t, i18n } = useTranslation();
    const { list, getALlListNotification, listStaff } = React.useContext(NotificationContext);

    let history = useHistory()
    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [isSearch, SetIsSearch] = useState(false)
    const [listProjectbyStaffDelivery, setListProjectbyStaffDelivey] = useState([])
    const [listProjectSearch, setListProjectSearch] = useState([])




    const HandleSearchData = debounce(async (value) => {
        let data = value
        if (data) {
            SetIsSearch(true)
            let res = await getDataSearchByEmplyer(data, user.account.Position, +user.account.shippingUnit_Id)
            if (res && +res.EC === 0) {
                let data = res.DT.filter(item => item.statusDeliveryId === 2)
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
            await fetchProjectUser()
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
        }

    }, 200)




    const fetchProjectUser = async () => {

        let res = await getDataSortByDelivery(+user.account.shippingUnit_Id, 2)
        if (res && +res.EC === 0) {
            setListProjectbyStaffDelivey(res.DT)
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

    }, [])
    return (
        <div className='employer-Delivery-container '>
            <div className='left-employer-Delivery d-none d-lg-block '>
                <SidebarStaff collapsed={collapsed} />

            </div>
            <div className='right-employer-Delivery  '>
                <div className='btn-toggle-employer-Delivery d-none d-lg-block'>
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
                        <div className='header-employer-Delivery mt-2'>
                            <div className='container'>
                                <div className='row'>
                                    <div className='location-path-employer-Delivery col-12 col-lg-6'>
                                        <Link to="/"> Home</Link>

                                        <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                        </span>
                                        <Link to="/Delivery_staff">Delivery</Link>
                                    </div>
                                    <div className='search-employer-Delivery col-12 col-lg-6 my-2'>
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
                            </div>
                        </div>
                        <div className='body-employer-Delivery'>
                            <div className="container">
                                <div className='name-page-employer-Delivery'>
                                    <h4>
                                        {t('Delivery-employer.One')}
                                    </h4>
                                    <div className='more-employer-pickup'>
                                        <b>{user?.account?.nameUnit?.NameUnit}</b>


                                    </div>
                                    <span>{user?.account?.Position}</span>
                                </div>
                                <div className='sort_Delivery my-3'>
                                    <div className='container my-3'>
                                        <div className='row mx-3'>
                                            <div className='col-12 col-lg-3 content-Delivery' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Delivery_staff" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Delivery-employer.Two')}
                                                </Link>
                                            </div>

                                            <div className='col-12 col-lg-3 content-Delivery' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Delivery_no_status" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Delivery-employer.Three')}
                                                </Link>
                                            </div>
                                            <div className='col-12 col-lg-3 content-Delivery' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Delivery_status_one" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Delivery-employer.Four')}
                                                </Link>
                                            </div>
                                            <div className='col-12 col-lg-3 my-2 content-Delivery ' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}>
                                                {t('Delivery-employer.Five')}
                                            </div>
                                            <div className='col-12 col-lg-3 content-Delivery' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Delivery_status_four" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Delivery-employer.Six')}
                                                </Link>
                                            </div>
                                            <div className='col-12 col-lg-3 content-Delivery' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Delivery_status_three" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Delivery-employer.Seven')}
                                                </Link>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                                {isSearch === false &&
                                    <div className='table-wrapper-employer-Delivery my-5'>
                                        <div className='container'>
                                            <div className='title-employer-Delivery my-2'>
                                                {t('Delivery-employer.Eight')} ({listProjectbyStaffDelivery.length})
                                            </div>
                                            <hr />
                                            <div className='sub-title-employer-Delivery my-2'>
                                                <div className='sub-left '>
                                                    <div className=' mx-3' style={{ color: "red" }}><i class="fa fa-flag" aria-hidden="true"></i>
                                                    </div>
                                                    <div className='NameColor'>
                                                        {t('Delivery-employer.Night')}
                                                    </div>

                                                </div>
                                                <div className='sub-title-employer-Delivery my-2' >

                                                </div>

                                            </div>
                                            <div style={{ overflow: "auto" }}>
                                                <table class="table table-bordered table-body-employer-Delivery">
                                                    <thead>
                                                        <tr className='table-secondary' >
                                                            <th></th>

                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Two')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Three')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Four')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Five')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Seven')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Eight')}
                                                            </th>

                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Ten')}
                                                            </th>
                                                            <th scope="col" style={{ width: "120px" }}>
                                                                {t('Delivery-employer.Body.Eleven')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Twelve')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Thirteen')}
                                                            </th>

                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Fifteen')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Sixteen')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Seventeen')}
                                                            </th>



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
                                                                        <td>
                                                                            {item?.name_customer}
                                                                            <br />
                                                                            {item?.phoneNumber_customer}
                                                                            <hr />
                                                                            <b> {t('Delivery-employer.Body.Six')}  </b>
                                                                            <br />
                                                                            {item.addressDetail},{item?.Ward_customer?.name},{item?.District_customer?.name},{item?.Province_customer?.name}
                                                                        </td>

                                                                        <td>
                                                                            <span style={{ color: "red", fontWeight: "700" }}>
                                                                                {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "chưa giao hàng"}

                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            {item?.Note ? item?.Note : ""}
                                                                            <br />
                                                                            {item?.Notemore ? item?.Notemore : ""}

                                                                        </td>
                                                                        <td>
                                                                            {item?.User_Delivery ? item?.User_Delivery : "chưa ai nhận đơn"}
                                                                            <br />
                                                                            {item?.Number_Delivery ? item?.Number_Delivery : ""}

                                                                        </td>
                                                                        <td>
                                                                            {item.totalWithShippingCost} {item.unit_money}
                                                                            <br />

                                                                        </td>
                                                                        <td style={{ color: "red", fontWeight: "700" }}>{item?.Cancel_reason ? item?.Cancel_reason : ""}</td>
                                                                        <td style={{ color: "red", fontWeight: "700" }}>{item?.Notice_Delivery ? item?.Notice_Delivery : ""}</td>


                                                                        <td>{item?.Delivery_time ? moment(`${item?.Delivery_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        <td>{item?.DeliveryDone_time ? moment(`${item?.DeliveryDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        {item.statusDeliveryId === 2
                                                                            &&
                                                                            <td>
                                                                                <span style={{ color: "green", fontWeight: "700" }} >
                                                                                    {t('Delivery-employer.Body.TwentySix')}
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
                                                                        {t('Delivery-employer.Body.Eighteen')}
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
                                {isSearch === true &&
                                    <div className='table-wrapper-employer-search my-5'>

                                        <div className='container'>
                                            <div className='title-employer-search my-3'>
                                                {t('Delivery-employer.Body.Twenty')} ({listProjectSearch.length})
                                            </div>
                                            <hr />
                                            <div style={{ overflow: "auto" }}>
                                                <table class="table table-bordered table-body-employer-search">
                                                    <thead>
                                                        <tr className='table-secondary'>
                                                            <th></th>

                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Two')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Three')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Four')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Five')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Seven')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Eight')}
                                                            </th>

                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Ten')}
                                                            </th>
                                                            <th scope="col" style={{ width: "120px" }}>
                                                                {t('Delivery-employer.Body.Eleven')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Twelve')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Thirteen')}
                                                            </th>

                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Fifteen')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Sixteen')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Delivery-employer.Body.Seventeen')}
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
                                                                        <td>
                                                                            {item?.name_customer}
                                                                            <br />
                                                                            {item?.phoneNumber_customer}
                                                                            <hr />
                                                                            <b> {t('Delivery-employer.Body.Six')}  </b>
                                                                            <br />
                                                                            {item.addressDetail},{item?.Ward_customer?.name},{item?.District_customer?.name},{item?.Province_customer?.name}
                                                                        </td>

                                                                        <td>
                                                                            <span style={{ color: "red", fontWeight: "700" }}>
                                                                                {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "chưa giao hàng"}

                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            {item?.Note ? item?.Note : ""}
                                                                            <br />
                                                                            {item?.Notemore ? item?.Notemore : ""}

                                                                        </td>
                                                                        <td>
                                                                            {item?.User_Delivery ? item?.User_Delivery : "chưa ai nhận đơn"}
                                                                            <br />
                                                                            {item?.Number_Delivery ? item?.Number_Delivery : ""}

                                                                        </td>
                                                                        <td>
                                                                            {item.totalWithShippingCost} {item.unit_money}
                                                                            <br />

                                                                        </td>
                                                                        <td style={{ color: "red", fontWeight: "700" }}>{item?.Cancel_reason ? item?.Cancel_reason : ""}</td>
                                                                        <td style={{ color: "red", fontWeight: "700" }}>{item?.Notice_Delivery ? item?.Notice_Delivery : ""}</td>


                                                                        <td>{item?.Delivery_time ? moment(`${item?.Delivery_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        <td>{item?.DeliveryDone_time ? moment(`${item?.DeliveryDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        {item.statusDeliveryId === 2
                                                                            &&
                                                                            <td>
                                                                                <span style={{ color: "green", fontWeight: "700" }} >
                                                                                    {t('Delivery-employer.Body.TwentySix')}
                                                                                </span>

                                                                            </td>

                                                                        }




                                                                    </tr>
                                                                </tbody>
                                                            )

                                                        }


                                                        )
                                                        :
                                                        <tr class="table-primary">
                                                            <td colSpan={14}>
                                                                <div className='d-flex align-item-center justify-content-center'>

                                                                    <h5>{t('Delivery-employer.Body.TwentyOne')}</h5>

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


            </div >

        </div >




    )


}
export default DeliveryStatusTwo;