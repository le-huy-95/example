import './Register.scss'
import { Link, useHistory } from "react-router-dom"
import React, { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify';
import { registerNewUser } from "../services/userService"
import { UserContext } from "../../contexApi/UserContext"

const Register = (props) => {
    const { user } = React.useContext(UserContext);

    let history = useHistory()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [Phone, setPhone] = useState()
    const [username, setUsername] = useState()
    const [confirmPass, setConfirmPass] = useState()
    const defaultValidInput = {
        isValidEmail: true,
        isValidPassword: true,
        isValidConfirmPass: true,
        isValidPhone: true,
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput)

    const handleBackLogin = () => {
        history.push("/login")
    }
    const handleRegister = async () => {
        let check = isValidInput();
        if (check === true) {
            let res = await registerNewUser(email, password, Phone, username
            )
            console.log("res register", res)
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

        } if (password.length < 6) {
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

        return true

    }

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