import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, NavLink, useHistory } from "react-router-dom"
import { validateInfomationChangePass } from "./services/ProjectService"
import { UserContext } from "../contexApi/UserContext"
import { toast } from 'react-toastify';
import './ModalSendEmail.scss'


const ModalSendEmailResetPass = (props) => {
    const { user } = React.useContext(UserContext);
    const { showModalSendemail, handleShowhideEmail } = props
    const [email, setEmail] = useState("")
    const [emailReceiveOtp, setEmailReceiveOtp] = useState("")
    const [phone, setPhone] = useState("")
    const [otp, setOtp] = useState("")
    const [PassWord, setPassWord] = useState("")
    const [ConfirmPassWord, setConfirmPassWord] = useState("")

    const [checkValidateEmail, setCheckValidateEmail] = useState(true)
    const [checkValidateEmailReceiveOtp, setcheckValidateEmailReceiveOtp] = useState(true)
    const [checkPhone, setcheckPhone] = useState(true)
    const [sendUpdateInfo, setSendUpdateInfo] = useState("0")
    const [checkValidateOtp, setcheckValidateOtp] = useState(true)
    const [checkValidatePassWord, setcheckValidatePassWord] = useState(true)
    const [checkValidateConfirmPassWord, setcheckValidateConfirmPassWord] = useState(true)



    const handleVerifyInfomationForgotPassWord = async () => {
        if (!email) {
            setCheckValidateEmail(false)
            toast.error("Can not empty email")
        }
        if (!emailReceiveOtp) {
            setcheckValidateEmailReceiveOtp(false)
            toast.error("Can not empty email receive otp")
        }
        if (!phone) {
            setcheckPhone(false)
            toast.error("Can not empty phone")
        }
        if (email && emailReceiveOtp && phone) {
            let res = await validateInfomationChangePass({
                email: email,
                phone: phone,
                emailReceiveOtp: emailReceiveOtp,
                name: user.account.username
            })
            if (res && +res.EC === 0) {
                setSendUpdateInfo("1")
                toast.success("Otp code has been sent to your gmail")
                setCheckValidateEmail(true)
                setcheckValidateEmailReceiveOtp(true)
                setcheckPhone(true)
            } else {
                toast.error(res.EM)
                setCheckValidateEmail(false)
                setcheckPhone(false)

            }
        }

    }

    return (
        <Modal show={showModalSendemail} onHide={handleShowhideEmail} animation={false} size='lg' centered >
            <Modal.Header closeButton>
                <Modal.Title>
                    <div>
                        <div> {sendUpdateInfo === "0" ? "Forgot Password" : "Update Password"}</div>
                        <div>Otp expire after 2 minutes</div>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {sendUpdateInfo === "0" ?
                    <div className='ResetPass-container'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-12'>
                                    <fieldset className='border rounded-3 p-3' >
                                        <legend className='float-none w-auto '>
                                            <div className='d-flex align-items-center px-3 '>
                                                <div>Gmail đăng ký trên hệ thống  {checkValidateEmail === false &&
                                                    <span style={{ color: "red" }}><i class="fa fa-times" aria-hidden="true"></i>
                                                    </span>
                                                }  </div>
                                            </div>

                                        </legend>

                                        <input
                                            id='input-password'
                                            type="email"
                                            className={checkValidateEmail === true ? "form-control  " : "form-control is-invalid"}
                                            placeholder='Email'
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}


                                        />
                                    </fieldset>
                                </div>
                                <div className='col-12 py-3'>
                                    <fieldset className='border rounded-3 p-3' >
                                        <legend className='float-none w-auto '>
                                            <div className='d-flex align-items-center px-3 '>
                                                <div>Gmail nhận mã OTp {checkValidateEmailReceiveOtp === false &&
                                                    <span style={{ color: "red" }}><i class="fa fa-times" aria-hidden="true"></i>
                                                    </span>
                                                } </div>
                                            </div>

                                        </legend>

                                        <input
                                            id='input-password'
                                            type="email"
                                            className={checkValidateEmailReceiveOtp === true ? "form-control  " : "form-control is-invalid"}
                                            placeholder='Email'
                                            value={emailReceiveOtp}
                                            onChange={(event) => setEmailReceiveOtp(event.target.value)}


                                        />
                                    </fieldset>
                                </div>
                                <div className='col-12 pt-3'>
                                    <fieldset className='border rounded-3 p-3' >
                                        <legend className='float-none w-auto px-3 '>
                                            <div className='d-flex align-items-center '>
                                                <div>Số điện thoại đăng ký trên hệ thống {checkPhone === false &&
                                                    <span style={{ color: "red" }}><i class="fa fa-times" aria-hidden="true"></i>
                                                    </span>
                                                } </div>
                                            </div>

                                        </legend>

                                        <input
                                            id='input-password'
                                            type="password"
                                            className={checkPhone === true ? "form-control  " : "form-control is-invalid"}
                                            placeholder='Phone number'
                                            onChange={(event) => setPhone(event.target.value)}


                                        />
                                    </fieldset>
                                </div>

                            </div>
                        </div>
                    </div>
                    :
                    <div className='ResetPass-container'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-12'>
                                    <fieldset className='border rounded-3 p-3' >
                                        <legend className='float-none w-auto '>
                                            <div className='d-flex align-items-center px-2 '>
                                                <div>Otp{checkValidateOtp === false &&
                                                    <span style={{ color: "red" }}><i class="fa fa-times" aria-hidden="true"></i>
                                                    </span>
                                                }  </div>
                                            </div>

                                        </legend>

                                        <input
                                            id='input-password'
                                            type="email"
                                            className={checkValidateOtp === true ? "form-control  " : "form-control is-invalid"}
                                            placeholder='Email'
                                            value={otp}
                                            onChange={(event) => setOtp(event.target.value)}


                                        />
                                    </fieldset>
                                </div>
                                <div className='col-12 py-3'>
                                    <fieldset className='border rounded-3 p-3' >
                                        <legend className='float-none w-auto '>
                                            <div className='d-flex align-items-center px-3 '>
                                                <div>New password{checkValidatePassWord === false &&
                                                    <span style={{ color: "red" }}><i class="fa fa-times" aria-hidden="true"></i>
                                                    </span>
                                                } </div>
                                            </div>

                                        </legend>

                                        <input
                                            id='input-password'
                                            type="email"
                                            className={checkValidatePassWord === true ? "form-control  " : "form-control is-invalid"}
                                            placeholder='PassWord'
                                            value={PassWord}
                                            onChange={(event) => setPassWord(event.target.value)}


                                        />
                                    </fieldset>
                                </div>
                                <div className='col-12 pt-3'>
                                    <fieldset className='border rounded-3 p-3' >
                                        <legend className='float-none w-auto px-3 '>
                                            <div className='d-flex align-items-center '>
                                                <div>Confirm PassWord {checkValidateConfirmPassWord === false &&
                                                    <span style={{ color: "red" }}><i class="fa fa-times" aria-hidden="true"></i>
                                                    </span>
                                                } </div>
                                            </div>

                                        </legend>

                                        <input
                                            id='input-password'
                                            type="password"
                                            className={checkValidateConfirmPassWord === true ? "form-control  " : "form-control is-invalid"}
                                            placeholder='Confirm PassWord'
                                            value={ConfirmPassWord}
                                            onChange={(event) => setConfirmPassWord(event.target.value)}

                                        />
                                    </fieldset>
                                </div>

                            </div>
                        </div>
                    </div>
                }



            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleShowhideEmail}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleVerifyInfomationForgotPassWord()} >
                    Save
                </Button>
            </Modal.Footer>
        </Modal >);
}

export default ModalSendEmailResetPass;