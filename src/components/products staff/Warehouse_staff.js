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

const Warehouse_staff = (props) => {
    let history = useHistory()
    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [ListProjectbyStaffWarehouse, setListProjectbyStaffWarehouse] = useState([])
    const [listProjectbyUsernameStaffWarehouse, setlistProjectbyUsernameStaffWarehouse] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [currentLimit, setCurrentLimit] = useState(7)
    const [isSearch, SetIsSearch] = useState(false)
    const [totalPage, setTotalPage] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [listProjectSearch, setListProjectSearch] = useState([])
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
            setvalueSearch("")
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
            }
        } else {
            toast.error(res.EM)
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
                }

            } else {
                toast.error(res.EM)
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

                }



            } else {
                toast.error(res.EM)
            }
        }
    }


    const fetchProjectUserWithUsername = async () => {
        let res = await getProjectWithPaginationWithEmployerWarehouse_user(+user.account.shippingUnit_Id, user.account.username, user.account.phone)
        if (res && +res.EC === 0) {
            setlistProjectbyUsernameStaffWarehouse(res.DT)
        } else {
            toast.error(res.EM)
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
            }
            if (res.DT.totalPage > 0 && res.DT.dataProject.length > 0) {
                let data = res.DT.dataProject
                console.log("res.DT", res.DT)
                if (data) {
                    setListProjectbyStaffWarehouse(data)
                }
            }
            if (res.DT.totalPage === 0 && res.DT.dataProject.length === 0) {
                let data = res.DT.dataProject
                setListProjectbyStaffWarehouse(data)

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
                                    <h4> List Warehouse </h4>
                                    <div className='more-employer-pickup'>
                                        <b>{user?.account?.nameUnit?.NameUnit}</b>


                                    </div>
                                    <span>{user?.account?.Position}</span>

                                </div>
                                <div className='sort_warehouse my-3'>
                                    <div className='container my-3'>
                                        <div className='row mx-3'>
                                            <div className='col-3 my-2 content-warehouse ' style={{ backgroundColor: "#61dafb", cursor: "pointer" }}> Tất cả đơn  </div>
                                            <div className='col-3 content-warehouse' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Warehouse_no_status" style={{ textDecoration: "none", color: "#474141" }}>Đơn chưa Nhập kho </Link>
                                            </div>
                                            <div className='col-3 content-warehouse' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Warehouse_status_one" style={{ textDecoration: "none", color: "#474141" }}> Đơn đã nhập kho </Link>
                                            </div>
                                            <div className='col-3 content-warehouse' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                                <Link to="/Warehouse_status_two" style={{ textDecoration: "none", color: "#474141" }}> Đơn đã xuất kho </Link>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {isSearch === false &&
                                    <>
                                        <div className='table-wrapper-employer-warehouse my-5'>
                                            <div className='container'>
                                                <div className='title-employer-warehouse my-3'>Tất cả đơn hàng ({ListProjectbyStaffWarehouse.length})</div>
                                                <hr />

                                                <div className='sub-title-employer-warehouse'>

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


                                                <table class="table table-bordered table-body-employer-warehouse">
                                                    <thead>
                                                        <tr className='table-secondary'>
                                                            <th></th>
                                                            <th scope="col">No</th>
                                                            <th scope="col">Id</th>

                                                            <th scope="col">Mã đơn</th>
                                                            <th scope="col">Mặt hàng</th>
                                                            <th scope="col">Số lượng </th>
                                                            <th scope="col"> Trạng thái đơn hàng</th>

                                                            <th scope="col"> Nhân viên xử lý</th>
                                                            <th scope="col" >Thời gian nhận đơn</th>
                                                            <th scope="col" >Thời gian Hoàn thành</th>
                                                            <th scope="col">Thao tác</th>


                                                        </tr>
                                                    </thead>
                                                    {ListProjectbyStaffWarehouse && ListProjectbyStaffWarehouse.length > 0
                                                        &&

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
                                                                        {!item?.User_Warehouse && !item?.Number_Warehouse &&
                                                                            < td >
                                                                                <button className='btn btn-danger' onClick={() => updateWArehouse(item)}> Nhận đơn</button>
                                                                            </td>
                                                                        }

                                                                        {+item?.statuswarehouseId === 1 &&
                                                                            <td>
                                                                                <button className='btn btn-info' > Đã nhập kho</button>
                                                                            </td>
                                                                        }
                                                                        {+item?.statuswarehouseId === 2 &&
                                                                            <td>
                                                                                <button className='btn btn-success' > Đã xuất kho</button>
                                                                            </td>
                                                                        }


                                                                    </tr>
                                                                </tbody>
                                                            )
                                                        })}


                                                </table>
                                            </div>


                                        </div>
                                        <div className='table-wrapper-employer-warehouse-One my-5'>
                                            <div className='container'>
                                                <div className='title-employer-warehouse-One my-3'>Đơn bạn đã nhận ({listProjectbyUsernameStaffWarehouse.length})</div>
                                                <hr />
                                                <table class="table table-bordered table-body-employer-warehouse-One">
                                                    <thead>
                                                        <tr className='table-secondary'>
                                                            <th></th>
                                                            <th scope="col">Id</th>
                                                            <th scope="col">Mã đơn</th>
                                                            <th scope="col">Mặt hàng</th>
                                                            <th scope="col">Số lượng </th>
                                                            <th scope="col">Trạng thái đơn hàng </th>

                                                            <th scope="col"> Nhân viên xử lý</th>
                                                            <th scope="col" >Thời gian nhập kho</th>
                                                            <th scope="col" >Thời gian xuất kho</th>
                                                            <th scope="col">Thao tác</th>


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
                                                                        {item.statuswarehouseId === 2 ?
                                                                            <td>
                                                                                <button className='btn btn-info mx-3 my-1' > Đã xong</button>
                                                                            </td>

                                                                            :
                                                                            <td>
                                                                                <button className='btn btn-success mx-3 my-1' onClick={() => complete(item)}> Hoàn thành</button>
                                                                                <br />
                                                                                <button className='btn btn-warning mx-3 my-1' onClick={() => updateWArehouse(item)}>Hủy nhận đơn</button>

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

                                                                    <h5> Đơn hàng đã được xử lý toàn bộ</h5>

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
                                    <div className='table-wrapper-employer-warehouse-One my-5'>
                                        <div className='container'>
                                            <div className='title-employer-warehouse-One my-3'>Kết quả tìm kiếm ({listProjectSearch.length})</div>
                                            <hr />
                                            <table class="table table-bordered table-body-employer-warehouse-One">
                                                <thead>
                                                    <tr className='table-secondary' >
                                                        <th></th>
                                                        <th scope="col">Id</th>
                                                        <th scope="col">Mã đơn</th>
                                                        <th scope="col">Mặt hàng</th>
                                                        <th scope="col">Số lượng </th>
                                                        <th scope="col">Trạng thái đơn hàng </th>

                                                        <th scope="col"> Nhân viên xử lý</th>
                                                        <th scope="col" >Thời gian nhập kho</th>
                                                        <th scope="col" >Thời gian xuất kho</th>
                                                        <th scope="col">Thao tác</th>


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
                                                                            <button className='btn btn-danger mx-3 my-1' onClick={() => updateWArehouse(item)} > Nhận đơn</button>
                                                                        </td>
                                                                    }

                                                                    {item.statuswarehouseId === 1
                                                                        &&
                                                                        <td>
                                                                            <button className='btn btn-success mx-3 my-1' onClick={() => complete(item)}> Hoàn thành</button>
                                                                            <br />
                                                                            <button className='btn btn-warning mx-3 my-1' onClick={() => updateWArehouse(item)}>Hủy nhận đơn</button>

                                                                        </td>
                                                                    }
                                                                    {item.statuswarehouseId === 2 &&
                                                                        <td>
                                                                            <button className='btn btn-info mx-3 my-1' > Đã xong</button>
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

                <ModalChatWithCutomer
                    showModal={showModal}
                    handleShowModal={handleShowModal}
                />
            </div >

        </div >




    )


}

export default Warehouse_staff;