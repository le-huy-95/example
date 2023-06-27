import './overview.scss'

import SidebarStaff from "../sidebar/sidebar staff"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import { updateOverviewInProject, getDataSortByOverview, getDataSearchByEmplyer } from "../services/ProjectService"
import moment from "moment"
import { toast } from 'react-toastify'
import _, { debounce } from "lodash"
import { useTranslation, Trans } from 'react-i18next';
import { NotificationContext } from "../../contexApi/NotificationContext"

const OverviewStatusThree = (props) => {
    const { t, i18n } = useTranslation();
    const { list, getALlListNotification, listStaff } = React.useContext(NotificationContext);

    let history = useHistory()
    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [listProjectbyStaffOverview, setListProjectbyStaffOverview] = useState([])
    const [listProjectSearch, setListProjectSearch] = useState([])
    const [isSearch, SetIsSearch] = useState(false)


    const [valueSearch, setvalueSearch] = useState("")





    const HandleSearchData = debounce(async (value) => {
        let data = value
        setvalueSearch(value)
        if (data) {
            SetIsSearch(true)
            let res = await getDataSearchByEmplyer(data, user.account.Position, +user.account.shippingUnit_Id)
            if (res && +res.EC === 0) {
                let data = res.DT.filter(item => item.receiveMoneyId === 3)
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

        let res = await getDataSortByOverview(+user.account.shippingUnit_Id, 3)
        if (res && +res.EC === 0) {
            setListProjectbyStaffOverview(res.DT)
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
        <div className='overview-container '>
            <div className='left-overview  '>
                <SidebarStaff collapsed={collapsed} />

            </div>
            <div className='right-overview  '>
                <div className='btn-toggle-overview'>
                    <span onClick={() => setCollapsed(!collapsed)} className=" d-sm-block ">
                        {collapsed === false ?
                            <i className="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
                            :
                            <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>

                        }
                    </span>
                </div>
                <div className='right-body-overview'>
                    <div className='container'>
                        <div className='header-overview'>
                            <div className='location-path-overview col'>
                                <Link to="/"> Home</Link>

                                <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                </span>
                                <Link to="/Overview">Delivery</Link>
                            </div>
                            <div className='col search-overview'>
                                <div className='search-icon-overview'>
                                    <i className="fa fa-search" aria-hidden="true"></i>

                                </div>
                                <input
                                    type="text"
                                    placeholder='Search infomation'
                                    onChange={(event) => HandleSearchData(event.target.value)}

                                />
                            </div>
                        </div>
                        <div className='body-overview'>
                            <div className="container">
                                <div className='name-page-overview'>
                                    <h4>
                                        {t('Accountant-employer.One')}
                                    </h4>
                                    <div className='more-overview'>
                                        <b>
                                            {user?.account?.nameUnit?.NameUnit}
                                        </b>


                                    </div>
                                    <span>
                                        {user?.account?.Position}

                                    </span>
                                </div>
                                <div className='sort_Overview my-3'>
                                    <div className='container my-3'>
                                        <div className='row mx-3'>
                                            <div className='col-4 content-Overview' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Overview" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Accountant-employer.Two')}
                                                </Link>
                                            </div>

                                            <div className='col-4 content-Overview' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Overview_no_status" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Accountant-employer.Three')}
                                                </Link>
                                            </div>
                                            <div className='col-4 content-Overview' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Overview_status-one" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Accountant-employer.Four')}
                                                </Link>
                                            </div>
                                            <div className='col-4 content-Overview' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Overview_status-two" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Accountant-employer.Five')}
                                                </Link>
                                            </div>
                                            <div className='col-4 my-2 content-Overview ' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}>
                                                {t('Accountant-employer.Six')}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {isSearch === false &&
                                    <>

                                        <div className='table table-bordered table-wrapper-overview-One my-5'>
                                            <div className='container'>
                                                <div className='title-overview-One my-3'>
                                                    {t('Accountant-employer.Eight')} ({listProjectbyStaffOverview.length})
                                                </div>
                                                <hr />

                                                <table className="table table-bordered table-body-overview">
                                                    <thead>
                                                        <tr className='table-secondary'>
                                                            <th scope="col">
                                                                {t('Accountant-employer.Body.Two')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Accountant-employer.Body.Three')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Accountant-employer.Body.Four')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Accountant-employer.Body.Five')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Accountant-employer.Body.Six')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Accountant-employer.Body.Seven')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Accountant-employer.Body.Eight')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Accountant-employer.Body.Ten')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Accountant-employer.Body.Eleven')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Accountant-employer.Body.Twelve')}
                                                            </th>
                                                            <th scope="col">
                                                                {t('Accountant-employer.Body.Thirteen')}
                                                            </th>

                                                        </tr>
                                                    </thead>
                                                    {listProjectbyStaffOverview && listProjectbyStaffOverview.length > 0
                                                        ?
                                                        listProjectbyStaffOverview.map((item, index) => {
                                                            return (
                                                                <tbody key={`item-${index}`}>
                                                                    <tr>
                                                                        <td>{item.id}</td>
                                                                        <td>{item.order}</td>
                                                                        <td>
                                                                            <span>
                                                                                {item.createdByName}
                                                                            </span>
                                                                            <br />
                                                                            <span>
                                                                                {item.createdBy}

                                                                            </span>
                                                                        </td>
                                                                        {item.receiveMoneyId === 3 &&
                                                                            <td style={{ color: "blue", fontWeight: "600" }}>{item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "Chưa xử lý"} </td>

                                                                        }

                                                                        {item.Mode_of_payment === "Nhận tiền thanh toán qua tài khoản ngân hàng" &&
                                                                            <td>
                                                                                <span>
                                                                                    <b>{t('Accountant-employer.Body.Six')}:</b> <span style={{ color: "red", fontWeight: "600" }}>{item?.Mode_of_payment ? item?.Mode_of_payment : ""}</span>
                                                                                </span>
                                                                                <br />

                                                                                <span>
                                                                                    <b>{t('Accountant-employer.Body.TwentyThree')}</b> {item?.Bank_name ? item?.Bank_name : ""}
                                                                                </span>
                                                                                <br />
                                                                                <span>
                                                                                    <b>{t('Accountant-employer.Body.TwentyFour')}</b>   {item?.name_account ? item?.name_account : ""}
                                                                                </span>
                                                                                <br />

                                                                                <span>
                                                                                    <b>{t('Accountant-employer.Body.TwentyFive')}</b>   {item?.Main_Account ? item?.Main_Account : ""}
                                                                                </span>
                                                                            </td>
                                                                        }
                                                                        {item.Mode_of_payment === "Nhận tiền thanh toán ở trung tâm" &&
                                                                            <td>
                                                                                <span>
                                                                                    <b>{t('Accountant-employer.Body.Six')} :</b> <span style={{ color: "red", fontWeight: "600" }}>{item?.Mode_of_payment ? item?.Mode_of_payment : ""}</span>
                                                                                </span>

                                                                            </td>
                                                                        }

                                                                        <td>{item.total}</td>
                                                                        <td>{item.unit_money}</td>

                                                                        <td>{item?.Overview_time ? moment(`${item?.Overview_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        <td>{item?.OverviewDone_time ? moment(`${item?.OverviewDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                        <td>
                                                                            {item.User_Overview ? item.User_Overview : "chưa ai nhận đơn"}
                                                                            <br />
                                                                            {item.Number_Overview && item.Number_Overview}

                                                                        </td>


                                                                        {item.receiveMoneyId === 3 &&
                                                                            < td >

                                                                                <span className='mb-3' style={{ color: "green", fontWeight: "600" }}  >
                                                                                    {t('Accountant-employer.Body.Sixteen')}
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

                                                                    <h5> {t('Accountant-employer.Body.TwentyTwo')}</h5>

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
                                    <div className='table-wrapper-overview-One my-5'>
                                        <div className='container'>
                                            <div className='title-overview-One my-3'>
                                                {t('Accountant-employer.Body.Eighteen')} ({listProjectSearch.length})
                                            </div>
                                            <hr />

                                            <table className="table table-bordered table-body-overview">
                                                <thead>
                                                    <tr className='table-secondary'>
                                                        <th scope="col">
                                                            {t('Accountant-employer.Body.Two')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Accountant-employer.Body.Three')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Accountant-employer.Body.Four')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Accountant-employer.Body.Five')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Accountant-employer.Body.Six')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Accountant-employer.Body.Seven')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Accountant-employer.Body.Eight')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Accountant-employer.Body.Ten')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Accountant-employer.Body.Eleven')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Accountant-employer.Body.Twelve')}
                                                        </th>
                                                        <th scope="col">
                                                            {t('Accountant-employer.Body.Thirteen')}
                                                        </th>


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
                                                                    <td>
                                                                        <span>
                                                                            {item.createdByName}
                                                                        </span>
                                                                        <br />
                                                                        <span>
                                                                            {item.createdBy}

                                                                        </span>
                                                                    </td>
                                                                    {item.receiveMoneyId === 3 &&
                                                                        <td style={{ color: "blue", fontWeight: "600" }}>{item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "Chưa xử lý"} </td>

                                                                    }

                                                                    {item.Mode_of_payment === "Nhận tiền thanh toán qua tài khoản ngân hàng" &&
                                                                        <td>
                                                                            <span>
                                                                                <b>{t('Accountant-employer.Body.Six')}:</b> <span style={{ color: "red", fontWeight: "600" }}>{item?.Mode_of_payment ? item?.Mode_of_payment : ""}</span>
                                                                            </span>
                                                                            <br />

                                                                            <span>
                                                                                <b>{t('Accountant-employer.Body.TwentyThree')}</b> {item?.Bank_name ? item?.Bank_name : ""}
                                                                            </span>
                                                                            <br />
                                                                            <span>
                                                                                <b>{t('Accountant-employer.Body.TwentyFour')}</b>   {item?.name_account ? item?.name_account : ""}
                                                                            </span>
                                                                            <br />

                                                                            <span>
                                                                                <b>{t('Accountant-employer.Body.TwentyFive')}</b>   {item?.Main_Account ? item?.Main_Account : ""}
                                                                            </span>
                                                                        </td>
                                                                    }
                                                                    {item.Mode_of_payment === "Nhận tiền thanh toán ở trung tâm" &&
                                                                        <td>
                                                                            <span>
                                                                                <b>{t('Accountant-employer.Body.Six')}:</b> <span style={{ color: "red", fontWeight: "600" }}>{item?.Mode_of_payment ? item?.Mode_of_payment : ""}</span>
                                                                            </span>

                                                                        </td>
                                                                    }

                                                                    <td>{item.total}</td>
                                                                    <td>{item.unit_money}</td>

                                                                    <td>{item?.Overview_time ? moment(`${item?.Overview_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                    <td>{item?.OverviewDone_time ? moment(`${item?.OverviewDone_time}`).format("DD/MM/YYYY HH:mm:ss") : ""}</td>
                                                                    <td>
                                                                        {item.User_Overview ? item.User_Overview : "chưa ai nhận đơn"}
                                                                        <br />
                                                                        {item.Number_Overview && item.Number_Overview}

                                                                    </td>


                                                                    {item.receiveMoneyId === 3 &&
                                                                        < td >

                                                                            <span className='mb-3' style={{ color: "green", fontWeight: "600" }}  >
                                                                                {t('Accountant-employer.Body.Sixteen')}
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

        </div >




    )


}

export default OverviewStatusThree;