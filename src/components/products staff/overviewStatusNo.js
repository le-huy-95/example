import './overview.scss'

import SidebarStaff from "../sidebar/sidebar staff"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import { updateOverviewInProject, getDataSortByOverview, getDataSearchByEmplyer, createNotification } from "../services/ProjectService"
import moment from "moment"
import { toast } from 'react-toastify'
import _, { debounce } from "lodash"

const OverviewNoStatus = (props) => {
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
                let data = res.DT.filter(item => item.receiveMoneyId === 0 && item.statusDeliveryId === 2)

                setListProjectSearch(data)
            }

        } else {
            SetIsSearch(false)
            await fetchProjectUser()

        }

    }, 200)

    const update = async (item) => {
        if (!item.User_Overview && !item.Number_Overview) {
            let res = await updateOverviewInProject(item.id, +user.account.shippingUnit_Id, user.account.username, user.account.phone, 1, new Date(), "", "")
            if (res && +res.EC === 0) {
                let abc = await createNotification(item.id, item.order, "đơn hàng đang đối soát", `${user.account.username}-${user.account.phone}`, item.createdBy, 0, 1, item.shippingUnit_Id)
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

        let res = await getDataSortByOverview(+user.account.shippingUnit_Id, 0)
        if (res && +res.EC === 0) {
            let data = res.DT.filter(item => item.statusDeliveryId === 2)

            setListProjectbyStaffOverview(data)
        }
    }


    useEffect(() => {
        fetchProjectUser();


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
                                    <h4> OverView </h4>
                                    <div className='more-overview'>
                                        <b>Giao hàng tiết kiệm</b>


                                    </div>
                                    <span> nhân viên kế toán</span>

                                </div>
                                <div className='sort_Overview my-3'>
                                    <div className='container my-3'>
                                        <div className='row mx-3'>
                                            <div className='col-4 content-Overview' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Overview" style={{ textDecoration: "none", color: "#474141" }}>Tất cả đơn </Link>
                                            </div>

                                            <div className='col-4 my-2 content-Overview ' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}> Đơn chưa đối soát  </div>

                                            <div className='col-4 content-Overview' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Overview_status-one" style={{ textDecoration: "none", color: "#474141" }}> Đơn đang đối soát </Link>
                                            </div>
                                            <div className='col-4 content-Overview' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Overview_status-two" style={{ textDecoration: "none", color: "#474141" }}> Đơn thanh toán chuyển khoản </Link>
                                            </div>
                                            <div className='col-4 content-Overview' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Overview_status-three" style={{ textDecoration: "none", color: "#474141" }}>Đơn thanh toán trực tiếp  </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {isSearch === false &&
                                    <>

                                        <div className='table table-bordered table-wrapper-overview-One my-5'>
                                            <div className='container'>
                                                <div className='title-overview-One my-3'>đơn hàng đã xử lý ({listProjectbyStaffOverview.length})</div>
                                                <hr />

                                                <table className="table table-bordered table-body-overview">
                                                    <thead>
                                                        <tr className='table-secondary'>
                                                            <th scope="col">Id</th>
                                                            <th scope="col">Mã đơn</th>
                                                            <th scope="col">Thông tin người tạo </th>
                                                            <th scope="col">T/T thanh toán</th>
                                                            <th scope="col">Hình tức thanh toán </th>
                                                            <th scope="col">Tổng tiền cần thanh toán </th>
                                                            <th scope="col">Loại tiền</th>
                                                            <th scope="col">Thời gian nhận đơn</th>
                                                            <th scope="col">Thời gian hòan thành</th>


                                                            <th scope="col">Người nhận đơn</th>
                                                            <th scope="col">Thao tác</th>

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
                                                                        {!item.receiveMoneyId &&
                                                                            <td style={{ color: "orange", fontWeight: "600" }}>{item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "Chưa xử lý"} </td>

                                                                        }

                                                                        {item.Mode_of_payment === "Nhận tiền thanh toán qua tài khoản ngân hàng" &&
                                                                            <td>
                                                                                <span>
                                                                                    <b>hình thức:</b>   <span style={{ color: "red", fontWeight: "600" }}>{item?.Mode_of_payment ? item?.Mode_of_payment : ""}</span>
                                                                                </span>
                                                                                <br />

                                                                                <span>
                                                                                    <b>Tên ngân hàng :</b> {item?.Bank_name ? item?.Bank_name : ""}
                                                                                </span>
                                                                                <br />
                                                                                <span>
                                                                                    <b>Chủ tại khoản:</b>   {item?.name_account ? item?.name_account : ""}
                                                                                </span>
                                                                                <br />

                                                                                <span>
                                                                                    <b>Stk:</b>   {item?.Main_Account ? item?.Main_Account : ""}
                                                                                </span>
                                                                            </td>
                                                                        }
                                                                        {item.Mode_of_payment === "Nhận tiền thanh toán ở trung tâm" &&
                                                                            <td>
                                                                                <span>
                                                                                    <b>hình thức:</b> <span style={{ color: "red", fontWeight: "600" }}>{item?.Mode_of_payment ? item?.Mode_of_payment : ""}</span>
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


                                                                        {+item.receiveMoneyId === 0 &&
                                                                            < td >

                                                                                <button className='btn btn-danger mb-3' onClick={() => update(item)} > Nhận đơn</button>

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
                                    <div className='table-wrapper-overview-One my-5'>
                                        <div className='container'>
                                            <div className='title-overview-One my-3'>Kết quả tìm kiếm ({listProjectSearch.length})</div>
                                            <hr />

                                            <table className="table table-bordered table-body-overview">
                                                <thead>
                                                    <tr className='table-secondary'>
                                                        <th scope="col">Id</th>
                                                        <th scope="col">Mã đơn</th>
                                                        <th scope="col">Thông tin người tạo </th>
                                                        <th scope="col">T/T thanh toán</th>
                                                        <th scope="col">Hình tức thanh toán </th>
                                                        <th scope="col">Tổng tiền cần thanh toán </th>
                                                        <th scope="col">Loại tiền</th>

                                                        <th scope="col">Người nhận đơn</th>
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
                                                                    {item.receiveMoneyId == 1 &&
                                                                        <td style={{ color: "blue", fontWeight: "600" }}>{item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "Chưa xử lý"} </td>

                                                                    }
                                                                    {item.receiveMoneyId == 2 &&
                                                                        <td style={{ color: "red", fontWeight: "600" }}>{item?.Status_Received_money?.status ? item?.Status_Received_money?.status : "Chưa xử lý"} </td>

                                                                    }
                                                                    <td>
                                                                        <span>
                                                                            {item?.Bank_name ? item?.Bank_name : ""}
                                                                        </span>
                                                                        <br />
                                                                        <span>
                                                                            {item?.Account_number ? item?.Account_number : ""}
                                                                        </span>
                                                                    </td>
                                                                    <td>{item.total}</td>
                                                                    <td>{item.unit_money}</td>
                                                                    <td>
                                                                        {item.User_Overview}
                                                                        <br />
                                                                        {item.Number_Overview}

                                                                    </td>

                                                                    {+item.receiveMoneyId === 0 &&
                                                                        < td >

                                                                            <button className='btn btn-danger' onClick={() => update(item)}>Nhận đơn</button>

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

export default OverviewNoStatus;