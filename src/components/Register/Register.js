import './Register.scss'
import { Link, useHistory } from "react-router-dom"
import React, { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify';
import { registerNewUser } from "../services/userService"
import { UserContext } from "../../contexApi/UserContext"
import { useTranslation, Trans } from 'react-i18next';
import {
    getAllProvinceCustomer, getAllProvince, fetchDistrictCustomerByProvinceCustomer, fetchWarCustomerdByDistrictCustomer,
    fetchWardByDistrict, getAddress_from, getAddress_to, fetchDistrictByProvince
} from "../services/addressService"
import _ from "lodash"
const Register = (props) => {
    const { user } = React.useContext(UserContext);
    const { t, i18n } = useTranslation();

    let history = useHistory()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [Phone, setPhone] = useState()
    const [username, setUsername] = useState()
    const [confirmPass, setConfirmPass] = useState()
    const [Province, setProvince] = useState()
    const [Sex, setSex] = useState()

    const [District, setDistrict] = useState()
    const [Ward, setWard] = useState()
    const [DetailAddress, setDetailAddress] = useState()
    const [assignDistrictByProvince, setassignDistrictByProvince] = useState([])
    const [allProvinceCutomer, setAllProvinceCustomer] = useState("")
    const [assignWardtByDistric, setassignWardtByDistric] = useState([])

    const handleOnchangeDistrictCustomer = async (value) => {
        if (value) {
            let res = await fetchWarCustomerdByDistrictCustomer(value)
            if (res && +res.EC === 0) {
                setassignWardtByDistric(res?.DT?.Ward_customers
                )
                setWard("")
            }
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
    const defaultValidInput = {
        isValidEmail: true,
        isValidPassword: true,
        isValidConfirmPass: true,
        isValidPhone: true,
        isValidProvince: true,
        isValidDistrict: true,
        isValidWard: true,
        isValidDetailAddress: true,

    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput)

    const handleOnchangeProviceCustomer = async (value) => {
        if (value) {
            let res = await fetchDistrictCustomerByProvinceCustomer(value)
            if (res && +res.EC === 0) {
                setassignDistrictByProvince(res?.DT?.District_customers
                )
                setDistrict("")

            }

        }
    }
    const handleBackLogin = () => {
        history.push("/login")
    }
    const handleRegister = async () => {
        console.log("email", email)
        console.log("password", password)
        console.log("Phone", Phone)
        console.log("username", username)
        console.log("Province", Province)
        console.log("District", District)
        console.log("Ward", Ward)
        console.log("DetailAddress", DetailAddress)
        console.log("Sex", Sex)

        let check = isValidInput();


        if (check === true) {
            let res = await registerNewUser(email, password, Phone, username, Province, District, Ward, DetailAddress, Sex
            )
            if (+res.EC === 0) {

                history.push("/login")
                toast.success(res.EM)
            } else {
                toast.error(res.EM)

            }

        }

    }

    const isValidInput = () => {

        setObjCheckInput(defaultValidInput)

        if (!email) {
            toast.error("email empty")
            setObjCheckInput({ ...defaultValidInput, isValidEmail: false })
            return false

        }
        let regx = /\S+@\S+\.\S+/;
        if (!regx.test(email)) {
            toast.error("please enter a valid email address")
            setObjCheckInput({ ...defaultValidInput, isValidEmail: false })

            return false

        }
        if (!Phone) {
            toast.error("Phone empty")
            setObjCheckInput({ ...defaultValidInput, isValidPhone: false })

            return false

        } if (!password) {
            toast.error("password empty")
            setObjCheckInput({ ...defaultValidInput, isValidPassword: false })

            return false

        } if (!confirmPass) {
            toast.error("confirmPass empty")
            setObjCheckInput({ ...defaultValidInput, isValidConfirmPass: false })

            return false

        }
        if (password.length < 6) {
            toast.error("Password have to enter  at least 6 character")
            setObjCheckInput({ ...defaultValidInput, isValidPassword: false })

            return false

        }
        if (confirmPass.length < 6) {
            toast.error("confirmPass have to enter  at least 6 character")
            setObjCheckInput({ ...defaultValidInput, isValidPassword: false })

            return false

        }
        if (password !== confirmPass) {
            toast.error("please  check again  confirm Pass or  password")
            setObjCheckInput({ ...defaultValidInput, isValidConfirmPass: false })

            return false

        }

        if (Province === "Tỉnh/thành phố" || !Province) {
            toast.error("Province address empty")
            setObjCheckInput({ ...defaultValidInput, isValidProvince: false })

            return false

        }
        if (District === "Quận/huyện" || !District) {
            toast.error("District address empty")
            setObjCheckInput({ ...defaultValidInput, isValidDistrict: false })

            return false

        }
        if (Ward === "Phường/xã" || !Ward) {
            toast.error("Ward address empty")
            setObjCheckInput({ ...defaultValidInput, isValidWard: false })

            return false

        }
        if (!DetailAddress) {
            toast.error("Detail address empty")
            setObjCheckInput({ ...defaultValidInput, isValidDetailAddress: false })

            return false

        }

        return true

    }
    useEffect(() => {
        getProvinceCustomer()
    }, [])
    useEffect(() => {
        if (user && user.isAuthenticated) {
            history.push("/")
        }
    }, [user])
    return (
        <div className='register-container '>
            <div className='container'>
                <div className='row px-3'>
                    <div className='container-left  d-none d-sm-block col-sm-7'>
                        <Link className='brand  ' to="/login" > huy le app</Link>
                        <div className='detail'> Meta Platforms, Inc., doing business as Meta and formerly named Facebook, Inc., and TheFacebook,</div>
                    </div>
                    <div className=' py-3 container-right col-12 col-sm-5 d-flex flex-column gap-3 ' >
                        <div className='brand  d-sm-none  ' > huy le app</div>

                        <h2 className='text-center ' > SigUp</h2>
                        <div className='form-group'>
                            <label htmlFor="" className='mb-1'>Email:</label>
                            <input type="email" className={objCheckInput.isValidEmail ? "form-control " : "form-control is-invalid"} placeholder='Email address ' value={email} onChange={(event) => setEmail(event.target.value)} />


                        </div>
                        <div className='form-group'>
                            <label htmlFor="" className='mb-1'>PhoneNumber:</label>
                            <input type="text" className={objCheckInput.isValidPhone ? "form-control " : "form-control is-invalid"} placeholder='Phone number ' value={Phone} onChange={(event) => setPhone(event.target.value)} />


                        </div>
                        <div className='form-group'>
                            <label htmlFor="" className='mb-1'>UserName:</label>
                            <input type="text" className='form-control' placeholder='User Name ' value={username} onChange={(event) => setUsername(event.target.value)} />


                        </div>
                        <div className='form-group'>
                            <label htmlFor="" className='mb-1'>Password:</label>
                            <input type="password" className={objCheckInput.isValidPassword ? "form-control " : "form-control is-invalid"} placeholder='Password ' value={password} onChange={(event) => setPassword(event.target.value)} />


                        </div>
                        <div className='form-group'>
                            <label htmlFor="" className='mb-1'>re-enter Password:</label>
                            <input type="password" className={objCheckInput.isValidConfirmPass ? "form-control " : "form-control is-invalid"} placeholder='Re-enter Password ' value={confirmPass} onChange={(event) => setConfirmPass(event.target.value)} />


                        </div>
                        <div className='col-12 col-sm-12 form-group'>

                            <label className='col-4'>
                                {t('Created-user.Night')}
                            </label>

                            <select
                                className={objCheckInput.isValidProvince === true ? "form-select my-2" : "form-select my-2 is-invalid"}
                                onChange={(event) => {
                                    handleOnchangeProviceCustomer(event.target.value);
                                    setProvince(event.target.value)
                                }
                                }

                                value={Province}


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

                            <label className='col-4'>
                                {t('Created-user.Ten')}
                            </label>

                            <select
                                className={objCheckInput.isValidDistrict === true ? "form-select my-2" : "form-select my-2 is-invalid"}
                                onChange={(event) => {
                                    handleOnchangeDistrictCustomer(event.target.value);
                                    setDistrict(event.target.value)
                                }
                                }

                                value={District}


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

                            <label className='col-4'>
                                {t('Created-user.Eleven')}
                            </label>

                            <select
                                className={objCheckInput.isValidWard === true ? "form-select my-2" : "form-select my-2 is-invalid"}
                                onChange={(event) => setWard(event.target.value)

                                }

                                value={Ward}


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


                        <div className='form-group'>
                            <label htmlFor="" className='mb-1'>Detail address :</label>
                            <input
                                type="text"
                                className={objCheckInput.isValidDetailAddress ? "form-control " : "form-control is-invalid"}
                                placeholder='Detail Address'
                                value={DetailAddress}
                                onChange={(event) => setDetailAddress(event.target.value)}
                            />


                        </div>

                        <div className='col-12  form-group'>
                            <label >
                                {t('Created-user.Thirteen')} :
                            </label>
                            <select className='form-select'
                                onChange={(event) => setSex(event.target.value)}
                                value={Sex}


                            >
                                <option defaultValue="...">...</option>

                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other" >Other</option>


                            </select >
                        </div>

                        <button className='btn btn-primary' onClick={() => handleRegister()}> Submit</button>


                        <hr />
                        <div className='text-center' >
                            <button className='btn btn-success' onClick={() => handleBackLogin()}>
                                Back to Login

                            </button>
                            <div className='mt-3 return'>
                                <Link to="/">
                                    <i className='fa fa-arrow-circle-left mx-1'></i>
                                    <span title='Return to Homepage'>Return to Homepage</span>
                                </Link>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div >
    );
}

export default Register;