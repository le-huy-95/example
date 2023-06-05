import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './listUser.scss'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { GetGroup, CreateNewUser, UpdateUser } from "../services/userService"
import { updateProject } from "../services/ProjectService"

import { toast } from 'react-toastify';
import _ from "lodash"
import getBase64 from "../commondUtils/commondUtils"
import {
    getAllProvinceCustomer, getAllProvince, fetchDistrictCustomerByProvinceCustomer, fetchWarCustomerdByDistrictCustomer,
    fetchWardByDistrict, getAddress_from, getAddress_to, fetchDistrictByProvince
} from "../services/addressService"
import { getAllShippingUnit, fetchShippingCostByShippingUnit, getPriceByAddress } from "../services/shippingService"
import { useHistory } from "react-router-dom"

const ModalCreate = (props) => {
    let history = useHistory()

    const { show, handleCloseCreateModal, handleCloseModalCreateone, action, dataModal, imageConvert, listUser1 } = props
    const [userGroup, setUserGroup] = useState([])
    const [allProvinceCutomer, setAllProvinceCustomer] = useState("")
    const [assignDistrictByProvince, setassignDistrictByProvince] = useState([])
    const [assignWardtByDistric, setassignWardtByDistric] = useState([])
    const [StatusProvinceCustomer, setStatusProvinceCustomer] = useState(true)
    const [StatusWardCustomer, setStatusWardCustomer] = useState(true)
    const [StatusDistrictCustomer, setStatusDistrictCustomer] = useState(true)
    const [shippingUnit, setShippingUnit] = useState([])

    const getProvinceCustomer = async () => {
        let res = await getAllProvinceCustomer()
        if (res && +res.EC === 0) {
            setAllProvinceCustomer(res.DT)

        } else {
            toast.error(res.EM)
        }
    }
    const handleOnchangeProviceCustomer = async (value) => {
        if (value) {
            let res = await fetchDistrictCustomerByProvinceCustomer(value)


            if (res && +res.EC === 0) {
                setassignDistrictByProvince(res?.DT?.District_customers
                )
            }

        }
    }
    const handleOnchangeDistrictCustomer = async (value) => {
        if (value) {
            let res = await fetchWarCustomerdByDistrictCustomer(value)
            if (res && +res.EC === 0) {
                setassignWardtByDistric(res?.DT?.Ward_customers
                )
            }
        }
    }


    const defaultUserData = {
        email: "",
        phone: "",
        username: "",
        password: "",
        address: "",
        sex: "",
        group: "",
        image: "",
        Province_customerId: "",
        District_customerId: "",
        Ward_customerId: "",
        addressDetail: "",
        Position: "",
        shippingUnit_Id: ""
    }


    const ValidInputsDefault = {
        email: true,
        phone: true,
        username: true,
        password: true,
        address: true,
        sex: true,
        group: true,
        image: true,
        Province_customerId: true,
        District_customerId: true,
        Ward_customerId: true,
        addressDetail: true,
        Position: true,
        shippingUnit_Id: true
    }

    const [userdata, setUserdata] = useState(defaultUserData)
    const [validInput, setValidInput] = useState(ValidInputsDefault)
    const [previreImage, setprevireImage] = useState("")


    useEffect(() => {
        getAllGroup()
        getProvinceCustomer()
        getShippingUnit()
    }, [])

    useEffect(() => {


        if (action === "Update") {
            setUserdata({ ...dataModal, group: dataModal.groupId })
            setprevireImage(imageConvert)
            handleOnchangeProviceCustomer(dataModal.Province_customerId)
            handleOnchangeDistrictCustomer(dataModal.District_customerId)

        }
    }, [action])



    useEffect(() => {

        if (action === "Create") {
            setUserdata(defaultUserData)
            setprevireImage("")
        }
    }, [action])

    const getAllGroup = async () => {
        let res = await GetGroup()
        if (res && +res.EC === 0) {
            setUserGroup(res.DT)
            if (res.DT && res.DT.length > 0) {
                setUserdata({ ...userdata })
            }
        } else {
            toast.error(res.EM)
        }
    }

    const handleOnchangeInput = async (value, name) => {
        let _userdata = _.cloneDeep(userdata)
        _userdata[name] = value

        if (_userdata["group"] == 2) {
            _userdata[name] = value
            _userdata["Position"] = ""
            _userdata["shippingUnit_Id"] = ""

        }

        if (_userdata["group"] == 3) {
            _userdata[name] = value
            _userdata["Position"] = ""
            _userdata["shippingUnit_Id"] = ""

        }

        if (name === "image") {
            let file = value[0]
            if (file) {
                let base64 = await getBase64(file)
                const objectUrl = URL.createObjectURL(file)
                setprevireImage(objectUrl)
                _userdata["image"] = base64
            }

        }

        setUserdata(_userdata)
    }


    const handleSelectProvinceCustomer = (value) => {
        if (value > 0) {
            setStatusProvinceCustomer(true)
            setStatusDistrictCustomer(false)
        }
        if (value === "Tỉnh/thành phố") {
            setStatusProvinceCustomer(false)
            setStatusDistrictCustomer(false)

        }

        if (+value == userdata?.District_customer?.Province_customerId) {
            setStatusDistrictCustomer(true)
        }

    }
    const handleSelectDistrictCustomer = (value) => {
        if (value > 0) {

            setStatusDistrictCustomer(true)
            setStatusWardCustomer(false)

        }
        if (value === "Quận/huyện") {
            setStatusDistrictCustomer(false)
            setStatusWardCustomer(false)

        }
        if (+value == userdata?.Ward_customer?.District_customerId) {
            setStatusWardCustomer(true)
        }
    }
    const handleSelectWardCustomer = (value) => {

        if (value > 0) {
            setStatusWardCustomer(true)

        } else {
            setStatusWardCustomer(false)


        }
    }

    const checkValueDate = () => {
        if (action === "Update") return true
        setValidInput(ValidInputsDefault)





        let arr = ["email", "phone", "password", "addressDetail", "group"]
        let check = true
        let regx = /\S+@\S+\.\S+/;

        if (!regx.test(userdata[arr[0]])) {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[0]] = false
            setValidInput(_validInput)
            toast.error("please enter a valid email address")

            return false

        }


        let regxPhone = /^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/;
        if (!regxPhone.test(userdata[arr[1]])) {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[1]] = false
            setValidInput(_validInput)
            toast.error("please enter a valid Phone Number")

            return false

        }

        for (let i = 0; i < arr.length; i++) {
            if (!userdata[arr[i]]) {
                let _validInput = _.cloneDeep(ValidInputsDefault);
                _validInput[arr[i]] = false
                setValidInput(_validInput)
                toast.error(`Empty input ${arr[i]}`)
                check = false
                break
            }
            if (userdata[arr[i]] && !userdata["Province_customerId"]) {
                setStatusProvinceCustomer(false)
                toast.error("please check Province customer address")
                return;
            }
        }


        return check


    }

    const handleConfirmUser = async () => {

        if (action === "Update") {
            if (!userdata["addressDetail"]) {
                let _validInput = _.cloneDeep(ValidInputsDefault);
                _validInput["addressDetail"] = false
                setValidInput(_validInput)
                toast.error("please enter a addressDetail")

                return
            }
        }
        if (StatusProvinceCustomer === false) {
            toast.error("please check Province customer address")
            return;
        }
        if (StatusDistrictCustomer === false) {
            toast.error("please check District  customer address")
            return;
        }

        if (StatusWardCustomer === false) {
            toast.error("please check Ward customer address")
            return;
        }
        let check = checkValueDate();



        if (check === true) {
            let res =
                action === "Create"
                    ?
                    await CreateNewUser({ ...userdata, groupId: userdata['group'] })
                    :
                    await UpdateUser({ ...userdata, groupId: userdata['group'] })
            if (res && +res.EC === 0) {
                toast.success("create success")
                setUserdata({
                    ...defaultUserData,

                })

                handleCloseModale()




            }
            if (res && +res.EC !== 0) {
                toast.error(res.EM)
                let _validInput = _.cloneDeep(ValidInputsDefault);
                _validInput[res.DT] = false
                setValidInput(_validInput)
            }
        }
    }


    const handleCloseModale = () => {


        handleCloseCreateModal()

        if (action === "Create") {
            setprevireImage("")
            setUserdata(defaultUserData)

        } else {
            setprevireImage(imageConvert)
            setUserdata(dataModal)

        }
        if (action === "Create") {
            setUserdata(defaultUserData)
        }
        setValidInput(ValidInputsDefault)
    }
    const getShippingUnit = async () => {
        let res = await getAllShippingUnit()
        if (res && +res.EC === 0) {
            setShippingUnit(res.DT)

        } else {
            toast.error(res.EM)
        }
    }
    return (
        <>


            <Modal show={show} onHide={() => handleCloseModale()} size="lg" className='modal-user' backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title> {action === "Create" ? "Create New User " : " Edit User"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group'>
                            <label >Email adress (<span className='red'>*</span>)</label>
                            <input
                                disabled={action === 'Create' ? false : true}
                                type="email"
                                className={validInput.email ? "form-control" : "form-control is-invalid"}
                                value={userdata.email}
                                onChange={(event) => handleOnchangeInput(event.target.value, "email")}
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-group'>
                            <label >UserName
                                {/* (<span className='red'>*</span> */}
                            </label>
                            <input
                                type="text" className='form-control'
                                value={userdata.username}
                                onChange={(event) => handleOnchangeInput(event.target.value, "username")}

                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label >Phone Number (<span className='red'>*</span>)</label>
                            <input
                                disabled={action === 'Create' ? false : true}
                                type="text"
                                className={validInput.phone ? "form-control" : "form-control is-invalid"}
                                value={userdata.phone}
                                onChange={(event) => handleOnchangeInput(event.target.value, "phone")}

                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            {action === 'Create' &&
                                <>

                                    <label >Password (<span className='red'>*</span>)</label>
                                    <input
                                        type="password"
                                        className={validInput.password ? "form-control" : "form-control is-invalid"}
                                        value={userdata.password}
                                        onChange={(event) => handleOnchangeInput(event.target.value, "password")}

                                    />
                                </>
                            }

                        </div>
                        {userdata.group == 2 || userdata.group == 3 ?
                            <></>
                            :
                            // <div className='col-12 col-sm-6 form-group'>
                            //     <label >Position (<span className='red'>*</span>)</label>
                            //     <input

                            //         type="text"
                            //         className={validInput.Position ? "form-control" : "form-control is-invalid"}
                            //         value={userdata.Position}
                            //         onChange={(event) => handleOnchangeInput(event.target.value, "Position")}
                            //     />
                            // </div>
                            <div className='col-12 col-sm-6 form-group'>
                                <label >Position (<span className='red'>*</span>)</label>
                                <select
                                    className={validInput.Position ? "form-control" : "form-control is-invalid"}
                                    onChange={(event) => handleOnchangeInput(event.target.value, "Position")}
                                    value={userdata.Position}
                                >
                                    <option value="Đơn vị">Lựa chọn chức vụ</option>
                                    <option value="Nhân viên lấy hàng">Nhân viên lấy hàng</option>
                                    <option value="Nhân viên kho hàng">Nhân viên kho hàng</option>
                                    <option value="Nhân viên giao hàng">Nhân viên giao hàng</option>
                                    <option value="Nhân viên kế toán">Nhân viên kế toán</option>





                                </select >
                            </div>

                        }


                        {userdata.group == 2 || userdata.group == 3 ?
                            <></>
                            :
                            <div className='col-12 col-sm-6 form-group'>
                                <label >Unit</label>
                                <select
                                    className={validInput.shippingUnit_Id ? "form-control" : "form-control is-invalid"}
                                    onChange={(event) => handleOnchangeInput(event.target.value, "shippingUnit_Id")}
                                    value={userdata.shippingUnit_Id}



                                >
                                    <option value="Đơn vị">Lựa chọn đơn vị công tác</option>


                                    {shippingUnit && shippingUnit.length > 0 &&
                                        shippingUnit.map((item, index) => {
                                            return (
                                                <option key={`Province - ${index}`} value={item.id}>{item.NameUnit}</option>

                                            )
                                        })
                                    }


                                </select >

                            </div>}

                        <div className='col-12 col-sm-12 form-group'>

                            <label className='col-4'>Address province user :</label>

                            <select
                                className={StatusProvinceCustomer === true ? "form-select my-2" : "form-select my-2 is-invalid"}
                                onChange={(event) => {
                                    handleSelectProvinceCustomer(event.target.value);
                                    handleOnchangeProviceCustomer(event.target.value);
                                    handleOnchangeInput(event.target.value, "Province_customerId")
                                }}

                                value={userdata.Province_customerId}


                            >
                                <option value="Tỉnh/thành phố">Tỉnh/thành phố</option>
                                {allProvinceCutomer && allProvinceCutomer.length > 0 &&
                                    allProvinceCutomer.map((item, index) => {
                                        return (
                                            <option key={`Province - ${index}`} value={item.id}>{item.name}</option>

                                        )
                                    })
                                }
                            </select >




                        </div>
                        <div className='col-12 col-sm-12 form-group'>
                            <label className='col-4'>Address district user :</label>

                            <select
                                className={StatusDistrictCustomer === true ? "form-select my-2" : "form-select my-2 is-invalid"}

                                onChange={(event) => {
                                    handleSelectDistrictCustomer(event.target.value);
                                    handleOnchangeDistrictCustomer(event.target.value);
                                    handleOnchangeInput(event.target.value, "District_customerId")
                                }}
                                value={userdata.District_customerId}

                            >
                                <option value="Quận/huyện">Quận/huyện</option>
                                {assignDistrictByProvince && assignDistrictByProvince.length > 0
                                    &&
                                    assignDistrictByProvince.map((item, index) => {
                                        return (
                                            <option key={`District - ${index}`} value={item.id}>{item.name}</option>

                                        )
                                    })
                                }
                            </select >
                        </div>
                        <div className='col-12 col-sm-12 form-group'>
                            <label className='col-4'>Address ward user :</label>

                            <select
                                className={StatusWardCustomer === true ? "form-select my-2" : "form-select my-2 is-invalid"}
                                onChange={(event) => {
                                    handleSelectWardCustomer(event.target.value);
                                    handleOnchangeInput(event.target.value, "Ward_customerId");

                                }
                                }
                                value={userdata.Ward_customerId}


                            >
                                <option value="Phường/xã">Phường/xã</option>
                                {assignWardtByDistric && assignWardtByDistric.length > 0 &&
                                    assignWardtByDistric.map((item, index) => {
                                        return (
                                            <option key={`Ward - ${index}`} value={item.id}>{item.name}</option>

                                        )
                                    })
                                }
                            </select >
                        </div>
                        <div className='col-12 col-sm-12 '>
                            <label className='col-4'>Address Detail :</label>

                            <input

                                id='input-total-product'
                                type="text"
                                className={validInput.addressDetail ? "form-control" : "form-control is-invalid"}
                                placeholder='địa chỉ chi tiết '
                                value={userdata.addressDetail}
                                onChange={(event) => handleOnchangeInput(event.target.value, "addressDetail")}

                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label >Gender</label>
                            <select className='form-select'
                                onChange={(event) => handleOnchangeInput(event.target.value, "sex")}
                                value={userdata.sex}


                            >
                                <option defaultValue="...">...</option>

                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other" >Other</option>


                            </select >
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label >Group (<span className='red'>*</span>)</label>
                            <select
                                className={validInput.group ? "form-select" : "form-select is-invalid"}
                                onChange={(event) => handleOnchangeInput(event.target.value, "group")}
                                value={userdata.group}
                            >
                                {action === 'Create' && <option defaultValue="0">select group user</option>}


                                {userGroup && userGroup.length > 0 &&
                                    userGroup.map((item, index) => {
                                        return (
                                            <option key={`group-${index}`} value={item.id}>{item.name}</option>

                                        )
                                    })}



                            </select >
                        </div>
                        <div className='col-12 col-sm-12 form-group py-3 image'>
                            <label >Image User :</label>

                            <div className='image-icon'>
                                <input type="file" id='previewimage' hidden
                                    onChange={(event) => handleOnchangeInput(event.target.files, "image")}
                                />
                                <label htmlFor="previewimage" className='Update-image '>Upload Image <i className="fa fa-upload" aria-hidden="true"></i>
                                </label>

                            </div>
                            {action === "Create" ?
                                <div className='preview-image ' style={{ backgroundImage: `url(${previreImage})` }}></div>
                                :
                                <div className='preview-image ' style={{ backgroundImage: `url(${previreImage})` }}></div>

                            }
                        </div>


                    </div>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => handleConfirmUser()} >
                        {action === 'Create' ? "Save" : "Update"}                    </Button>
                    <Button variant="secondary" onClick={() => handleCloseModale()}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal >
        </>
    );
}


export default ModalCreate