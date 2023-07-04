import React, { useEffect, useState, useContext } from 'react'
import './listUser.scss'
import { showListbyGroup } from "../services/userService"
import ReactPaginate from 'react-paginate';
import { DeleteUser, getDataUserSearch } from "../services/userService"
import { toast } from 'react-toastify';
import ModalDelete from "./modalDelete"
import ModalCreate from "./modalCreate"
import moment from "moment"
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import _, { debounce } from "lodash"
import { Link, NavLink, useHistory } from "react-router-dom"
import * as XLSX from 'xlsx';
import { Bars } from 'react-loader-spinner'
import { useTranslation, Trans } from 'react-i18next';
import { UserContext } from "../../contexApi/UserContext"
import { NotificationContext } from "../../contexApi/NotificationContext"

const UserGroupBoss = (props) => {
    let history = useHistory()
    const { t, i18n } = useTranslation();
    const { list, getALlListNotification, listStaff } = React.useContext(NotificationContext);
    const { user } = React.useContext(UserContext);

    const [listUser1, setListUser1] = useState([])
    const [listUserSearch, setListUserSearch] = useState([])
    const [listUserlenght, setListUserlenght] = useState([])
    const [listUserExport, setListUserExport] = useState([])

    const [currentPage, setCurrentPage] = useState(
        localStorage.getItem("infomation Page userBoss") ? localStorage.getItem("infomation Page userBoss") : 1

    )
    const [currentLimit, setCurrentLimit] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [dataModelDelete, setDataModelDelete] = useState({})
    const [dataModel, setDataModel] = useState({})
    const [imageConvert, setImageConvert] = useState({})

    const [showCreateUserModal, setshowCreateUserModal] = useState(false)

    const [actionModal, setActionModal] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [previewsImage, setPreviewsImage] = useState("")
    const [sortName, setSortName] = useState(false)
    const [sortTime, setSortTime] = useState(false)
    const [sortBy, setSortBy] = useState("")
    const [fieldSort, setFieldSort] = useState("")
    const [sortDataSearch, setSortDataSearch] = useState(false)
    const [isloading, setIsloading] = useState(false)


    const fetchUser1 = async () => {
        let GroupId = 1
        let res = await showListbyGroup(currentPage, currentLimit, +GroupId)
        if (res && +res.EC === 0) {
            setTotalPage(res.DT.totalPage)
            // khi truyền vào 1 trang không có dữ liệu và các trang trước có dữ liệu thì khi xóa sẽ về trang trươc
            if (res.DT.totalPage > 0 && res.DT.dataUser.length === 0) {
                let GroupId = 1
                setCurrentPage(+res.DT.totalPage)
                await showListbyGroup(+res.DT.totalPage, currentLimit, +GroupId)
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
            }
            if (res.DT.totalPage > 0 && res.DT.dataUser.length > 0) {
                setIsloading(true)
                setListUser1(res.DT.dataUser)
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
                setListUserlenght(res.DT.totalUser)
                let dataExxport = []
                res.DT.dataUser.forEach((item) => {
                    dataExxport.push({
                        id: item.id,
                        email: item.email,
                        name: item.username,
                        phone: item.phone,
                        group: item.Group.name,
                        address_province: item?.Province_customer?.name,
                        address_district: item?.District_customer?.name,
                        address_ward: item?.Ward_customer?.name,
                        address: item.addressDetail,
                        create_at: moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")
                    })
                });
                if (dataExxport.length > 0) {
                    setListUserExport(dataExxport)
                    if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupWithRound?.name === "Dev") {
                        await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                    }
                }

            } if (res.DT.totalPage === 0 && res.DT.dataUser.length === 0) {
                setListUser1(res.DT.dataUser)
                setIsloading(true)
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
            }

        }

    }

    useEffect(() => {
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
        fetchUser1();
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('page', currentPage);
        currentUrlParams.set("limit", currentLimit);
        currentUrlParams.set("GroupId", 1);

        history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }, [currentPage])

    useEffect(() => {
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
        localStorage.setItem("infomation Page userBoss", 1)

    }, [])



    const handleClickImage = (imagebase64) => {
        if (!imagebase64) return;
        setPreviewsImage(imagebase64)
        setIsOpen(true)
    };
    const handlePageClick = (event) => {

        setCurrentPage(+event.selected + 1)
        localStorage.setItem("infomation Page userBoss", event.selected + 1)

    };


    const fetchUser1AfterRefesh = async () => {
        let currentPageAfterRefesh = +localStorage.getItem("infomation Page userBoss")
        let GroupId = 1

        let res = await showListbyGroup(currentPageAfterRefesh, currentLimit, GroupId)

        if (res && +res.EC === 0) {
            setTotalPage(res.DT.totalPage)
            // khi truyền vào 1 trang không có dữ liệu và các trang trước có dữ liệu thì khi xóa sẽ về trang trươc
            if (res.DT.totalPage > 0 && res.DT.dataUser.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await showListbyGroup(+res.DT.totalPage, currentLimit, GroupId)
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
            }
            if (res.DT.totalPage > 0 && res.DT.dataUser.length > 0) {
                setListUser1(res.DT.dataUser)
                setIsloading(true)
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
            }

        }

    }

    useEffect(() => {
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
        window.history.pushState('', '', `?page=${localStorage.getItem("infomation Page userBoss")}&limit=${currentLimit}&GroupId=1`);

        fetchUser1AfterRefesh()
    }, [window.location.reload])
    const handleOpenModalDelete = async (user) => {
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
        setDataModelDelete(user)
        setShowDeleteModal(true)
    }

    const handleCloseModalCreate = async () => {
        setshowCreateUserModal(!showCreateUserModal)
        setActionModal("")
        await fetchUser1();
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
    }


    const handleCloseModalDelete = async () => {
        setDataModelDelete({})
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
        setShowDeleteModal(false)
    }

    const handleDeleteUser = async () => {
        let res = await DeleteUser(dataModelDelete)
        if (res && +res.EC === 0) {
            toast.success(res.EM)
            setShowDeleteModal(false)
            await fetchUser1();
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
        } else {
            toast.error(res.EC)
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
        }
    }


    const handleOpenModalEdit = async (item) => {
        setActionModal("Update")
        let imagebase64 = ""
        if (item.image) {
            imagebase64 = new Buffer(item.image, "base64").toString("binary")
        }
        setDataModel({ ...item, image: imagebase64 })
        setImageConvert(imagebase64)
        setshowCreateUserModal(!showCreateUserModal)
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
    }



    const handleRefesh = async () => {
        await fetchUser1();
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
    }

    const handleChangsortItem = async (sortBy, fieldSort) => {
        setSortBy(sortBy);
        setFieldSort(fieldSort)
        if (fieldSort && fieldSort === "username") {
            setSortName(!sortName)
            let _listUser = _.cloneDeep(listUser1)
            _listUser = _.orderBy(_listUser, [fieldSort], [sortBy])
            setListUser1(_listUser)
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
        }
        if (fieldSort === "createdAt") {
            setSortTime(!sortTime)
            let _listUser = _.cloneDeep(listUser1)
            _listUser = _.orderBy(_listUser, [fieldSort], [sortBy])
            setListUser1(_listUser)
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }

        }
    }

    const handleSearch = debounce(async (event) => {
        let data = event.target.value
        if (data) {
            setSortDataSearch(true)
            let res = await getDataUserSearch(data)
            if (res && +res.EC === 0) {
                let result = res.DT
                let data = result.filter(item => item.groupId === 1)
                if (data) {
                    setListUserSearch(data)
                    if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupWithRound?.name === "Dev") {
                        await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                    }
                }
            }

        }
        else {
            setSortDataSearch(false)
            await fetchUser1()
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
        }
    }, 300)
    const handleExportData = () => {
        if (listUserExport.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUserExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "listUser");
            XLSX.writeFile(workbook, "ExportListUser.csv")
        }
    }
    return (
        <div className='container px-3'>
            <div className='listUser-container'>
                <div className='user-header d-none d-md-block'>
                    <div className='title mt-3 '>
                        <h2>
                            {t('List-user.One')}
                        </h2>
                    </div>
                    <div className='more '>
                        <div className='col search'>
                            <div className='search-icon'>
                                <i className="fa fa-search" aria-hidden="true"></i>

                            </div>
                            <input type="text"
                                placeholder='Search infomation'
                                onChange={(event) => handleSearch(event)}

                            />
                        </div>
                        <div className='action'>
                            <button className='btn btn-primary refresh'
                                onClick={() => {
                                    setshowCreateUserModal(true);
                                    setActionModal("Create")
                                }}>
                                <i className="fa fa-user-plus" ></i>

                                {t('List-user.Two')}
                            </button>
                            <button className='btn btn-success refresh' onClick={() => handleRefesh()}>
                                <i className="fa fa-refresh"
                                ></i>

                                {t('List-user.Three')}
                            </button>
                            <button className="btn btn-primary" onClick={() => handleExportData()}>
                                <i class="fa fa-cloud-download" aria-hidden="true"></i>

                                {t('List-user.Four')}
                            </button>
                        </div>
                    </div>

                </div>
                <div className='user-header d-block d-md-none'>
                    <div className='title mt-3 '>
                        <h2>
                            {t('List-user.One')}
                        </h2>
                    </div>
                    <div className='more '>
                        <div className='container'>
                            <div className='row'>
                                <div className=' search'>
                                    <div className='search-icon'>
                                        <i className="fa fa-search" aria-hidden="true"></i>

                                    </div>
                                    <input type="text"
                                        placeholder='Search infomation'
                                        onChange={(event) => handleSearch(event)}

                                    />
                                </div>
                                <div className='action mt-3'>
                                    <div className='container'>
                                        <div className='row'>
                                            <button className='btn btn-primary refresh col-12 col-lg-3 '
                                                onClick={() => {
                                                    setshowCreateUserModal(true);
                                                    setActionModal("Create")
                                                }}>
                                                <i className="fa fa-user-plus" ></i>

                                                {t('List-user.Two')}
                                            </button>
                                            <button className='btn btn-success refresh col-12 col-lg-3 my-3' onClick={() => handleRefesh()}>
                                                <i className="fa fa-refresh"
                                                ></i>

                                                {t('List-user.Three')}
                                            </button>
                                            <button className="btn btn-primary col-12 col-lg-3" onClick={() => handleExportData()}>
                                                <i class="fa fa-cloud-download" aria-hidden="true"></i>

                                                {t('List-user.Four')}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>


                    </div>

                </div>
                <div className='sort-unit my-3'>
                    <div className='container my-3'>
                        <div className='row mx-3'>
                            <div className='col-12 col-lg-3 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                <Link to="/listuser" style={{ textDecoration: "none", color: "#474141" }}>
                                    {t('List-user.Five')}
                                </Link>
                            </div>
                            <div className='col-12 col-lg-2 my-2 content boder-bottom' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                <Link to="/listuserbygroupCustomer" style={{ textDecoration: "none", color: "#474141" }}>
                                    {t('List-user.Six')}
                                </Link>
                            </div>
                            <div className='col-12 col-lg-2 my-2 content boder-bottom' style={{ borderBottom: "5px solid #61dafb", cursor: "pointer" }}>
                                {t('List-user.Seven')} ({listUserlenght > 0 ? listUserlenght : "0"})</div>
                            <div className='col-12 col-lg-2 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                <Link to="/listuserbygroupDev" style={{ textDecoration: "none", color: "#474141" }}>
                                    {t('List-user.Eight')}
                                </Link>

                            </div>
                            <div className='col-12 col-lg-2 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                <Link to="/listuserbygroupStaff" style={{ textDecoration: "none", color: "#474141" }}>
                                    {t('List-user.Night')}
                                </Link>

                            </div>

                        </div>
                    </div>
                </div>
                {sortDataSearch === false && isloading === true &&
                    <div className='user-footer my-3'>
                        <ReactPaginate
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
                }
                {isloading === true
                    ?
                    <div className='user-body  '>
                        <table className="table table-bordered  table-striped table-hover">
                            <thead >
                                <tr>
                                    <th scope="col" className='table-success'>
                                        {t('List-user.Body.One')}
                                    </th>
                                    <th scope="col" className='table-success'>
                                        {t('List-user.Body.Two')}
                                    </th>
                                    <th scope="col" className='table-success' style={{ width: "100px" }} >
                                        {t('List-user.Body.Three')}
                                    </th>

                                    <th scope="col" className='table-success' style={{ width: "200px" }}>
                                        {sortName === true
                                            ?
                                            <div className='d-flex'>
                                                <span>
                                                    {t('List-user.Body.Four')}
                                                </span>
                                                <span className='mx-2' onClick={() => handleChangsortItem("asc", "username")} style={{ cursor: "pointer" }}>
                                                    <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                                                </span>
                                            </div>
                                            :
                                            <div className='d-flex'>
                                                <span>
                                                    {t('List-user.Body.Four')}
                                                </span>
                                                <span className='mx-2' onClick={() => handleChangsortItem("desc", "username")} style={{ cursor: "pointer" }}>
                                                    <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
                                                </span>
                                            </div>
                                        }

                                    </th>
                                    <th scope="col" className='table-success' >
                                        {t('List-user.Body.Five')}
                                    </th>

                                    <th scope="col" className='table-success' style={{ width: "200px" }}>
                                        {t('List-user.Body.Six')}
                                    </th>
                                    <th scope="col" className='table-success' style={{ width: "160px" }}>
                                        {t('List-user.Body.Seven')}
                                    </th>

                                    <th scope="col" className='table-success' style={{ width: "130px" }}>
                                        {t('List-user.Body.Eight')}
                                    </th>

                                    <th scope="col" className='table-success' style={{ width: "100px" }}>
                                        {t('List-user.Body.Night')}
                                    </th>
                                    <th scope="col" className='table-success'>
                                        {t('List-user.Body.Ten')}
                                    </th>
                                    <th scope="col" className='table-success'>
                                        {t('List-user.Body.Eleven')}
                                    </th>
                                    <th scope="col" className='table-success' style={{ width: "200px" }}>
                                        {sortTime === true
                                            ?
                                            <div className='d-flex'>
                                                <span>
                                                    {t('List-user.Body.Twele')}
                                                </span>
                                                <span className='mx-2' onClick={() => handleChangsortItem("desc", "createdAt")} style={{ cursor: "pointer" }}>
                                                    <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                                                </span>
                                            </div>
                                            :
                                            <div className='d-flex'>
                                                <span>
                                                    {t('List-user.Body.Twele')}
                                                </span>
                                                <span className='mx-2' onClick={() => handleChangsortItem("asc", "createdAt")} style={{ cursor: "pointer" }}>
                                                    <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
                                                </span>
                                            </div>
                                        }
                                    </th>

                                    <th scope="col" className='table-success'>
                                        {t('List-user.Body.Thirteen')}
                                    </th>

                                </tr>
                            </thead>
                            {sortDataSearch === false &&
                                <tbody>
                                    {listUser1 && listUser1.length > 0 ?
                                        <>
                                            {listUser1.map((item, index) => {
                                                let imagebase64 = ""
                                                if (item.image) {
                                                    imagebase64 = new Buffer(item.image, "base64").toString("binary")

                                                }


                                                return (
                                                    <tr key={`row-${index}`}
                                                    >
                                                        <td className='table-light'>{(currentPage - 1) * currentLimit + index + 1}</td>

                                                        <td className='table-light' >{item.id}</td>
                                                        <td className='table-light image-list' onClick={() => handleClickImage(imagebase64)} >
                                                            <img src={`${imagebase64}`} alt="" />
                                                        </td>

                                                        <td className='table-light'>{item.username}</td>
                                                        <td className='table-light'>{item.email}</td>
                                                        <td className='table-light'>
                                                            {item?.addressDetail},  {item?.Ward_customer?.name}, {item?.District_customer?.name},{item?.Province_customer?.name}
                                                        </td>
                                                        <td className='table-light'>{item?.Shipping_Unit?.NameUnit}</td>

                                                        <td className='table-light'>{item?.Position}</td>
                                                        <td className='table-light'>{item.phone}</td>
                                                        <td className='table-light'>{item.sex}</td>
                                                        <td className='table-light' style={{ fontWeight: "700" }}>{item.Group ? item.Group.name : ""}</td>
                                                        <td className='table-light'>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                        <td className='table-light ' >

                                                            <div className='d-flex'>
                                                                <div onClick={() => handleOpenModalEdit(item)} style={{ cursor: "pointer", fontSize: "25px" }}>
                                                                    <i class="fa fa-pencil" aria-hidden="true"></i>

                                                                </div>
                                                                <div className='mx-3' onClick={() => handleOpenModalDelete(item)} style={{ color: "red", cursor: "pointer", fontSize: "25px" }}>
                                                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                                                </div>

                                                            </div>

                                                        </td>
                                                        {isOpen && previewsImage &&
                                                            <Lightbox
                                                                mainSrc={previewsImage}

                                                                onCloseRequest={() => setIsOpen(false)}

                                                            />
                                                        }

                                                        {isOpen && previewsImage &&
                                                            <Lightbox
                                                                mainSrc={previewsImage}

                                                                onCloseRequest={() => setIsOpen(false)}

                                                            />
                                                        }
                                                    </tr>

                                                )

                                            })}

                                        </> :
                                        <tr>
                                            <td colSpan={15}>
                                                <div className='images'>
                                                    <img src="https://cdn2.wpbeginner.com/wp-content/uploads/2013/04/wp404error.jpg" alt="" />

                                                </div>
                                            </td>

                                        </tr>

                                    }


                                </tbody>
                            }
                            {sortDataSearch === true &&
                                <tbody>
                                    {listUserSearch && listUserSearch.length > 0
                                        ?
                                        listUserSearch.map((item, index) => {
                                            let imagebase64 = ""
                                            if (item.image) {
                                                imagebase64 = new Buffer(item.image, "base64").toString("binary")

                                            }


                                            return (
                                                <tr key={`row-${index}`}
                                                >
                                                    <td className='table-light'>{(currentPage - 1) * currentLimit + index + 1}</td>

                                                    <td className='table-light'>{item.id}</td>
                                                    <td className='table-light image-list' onClick={() => handleClickImage(imagebase64)} >
                                                        <img src={`${imagebase64}`} alt="" />
                                                    </td>

                                                    <td className='table-light'>{item.username}</td>
                                                    <td className='table-light'>{item.email}</td>
                                                    <td className='table-light'>
                                                        {item?.addressDetail}, {item?.Ward_customer?.name}, {item?.District_customer?.name} ,{item?.Province_customer?.name}
                                                    </td>
                                                    <td className='table-light'>{item?.Shipping_Unit?.NameUnit}</td>

                                                    <td className='table-light'>{item?.Position}</td>
                                                    <td className='table-light'>{item.phone}</td>
                                                    <td className='table-light'>{item.sex}</td>
                                                    <td className='table-light'>{item.Group ? item.Group.name : ""}</td>
                                                    <td className='table-light'>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                    <td className='table-light ' >

                                                        <div className='d-flex'>
                                                            <div onClick={() => handleOpenModalEdit(item)} style={{ cursor: "pointer", fontSize: "25px" }}>
                                                                <i class="fa fa-pencil" aria-hidden="true"></i>

                                                            </div>
                                                            <div className='mx-3' onClick={() => handleOpenModalDelete(item)} style={{ color: "red", cursor: "pointer", fontSize: "25px" }}>
                                                                <i class="fa fa-trash" aria-hidden="true"></i>
                                                            </div>

                                                        </div>

                                                    </td>
                                                    {isOpen && previewsImage &&
                                                        <Lightbox
                                                            mainSrc={previewsImage}

                                                            onCloseRequest={() => setIsOpen(false)}

                                                        />
                                                    }
                                                </tr>

                                            )

                                        })




                                        :
                                        <tr>
                                            <td colSpan={15}>
                                                <div className='images'>
                                                    <img src="https://cdn2.wpbeginner.com/wp-content/uploads/2013/04/wp404error.jpg" alt="" />

                                                </div>
                                            </td>

                                        </tr>

                                    }


                                </tbody>

                            }
                        </table>

                    </div>
                    :
                    <tr className='d-flex align-item-center justify-content-center'>
                        <td colSpan={15}>
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
                                <div> {t('List-user.Body.Fourteen')}</div>
                            </div>
                        </td>

                    </tr>
                }



            </div >
            <ModalDelete show={showDeleteModal}
                handleCloseModal={handleCloseModalDelete}
                handleDeleteUser={handleDeleteUser}
                dataModelDelete={dataModelDelete}
            />
            <ModalCreate
                show={showCreateUserModal}
                handleCloseCreateModal={handleCloseModalCreate}
                action={actionModal}
                dataModal={dataModel}
                imageConvert={imageConvert}
                setActionModal={setActionModal}
                listUser1={listUser1}
            />

        </div >
    )
}


export default UserGroupBoss