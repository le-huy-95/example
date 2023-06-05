import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './createProject.scss'
import getBase64 from "../commondUtils/commondUtils"
import _ from "lodash"
import { toast } from 'react-toastify';
import { UserContext } from "../../contexApi/UserContext"
import {
    getAllProvinceCustomer, getAllProvince, fetchDistrictCustomerByProvinceCustomer, fetchWarCustomerdByDistrictCustomer,
    fetchWardByDistrict, getAddress_from, getAddress_to, fetchDistrictByProvince
} from "../services/addressService"
import { getAllShippingUnit, fetchShippingCostByShippingUnit, getPriceByAddress } from "../services/shippingService"
import { CreateProject, getSaleChannel, getStastusPayment, getNameProduct, getNumberProductinWarehouse } from "../services/ProjectService"
import { Link, NavLink, useHistory } from "react-router-dom"

const CreateNewProject = (props) => {
    let history = useHistory()

    const { showModalCreatNewProject, setShowModalCreatNewProject, handleShowHideModalCreatNewProject, listProject,
        fetchProjectUser, setShowNotificationCreateSuccess, userdata, setUserdata, validInput,
        setValidInput, defaultUserData, ValidInputsDefault, order, setProductAfterCreate, productAfterCreate,
        selecCheckSubtmitImage, setSelecCheckSubtmitImage, previreImage, setprevireImage, handleConfirmUser,
        Product, SetProduct, ProductNumber, SetProductNumber, handleOnchangeInput, numberProduct, setNumberProduct, setId, id
    } = props;
    const [allProvince, setAllProvince] = useState("")
    const [allProvinceCutomer, setAllProvinceCustomer] = useState("")

    const [allAddressFrom, setAllAddressFrom] = useState("")
    const [allAddressTo, setAllAddressTo] = useState("")
    const [SaleChannel, setSaleChannel] = useState("")
    const [StatusPayment, setStatusPayment] = useState("")
    const [assignDistrictByProvinceOfReceipt, setassignDistrictByProvinceOfReceipt] = useState([])
    const [assignDistrictByProvince, setassignDistrictByProvince] = useState([])
    const [selectProvince, setSelectProvince] = useState('')
    const [assignWardtByDistric, setassignWardtByDistric] = useState([])
    const [assignWardtByDistricOfReceipt, setassignWardtByDistricOfReceipt] = useState([])
    const [shippingUnit, setShippingUnit] = useState([])
    const [assignShippingCostByShippingunit, setassignShippingCostByShippingunit] = useState([])
    const [selectShippingCost, setSelectShippingCost] = useState('')
    const [shippingCost, setshippingCost] = useState([])
    const { user } = React.useContext(UserContext);
    const [image, setimage] = useState([])




    const getnameProduct = async () => {
        let res = await getNameProduct()
        if (res && +res.EC === 0) {
            let data = res.DT.filter(item => item.product_statusId !== 3 && item.product_statusId !== 2 && item.createdBy === user.account.phone)

            SetProduct(data)
        }
    }

    const getNumberProduct = async (id) => {
        setId(id)
        if (id !== "sản phẩm") {
            let res = await getNumberProductinWarehouse(id)
            if (res && +res.EC === 0) {
                setNumberProduct(res.DT?.product_number)
            }
        } else {
            setNumberProduct("")
        }

    }


    const handleOnchangeImage = async (value) => {

        const fileArray = Array.from(value).map((file) => URL.createObjectURL(file))
        setimage(value)
        setprevireImage(fileArray)

    }


    const handleOnchangeProvinceOfReceipt = async (value) => {
        setSelectProvince(value)
        if (value) {
            let res = await fetchDistrictByProvince(value)

            console.log(res)

            if (res && +res.EC === 0) {
                setassignDistrictByProvinceOfReceipt(res?.DT?.Address_Districts
                )
            }

        }
    }



    const handleOnchangeProviceCustomer = async (value) => {
        // setSelectProvince(value)
        if (value) {
            let res = await fetchDistrictCustomerByProvinceCustomer(value)


            if (res && +res.EC === 0) {
                setassignDistrictByProvince(res?.DT?.District_customers
                )
            }

        }
    }

    const handleOnchangeDistrictOfReceipt = async (value) => {
        if (value) {
            let res = await fetchWardByDistrict(value)
            console.log("res", res)
            if (res && +res.EC === 0) {
                setassignWardtByDistricOfReceipt(res?.DT?.Address_Wards
                )
            }


        }
    }

    const handleOnchangeDistrict = async (value) => {

        if (value) {
            let res = await fetchWarCustomerdByDistrictCustomer(value)

            if (res && +res.EC === 0) {
                console.log("211", res)

                setassignWardtByDistric(res?.DT?.Ward_customers
                )
            }

        }
    }

    const handleOnchangeShippingUnit = async (value) => {
        setSelectShippingCost(value)
        if (value) {
            let res = await fetchShippingCostByShippingUnit(value)

            if (res && +res.EC === 0) {
                setassignShippingCostByShippingunit(res?.DT?.Shipping_Costs
                )
            }

        }
    }


    const handleRenderCost = async (From, to, shippingUnit_Id) => {


        if (From, to, +shippingUnit_Id) {



            let res = await getPriceByAddress(From, to, +shippingUnit_Id)
            if (res && +res.EC === 0) {
                console.log("res", res)
                setshippingCost(res?.DT?.Cost)
            }


        }
    }
    const getAllSaleChannel = async () => {
        let res = await getSaleChannel()
        if (res && +res.EC === 0) {
            setSaleChannel(res.DT)

        } else {
            toast.error(res.EM)
        }
    }

    const getAllStastusPayment = async () => {
        let res = await getStastusPayment()
        if (res && +res.EC === 0) {
            setStatusPayment(res.DT)

        } else {
            toast.error(res.EM)
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
    const getProvince = async () => {
        let res = await getAllProvince()
        if (res && +res.EC === 0) {
            setAllProvince(res.DT)

        } else {
            toast.error(res.EM)
        }
    }
    const getAddressFrom = async () => {
        let res = await getAddress_from()
        if (res && +res.EC === 0) {
            setAllAddressFrom(res.DT)

        } else {
            toast.error(res.EM)
        }
    }
    const getAddressTo = async () => {
        let res = await getAddress_to()
        if (res && +res.EC === 0) {
            setAllAddressTo(res.DT)

        } else {
            toast.error(res.EM)
        }
    }
    const getShippingUnit = async () => {
        let res = await getAllShippingUnit()
        if (res && +res.EC === 0) {
            setShippingUnit(res.DT)

        } else {
            toast.error(res.EM)
        }
    }



    const handleSubmitImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        console.log("image", image)
        for (let i = 0; i < image.length; i++) {

            formData.append('multiple_image', image[i]);


        }
        formData.append("order", userdata.order);


        fetch("http://localhost:3030/api/v6/upload-multiple-pic", {
            method: "POST",
            body: formData,

        }).then((res) => res.status === 500 ? toast.error(" địnhg dạng ảnh không đúng hoặc dung lượng ảnh quá lớn") : toast.success(`Đã thêm ${previreImage.length} ảnh thành công vào đơn hàng`));

        setSelecCheckSubtmitImage(true)

    }



    const handleDeleteImage = (link) => {

        let numberdeleteImage = []
        for (let i = 0; i < previreImage.length; i++) {
            if (previreImage[i] === link) {
                numberdeleteImage.push(i)
            }
        }

        let abc = Object.values(image);
        let resultImage = abc.filter(item => item !== abc[numberdeleteImage])
        setimage(resultImage)

        let result = previreImage.filter(item => item !== link)
        setprevireImage(result)
    }






    useEffect(() => {
        getProvinceCustomer()
        getProvince()
        getShippingUnit()
        getAddressFrom()
        getAddressTo()
        getAllSaleChannel()
        getAllStastusPayment()
        getnameProduct()
        handleRenderCost()

    }, [showModalCreatNewProject])


    const handleCloseModale = () => {
        setNumberProduct("")
        setSelecCheckSubtmitImage(false)

        setSelectShippingCost("")
        handleShowHideModalCreatNewProject()
        setprevireImage("")
        setUserdata(defaultUserData)
        setValidInput(ValidInputsDefault)


    }

    return (
        <>


            <Modal show={showModalCreatNewProject}
                onHide={() => handleCloseModale()}
                size="xl"
                backdrop="static"

            >
                <Modal.Header closeButton>
                    <Modal.Title>Tạo Đơn hàng mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='create_new_Project-container col-12'>
                        <div className='container'>
                            <div className='tittle my-3'>
                                <h4 className='order '>
                                    <span className='mx-2 name-order' > Mã đơn hàng :</span>
                                    <span className='name-order_number'
                                    >{order ? userdata.order = order : "Đang cập nhật"}</span>
                                </h4>

                            </div>
                            <div className='row'>
                                <div className='left-table col-8'>

                                    <div className='create-product '

                                    >
                                        <h4 className='mb-3 d-flex align-item-center justify-content-center'> Thêm thông tin sản phẩm và giá cả</h4>
                                        <div className='row'>
                                            <div className='name-product col-5 mb-2'>
                                                <label htmlFor='input-name-product' className='mb-2' >Tên sản phẩm (<span className='red'>*</span>)</label>

                                                <select
                                                    style={{ fontWeight: "700" }}
                                                    className={validInput.name_Product ? "form-select " : "form-select  is-invalid"}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "name_Product")}
                                                    onClick={(event) => { getNumberProduct(event.target.value); }}
                                                    value={userdata.name_Product}
                                                >

                                                    <option value="sản phẩm">Chọn sản phẩm muốn giao</option>

                                                    {Product && Product.length > 0 &&
                                                        Product.map((item, index) => {


                                                            return (
                                                                <option key={`Province - ${index}`} value={item.id} style={{ fontWeight: "700" }}>
                                                                    Id sản phẩm  {item.id} : {item.product}
                                                                </option>

                                                            )
                                                        })
                                                    }

                                                </select >
                                                {Product && Product.length === 0 &&
                                                    <label htmlFor='input-name-product' className='mb-2'  >
                                                        <b>Bạn chưa có sản phẩm  trong kho hàng </b>
                                                        <br />
                                                        <Link to="/Warehouse">
                                                            <i class="fa fa-wrench" aria-hidden="true"></i>
                                                            <span className='mx-2'>vui lòng tạo ngay sản phẩm </span>
                                                        </Link>

                                                    </label>
                                                }

                                            </div>
                                            <div className='number-product col-4 mb-2'>
                                                <label htmlFor='input-number-product' className='mb-2' >Số lượng sản phẩm (<span className='red'>*</span>)</label>
                                                <input
                                                    id='input-number-product'
                                                    type="text"
                                                    min="1" max="9999"
                                                    className={validInput.number ? "form-control" : "form-control is-invalid"}
                                                    value={userdata.number}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "number")}

                                                />

                                                {numberProduct > 0 &&
                                                    <label htmlFor='input-number-product' className='mb-2' >Số lượng Sản phẩm còn trong kho : <b>{numberProduct ? numberProduct : ""} </b></label>

                                                }
                                                {numberProduct === 0 &&
                                                    <label htmlFor='input-number-product' className='mb-2' >Số lượng Sản phẩm còn trong kho : <b>Hết hàng </b></label>

                                                }

                                            </div>
                                            <div className='unit col-3 mb-2'>
                                                <label htmlFor='input-product'  >Đơn vị:</label>
                                                <select
                                                    readOnly
                                                    className={validInput.unit ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "unit")}
                                                    value={userdata.unit}
                                                >
                                                    <option value="Đơn vị">Lựa chọn </option>
                                                    <option value="Chiếc">Chiếc</option>
                                                    <option value="Bộ">Bộ </option>
                                                    <option value="Tấm">Tấm</option>
                                                    <option value="Miếng">Miếng</option>
                                                    <option value="Túi">Túi</option>
                                                    <option value="Hộp">Hộp</option>
                                                    <option value="Gói">Gói </option>
                                                    <option value="Bao tải">Bao tải</option>
                                                    <option value="Thùng">Thùng</option>




                                                </select >
                                            </div>
                                            <div className='number-product col-12 mb-2'>
                                                <label htmlFor='input-number-product' className='mb-2' >Kênh mua hàng (<span className='red'>*</span>)</label>
                                                <select
                                                    className={validInput.salesChannel ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "salesChannel")}
                                                    value={userdata.salesChannel}


                                                >
                                                    <option defaultValue="Phường/xã">...</option>
                                                    {SaleChannel && SaleChannel.length > 0 &&
                                                        SaleChannel.map((item, index) => {
                                                            return (
                                                                <option key={`SaleChannel-${index}`} value={item.id}>{item.name}</option>

                                                            )
                                                        })
                                                    }



                                                </select >
                                            </div>

                                            <div className='money-product col-6'>
                                                <label htmlFor='input-money-product' className='mb-2' >Giá 1 sản phẩm(<span className='red'>*</span>)</label>
                                                <input
                                                    id='input-money-product'
                                                    type="text"
                                                    min="1" max="9999"
                                                    className={validInput.money ? "form-control" : "form-control is-invalid"}
                                                    value={userdata.money}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "money")}

                                                />
                                            </div>
                                            <div className='total-product col-6'>
                                                <label htmlFor='input-total-product' className='mb-2' >Khuyến mãi:</label>
                                                <input
                                                    id='input-total-product'
                                                    type="text"
                                                    min="1" max="9999"
                                                    className={validInput.price_drop ? "form-control" : "form-control is-invalid"}
                                                    value={userdata.price_drop}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "price_drop")}

                                                />
                                            </div>
                                            <div className='StatusPayment col-6 mb-1'>
                                                <label htmlFor='input-StatusPayment' className='mb-2' >Trạng thái thanh toán (<span className='red'>*</span>)</label>
                                                <select
                                                    className={validInput.StatusPaymentId ? "form-select " : "form-select  is-invalid"}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "StatusPaymentId")}
                                                    value={userdata.StatusPaymentId}


                                                >
                                                    <option defaultValue="Phường/xã">Chọn trạng thái thanh toán</option>
                                                    {StatusPayment && StatusPayment.length > 0 &&
                                                        StatusPayment.map((item, index) => {
                                                            return (
                                                                <option key={`SaleChannel-${index}`} value={item.id}>{item.status}</option>

                                                            )
                                                        })
                                                    }



                                                </select >
                                            </div>
                                            {userdata.StatusPaymentId === "3" &&
                                                <div className='total-product col-6'>
                                                    <label htmlFor='input-total-product' className='mb-2' >Đã thanh toán :</label>
                                                    <input
                                                        id='input-total-product'
                                                        type="text"
                                                        min="1" max="9999"
                                                        className={validInput.paid ? "form-control" : "form-control is-invalid"}
                                                        value={userdata.paid}
                                                        onChange={(event) => handleOnchangeInput(event.target.value, "paid")}

                                                    />
                                                </div>

                                            }
                                            {userdata.StatusPaymentId === "2" &&
                                                <div className='total-product col-6'>
                                                    <label htmlFor='input-total-product' className='mb-2' >Đã thanh toán :</label>
                                                    <input
                                                        id='input-total-product'
                                                        type="text"
                                                        min="1" max="9999"
                                                        className={validInput.paid ? "form-control" : "form-control is-invalid"}
                                                        value={userdata.paid = "0"}
                                                        onChange={(event) => handleOnchangeInput(event.target.value, "paid")}

                                                    />
                                                </div>

                                            }
                                            {userdata.StatusPaymentId === "1" &&
                                                <div className='total-product col-6'>
                                                    <label htmlFor='input-total-product' className='mb-2' >Đã thanh toán :</label>
                                                    <input
                                                        id='input-total-product'
                                                        type="text"
                                                        min="1" max="9999"
                                                        className={validInput.paid ? "form-control" : "form-control is-invalid"}
                                                        value={userdata.paid = Number(`${userdata.money}`) * Number(`${userdata.number}`) - Number(`${userdata.price_drop ? userdata.price_drop : "0"}`)}
                                                        onChange={(event) => handleOnchangeInput(event.target.value, "paid")}

                                                    />
                                                </div>

                                            }

                                            <div className='total-product col-6'>
                                                <label htmlFor='input-total-product' className='mb-2' >Tổng giá trị <b>{userdata.number}</b> sản phẩm (chưa có phí ship) </label>
                                                <input
                                                    id='input-total-product'
                                                    type="text"

                                                    className={validInput.totalMoney ? "form-control" : "form-control is-invalid"}
                                                    disabled
                                                    value={Number(`${userdata.money}`) * Number(`${userdata.number}`) - Number(`${userdata.price_drop ? userdata.price_drop : "0"}`) - Number(`${userdata.paid ? userdata.paid : "0"}`)
                                                        ? userdata.totalMoney = Number(`${userdata.money}`) * Number(`${userdata.number}`) - Number(`${userdata.price_drop ? userdata.price_drop : "0"}`) - Number(`${userdata.paid ? userdata.paid : "0"}`)
                                                        : userdata.totalMoney = "0"
                                                    }

                                                />
                                            </div>


                                            <div className='unitMoney col-6 mb-2'>
                                                <label htmlFor='input-product'>Đơn vị tiền :</label>
                                                <select
                                                    className={validInput.unit_money ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "unit_money")}
                                                    value={userdata.unit_money}
                                                >
                                                    <option value="Đơn vị">Lựa chọn </option>
                                                    <option value="VND">VND</option>
                                                    <option value="USD">USD</option>
                                                    <option value="RMB">RMB</option>




                                                </select >
                                            </div>


                                            <div className='unitMoney col-6 mb-2'>
                                                <label htmlFor='input-product'> Hình thức nhận tiền thanh toán :</label>
                                                <select
                                                    className={validInput.Mode_of_payment ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "Mode_of_payment")}
                                                    value={userdata.Mode_of_payment}
                                                >
                                                    <option value="Lựa chọn">Lựa chọn </option>
                                                    <option value="Nhận tiền thanh toán ở trung tâm">Nhận tiền ở trung tâm giao dịch</option>
                                                    <option value="Nhận tiền thanh toán qua tài khoản ngân hàng">Nhận tiền qua tài khoản ngân hàng</option>




                                                </select >
                                            </div>
                                            {userdata.Mode_of_payment === "Nhận tiền thanh toán qua tài khoản ngân hàng"

                                                &&
                                                <>

                                                    <div className='total-product col-6'>
                                                        <label htmlFor='input-total-product' className='mb-2' >Tên chủ tài khoản</label>
                                                        <input
                                                            id='input-total-product'
                                                            type="text"
                                                            className={validInput.name_account ? "form-control" : "form-control is-invalid"}
                                                            value={userdata.name_account}
                                                            onChange={(event) => handleOnchangeInput(event.target.value, "name_account")}

                                                        />

                                                    </div>

                                                    <div className='unitMoney col-6 mb-2'>
                                                        <label htmlFor='input-product'> Tên ngân hàng :</label>
                                                        <select
                                                            className={validInput.Bank_name ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                            onChange={(event) => handleOnchangeInput(event.target.value, "Bank_name")}
                                                            value={userdata.Bank_name}
                                                        >
                                                            <option value="Lựa chọn ">Lựa chọn </option>
                                                            <option value="Vietcombank">Vietcombank</option>
                                                            <option value="Vietinbank">Vietinbank</option>
                                                            <option value="Agribank">Agribank</option>
                                                            <option value="Techcombank">Techcombank</option>
                                                            <option value="Tpbank">Tpbank</option>
                                                            <option value="Vpbank">Vpbank</option>
                                                            <option value="Mbbank">Mbbank</option>
                                                            <option value="Oceanbank">Oceanbank</option>
                                                            <option value="Bidv">Bidv</option>
                                                            <option value="Acbbank">Acbbank</option>
                                                            <option value="Sacombank">Sacombank</option>
                                                            <option value="VIB">VIB</option>
                                                        </select >
                                                    </div>
                                                    <div className='total-product col-6'>
                                                        <label htmlFor='input-total-product' className='mb-2' >Số tài khoản</label>
                                                        <input
                                                            id='input-total-product'
                                                            type="text"
                                                            className={validInput.Main_Account ? "form-control" : "form-control is-invalid"}
                                                            value={userdata.Main_Account}
                                                            onChange={(event) => handleOnchangeInput(event.target.value, "Main_Account")}

                                                        />

                                                    </div>
                                                </>
                                            }

                                        </div>

                                    </div>
                                    <div className='create-customer my-5 '>
                                        <h4 className='mb-4 d-flex align-item-center justify-content-center'> Thêm thông tin người nhận</h4>
                                        <div className='row'>
                                            <div className='name-customer col-6 mb-2'>
                                                <label htmlFor='input-name-customer' className='mb-2' >Tên : (<span className='red'>*</span>)</label>
                                                <input
                                                    id='input-name-customer'
                                                    type="text"
                                                    className={validInput.customer_name ? "form-control" : "form-control is-invalid"}
                                                    value={userdata.customer_name}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "customer_name")}

                                                />
                                            </div>
                                            <div className='phone-customer col-6 mb-2'>
                                                <label htmlFor='input-phone-customer' className='mb-2' >số điện thoại (<span className='red'>*</span>)</label>
                                                <input
                                                    id='input-phone-customer'
                                                    type="text"
                                                    className={validInput.customer_name_phone ? "form-control" : "form-control is-invalid"}
                                                    value={userdata.customer_name_phone}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "customer_name_phone")}

                                                />
                                            </div>
                                            <div className='note-customer col-12 mb-2'>
                                                <label htmlFor='input-note-customer' className='mb-2' >Ghi chú : </label>
                                                <input
                                                    id='input-note-customer'
                                                    type="text"
                                                    className='form-control'
                                                    value={userdata.note}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "note")}

                                                />
                                            </div>
                                            <div className='age-customer col-6'>
                                                <label htmlFor='input-age-customer' className='mb-2' >tuổi</label>
                                                <input
                                                    id='input-age-customer'
                                                    type="text"
                                                    className={validInput.age ? "form-control" : "form-control is-invalid"}
                                                    value={userdata.age}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "age")}

                                                />
                                            </div>
                                            <div className='address-customer col-6'>
                                                <label htmlFor='select-address-product' >Địa chỉ (<span className='red'>*</span>)</label>
                                                <select
                                                    id='select-address-product'
                                                    className={validInput.Province_customer ? "form-select my-2" : "form-select my-2 is-invalid"}

                                                    onChange={(event) => { handleOnchangeProviceCustomer(event.target.value); handleOnchangeInput(event.target.value, "Province_customer") }}
                                                    value={userdata.Province_customer}

                                                >
                                                    <option defaultValue="Tỉnh/thành phố">Tỉnh/thành phố</option>


                                                    {allProvinceCutomer && allProvinceCutomer.length > 0 &&
                                                        allProvinceCutomer.map((item, index) => {
                                                            return (
                                                                <option key={`Province - ${index}`} value={item.id}>{item.name}</option>

                                                            )
                                                        })
                                                    }
                                                </select >
                                                <select
                                                    className={validInput.District_customer ? "form-select my-2" : "form-select my-2 is-invalid"}

                                                    onChange={(event) => { handleOnchangeDistrict(event.target.value); handleOnchangeInput(event.target.value, "District_customer") }}
                                                    value={userdata.District_customer}

                                                >
                                                    <option defaultValue="Quận/huyện">Quận/huyện</option>
                                                    {assignDistrictByProvince && assignDistrictByProvince.length > 0
                                                        &&
                                                        assignDistrictByProvince.map((item, index) => {
                                                            return (
                                                                <option key={`District - ${index}`} value={item.id}>{item.name}</option>

                                                            )
                                                        })
                                                    }
                                                </select >
                                                <select
                                                    className={validInput.Ward_customer ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "Ward_customer")}
                                                    value={userdata.Ward_customer}


                                                >
                                                    <option defaultValue="Phường/xã">Phường/xã</option>
                                                    {assignWardtByDistric && assignWardtByDistric.length > 0 &&
                                                        assignWardtByDistric.map((item, index) => {
                                                            return (
                                                                <option key={`Ward - ${index}`} value={item.id}>{item.name}</option>

                                                            )
                                                        })
                                                    }
                                                </select >
                                                <input
                                                    id='input-total-product'
                                                    type="text"
                                                    className={validInput.detail_address_customer ? "form-control" : "form-control is-invalid"}
                                                    placeholder='địa chỉ chi tiết '
                                                    value={userdata.detail_address_customer}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "detail_address_customer")}

                                                />
                                            </div>
                                        </div>


                                    </div>

                                </div>
                                <div className='right-table col-4 '>
                                    <div className='create-note  '>
                                        <h5 className='mb-4 d-flex align-item-center justify-content-center'> Thêm thông tin bổ xung</h5>
                                        <div className='row'>
                                            <div className=' col-12 mb-2'>
                                                <label htmlFor='input-name-customer' className='mb-2' >
                                                    Ghi Chú :
                                                </label>
                                                <input
                                                    id='input-name-customer'
                                                    type="text"
                                                    className='form-control'
                                                    value={userdata.Note_More}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "Note_More")}

                                                />
                                            </div>






                                        </div>

                                    </div>
                                    <div className='user-create mt-3 '>
                                        <h5 className='mb-4 d-flex align-item-center justify-content-center'> Người tạo đơn :</h5>
                                        <div className='row'>
                                            <div className=' col-12 mb-2'>
                                                <label htmlFor='input-name-customer' className='mb-2' >
                                                    Họ tên :
                                                </label>
                                                {user &&

                                                    <input
                                                        id='input-name-customer'
                                                        type="text"
                                                        className='form-control'
                                                        disabled
                                                        value={user.account.username.toLocaleUpperCase()}

                                                    />
                                                }
                                            </div>

                                            <div className=' col-12 mb-2'>
                                                <label htmlFor='input-name-customer' className='mb-2' >
                                                    Số điện thoại :
                                                </label>
                                                {user &&

                                                    <input
                                                        id='input-name-customer'
                                                        type="text"
                                                        className='form-control'
                                                        disabled
                                                        value={user.account.phone}

                                                    />
                                                }
                                            </div>
                                            <div className=' col-12 mb-2'>
                                                <label htmlFor='delivery_From' className='mb-2' >
                                                    Địa chỉ gủi hàng :(<span className='red'>*</span>)
                                                </label>
                                                <select
                                                    id='select-address-product'
                                                    className={validInput.Province_of_receipt ? "form-select my-2" : "form-select my-2 is-invalid"}

                                                    onChange={(event) => {
                                                        handleOnchangeProvinceOfReceipt(event.target.value);
                                                        handleOnchangeInput(event.target.value, "Province_of_receipt")
                                                    }}
                                                    value={userdata.Province_of_receipt}

                                                >
                                                    <option defaultValue="Tỉnh/thành phố">Tỉnh/thành phố</option>


                                                    {allProvince && allProvince.length > 0 &&
                                                        allProvince.map((item, index) => {
                                                            return (
                                                                <option key={`Province - ${index}`} value={item.id}>{item.name}</option>

                                                            )
                                                        })
                                                    }



                                                </select >

                                                <select
                                                    id='select-address-product'
                                                    className={validInput.District_of_receipt ? "form-select my-2" : "form-select my-2 is-invalid"}

                                                    onChange={(event) => {
                                                        handleOnchangeDistrictOfReceipt(event.target.value);
                                                        handleOnchangeInput(event.target.value, "District_of_receipt")
                                                    }}
                                                    value={userdata.District_of_receipt}


                                                >
                                                    <option defaultValue="Quận/huyện">Quận/huyện</option>
                                                    {assignDistrictByProvinceOfReceipt && assignDistrictByProvinceOfReceipt.length > 0 &&
                                                        assignDistrictByProvinceOfReceipt.map((item, index) => {
                                                            return (
                                                                <option key={`Province - ${index}`} value={item.id}>{item.name}</option>

                                                            )
                                                        })
                                                    }
                                                </select >
                                                <select
                                                    className={validInput.Ward_of_receipt ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "Ward_of_receipt")}
                                                    value={userdata.Ward_of_receipt}


                                                >
                                                    <option defaultValue="Phường/xã">Phường/xã</option>
                                                    {assignWardtByDistricOfReceipt && assignWardtByDistricOfReceipt.length > 0 &&
                                                        assignWardtByDistricOfReceipt.map((item, index) => {
                                                            return (
                                                                <option key={`Province - ${index}`} value={item.id}>{item.name}</option>

                                                            )
                                                        })
                                                    }



                                                </select >

                                                <input
                                                    id='input-total-product'
                                                    type="text"
                                                    className={validInput.Detail_Place_of_receipt ? "form-control" : "form-control is-invalid"}
                                                    placeholder='địa chỉ gửi hàng chi tiết '
                                                    value={userdata.Detail_Place_of_receipt}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "Detail_Place_of_receipt")}

                                                />
                                            </div>

                                        </div>

                                    </div>
                                    <div className='create-delivery my-3 '>
                                        <h5 className='mb-4 d-flex align-item-center justify-content-center'> Thêm thông tin giao hàng</h5>
                                        <div className='row'>
                                            <div className=' col-12 mb-2'>

                                                <label htmlFor='delivery_unit' className='mb-2' >
                                                    lựa chọn đơn vị vận chuyển :(<span className='red'>*</span>)
                                                </label>
                                                <select
                                                    className={validInput.shippingUnitId ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                    onChange={(event) => { handleOnchangeShippingUnit(event.target.value); handleOnchangeInput(event.target.value, "shippingUnitId") }}
                                                    onClick={() => handleRenderCost(userdata.From_address, userdata.To_address, +selectShippingCost)}

                                                    value={userdata.shippingUnitId}


                                                >
                                                    <option defaultValue="Phường/xã">Lựa chọn đơn vị giao hàng</option>

                                                    {shippingUnit && shippingUnit.length > 0 &&
                                                        shippingUnit.map((item, index) => {
                                                            return (
                                                                <option key={`Province - ${index}`} value={item.id}>{item.NameUnit}</option>

                                                            )
                                                        })
                                                    }



                                                </select >

                                            </div>

                                            <div className=' col-12 mb-2'>
                                                <label htmlFor='delivery_From' className='mb-2' >
                                                    Nơi gửi hàng :(<span className='red'>*</span>)
                                                </label>
                                                <select
                                                    className={validInput.From_address ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "From_address")}
                                                    onClick={() => handleRenderCost(userdata.From_address, userdata.To_address, +selectShippingCost)}

                                                    value={userdata.From_address}


                                                >
                                                    <option defaultValue="Phường/xã">Nơi gửi hàng</option>
                                                    {allAddressFrom && allAddressFrom.length > 0 &&
                                                        allAddressFrom.map((item, index) => {
                                                            return (
                                                                <option key={`Province - ${index}`} value={item.name}>{item.name}</option>

                                                            )
                                                        })
                                                    }
                                                </select >


                                            </div>

                                            <div className=' col-12 mb-2'>
                                                <label htmlFor='delivery_To' className='mb-2' >
                                                    Nơi đến :(<span className='red'>*</span>)
                                                </label>
                                                <select
                                                    className={validInput.To_address ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "To_address")}
                                                    onClick={() => handleRenderCost(userdata.From_address, userdata.To_address, +selectShippingCost)}

                                                    value={userdata.To_address}


                                                >
                                                    <option defaultValue="Phường/xã">Nơi nhận hàng</option>
                                                    {allAddressTo && allAddressTo.length > 0 &&
                                                        allAddressTo.map((item, index) => {
                                                            return (
                                                                <option key={`Province - ${index}`} value={item.name}>{item.name}</option>

                                                            )
                                                        })
                                                    }
                                                </select >
                                            </div>
                                            <div className=' col-12 mb-2'>
                                                <label htmlFor='delivery_To' className='mb-2' >
                                                    Giá cước:
                                                </label>

                                                <input
                                                    id='elivery_To'
                                                    type="text"
                                                    disabled
                                                    className='form-control'
                                                    onChange={() => handleOnchangeInput(shippingCost, "shipping_Cost")}
                                                    value={shippingCost ? userdata.shipping_Cost = shippingCost : "Đang cập nhật"
                                                    }

                                                />




                                            </div>
                                            <div className=' col-12 mb-2'>
                                                <label htmlFor='delivery_To' className='mb-2' >
                                                    Tổng giá trị đơn hàng (Đã có phí ship)
                                                </label>

                                                <input
                                                    id='elivery_To'
                                                    type="text"
                                                    disabled
                                                    className='form-control'
                                                    onChange={(event) => handleOnchangeInput(event.target.value, "totalWithShippingCost")}
                                                    value={userdata.shipping_Cost && userdata.totalMoney
                                                        ?
                                                        userdata.totalWithShippingCost = Number(`${userdata.shipping_Cost}`) + Number(`${userdata.totalMoney}`)
                                                        : userdata.totalWithShippingCost = "Đang cập nhật"
                                                    }

                                                />




                                            </div>


                                        </div>

                                    </div>
                                </div>


                            </div>
                            <div className='create-image '>
                                <h4 className=' d-flex align-item-center justify-content-center '>Thêm hình ảnh</h4>
                                {selecCheckSubtmitImage === true &&
                                    <div className=' d-flex align-item-center justify-content-center '>
                                        Đã thêm--<h5>{previreImage.length}--</h5>ảnh vào đơn hàng
                                    </div>}
                                <div className='image-product col-12 '>
                                    <div className='container'>
                                        <form
                                            onSubmit={handleSubmitImage}
                                            method='POST'
                                            encType='multipart/form-data'
                                            action='upload-multiple-pic'
                                        >
                                            <div className='image col-12'>
                                                <div className='row'>
                                                    <div className='col-12 d-flex icon '>

                                                        <input
                                                            type="file"
                                                            id='previewimage'
                                                            name="multiple-image"
                                                            multiple
                                                            hidden
                                                            onChange={(event) => handleOnchangeImage(event.target.files)}
                                                        />
                                                        <label
                                                            htmlFor="previewimage"
                                                            className='Update-image col-3  d-flex align-item-center justify-content-center'>
                                                            <span>
                                                                <i className="fa fa-upload " aria-hidden="true"></i>
                                                            </span>
                                                            <span > Upload Image</span>

                                                        </label>
                                                        <div className='col-6'></div>
                                                        {previreImage.length > 0 &&
                                                            <button className='btn btn-success col-3'>
                                                                <i class="fa fa-check" aria-hidden="true"></i>

                                                                <span className='mx-2'>Save Image</span>
                                                            </button>


                                                        }


                                                    </div>

                                                </div>

                                                <div className=' container '>
                                                    <div className='row d-flex justify-content-center gap-1'>

                                                        {previreImage && previreImage.length > 0 &&
                                                            previreImage.map((item, index) => {


                                                                return (
                                                                    <div className='preview-image ' key={`image - ${index}`}

                                                                        style={{ backgroundImage: `url(${item})`, height: "150px" }}
                                                                    >
                                                                        <div className='cancel' onClick={() => handleDeleteImage(item)} title="Delete Image">
                                                                            <i class="fa fa-times-circle-o" aria-hidden="true"></i>
                                                                        </div>
                                                                    </div>


                                                                )
                                                            })

                                                        }

                                                    </div>



                                                </div>


                                            </div>
                                        </form>
                                    </div>



                                </div>


                            </div>
                        </div>


                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModale()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => { handleConfirmUser() }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal >

        </>
    );
}

export default CreateNewProject;