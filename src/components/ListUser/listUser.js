import React, { useEffect, useState, useContext } from 'react'
import './listUser.scss'
import { showList } from "../services/userService"
import ReactPaginate from 'react-paginate';
import { DeleteUser, getDataUserSearch } from "../services/userService"
import { toast } from 'react-toastify';
import ModalDelete from "../ListUser/modalDelete"
import ModalCreate from "../ListUser/modalCreate"
import moment from "moment"
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import _, { debounce } from "lodash"
import { Link, NavLink, useHistory } from "react-router-dom"
import * as XLSX from 'xlsx';
import { Bars } from 'react-loader-spinner'

const Users = (props) => {
    let history = useHistory()

    const [listUser, setListUser] = useState([])
    const [listUserlenght, setListUserlenght] = useState([])
    const [listUserSearch, setListUserSearch] = useState([])
    const [listUserExport, setListUserExport] = useState([])

    const [currentPage, setCurrentPage] = useState(
        localStorage.getItem("infomation Page alluser") ? localStorage.getItem("infomation Page alluser") : 1

    )
    const [currentLimit, setCurrentLimit] = useState(8)
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


    const fetchUser = async () => {

        let res = await showList(currentPage, currentLimit)

        if (res && +res.EC === 0) {

            setTotalPage(res.DT.totalPage)
            // khi truyền vào 1 trang không có dữ liệu và các trang trước có dữ liệu thì khi xóa sẽ về trang trươc
            if (res.DT.totalPage > 0 && res.DT.dataUser.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await showList(+res.DT.totalPage, currentLimit)
            }
            if (res.DT.totalPage > 0 && res.DT.dataUser.length > 0) {
                setIsloading(true)
                setListUser(res.DT.dataUser)
                setListUserlenght(res.DT.totalUser)
                let dataExxport = []
                res.DT.dataUser.forEach((item) => {
                    dataExxport.push({
                        id: item.id,
                        email: item.email,
                        name: item.username,
                        phone: item.phone,
                        group: item?.Group?.name,
                        address_province: item?.Province_customer?.name,
                        address_district: item?.District_customer?.name,
                        address_ward: item?.Ward_customer?.name,
                        address: item.addressDetail,
                        create_at: moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")
                    })
                });
                if (dataExxport.length > 0) {
                    setListUserExport(dataExxport)

                }
            }
            if (res.DT.totalPage === 0 && res.DT.dataUser.length === 0) {
                setListUser(res.DT.dataUser)
                setListUserlenght(res.DT.totalUser)
                setIsloading(true)

            }
        }
    }

    useEffect(() => {
        fetchUser();
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('page', currentPage);
        currentUrlParams.set("limit", currentLimit);

        history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }, [currentPage])





    const handleClickImage = (imagebase64) => {
        if (!imagebase64) return;
        setPreviewsImage(imagebase64)
        setIsOpen(true)
    };
    const handlePageClick = (event) => {

        setCurrentPage(+event.selected + 1)
        localStorage.setItem("infomation Page alluser", event.selected + 1)

    };
    const fetchUserAfterRefesh = async () => {
        let currentPageAfterRefesh = +localStorage.getItem("infomation Page alluser")

        let res = await showList(currentPageAfterRefesh, currentLimit)

        if (res && +res.EC === 0) {
            setTotalPage(res.DT.totalPage)
            // khi truyền vào 1 trang không có dữ liệu và các trang trước có dữ liệu thì khi xóa sẽ về trang trươc
            if (res.DT.totalPage > 0 && res.DT.dataUser.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await showList(+res.DT.totalPage, currentLimit)
            }
            if (res.DT.totalPage > 0 && res.DT.dataUser.length > 0) {
                setListUser(res.DT.dataUser)
                setIsloading(true)

            }

        }

    }

    useEffect(() => {
        window.history.pushState('', '', `?page=${localStorage.getItem("infomation Page alluser")}&limit=${currentLimit}`);

        fetchUserAfterRefesh()
    }, [window.location.reload,])
    const handleOpenModalDelete = (user) => {

        setDataModelDelete(user)
        setShowDeleteModal(true)
    }

    const handleCloseModalCreate = async () => {
        setshowCreateUserModal(!showCreateUserModal)
        setActionModal("")
        await fetchUser();

    }

    const handleCloseModalDelete = () => {
        setDataModelDelete({})

        setShowDeleteModal(false)
    }

    const handleDeleteUser = async () => {
        let res = await DeleteUser(dataModelDelete)
        if (res && +res.EC === 0) {
            toast.success(res.EM)
            setShowDeleteModal(false)

            await fetchUser();

        } else {
            toast.error(res.EC)
        }
    }


    const handleOpenModalEdit = (item) => {
        setActionModal("Update")
        let imagebase64 = ""
        if (item.image) {
            imagebase64 = new Buffer(item.image, "base64").toString("binary")
        }
        setDataModel({ ...item, image: imagebase64 })
        setImageConvert(imagebase64)
        setshowCreateUserModal(!showCreateUserModal)
    }



    const handleRefesh = async () => {
        await fetchUser();

    }

    const handleChangsortItem = (sortBy, fieldSort) => {
        setSortBy(sortBy);
        setFieldSort(fieldSort)
        if (fieldSort && fieldSort === "username") {
            setSortName(!sortName)
            let _listUser = _.cloneDeep(listUser)
            _listUser = _.orderBy(_listUser, [fieldSort], [sortBy])
            setListUser(_listUser)

        }
        if (fieldSort === "createdAt") {
            setSortTime(!sortTime)
            let _listUser = _.cloneDeep(listUser)
            _listUser = _.orderBy(_listUser, [fieldSort], [sortBy])
            setListUser(_listUser)


        }
    }

    const handleSearch = debounce(async (event) => {
        let data = event.target.value
        if (data) {
            setSortDataSearch(true)
            let res = await getDataUserSearch(data)
            if (res && +res.EC === 0) {
                let result = res.DT
                if (result) {
                    setListUserSearch(result)

                }
            }

        }
        else {
            setSortDataSearch(false)
            await fetchUser()

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
                <div className='user-header'>
                    <div className='title mt-3 '>
                        <h2>Manage User</h2>
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

                                Add new user
                            </button>
                            <button className='btn btn-success refresh' onClick={() => handleRefesh()}>
                                <i className="fa fa-refresh"
                                ></i>

                                Refesh
                            </button>
                            <button className="btn btn-primary" onClick={() => handleExportData()}>
                                <i class="fa fa-cloud-download" aria-hidden="true"></i>

                                Export listuser
                            </button>
                        </div>
                    </div>

                </div>
                <div className='sort-unit my-3'>
                    <div className='container my-3'>
                        <div className='row mx-3'>
                            <div className='col-3 my-2 content ' style={{ borderBottom: "5px solid #61dafb", cursor: "pointer" }}>All user ({listUserlenght})</div>
                            <div className='col-2 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                <Link to="/listuserbygroupCustomer" style={{ textDecoration: "none", color: "#474141" }}>Customer</Link>
                            </div>
                            <div className='col-2 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                <Link to="/listuserbygroupBoss" style={{ textDecoration: "none", color: "#474141" }}>Boss </Link>
                            </div>
                            <div className='col-2 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                <Link to="/listuserbygroupDev" style={{ textDecoration: "none", color: "#474141" }}>Dev </Link>

                            </div>
                            <div className='col-2 content' style={{ borderBottom: "5px solid #f0f2f5", cursor: "pointer" }}>
                                <Link to="/listuserbygroupStaff" style={{ textDecoration: "none", color: "#474141" }}>Staff </Link>

                            </div>


                        </div>
                    </div>
                </div>
                {sortDataSearch === false && isloading === true &&
                    <div className='user-footer my-3'>
                        <ReactPaginate
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
                {isloading == true
                    ?
                    <div className='user-body  '>
                        <table className="table table-bordered  table-striped table-hover">
                            <thead >
                                <tr>
                                    <th scope="col" className='table-success'>No</th>
                                    <th scope="col" className='table-success'>Id</th>
                                    <th scope="col" className='table-success' style={{ width: "100px" }} >Image</th>

                                    <th scope="col" className='table-success' style={{ width: "220px" }}>
                                        {sortName === true
                                            ?
                                            <>
                                                <span>username </span>
                                                <span className='mx-2' onClick={() => handleChangsortItem("asc", "username")} style={{ cursor: "pointer" }}>
                                                    <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                                                </span>
                                            </>
                                            :
                                            <>
                                                <span>username </span>
                                                <span className='mx-2' onClick={() => handleChangsortItem("desc", "username")} style={{ cursor: "pointer" }}>
                                                    <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
                                                </span>
                                            </>
                                        }

                                    </th>
                                    <th scope="col" className='table-success' >email</th>

                                    <th scope="col" className='table-success' style={{ width: "200px" }}>Address user</th>
                                    <th scope="col" className='table-success' style={{ width: "160px" }}>unit</th>

                                    <th scope="col" className='table-success' style={{ width: "130px" }}>Position</th>

                                    <th scope="col" className='table-success' style={{ width: "100px" }}>phone</th>
                                    <th scope="col" className='table-success'>sex</th>
                                    <th scope="col" className='table-success'>Group</th>
                                    <th scope="col" className='table-success' style={{ width: "210px" }}>
                                        {sortTime === true
                                            ?
                                            <>
                                                <span>createdAt </span>
                                                <span className='mx-2' onClick={() => handleChangsortItem("desc", "createdAt")} style={{ cursor: "pointer" }}>
                                                    <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                                                </span>
                                            </>
                                            :
                                            <>
                                                <span>createdAt </span>
                                                <span className='mx-2' onClick={() => handleChangsortItem("asc", "createdAt")} style={{ cursor: "pointer" }}>
                                                    <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
                                                </span>
                                            </>
                                        }
                                    </th>

                                    <th scope="col" className='table-success'>Action</th>

                                </tr>
                            </thead>
                            {sortDataSearch === false
                                &&
                                <tbody>
                                    {listUser && listUser.length > 0 ?
                                        <>
                                            {listUser.map((item, index) => {
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
                                                            <img style={{ width: "100%", height: "100%" }} src={`${imagebase64}`} />
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
                                                        <img style={{ width: "100%", height: "100%" }} src={`${imagebase64}`} alt="" />
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
                                                    <td className='table-light  '>
                                                        <div className="dropdown">
                                                            <div type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">

                                                                <i class="fa fa-caret-down" aria-hidden="true"></i>

                                                            </div>
                                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                                <li style={{ cursor: "pointer" }}><a className="dropdown-item" onClick={() => handleOpenModalEdit(item)} title="Edit">Edit user</a></li>
                                                                <li style={{ cursor: "pointer" }}><a className="dropdown-item" onClick={() => handleOpenModalDelete(item)} title="Delete">Delete user</a></li>
                                                            </ul>
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
                                <div> ... is loading</div>
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
                fetchUser={fetchUser}
                action={actionModal}
                dataModal={dataModel}
                imageConvert={imageConvert}
                setActionModal={setActionModal}
                listUser={listUser}
            />

        </div >
    )
}


export default Users