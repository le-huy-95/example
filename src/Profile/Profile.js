import './Profile.scss'
import { Link, NavLink, useHistory } from "react-router-dom"
import { GetProfile } from "../components/services/userService"
import { UserContext } from "../contexApi/UserContext"
import React, { useEffect, useState } from 'react'
import moment from "moment"
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { UpdateImageChat } from "../components/services/ProjectService"
import { fetchDistrictCustomerByProvinceCustomer, fetchWarCustomerdByDistrictCustomer, getAllProvinceCustomer } from "../components/services/addressService"
import { toast } from 'react-toastify';

import _ from "lodash"
const Profile = (props) => {
    const { user } = React.useContext(UserContext);
    const [data, setData] = useState("")
    const [dataDefaut, setDataDefaut] = useState("")

    const [isOpen, setIsOpen] = useState(false)
    const [previewsImage, setPreviewsImage] = useState("")
    const [editName, setEditName] = useState(false)
    const [image, setImage] = useState("")
    const [editSex, setEditSex] = useState(false)
    const [editAddress, setEditAddress] = useState(false)
    const [assignDistrictByProvince, setassignDistrictByProvince] = useState([])
    const [allProvinceCutomer, setAllProvinceCustomer] = useState("")
    const [assignWardtByDistric, setassignWardtByDistric] = useState([])

    let getProfile = async () => {
        let res = await GetProfile(user?.account?.phone)
        if (res && +res.EC === 0) {
            console.log(res.DT)
            setData(res.DT)
            setDataDefaut(res.DT)
            let imagebase64 = ""
            if (res.DT.image) {
                imagebase64 = new Buffer(res.DT.image, "base64").toString("binary")
                setImage(imagebase64)
            }
        }

    }


    const [isValidProvince, setisValidProvince] = useState(true)
    const [isValidDistrict, setisValidDistrict] = useState(true)
    const [isValidWard, setisValidWard] = useState(true)
    const [isValidDetailAddress, setisValidDetailAddress] = useState(true)



    const handleSelectProvinceCustomer = (value) => {
        if (value > 0) {
            setisValidProvince(true)
            setisValidDistrict(false)
        }
        if (value === "Tỉnh/thành phố") {
            setisValidProvince(false)
            setisValidDistrict(false)

        }

        if (+value == data.District_customer.Province_customerId) {
            setisValidDistrict(true)
        }

    }


    const handleSelectDistrictCustomer = (value) => {
        if (value > 0) {

            setisValidDistrict(true)
            setisValidWard(false)

        } else {
            setisValidDistrict(false)
            setisValidWard(false)

        }
        if (+value == data.Ward_customer.District_customerId) {
            setisValidWard(true)
        }
    }

    const handleSelectWardCustomer = (value) => {

        if (value > 0) {
            setisValidWard(true)

        } else {
            setisValidWard(false)
        }
    }

    const getProvinceCustomer = async () => {
        let res = await getAllProvinceCustomer()
        if (res && +res.EC === 0) {
            setAllProvinceCustomer(res.DT)

        } else {
            toast.error(res.EM)

        }
    }
    useEffect(() => {
        getProvinceCustomer()

    }, [])

    useEffect(() => {
        if (editAddress === true) {
            handleOnchangeProviceCustomer(data?.Province_customerId)
            handleOnchangeDistrictCustomer(data?.District_customerId)

        }
    }, [editAddress])


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


    const handleOnchangeInput = async (value, name) => {
        let _data = _.cloneDeep(data)
        _data[name] = value

        setData(_data)

    }

    const handleClickImage = (imagebase64) => {
        if (!imagebase64) return;
        setPreviewsImage(imagebase64)
        setIsOpen(true)
    };

    useEffect(() => {
        getProfile()

    }, [])

    return (
        <div className='Profile-container'>
            <div className='container ctn'>
                <div className='location-path-Profile my-3'>
                    <Link to="/"> Home</Link>

                    <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                    </span>
                    <Link to="/Profile">Profile</Link>
                </div>
                <div className='Title mb-3'> My profile</div>

                <div className='profile-body'>
                    <div className='row'>

                        <div className='left col-5'>
                            <div className='container'>
                                <div className='image my-3' onClick={() => handleClickImage(image)}>
                                    <img src={image} alt="Avata" />
                                </div>
                                <div className='title'>
                                    <span>
                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                    </span>
                                    <span className='mx-2'>
                                        Thay đổi avata
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div className='right col-7' >
                            <div className='Infomation'>
                                <div className="container">

                                    {editName === false
                                        ?
                                        <>
                                            <div className="item my-3">

                                                <span className='my-3 d-flex'>
                                                    <span className='item-user mx-2'>
                                                        <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                                                    </span>
                                                    <span className='mx-3 '>
                                                        Họ và tên
                                                    </span>
                                                </span>
                                                <span className='d-flex align-items-center'>
                                                    <span className='mx-3 color-item address-wrap' >{data.username}</span>



                                                    <button className='btn btn-warning edit-profile mx-2' onClick={() => setEditName(true)} title='Edit'>
                                                        <i class="fa fa-pencil" aria-hidden="true"></i>

                                                    </button>








                                                </span>

                                            </div>
                                        </>
                                        :
                                        <div className='container'>
                                            <div className='row item my-3'>
                                                <div className='col-12'>
                                                    <div className='d-flex mt-3' style={{ fontSize: "25px" }} >
                                                        <span className='mx-2 address-wrap item-user' >
                                                            <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                                                        </span>
                                                        <span className='mx-2 '>
                                                            Họ và tên
                                                        </span>
                                                    </div>

                                                    <div className='item-edit'>
                                                        <input
                                                            id='input-number-product '
                                                            type="text"
                                                            className="form-control  my-3 mx-3"
                                                            value={data?.username}
                                                            onChange={(event) => handleOnchangeInput(event.target.value, "username")}


                                                        />

                                                        <div className='d-flex'>
                                                            <button className='btn btn-success btn' title='Save'>
                                                                <i class="fa fa-check" aria-hidden="true"></i>

                                                            </button>
                                                            <button className='btn btn-danger mx-2 btn' title='Exit' onClick={() => { setEditName(false); setData(dataDefaut) }}>
                                                                <i class="fa fa-times" aria-hidden="true"></i>


                                                            </button>
                                                        </div>

                                                    </div>
                                                </div>


                                            </div>

                                        </div>


                                    }


                                    <div className="item my-3">
                                        <span className='my-3'>
                                            <span className='item-phone mx-2'>
                                                <i class="fa fa-phone" aria-hidden="true"></i>

                                            </span>
                                            <span className='mx-3'>Phone</span>
                                        </span>
                                        <span>
                                            <span className='mx-3 color-item'>{data.phone}</span>

                                        </span>

                                    </div>
                                    {editSex === false
                                        ?
                                        <>

                                            <div className="item my-3">
                                                <span className='my-3'>
                                                    <span className='item-Sex mx-2'>
                                                        <i class="fa fa-venus-mars" aria-hidden="true"></i>


                                                    </span>
                                                    <span className='mx-3'>Sex</span>
                                                </span>
                                                <span>
                                                    <span className='mx-3 color-item'>{data.sex}</span>
                                                    <button className='btn btn-warning edit-profile mx-2' onClick={() => setEditSex(true)}>
                                                        <i class="fa fa-pencil" aria-hidden="true"></i>

                                                    </button>
                                                </span>

                                            </div>
                                        </>
                                        :
                                        <div className='container'>
                                            <div className='row item my-3'>
                                                <div className='col-12'>
                                                    <div className='d-flex mt-3' style={{ fontSize: "25px" }} >
                                                        <span className='mx-2 address-wrap item-Sex'>
                                                            <i class="fa fa-venus-mars" aria-hidden="true"></i>
                                                        </span>
                                                        <span className='mx-3'>Sex</span>

                                                    </div>

                                                    <div className='item-edit my-3'>
                                                        <select className='form-select'
                                                            onChange={(event) => handleOnchangeInput(event.target.value, "sex")}
                                                            value={data.sex}


                                                        >
                                                            <option defaultValue="...">...</option>

                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                            <option value="Other" >Other</option>


                                                        </select >

                                                        <div className='d-flex mx-2'>
                                                            <button className='btn btn-success btn' title='Save'>
                                                                <i class="fa fa-check" aria-hidden="true"></i>

                                                            </button>
                                                            <button className='btn btn-danger mx-2 btn' title='Exit' onClick={() => { setEditSex(false); setData(dataDefaut) }}>
                                                                <i class="fa fa-times" aria-hidden="true"></i>


                                                            </button>
                                                        </div>

                                                    </div>
                                                </div>


                                            </div>

                                        </div>
                                    }
                                    <div className="item my-3">
                                        <span className='my-3  d-flex'>
                                            <span className='item-Mail mx-2'>
                                                <i class="fa fa-envelope" aria-hidden="true"></i>



                                            </span>
                                            <span className='mx-3'>Email</span>
                                        </span>
                                        <span className='d-flex align-items-center'>
                                            <span className='mx-3 color-item address-wrap'>{data.email}</span>

                                        </span>

                                    </div>
                                    <div className="item my-3">
                                        <span className='my-3'>
                                            <span className='item-Group mx-2'>
                                                <i class="fa fa-thumb-tack" aria-hidden="true"></i>



                                            </span>
                                            <span className='mx-3'>Group</span>
                                        </span>
                                        <span>
                                            <span className='mx-3 color-item'>{data?.Group?.name}</span>

                                        </span>

                                    </div>
                                    {editAddress === false
                                        ?
                                        <div className="item my-3">
                                            <span className='my-3 d-flex'>
                                                <span className='item-Address mx-2'>
                                                    <i class="fa fa-location-arrow" aria-hidden="true"></i>
                                                </span>
                                                <span className='mx-3'>Address</span>
                                            </span>
                                            <span className='d-flex align-items-center'>
                                                <span className='mx-3 color-item address-wrap'>{data?.addressDetail},{data?.Ward_customer?.name},{data?.District_customer?.name},{data.Province_customer?.name}</span>
                                                <button className='btn btn-warning edit-profile mx-2' onClick={() => setEditAddress(true)}>
                                                    <i class="fa fa-pencil" aria-hidden="true"></i>

                                                </button>
                                            </span>

                                        </div>
                                        :
                                        <div className='container'>
                                            <div className='row item my-3'>
                                                <div className='col-12'>
                                                    <div className='d-flex mt-3 '  >
                                                        <span className='mx-2 address-wrap item-Address' >
                                                            <i class="fa fa-location-arrow" aria-hidden="true"></i>
                                                        </span>
                                                        <span className='mx-3'>Address</span>

                                                    </div>
                                                    <div className='row'>


                                                        <div className='item-edit'>
                                                            <div className='item-edit-address col-8'>
                                                                <select
                                                                    className={isValidProvince === true ? "form-select my-2 " : " form-select my-2  is-invalid"}
                                                                    onChange={(event) => {
                                                                        handleSelectProvinceCustomer(event.target.value);
                                                                        handleOnchangeProviceCustomer(event.target.value);
                                                                        handleOnchangeInput(event.target.value, "Province_customerId")
                                                                    }
                                                                    }

                                                                    value={data.Province_customerId}

                                                                >
                                                                    <option value="Tỉnh/thành phố">Tỉnh/thành phố</option>
                                                                    {allProvinceCutomer && allProvinceCutomer.length > 0
                                                                        ?
                                                                        allProvinceCutomer.map((item, index) => {
                                                                            return (
                                                                                <option key={`Province - ${index}`} value={item.id}>{item.name}</option>

                                                                            )
                                                                        })
                                                                        :
                                                                        <option value={data.Province_customerId} >{data.Province_customer.name}</option>

                                                                    }
                                                                </select >
                                                                <select
                                                                    className={isValidDistrict === true ? "form-select my-2 mx-2" : "form-select my-2 mx-2 is-invalid"}
                                                                    onChange={(event) => {
                                                                        handleSelectDistrictCustomer(event.target.value);

                                                                        handleOnchangeDistrictCustomer(event.target.value);
                                                                        handleOnchangeInput(event.target.value, "District_customerId")
                                                                    }
                                                                    }

                                                                    value={data.District_customerId}

                                                                >
                                                                    <option value="Quận/huyện">Quận/huyện</option>
                                                                    {assignDistrictByProvince && assignDistrictByProvince.length > 0
                                                                        ?
                                                                        assignDistrictByProvince.map((item, index) => {
                                                                            return (
                                                                                <option key={`District - ${index}`} value={item.id}>{item.name}</option>

                                                                            )
                                                                        })
                                                                        :
                                                                        <option value={data.District_customerId} >{data.District_customer.name}</option>

                                                                    }
                                                                </select >
                                                                <select
                                                                    className={isValidWard === true ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                                    onChange={(event) => {
                                                                        handleOnchangeInput(event.target.value, "Ward_customerId");
                                                                        handleSelectWardCustomer(event.target.value)
                                                                    }

                                                                    }

                                                                    value={data.Ward_customerId}


                                                                >
                                                                    <option value="Phường/xã">Phường/xã</option>
                                                                    {assignWardtByDistric && assignWardtByDistric.length > 0
                                                                        ?
                                                                        assignWardtByDistric.map((item, index) => {
                                                                            return (
                                                                                <option key={`Ward - ${index}`} value={item.id}>{item.name}</option>

                                                                            )
                                                                        })
                                                                        :
                                                                        <option value={data.Ward_customerId} >{data.Ward_customer.name}</option>
                                                                    }
                                                                </select >
                                                                <input
                                                                    type="text"
                                                                    className={isValidDetailAddress ? "form-control mb-2 " : "form-control is-invalid mb-2"}
                                                                    placeholder='Detail Address'
                                                                    value={data?.addressDetail}
                                                                    onChange={(event) => {
                                                                        handleOnchangeInput(event.target.value, "addressDetail");
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className='d-flex col-3 d-flex justify-content-center '>
                                                                <button className='btn btn-success btn' title='Save'>
                                                                    <i class="fa fa-check" aria-hidden="true"></i>

                                                                </button>
                                                                <button className='btn btn-danger mx-2 btn' title='Exit'
                                                                    onClick={() => {
                                                                        setEditAddress(false);
                                                                        setData(dataDefaut);
                                                                        setisValidProvince(true);
                                                                        setisValidDistrict(true);
                                                                        setisValidWard(true)
                                                                    }}>
                                                                    <i class="fa fa-times" aria-hidden="true"></i>


                                                                </button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>


                                            </div>

                                        </div>

                                    }

                                    {data?.Shipping_Unit?.NameUnit &&
                                        <div className="item my-3">
                                            <span className='my-3 d-flex'>
                                                <span className='item-shipping mx-2'>
                                                    <i class="fa fa-motorcycle" aria-hidden="true"></i>




                                                </span>
                                                <span className='mx-3'>Shipping unit</span>
                                            </span>
                                            <span className='d-flex align-items-center'>
                                                <span className='mx-3 color-item '>{data?.Shipping_Unit?.NameUnit}</span>

                                            </span>

                                        </div>
                                    }
                                    {data?.Position
                                        &&
                                        <div className="item my-3">
                                            <span className='my-3 d-flex'>
                                                <span className='item-position mx-2'>
                                                    <i class="fa fa-rss" aria-hidden="true"></i>




                                                </span>
                                                <span className='mx-3'>Position</span>
                                            </span>
                                            <span className='d-flex align-items-center'>
                                                <span className='mx-3 color-item address-wrap'>{data?.Position ? data?.Position : ""}</span>

                                            </span>

                                        </div>
                                    }

                                    <div className="item my-3">
                                        <span className='my-3'>
                                            <span className='item-Time mx-2'>
                                                <i class="fa fa-clock-o" aria-hidden="true"></i>
                                            </span>
                                            <span className='mx-3'>Created at</span>
                                        </span>
                                        <span>
                                            <span className='mx-3 color-item'>
                                                {moment(`${data.createdAt}`).format("DD/MM/YYYY")}                                                            </span>

                                        </span>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {isOpen && previewsImage &&
                            <Lightbox
                                mainSrc={previewsImage}

                                onCloseRequest={() => setIsOpen(false)}

                            />
                        }



                    </div>
                </div>

            </div>
        </div >

    )
}

export default Profile;