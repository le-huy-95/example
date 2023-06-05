import './Role.scss'
import { useEffect, useState } from 'react'
import _ from "lodash"
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { CreateRole } from "../services/RoleService"
import TableRole from "./tableRole"
import { getRoleWithPagination } from "../services/RoleService"
import ReactPaginate from 'react-paginate'

const Role = (props) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [currentLimit, setCurrentLimit] = useState(4)
    const [listRole, setListRole] = useState([])
    const [totalPage, setTotalPage] = useState(0)


    const handlePageClick = (event) => {

        setCurrentPage(+event.selected + 1)
    };
    const fetchUserRole = async () => {

        let res = await getRoleWithPagination(currentPage, currentLimit)
        console.log(res)
        if (res && +res.EC === 0) {
            setTotalPage(res.DT.totalPage)
            if (res.DT.totalPage > 0 && res.DT.dataUser.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await getRoleWithPagination(+res.DT.totalPage, currentLimit)
            }
            if (res.DT.totalPage > 0 && res.DT.dataUser.length > 0) {
                setListRole(res.DT.dataUser)
            }

        }

    }
    const dataDefault = {
        child1: {
            url: "", description: "", isValidUrl: true
        },

    }
    const [listchilds, setListchilds] = useState(dataDefault)


    // useEffect(() => {
    //     // loop object(lap theo mang object)
    //     Object.entries(listchilds).map(([key, value]) => {
    //     })
    // }, [])


    const handleOnchangleInput = (name, value, key) => {
        // name la ten key cua moi object vd:url
        // value la gia tri cua moi object 
        // key la ten cua moi object vd:child1


        let _listchilds = _.cloneDeep(listchilds);
        _listchilds[key][name] = value;
        if (value && name === "url") {
            _listchilds[key]["isValidUrl"] = true

        }
        setListchilds(_listchilds)
    }

    const handleAddNewRole = () => {
        let _listchilds = _.cloneDeep(listchilds);
        _listchilds[`child-${uuidv4()}`] = dataDefault;
        setListchilds(_listchilds)
    }


    const handleDeleteRole = (key) => {
        let _listchilds = _.cloneDeep(listchilds);
        delete _listchilds[key]
        setListchilds(_listchilds)

    }

    const handleSaveRole = async () => {
        // check xem role naof rong url
        let invalidObj = Object.entries(listchilds).find(([key, value], index) => {
            return value && !value.url
        })
        if (!invalidObj) {
            let data = buildDatatoPersist()
            let res = await CreateRole(data)
            if (res && res.EC === 1) {

            } else {
                toast.info(res.EM)
                await fetchUserRole()

            }
        } else {
            toast.error("you can not empty this input")
            let _listchilds = _.cloneDeep(listchilds);
            _listchilds[invalidObj[0]]["isValidUrl"] = false
            setListchilds(_listchilds)

        }
    }


    const buildDatatoPersist = () => {
        // tao data de gui len database
        let _listchilds = _.cloneDeep(listchilds);
        let res = [];
        Object.entries(listchilds).map(([key, value], index) => {
            res.push({
                url: value.url,
                description: value.description
            })
        })
        return res
    }



    return (
        <div className='role-container'>
            <div className='container '>
                <div className=' mt-3 add-role container'>
                    <div className='row-title mt-3  '>
                        <h3> Add Url to Role (thêm đường link url vào phần quyền hạn) </h3>
                    </div>
                    <div className='dad-role row'>
                        {Object.entries(listchilds).map(([key, item], index) => {
                            return (
                                <div className="child-role row" key={`child-${key}`}>
                                    <div className='col-5 form-group'>
                                        <label>Url :</label>
                                        <input type="text" className={item.isValidUrl ? "form-control" : 'form-control is-invalid'}
                                            value={item.url}
                                            onChange={(event) => handleOnchangleInput("url", event.target.value, key)} />
                                    </div>
                                    <div className='col-5 form-group'>
                                        <label>Description : </label>
                                        <input type="text" className='form-control'
                                            value={item.description}
                                            onChange={(event) => handleOnchangleInput("description", event.target.value, key)} />

                                    </div>
                                    <div className='col-2 mt-4 action'>
                                        <button className='btn btn-success ' title="Add New Role" onClick={() => handleAddNewRole()}>
                                            <i className="fa fa-plus" ></i>

                                        </button>
                                        {index >= 1 &&
                                            <button className='btn btn-danger ' title="Delete Role" onClick={() => handleDeleteRole(key)}>
                                                <i className="fa fa-trash-o" ></i>

                                            </button>}

                                    </div>
                                </div>


                            )
                        })}

                        <div>
                            <button className='btn btn-warning my-3' title="Save" onClick={() => handleSaveRole()}>
                                <i className="fa fa-save" ></i>

                            </button>
                        </div>


                    </div>
                </div>

                <div className='mt-3  List-role container'>
                    <h3> List All Role (hiển thị toàn bộ các url trông phần role)</h3>
                    <TableRole currentPage={currentPage} currentLimit={currentLimit} setCurrentPage={setCurrentPage} fetchUserRole={fetchUserRole} listRole={listRole} totalPage={totalPage} />
                    {totalPage > 0 &&
                        <div className='user-footer'>
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
                                // thuộc tính này dùng để khi xóa trang xong về trang trước thì active trang đó
                                forcePage={+currentPage - 1}
                            />
                        </div>
                    }
                </div>

            </div>

        </div>

    )
}


export default Role