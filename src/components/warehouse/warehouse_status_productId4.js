import './Warehouse.scss'

import Sidebar from "../sidebar/sidebar"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { UserContext } from "../../contexApi/UserContext"
import { getAllNumberSatusProductInWarehouse, getDataSearchInWarehouse, getListWarehouseWithPaginationproductStatusId } from "../services/ProjectService"
import ReactPaginate from 'react-paginate';
import ModalCreateWarehouse from "./modalCreateWarehouse"
import ModalDeleteWarehouse from "./modalDeleteWarehouse"
import Lightbox from 'react-image-lightbox';
import * as XLSX from 'xlsx';
import moment from "moment"
import _, { assign, debounce } from "lodash"
import { Bars } from 'react-loader-spinner'
import { toast } from 'react-toastify';

const Warehouse_status_productId4 = (props) => {

    let history = useHistory()
    const { user } = React.useContext(UserContext);
    const [collapsed, setCollapsed] = useState(false)
    const [listWarehouse, setListWarehouse] = useState([])
    const [currentPage, setCurrentPage] = useState(
        localStorage.getItem("Page two warehouse") ? localStorage.getItem("Page two warehouse") : 1

    )
    const [currentLimit, setCurrentLimit] = useState(8)
    const [totalPage, setTotalPage] = useState(0)
    const [action, setAction] = useState("")
    const [dataWarehouseEdit, setDataWarehouseEdit] = useState("")
    const [dataWarehouseRepeat, setDataWarehouseRepeat] = useState("")

    const [dataWarehouseDelete, setDataWarehouseDelete] = useState("")

    const [previreImage, setprevireImage] = useState("")

    const [showModalCreateWarehouse, setShowModalCreateWarehouse] = useState(false);
    const [showModalDeleteWarehouse, setShowModalDeleteWarehouse] = useState(false);
    const [allWarehouseLenght, setAllWarehouseLenght] = useState("")
    const [statusProduct1, setStatusProduct1] = useState("")
    const [statusProduct2, setStatusProduct2] = useState("")
    const [statusProduct3, setStatusProduct3] = useState("")

    const [isOpen, setIsOpen] = useState(false)
    const [sortDataSearch, setSortDataSearch] = useState(false)
    const [isLoading, SetIsLoading] = useState(false)
    const [fieldSort, setFieldSort] = useState("")
    const [sorttime, setSortTime] = useState(false)
    const [sortProduct, setSortProduct] = useState(false)
    const [sortBy, setSortBy] = useState("")
    const getAllInWarehouse = async () => {
        let res = await getAllNumberSatusProductInWarehouse(user.account.phone)
        if (res && +res.EC === 0) {
            setAllWarehouseLenght(res.DT)
        }

    }


    const handleRefesh = async () => {
        await fetchProjectUser()
    }


    const handleShowhideModalCreateWarehouse = () => {
        setShowModalCreateWarehouse(!showModalCreateWarehouse)
        setAction("Create")
    }

    const handleShowhideModalEditWarehouse = (item) => {
        setShowModalCreateWarehouse(!showModalCreateWarehouse)
        setAction("Update")

        setDataWarehouseEdit(item)

    }
    const handleShowhideModalEditWarehouseRepeat = (item) => {
        setShowModalCreateWarehouse(!showModalCreateWarehouse)
        setAction("Repeat")

        setDataWarehouseRepeat(item)

    }
    const handleShowhideModalDelteWarehouse = (item) => {
        setAction("Delete")

        setShowModalDeleteWarehouse(!showModalDeleteWarehouse)
        setDataWarehouseDelete(item)
    }
    const fetchProjectUser = async () => {
        let productStatusId = 4
        let res = await getListWarehouseWithPaginationproductStatusId(currentPage, currentLimit, user.account.phone, +productStatusId)
        if (res && +res.EC === 0) {
            setSortDataSearch(false)
            setTotalPage(+res.DT.totalPage)
            if (res.DT.totalPage > 0 && res.DT.dataProduct.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await getListWarehouseWithPaginationproductStatusId(+res.DT.totalPage, currentLimit, user.account.phone, +productStatusId)
            }
            if (res.DT.totalPage > 0 && res.DT.dataProduct.length > 0) {
                let data = res.DT.dataProduct
                setListWarehouse(data)
                SetIsLoading(true)
            }
            if (res.DT.totalPage === 0 && res.DT.dataProduct.length === 0) {
                setListWarehouse(res.DT.dataProduct)
                SetIsLoading(true)

            }
        } else {
            SetIsLoading(false)

        }
    }
    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1)
        localStorage.setItem("Page two warehouse", event.selected + 1)

    }
    useEffect(() => {
        fetchProjectUser();
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('page', currentPage);
        currentUrlParams.set("limit", currentLimit);

        history.push(window.location.pathname + "?" + currentUrlParams.toString());

    }, [currentPage])
    const handleClickImage = (imagebase64) => {
        if (!imagebase64) return;
        setprevireImage(imagebase64)
        setIsOpen(true)
    };
    useEffect(() => {
        fetchProjectUser();
    }, [currentPage])
    useEffect(() => {
        getAllInWarehouse()
    }, [])

    const getDataWithcurrentPage = async () => {
        let productStatusId = 4

        let currentPageAfterRefesh = +localStorage.getItem("Page two warehouse")
        let res = await getListWarehouseWithPaginationproductStatusId(+currentPageAfterRefesh, +currentLimit, user.account.phone, +productStatusId)
        if (res && +res.EC === 0) {
            let data = res.DT.dataProduct
            if (data) {
                setListWarehouse(data)
                SetIsLoading(true)
            }
        }
        else {
            SetIsLoading(false)

            toast.error(res.EM)
        }
    }



    useEffect(() => {
        window.history.pushState('', '', `?page=${localStorage.getItem("Page two warehouse")}&limit=${currentLimit}`);

        getDataWithcurrentPage()
    }, [window.location.reload])

    const handleExportData = () => {
        if (listWarehouse.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listWarehouse);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "listProduct");
            XLSX.writeFile(workbook, "ExportListProductinWarehouse.csv")
        }
    }

    const handleSearch = debounce(async (event) => {

        let data = event.target.value
        if (data) {

            let res = await getDataSearchInWarehouse(data)
            if (res && +res.EC === 0) {
                let data = res.DT
                let resultsSearch = data.filter(item => item.createdBy === user.account.phone)
                let resultsSearchOne = resultsSearch.filter(item => item.product_statusId === 4)
                if (resultsSearchOne) {
                    setListWarehouse(resultsSearchOne)
                    setSortDataSearch(true)

                } else {
                    setListWarehouse("")

                }

            }

        } else {
            setSortDataSearch(false)

            await fetchProjectUser()
        }

    }, 300)
    const handleChangsortItem = (sortBy, fieldSort) => {


        setSortBy(sortBy);
        setFieldSort(fieldSort)
        if (fieldSort && fieldSort === "product") {
            setSortProduct(!sortProduct)
            let _listWarehouse = _.cloneDeep(listWarehouse)
            _listWarehouse = _.orderBy(_listWarehouse, [fieldSort], [sortBy])
            setListWarehouse(_listWarehouse)


        }
        if (fieldSort && fieldSort === "createdAt") {
            setSortTime(!sorttime)
            let _listWarehouse = _.cloneDeep(listWarehouse)
            _listWarehouse = _.orderBy(_listWarehouse, [fieldSort], [sortBy])
            setListWarehouse(_listWarehouse)
        }



    }
    return (

        <div className='Contact-container '>
            <div className='left  '>
                <Sidebar collapsed={collapsed} />

            </div>
            <div className='right  '>
                <div className='btn-toggle'>
                    <span onClick={() => setCollapsed(!collapsed)} className=" d-sm-block ">
                        {collapsed === false ?
                            <i className="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
                            :
                            <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>

                        }
                    </span>
                </div>
                {isLoading === true ?
                    <div className='right-body'>
                        <div className='container'>
                            <div className='header'>
                                <div className='location-path col'>
                                    <Link to="/"> Home</Link>

                                    <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                    </span>
                                    <Link to="/Warehouse">Warehouse </Link>
                                </div>
                                <div className='col search'>
                                    <div className='search-icon'>
                                        <i className="fa fa-search" aria-hidden="true"></i>

                                    </div>
                                    <input
                                        type="text"
                                        placeholder='Search infomation'
                                        onChange={(event) => handleSearch(event)}

                                    />
                                </div>
                            </div>
                            <div className='body'>
                                <div className="container">
                                    <div className='name-page'>
                                        <div>
                                            <h4> Warehouse </h4>
                                            <Link to="/dashboard_Warehouse">
                                                <button className='btn btn-warning' style={{ fontSize: "20px" }}>
                                                    <span >
                                                        <i class="fa fa-line-chart" aria-hidden="true"></i>
                                                    </span>
                                                    <span className='mx-3'>Xem bảng thống kê</span>
                                                </button>
                                            </Link>
                                        </div>
                                        <div className='more'>

                                            <button className='btn btn-success' onClick={() => handleRefesh()} >
                                                <i class="fa fa-refresh" aria-hidden="true"></i>
                                                Refesh

                                            </button>
                                            <button className='btn btn-warning' onClick={() => handleExportData()} >
                                                <i class="fa fa-cloud-download" aria-hidden="true"></i>
                                                Export file
                                            </button>
                                            <button className='btn btn-primary' onClick={() => handleShowhideModalCreateWarehouse()}>
                                                <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                                Create goods
                                            </button>
                                        </div>

                                    </div>
                                    <div className='table-wrapper'>
                                        <div className='container'>
                                            <div className='infomation-goods my-3'>
                                                <div className=' name d-flex align-item-center justify-content-center my-3'>
                                                    Thông tin chung
                                                </div>
                                                <div className='item-goods'>
                                                    <div className='container'>
                                                        {allWarehouseLenght && allWarehouseLenght.length > 0
                                                            &&
                                                            allWarehouseLenght.map((item, index) => {
                                                                return (
                                                                    <div className='row d-flex justify-content-center' key={`lenght-${index}`}>
                                                                        <div className="item col-2">
                                                                            <h3>{item.AllProduct ? item.AllProduct : "0"}</h3>
                                                                            <div className='content mb-3' style={{ fontWeight: "700" }}>
                                                                                Tổng sản phẩm

                                                                            </div>
                                                                            <Link to="/Warehouse" className='d-flex justify-content-center'>
                                                                                <button className='btn btn-primary' style={{ cursor: 'pointer' }} >xem chi tiết </button>


                                                                            </Link>
                                                                        </div>
                                                                        <div className="item col-2">
                                                                            <h3>{item.product_statusId4 ? item.product_statusId4 : "0"}</h3>
                                                                            <div className='content mb-3' style={{ fontWeight: "700" }}>
                                                                                Đang bán

                                                                            </div>

                                                                            <Link to="/Warehouse_status_productId4" className='d-flex justify-content-center'>

                                                                                <button className='btn btn-primary' style={{ cursor: "no-drop", opacity: "0.5" }} >xem chi tiết</button>


                                                                            </Link>



                                                                        </div>

                                                                        <div className="item col-2">
                                                                            <h3>{item.product_statusId3 ? item.product_statusId3 : "0"}</h3>
                                                                            <div className='content mb-3' style={{ fontWeight: "700" }}>
                                                                                Bị hủy
                                                                            </div>
                                                                            <Link to="/Warehouse_status_productId3" className='d-flex justify-content-center'>

                                                                                <button className='btn btn-primary' >xem chi tiết   </button>

                                                                            </Link>

                                                                        </div>

                                                                        <div className="item col-2">
                                                                            <h3>{item.product_statusId1 ? item.product_statusId1 : "0"}</h3>
                                                                            <div className='content mb-3' style={{ fontWeight: "700" }}>
                                                                                Mới nhập
                                                                            </div>
                                                                            <Link to="/Warehouse_status_productId1" className='d-flex justify-content-center'>

                                                                                <button className='btn btn-primary' >xem chi tiết   </button>

                                                                            </Link>

                                                                        </div>
                                                                        <div className="item col-2">
                                                                            <h3>{item.product_statusId2 ? item.product_statusId2 : "0"}</h3>
                                                                            <div className='content mb-3' style={{ fontWeight: "700" }}>
                                                                                Hết hàng
                                                                            </div>
                                                                            <Link to="/Warehouse_status_productId2" className='d-flex justify-content-center'>

                                                                                <button className='btn btn-primary' >xem chi tiết   </button>

                                                                            </Link>

                                                                        </div>

                                                                    </div>
                                                                )
                                                            })
                                                        }


                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className='table-wrapper'>

                                        <div className='container'>
                                            <div className='d-flex align-item-center justify-content-between'>
                                                <div className='my-2 d-flex align-item-center gap-3'>
                                                    <div className='my-2 d-flex align-item-center gap-2'>
                                                        <div style={{ backgroundColor: "blueviolet", width: "30px", height: "30px", borderRadius: "50%" }}></div>
                                                        <div style={{ fontSize: "20px", fontWeight: "700" }}>Mới nhập</div>
                                                    </div>
                                                    <div className='my-2 d-flex align-item-center gap-2'>
                                                        <div style={{ backgroundColor: "violet", width: "30px", height: "30px", borderRadius: "50%" }}></div>
                                                        <div style={{ fontSize: "20px", fontWeight: "700" }}>Hết hàng</div>
                                                    </div>
                                                    <div className='my-2 d-flex align-item-center gap-2'>
                                                        <div style={{ backgroundColor: "red", width: "30px", height: "30px", borderRadius: "50%" }}></div>
                                                        <div style={{ fontSize: "20px", fontWeight: "700" }}>Đã hủy</div>
                                                    </div>
                                                    <div className='my-2 d-flex align-item-center gap-2'>
                                                        <div style={{ backgroundColor: "green", width: "30px", height: "30px", borderRadius: "50%" }}></div>
                                                        <div style={{ fontSize: "20px", fontWeight: "700" }}>Đang bán</div>
                                                    </div>
                                                </div>


                                                {sortDataSearch === false &&
                                                    <div className='ReactPaginate my-1'>
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
                                                }
                                            </div>

                                            <table class="table  table-hover my-3">
                                                <thead className='table-success' >
                                                    <tr>
                                                        <th scope="col">No</th>
                                                        <th scope="col">Id</th>
                                                        <th scope="col" style={{ width: "100px" }}>Image</th>
                                                        <th style={{ width: "150px" }}>
                                                            {sortProduct === true ?
                                                                <span>
                                                                    <span>Product</span>
                                                                    <span style={{ paddingLeft: "10px", cursor: "pointer" }}
                                                                    >
                                                                        <span onClick={() =>
                                                                            handleChangsortItem("desc", "product")}
                                                                        >
                                                                            <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                                                                        </span>

                                                                    </span>
                                                                </span>
                                                                :
                                                                <span>
                                                                    <span>Product</span>
                                                                    <span style={{ paddingLeft: "10px", cursor: "pointer" }}
                                                                    >
                                                                        <span onClick={() =>
                                                                            handleChangsortItem("asc", "product")}
                                                                        >
                                                                            <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
                                                                        </span>

                                                                    </span>
                                                                </span>
                                                            }

                                                        </th>                                                        <th scope="col">Product status</th>
                                                        <th scope="col">Product Prince (vnd)</th>
                                                        <th scope="col">Number </th>
                                                        <th scope="col">Suppliers </th>
                                                        <th scope="col">Suppliers address</th>
                                                        <th scope="col">Suppliers phone</th>
                                                        <th>
                                                            {sorttime === true ?
                                                                <span>
                                                                    Created at
                                                                    <span style={{ paddingLeft: "10px", cursor: "pointer" }}
                                                                    >
                                                                        <span onClick={() =>
                                                                            handleChangsortItem("desc", "createdAt")}
                                                                        >
                                                                            <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                                                                        </span>

                                                                    </span>
                                                                </span>
                                                                :
                                                                <span>
                                                                    Created at
                                                                    <span style={{ paddingLeft: "10px", cursor: "pointer" }}
                                                                    >
                                                                        <span onClick={() =>
                                                                            handleChangsortItem("asc", "createdAt")}
                                                                        >
                                                                            <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
                                                                        </span>

                                                                    </span>
                                                                </span>
                                                            }
                                                        </th>                                                        <th scope="col"> Action</th>


                                                    </tr>
                                                </thead>
                                                {sortDataSearch === false
                                                    &&
                                                    <tbody>
                                                        {listWarehouse && listWarehouse.length > 0
                                                            ?
                                                            listWarehouse.map((item, index) => {

                                                                return (
                                                                    <tr key={`row-${index}`} >

                                                                        <td scope="row">{(currentPage - 1) * currentLimit + index + 1}</td>
                                                                        <td scope="row" >{item.id}</td>
                                                                        <td scope="row" onClick={() => handleClickImage("http://localhost:3030/image/" + item.image)} style={{ cursor: "pointer", width: "70px", height: "70px" }}>
                                                                            <img style={{ width: "100%", height: "100%" }} src={"http://localhost:3030/image/" + item.image} alt="" />
                                                                        </td>
                                                                        <td>{item?.product}</td>
                                                                        {item?.Product_status?.status === "mới nhập" &&
                                                                            <td style={{ color: "blueviolet", fontWeight: "800" }}>
                                                                                {item?.Product_status?.status
                                                                                    ?
                                                                                    <div style={{ backgroundColor: "blueviolet", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                    :
                                                                                    "Đang xử lý"
                                                                                }
                                                                            </td>
                                                                        }
                                                                        {item?.Product_status?.status === "hết hàng" &&
                                                                            <td style={{ color: "violet", fontWeight: "800" }}>
                                                                                {item?.Product_status?.status
                                                                                    ?
                                                                                    <div style={{ backgroundColor: "violet", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                    :
                                                                                    "Đang xử lý"
                                                                                }
                                                                            </td>
                                                                        }
                                                                        {item?.Product_status?.status === "đã hủy" &&
                                                                            <td style={{ color: "red", fontWeight: "800" }}>
                                                                                {item?.Product_status?.status
                                                                                    ?
                                                                                    <div style={{ backgroundColor: "red", width: "20px", height: "20px", borderRadius: "50%" }}></div>

                                                                                    :
                                                                                    "Đang xử lý"
                                                                                }
                                                                            </td>
                                                                        }
                                                                        {item?.Product_status?.status === "đang bán" &&
                                                                            <td style={{ color: "green", fontWeight: "800" }}>
                                                                                {item?.Product_status?.status
                                                                                    ?
                                                                                    <div style={{ backgroundColor: "green", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                    :
                                                                                    "Đang xử lý"
                                                                                }
                                                                            </td>
                                                                        }
                                                                        <td>
                                                                            <div className='d-flex'>
                                                                                <span style={{ fontSize: "20px" }}> {item?.product_cost}</span>
                                                                                <span style={{ color: "#7790b6", fontSize: "15px" }} className='mx-1'> /products</span>
                                                                            </div>
                                                                        </td>
                                                                        <td>{item?.product_number}</td>
                                                                        <td>{item?.Suppliers}</td>
                                                                        <td style={{ overflowWrap: "anywhere" }}>{item?.Suppliers_address}</td>
                                                                        <td>{item?.Suppliers_phone}</td>
                                                                        <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>



                                                                        {item?.product_statusId === 2
                                                                            &&
                                                                            <td >
                                                                                <div className='d-flex'>
                                                                                    <button className="btn btn-success " title='Đặt hàng tiếp sản phẩm này' onClick={() => handleShowhideModalEditWarehouseRepeat(item)} style={{ borderRadius: "50%" }}>
                                                                                        <i class="fa fa-repeat" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-warning mx-2" title='chỉnh sửa sản phẩm' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-danger " title='xóa sản phẩm' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                                                                    </button>

                                                                                </div>


                                                                            </td>

                                                                        }


                                                                        {item?.product_statusId === 3
                                                                            &&
                                                                            <td >
                                                                                <div className='d-flex'>
                                                                                    <button className="btn btn-success " title='Đặt hàng tiếp sản phẩm này' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-repeat" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-warning mx-2" title='chỉnh sửa sản phẩm' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-danger " title='xóa sản phẩm' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                                                                    </button>

                                                                                </div>


                                                                            </td>

                                                                        }

                                                                        {item?.product_statusId === 1
                                                                            &&
                                                                            <td >
                                                                                <div className='d-flex'>
                                                                                    <button className="btn btn-success " title='Đặt hàng tiếp sản phẩm này' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-repeat" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-warning mx-2" title='chỉnh sửa sản phẩm' onClick={() => handleShowhideModalEditWarehouse(item)} style={{ borderRadius: "50%" }}>
                                                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-danger " title='xóa sản phẩm' onClick={() => handleShowhideModalDelteWarehouse(item)} style={{ borderRadius: "50%" }}>
                                                                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                                                                    </button>

                                                                                </div>


                                                                            </td>

                                                                        }
                                                                        {item?.product_statusId === 4
                                                                            &&
                                                                            <td >
                                                                                <div className='d-flex'>
                                                                                    <button className="btn btn-success " title='Đặt hàng tiếp sản phẩm này' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-repeat" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-warning mx-2" title='chỉnh sửa sản phẩm' onClick={() => handleShowhideModalEditWarehouse(item)} style={{ borderRadius: "50%" }}>
                                                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-danger " title='xóa sản phẩm' onClick={() => handleShowhideModalDelteWarehouse(item)} style={{ borderRadius: "50%" }}>
                                                                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                                                                    </button>

                                                                                </div>


                                                                            </td>

                                                                        }
                                                                        {
                                                                            isOpen && previreImage &&
                                                                            <Lightbox
                                                                                mainSrc={previreImage}

                                                                                onCloseRequest={() => setIsOpen(false)}

                                                                            />
                                                                        }
                                                                    </tr>
                                                                )

                                                            }
                                                            )
                                                            :
                                                            <tr>
                                                                <td colSpan={15}>
                                                                    <div className='imageNotFound'>
                                                                        <img src="https://www.wolfgangdigital.com/uploads/blog/How_to_manage_out_of_date_stock_for_eCommerce.jpg" alt="" />

                                                                    </div>
                                                                </td>

                                                            </tr>

                                                        }


                                                    </tbody>


                                                }
                                                {sortDataSearch === true
                                                    &&
                                                    <tbody>
                                                        {listWarehouse && listWarehouse.length > 0
                                                            ?
                                                            listWarehouse.map((item, index) => {

                                                                return (
                                                                    <tr key={`row-${index}`} >

                                                                        <td scope="row">{(currentPage - 1) * currentLimit + index + 1}</td>
                                                                        <td scope="row" >{item.id}</td>
                                                                        <td scope="row" onClick={() => handleClickImage("http://localhost:3030/image/" + item.image)} style={{ cursor: "pointer", width: "70px", height: "70px" }}>
                                                                            <img style={{ width: "100%", height: "100%" }} src={"http://localhost:3030/image/" + item.image} alt="" />
                                                                        </td>
                                                                        <td>{item?.product}</td>
                                                                        {item?.Product_status?.status === "mới nhập" &&
                                                                            <td style={{ color: "blueviolet", fontWeight: "800" }}>
                                                                                {item?.Product_status?.status
                                                                                    ?
                                                                                    item?.Product_status?.status
                                                                                    :
                                                                                    "Đang xử lý"
                                                                                }
                                                                            </td>
                                                                        }
                                                                        {item?.Product_status?.status === "hết hàng" &&
                                                                            <td style={{ color: "violet", fontWeight: "800" }}>
                                                                                {item?.Product_status?.status
                                                                                    ?
                                                                                    item?.Product_status?.status
                                                                                    :
                                                                                    "Đang xử lý"
                                                                                }
                                                                            </td>
                                                                        }
                                                                        {item?.Product_status?.status === "đã hủy" &&
                                                                            <td style={{ color: "red", fontWeight: "800" }}>
                                                                                {item?.Product_status?.status
                                                                                    ?
                                                                                    item?.Product_status?.status
                                                                                    :
                                                                                    "Đang xử lý"
                                                                                }
                                                                            </td>
                                                                        }
                                                                        <td style={{ color: "green", fontWeight: "800" }}>
                                                                            {item?.Product_status?.status
                                                                                ?
                                                                                <div style={{ backgroundColor: "green", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                :
                                                                                "Đang xử lý"
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            <div className='d-flex'>
                                                                                <span style={{ fontSize: "20px" }}> {item?.product_cost}</span>
                                                                                <span style={{ color: "#7790b6", fontSize: "15px" }} className='mx-1'> /products</span>
                                                                            </div>
                                                                        </td>
                                                                        <td>{item?.product_number}</td>
                                                                        <td>{item?.Suppliers}</td>
                                                                        <td style={{ overflowWrap: "anywhere" }}>{item?.Suppliers_address}</td>
                                                                        <td>{item?.Suppliers_phone}</td>
                                                                        <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>



                                                                        {item?.product_statusId === 2
                                                                            &&
                                                                            <td >
                                                                                <div className='d-flex'>
                                                                                    <button className="btn btn-success " title='Đặt hàng tiếp sản phẩm này' onClick={() => handleShowhideModalEditWarehouseRepeat(item)} style={{ borderRadius: "50%" }}>
                                                                                        <i class="fa fa-repeat" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-warning mx-2" title='chỉnh sửa sản phẩm' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-danger " title='xóa sản phẩm' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                                                                    </button>

                                                                                </div>


                                                                            </td>

                                                                        }


                                                                        {item?.product_statusId === 3
                                                                            &&
                                                                            <td >
                                                                                <div className='d-flex'>
                                                                                    <button className="btn btn-success " title='Đặt hàng tiếp sản phẩm này' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-repeat" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-warning mx-2" title='chỉnh sửa sản phẩm' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-danger " title='xóa sản phẩm' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                                                                    </button>

                                                                                </div>


                                                                            </td>

                                                                        }

                                                                        {item?.product_statusId === 1
                                                                            &&
                                                                            <td >
                                                                                <div className='d-flex'>
                                                                                    <button className="btn btn-success " title='Đặt hàng tiếp sản phẩm này' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-repeat" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-warning mx-2" title='chỉnh sửa sản phẩm' onClick={() => handleShowhideModalEditWarehouse(item)} style={{ borderRadius: "50%" }}>
                                                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-danger " title='xóa sản phẩm' onClick={() => handleShowhideModalDelteWarehouse(item)} style={{ borderRadius: "50%" }}>
                                                                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                                                                    </button>

                                                                                </div>


                                                                            </td>

                                                                        }
                                                                        {item?.product_statusId === 4
                                                                            &&
                                                                            <td >
                                                                                <div className='d-flex'>
                                                                                    <button className="btn btn-success " title='Đặt hàng tiếp sản phẩm này' style={{ borderRadius: "50%", opacity: "0.2", cursor: "no-drop" }}>
                                                                                        <i class="fa fa-repeat" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-warning mx-2" title='chỉnh sửa sản phẩm' onClick={() => handleShowhideModalEditWarehouse(item)} style={{ borderRadius: "50%" }}>
                                                                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <button className="btn btn-danger " title='xóa sản phẩm' onClick={() => handleShowhideModalDelteWarehouse(item)} style={{ borderRadius: "50%" }}>
                                                                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                                                                    </button>

                                                                                </div>


                                                                            </td>

                                                                        }
                                                                        {
                                                                            isOpen && previreImage &&
                                                                            <Lightbox
                                                                                mainSrc={previreImage}

                                                                                onCloseRequest={() => setIsOpen(false)}

                                                                            />
                                                                        }
                                                                    </tr>
                                                                )

                                                            }
                                                            )
                                                            :
                                                            <tr>
                                                                <td colSpan={15}>
                                                                    <div className='imageNotFound'>
                                                                        <img src="https://www.wolfgangdigital.com/uploads/blog/How_to_manage_out_of_date_stock_for_eCommerce.jpg" alt="" />

                                                                    </div>
                                                                </td>

                                                            </tr>

                                                        }
                                                    </tbody>




                                                }
                                            </table>
                                        </div>
                                    </div>
                                </div>


                            </div>

                        </div>

                    </div>

                    :
                    <div className='loading-data-container'>
                        <Bars
                            height={100}
                            width={100}
                            radius={5}
                            color="#1877f2"
                            ariaLabel="ball-triangle-loading"
                            wrapperClass={{}}
                            wrapperStyle=""
                            visible={true}
                        />
                        <h3>...Loading</h3>
                    </div>
                }
                <ModalCreateWarehouse
                    showModalCreateWarehouse={showModalCreateWarehouse}
                    handleShowhideModalCreateWarehouse={handleShowhideModalCreateWarehouse}
                    action={action}
                    dataWarehouseEdit={dataWarehouseEdit}
                    dataWarehouseRepeat={dataWarehouseRepeat}
                    fetchProjectUser={fetchProjectUser}
                    previreImage={previreImage}
                    setprevireImage={setprevireImage}
                />
                <ModalDeleteWarehouse
                    showModalDeleteWarehouse={showModalDeleteWarehouse}
                    handleShowhideModalDelteWarehouse={handleShowhideModalDelteWarehouse}
                    dataWarehouseDelete={dataWarehouseDelete}
                    fetchProjectUser={fetchProjectUser}
                    action={action}

                />
            </div >

        </div >








    )


}

export default Warehouse_status_productId4;