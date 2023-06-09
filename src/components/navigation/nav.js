import React, { useEffect, useState, useContext } from 'react'
import './nav.scss'
import { NavLink, Link } from "react-router-dom"
import { useLocation, useHistory } from 'react-router-dom';
import { UserContext } from "../../contexApi/UserContext"

import { LogOutUser } from "../services/userService"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../../img/logo.svg"
import { toast } from 'react-toastify'
import ModalViewNotification from "../modalviewNotification"
import { NotificationContext } from "../../contexApi/NotificationContext"
import ModalChangePass from "../modalChangePass"
const NavHeader = (props) => {
    const location = useLocation()
    const history = useHistory()
    const { user, logout } = React.useContext(UserContext);
    const { list, listStaff } = React.useContext(NotificationContext);


    const [show, setShow] = useState(false)
    const [showModalChangePass, setShowModalChangePass] = useState(false)

    const handleShowChanePassModal = () => {
        setShowModalChangePass(!showModalChangePass)
    }


    const handleShowNotificationModal = () => {
        setShow(!show)
    }
    const handleLogOut = async () => {
        let res = await LogOutUser()
        // clear cookie
        if (res && +res.EC === 0) {
            localStorage.removeItem("jwt")
            // clear localStorage
            localStorage.removeItem("infomation Page")
            localStorage.removeItem("StatusPayment")

            logout();
            // set user default in contextApi
            toast.success("logout success !")
            history.push("/login")
        } else {
            toast.error(res.EM)
        }
    }
    //  neu ko co thong tin user thi khong hien thanh nav va chi cho thanh nav hien khi o trang home khi chua co nguoi dung
    if (user && user.isAuthenticated === true || location.pathname === "/") {

        return (
            <>
                <div className='nav-header'>
                    <Navbar bg="header" expand="lg">
                        <Container>

                            <Navbar.Brand >

                                <img
                                    src={logo}
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top"
                                    alt='Logo'
                                />
                                <span className='brand-name' >HUY LE </span>
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <NavLink className="nav-link" to="/" exact>Home</NavLink>
                                    <NavDropdown title="Admin" id="basic-nav-dropdown" className='dropdown'>
                                        <NavDropdown.Item href='/listuser'  >List user</NavDropdown.Item>
                                        <NavDropdown.Item href='/role' >Role</NavDropdown.Item>
                                        <NavDropdown.Item href='/grouprole'>Group-role</NavDropdown.Item>
                                    </NavDropdown>
                                    {!user.account.Position &&
                                        <NavDropdown title="Customer" id="basic-nav-dropdown" className='dropdown'>
                                            <NavDropdown.Item href='/dashboard_Product'>Dashboard Product</NavDropdown.Item>
                                            <NavDropdown.Item href='/dashboard_Warehouse'>Dashboard Warehouse</NavDropdown.Item>
                                            <NavDropdown.Item href='/Products' >Product</NavDropdown.Item>
                                            <NavDropdown.Item href='/Warehouse' >Warehouse</NavDropdown.Item>
                                        </NavDropdown>
                                    }
                                    {user?.account?.groupWithRound?.name === "Staff" &&
                                        <NavDropdown title="employer" id="basic-nav-dropdown" className='dropdown'>
                                            <NavDropdown.Item href='/order-processing'>Manage</NavDropdown.Item>
                                            {user?.account?.groupWithRound?.name === "Staff" && user?.account?.Position === "Nhân viên lấy hàng" &&
                                                <NavDropdown.Item href='/Pickup_staff'>Pick up</NavDropdown.Item>
                                            }
                                            {user?.account?.groupWithRound?.name === "Staff" && user?.account?.Position === "Nhân viên kho hàng" &&
                                                <NavDropdown.Item href='/Warehouse_staff'>Warehouse</NavDropdown.Item>

                                            }
                                            {user?.account?.groupWithRound?.name === "Staff" && user?.account?.Position === "Nhân viên giao hàng" &&
                                                <NavDropdown.Item href='/Delivery_staff'>Delivery</NavDropdown.Item>

                                            }
                                            {user?.account?.groupWithRound?.name === "Staff" && user?.account?.Position === "Nhân viên kế toán" &&
                                                <NavDropdown.Item href='/Overview'>Overview</NavDropdown.Item>

                                            }





                                        </NavDropdown>
                                    }


                                </Nav>
                                <Nav>
                                    {user && user.isAuthenticated === true ?
                                        <>
                                            <Nav.Item className='nav-link' >
                                                Welcome <b> {user.account.username.toLocaleUpperCase()}</b> !
                                            </Nav.Item>
                                            <NavDropdown title="Settings" id="basic-nav-dropdown">
                                                <NavDropdown.Item onClick={() => handleShowChanePassModal()} >Change Password</NavDropdown.Item>
                                                <NavDropdown.Item >
                                                    <span onClick={() => handleLogOut()}> Log out</span>
                                                </NavDropdown.Item>

                                            </NavDropdown>
                                        </>
                                        :
                                        <Link className='nav-link' to="/login" >
                                            Login
                                        </Link>


                                    }


                                </Nav>
                                <Nav.Item className='nav-link' >
                                    <button className=" btn btn-primary position-relative" onClick={() => handleShowNotificationModal()}>

                                        <i className="fa fa-bell" aria-hidden="true"></i>
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {!user.account.Position ? list.length : listStaff.length}


                                            <span className="visually-hidden">unread messages</span>
                                        </span>
                                    </button>

                                </Nav.Item>
                                <Nav>
                                    <div className="nav-link  image" title='Change language' >
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/2000px-Flag_of_Vietnam.svg.png" alt="" />
                                    </div >
                                </Nav>
                            </Navbar.Collapse>
                        </Container>

                    </Navbar>

                </div >

                <ModalViewNotification
                    handleShowNotificationModal={handleShowNotificationModal}
                    show={show}
                />
                <ModalChangePass
                    showModalChangePass={showModalChangePass}
                    handleShowChanePassModal={handleShowChanePassModal}
                />

            </>
        );
    } else {
        return <></>
    }
}


export default NavHeader;