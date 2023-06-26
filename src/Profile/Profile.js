import './Profile.scss'
import { Link, NavLink, useHistory } from "react-router-dom"
import { GetProfile } from "../components/services/userService"
import { UserContext } from "../contexApi/UserContext"
import React, { useEffect, useState } from 'react'
import moment from "moment"
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { UpdateImageChat } from "../components/services/ProjectService"

const Profile = (props) => {
    const { user } = React.useContext(UserContext);
    const [data, setData] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [previewsImage, setPreviewsImage] = useState("")

    let getProfile = async () => {
        let res = await GetProfile(user?.account?.phone)
        if (res && +res.EC === 0) {
            let arr = []
            arr.push(res.DT)
            setData(arr)
        }

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
                        {data && data.length > 0 &&

                            data.map((item, index) => {
                                let imagebase64 = ""
                                if (item.image) {
                                    imagebase64 = new Buffer(item.image, "base64").toString("binary")

                                }
                                return (
                                    <>
                                        <div className='left col-5'>
                                            <div className='container'>
                                                <div className='image my-3' onClick={() => handleClickImage(imagebase64)}>
                                                    <img src={`${imagebase64}`} alt="Avata" />
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

                                        <div className='right col-7' key={`item-${index}`}>
                                            <div className='Infomation'>
                                                <div className="container">

                                                    <div className="item my-3">
                                                        <span className='my-3 d-flex'>
                                                            <span className='item-user mx-2'>
                                                                <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                                                            </span>
                                                            <span className='mx-3'>Họ và tên </span>
                                                        </span>
                                                        <span className='d-flex align-items-center'>

                                                            <span className='mx-3 color-item address-wrap' >{item.username}</span>


                                                            <button className='btn btn-warning edit-profile mx-2'>
                                                                <i class="fa fa-pencil" aria-hidden="true"></i>

                                                            </button>
                                                        </span>

                                                    </div>
                                                    <div className="item my-3">
                                                        <span className='my-3'>
                                                            <span className='item-phone mx-2'>
                                                                <i class="fa fa-phone" aria-hidden="true"></i>

                                                            </span>
                                                            <span className='mx-3'>Phone</span>
                                                        </span>
                                                        <span>
                                                            <span className='mx-3 color-item'>{item.phone}</span>

                                                        </span>

                                                    </div>
                                                    <div className="item my-3">
                                                        <span className='my-3'>
                                                            <span className='item-Sex mx-2'>
                                                                <i class="fa fa-venus-mars" aria-hidden="true"></i>


                                                            </span>
                                                            <span className='mx-3'>Sex</span>
                                                        </span>
                                                        <span>
                                                            <span className='mx-3 color-item'>{item.sex}</span>
                                                            <button className='btn btn-warning edit-profile mx-2'>
                                                                <i class="fa fa-pencil" aria-hidden="true"></i>

                                                            </button>
                                                        </span>

                                                    </div>
                                                    <div className="item my-3">
                                                        <span className='my-3  d-flex'>
                                                            <span className='item-Mail mx-2'>
                                                                <i class="fa fa-envelope" aria-hidden="true"></i>



                                                            </span>
                                                            <span className='mx-3'>Email</span>
                                                        </span>
                                                        <span className='d-flex align-items-center'>
                                                            <span className='mx-3 color-item address-wrap'>{item.email}</span>
                                                            <button className='btn btn-warning edit-profile mx-2'>
                                                                <i class="fa fa-pencil" aria-hidden="true"></i>

                                                            </button>
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
                                                            <span className='mx-3 color-item'>{item?.Group?.name}</span>

                                                        </span>

                                                    </div>
                                                    <div className="item my-3">
                                                        <span className='my-3 d-flex'>
                                                            <span className='item-Address mx-2'>
                                                                <i class="fa fa-location-arrow" aria-hidden="true"></i>



                                                            </span>
                                                            <span className='mx-3'>Address</span>
                                                        </span>
                                                        <span className='d-flex align-items-center'>
                                                            <span className='mx-3 color-item address-wrap'>{item?.addressDetail},{item?.Ward_customer.name},{item?.District_customer?.name},{item.Province_customer.name}</span>
                                                            <button className='btn btn-warning edit-profile mx-2'>
                                                                <i class="fa fa-pencil" aria-hidden="true"></i>

                                                            </button>
                                                        </span>

                                                    </div>
                                                    {item?.Shipping_Unit?.NameUnit &&
                                                        <div className="item my-3">
                                                            <span className='my-3 d-flex'>
                                                                <span className='item-shipping mx-2'>
                                                                    <i class="fa fa-motorcycle" aria-hidden="true"></i>




                                                                </span>
                                                                <span className='mx-3'>Shipping unit</span>
                                                            </span>
                                                            <span className='d-flex align-items-center'>
                                                                <span className='mx-3 color-item '>{item?.Shipping_Unit?.NameUnit}</span>

                                                            </span>

                                                        </div>
                                                    }
                                                    {item?.Position
                                                        &&
                                                        <div className="item my-3">
                                                            <span className='my-3 d-flex'>
                                                                <span className='item-position mx-2'>
                                                                    <i class="fa fa-rss" aria-hidden="true"></i>




                                                                </span>
                                                                <span className='mx-3'>Position</span>
                                                            </span>
                                                            <span className='d-flex align-items-center'>
                                                                <span className='mx-3 color-item address-wrap'>{item?.Position ? item?.Position : ""}</span>

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
                                                                {moment(`${item.createdAt}`).format("DD/MM/YYYY")}                                                            </span>

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
                                    </>

                                )
                            })
                        }


                    </div>
                </div>

            </div>
        </div >

    )
}

export default Profile;