import './overview.scss'

import SidebarStaff from "../sidebar/sidebar staff"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import { getProjectWithPaginationWithEmployerOverview, getProjectWithPaginationWithEmployerOverview_user, updateOverviewInProject, getDataSearchByEmplyer, createNotification } from "../services/ProjectService"
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify'
import moment from "moment"
import _, { debounce } from "lodash"
import { useTranslation, Trans } from 'react-i18next';

const Overview = (props) => {
    const { t, i18n } = useTranslation();

    let history = useHistory()
    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [listProjectbyStaffOverview, setListProjectbyStaffOverview] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [currentLimit, setCurrentLimit] = useState(6)
    const [isSearch, SetIsSearch] = useState(false)
    const [totalPage, setTotalPage] = useState(0)
    const [listProjectbyuserStaff, setListProjectbyuserStaff] = useState([])
    const [listProjectSearch, setListProjectSearch] = useState([])
    const [valueSearch, setvalueSearch] = useState("")


    const HandleSearchData = debounce(async (value) => {
        let data = value
        setvalueSearch(value)
        if (data) {
            SetIsSearch(true)
            let res = await getDataSearchByEmplyer(data, user.account.Position, +user.account.shippingUnit_Id)
            console.log("res", res)
            if (res && +res.EC === 0) {
                let data = res.DT.filter(item => item.statusDeliveryId === 2)

                setListProjectSearch(data)
            }

        } else {
            SetIsSearch(false)
            await fetchProjectUserWithUsername()
            await fetchProjectUser()
        }

    }, 200)

    const update = async (item) => {
        if (!item.User_Overview && !item.Number_Overview) {
            let res = await updateOverviewInProject(item.id, +user.account.shippingUnit_Id, user.account.username, user.account.phone, 1, new Date(), "", "")
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "đơn hàng đang đối soát", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUserWithUsername()
                    await fetchProjectUser()
                    await HandleSearchData(valueSearch)
                }

            } else {
                toast.error(res.EM)
            }
        }
        if (item.User_Overview && item.Number_Overview) {
            let res = await updateOverviewInProject(item.id, +user.account.shippingUnit_Id, "", "", 0, "", "", "")
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "đơn hàng trì hoãn đối soát", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUserWithUsername()
                    await fetchProjectUser()
                    await HandleSearchData(valueSearch)
                }

            } else {
                toast.error(res.EM)
            }
        }

    }
    const complete = async (item) => {
        if (item.Mode_of_payment === "Nhận tiền thanh toán qua tài khoản ngân hàng") {
            let res = await updateOverviewInProject(item.id, +user.account.shippingUnit_Id, user.account.username, user.account.phone, 2, item.Overview_time, new Date(), 1)
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "đơn hàng đối soát xong bằng chuyển khoản", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 0, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUserWithUsername()
                    await fetchProjectUser()
                    await HandleSearchData(valueSearch)
                }
            } else {
                toast.error(res.EM)
            }
        }
        if (item.User_Overview && item.Number_Overview && item.Mode_of_payment === "Nhận tiền thanh toán ở trung tâm") {
            let res = await updateOverviewInProject(item.id, +user.account.shippingUnit_Id, user.account.username, user.account.phone, 3, item.Overview_time, new Date(), 1)
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "đơn hàng đối soát xong bằng tiền mặt", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    await fetchProjectUserWithUsername()
                    await fetchProjectUser()
                    await HandleSearchData(valueSearch)
                }
            } else {
                toast.error(res.EM)
            }
        }

    }



    const fetchProjectUserWithUsername = async () => {
        let res = await getProjectWithPaginationWithEmployerOverview_user(+user.account.shippingUnit_Id, user.account.username, user.account.phone)
        if (res && +res.EC === 0) {
            setListProjectbyuserStaff(res.DT)
        } else {
            toast.error(res.EM)
        }

    }
    const fetchProjectUser = async () => {

        let res = await getProjectWithPaginationWithEmployerOverview(currentPage, currentLimit, +user.account.shippingUnit_Id)
        if (res && +res.EC === 0) {
            setTotalPage(+res.DT.totalPage)
            if (res.DT.totalPage > 0 && res.DT.dataProject.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await getProjectWithPaginationWithEmployerOverview(+res.DT.totalPage, currentLimit, +user.account.shippingUnit_Id)
            }
            if (res.DT.totalPage > 0 && res.DT.dataProject.length > 0) {
                let data = res.DT.dataProject
                console.log("data", res.DT)
                if (data) {
                    setListProjectbyStaffOverview(data)
                }
            }
            if (res.DT.totalPage === 0 && res.DT.dataProject.length === 0) {
                let data = res.DT.dataProject
                setListProjectbyStaffOverview(data)

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
                                            <div className='col-4 my-2 content-Overview ' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}>
                                                {t('Accountant-employer.Two')}
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
                                            <div className='col-4 content-Overview' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Overview_status-three" style={{ textDecoration: "none", color: "#474141" }}>
                                                    {t('Accountant-employer.Six')}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {isSearch === false &&
                                    <>
                                        <div className='table-wrapper-overview my-5'>
                                            <div className='container'>
                                                <div className='title-overview my-3'>
                                                    {t('Accountant-employer.Eight')} ({listProjectbyStaffOverview.length})
                                                </div>
                                                <hr />
                                                <div className='sub-title-overview'>

                                                    <div className='sub-title-overview-right ' >
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
                                                <table className="table table-bordered table-body-overview">
                                                    <thead>
                                                        <tr className='table-secondary'>
                                                            <th scope="col">
                                                                {t('Accountant-employer.Body.One')}
                                                            </th>
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
                                                                        <td >{(currentPage - 1) * currentLimit + index + 1}</td>
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

                                                                        {item.receiveMoneyId === 0 &&
                                                                            <td style={{ color: "orange", fontWeight: "600" }}>{item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "Chưa xử lý"} </td>

                                                                        }
                                                                        {item.receiveMoneyId > 0 &&
                                                                            <td style={{ color: "blue", fontWeight: "600" }}>{item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "Chưa xử lý"} </td>

                                                                        }

                                                                        {item.Mode_of_payment === "Nhận tiền thanh toán qua tài khoản ngân hàng" &&
                                                                            <td>
                                                                                <span>
                                                                                    <b>{t('Accountant-employer.Body.Six')}:</b>   <span style={{ color: "red", fontWeight: "600" }}>{item?.Mode_of_payment ? item?.Mode_of_payment : ""}</span>
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
                                                                                    <b>{t('Accountant-employer.Body.Six')} :</b>   <span style={{ color: "red", fontWeight: "600" }}>{item?.Mode_of_payment ? item?.Mode_of_payment : ""}</span>
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
                                                                        {item.receiveMoneyId === 0 &&
                                                                            <td>
                                                                                <button className='btn btn-danger mb-3' onClick={() => update(item)} >
                                                                                    {t('Accountant-employer.Body.Fourteen')}
                                                                                </button>

                                                                            </td>

                                                                        }
                                                                        {item.receiveMoneyId === 1 &&
                                                                            <td style={{ color: "orange", fontWeight: "600" }}>
                                                                                {t('Accountant-employer.Body.Fifteen')}
                                                                            </td>

                                                                        }
                                                                        {item.receiveMoneyId === 2 || item.receiveMoneyId === 3 &&
                                                                            <td style={{ color: "blue", fontWeight: "600" }}>
                                                                                {t('Accountant-employer.Body.Sixteen')}
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
                                                                        {t('Accountant-employer.Body.TwentyTwo')}
                                                                    </h5>

                                                                </div>

                                                            </td>

                                                        </tr>
                                                    }


                                                </table>
                                            </div>


                                        </div>
                                        <div className='table table-bordered table-wrapper-overview-One my-5'>
                                            <div className='container'>
                                                <div className='title-overview-One my-3'>
                                                    {t('Accountant-employer.Body.TwentyOne')}({listProjectbyuserStaff.length})
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
                                                    {listProjectbyuserStaff && listProjectbyuserStaff.length > 0
                                                        ?
                                                        listProjectbyuserStaff.map((item, index) => {
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
                                                                        {!item.receiveMoneyId &&
                                                                            <td style={{ color: "orange", fontWeight: "600" }}>{item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "Chưa xử lý"} </td>

                                                                        }
                                                                        {item.receiveMoneyId &&
                                                                            <td style={{ color: "blue", fontWeight: "600" }}>{item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "Chưa xử lý"} </td>

                                                                        }

                                                                        {item.Mode_of_payment === "Nhận tiền thanh toán qua tài khoản ngân hàng" &&
                                                                            <td>
                                                                                <span>
                                                                                    <b>{t('Accountant-employer.Body.Six')}</b>   <span style={{ color: "red", fontWeight: "600" }}>{item?.Mode_of_payment ? item?.Mode_of_payment : ""}</span>
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


                                                                        {+item.receiveMoneyId === 1 &&
                                                                            < td >
                                                                                <button className='btn btn-success mb-3' onClick={() => complete(item)}>
                                                                                    {t('Accountant-employer.Body.Seventeen')}
                                                                                </button>
                                                                                <br />
                                                                                <button className='btn btn-danger mb-3' onClick={() => update(item)} >
                                                                                    {t('Accountant-employer.Body.TwentySix')}
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
                                                                        {t('Accountant-employer.Body.Twenty')}
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
                                                                    {!item.receiveMoneyId &&
                                                                        <td style={{ color: "orange", fontWeight: "600" }}>{item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "Chưa xử lý"} </td>

                                                                    }
                                                                    {item.receiveMoneyId > 0 &&
                                                                        <td style={{ color: "blue", fontWeight: "600" }}>{item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "Chưa xử lý"} </td>

                                                                    }

                                                                    {item.Mode_of_payment === "Nhận tiền thanh toán qua tài khoản ngân hàng" &&
                                                                        <td>
                                                                            <span>
                                                                                <b>{t('Accountant-employer.Body.Six')}</b>   <span style={{ color: "red", fontWeight: "600" }}>{item?.Mode_of_payment ? item?.Mode_of_payment : ""}</span>
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

                                                                    {item.receiveMoneyId === 0 &&
                                                                        <td>
                                                                            <button className='btn btn-danger mb-3' onClick={() => update(item)} >
                                                                                {t('Accountant-employer.Body.Fourteen')}
                                                                            </button>

                                                                        </td>

                                                                    }
                                                                    {+item.receiveMoneyId === 1 && user?.account?.phone == item.Number_Overview &&
                                                                        < td >
                                                                            <button className='btn btn-success mb-3' onClick={() => complete(item)}>
                                                                                {t('Accountant-employer.Body.Seventeen')}
                                                                            </button>
                                                                            <br />
                                                                            <button className='btn btn-danger mb-3' onClick={() => update(item)} >
                                                                                {t('Accountant-employer.Body.TwentySix')}
                                                                            </button>

                                                                        </td>
                                                                    }
                                                                    {+item.receiveMoneyId === 1 && user?.account?.phone !== item.Number_Overview &&
                                                                        <td style={{ color: "orange", fontWeight: "600" }}>
                                                                            {t('Accountant-employer.Body.Fifteen')}
                                                                        </td>
                                                                    }
                                                                    {item.receiveMoneyId === 2 || item.receiveMoneyId === 3 &&
                                                                        <td style={{ color: "blue", fontWeight: "600" }}>
                                                                            {t('Accountant-employer.Body.Sixteen')}
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

                                                                <h5>{t('Accountant-employer.Body.TwentySeven')}</h5>

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

export default Overview;