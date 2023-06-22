import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './modalChatWithCutomer.scss'
import { fetchProjectByid, updateProjectChat, deleteChatProject, createChatProject, createNotification } from "../services/ProjectService"
import { updateImage, updateImageIdandProjectId, fetchImagebyUser } from "../services/imageService"

import { SRLWrapper } from 'simple-react-lightbox'
import { toast } from 'react-toastify'
import moment from "moment"
import { useEffect } from 'react';
import { UserContext } from "../../contexApi/UserContext"

const ModalChatWithCutomer = (props) => {
    const { user } = React.useContext(UserContext);

    const { showModal, handleShowModal, dataChatOne } = props
    const [projects, setProjects] = useState({})
    const [chatEditContent, setchatEditContent] = useState("")
    const [dataChatProduct, setdataChatProduct] = useState("")
    const [chatContent, setchatContent] = useState("")
    const [imageUser, setImageUser] = useState("")
    const [changeStatusChatProject, setChangeStatusChatProject] = useState(false)

    const ProductId = dataChatOne?.id
    const getProjects = async () => {
        let res = await fetchProjectByid(ProductId)
        if (res && +res.EC === 0) {
            setProjects(res.DT[0])
        }
        else {
            toast.error(res.EM)
        }
    }

    const handleChangeStatusEditChat = (item) => {
        setChangeStatusChatProject(!changeStatusChatProject)
        setdataChatProduct(item)
        setchatEditContent(item.text)
    }
    const handleCancelChangeStatusEditChat = (item) => {

        setChangeStatusChatProject(!changeStatusChatProject)
    }



    let dataUpdateChat = {
        id: dataChatProduct.id,
        projectId: dataChatProduct.projectId,
        text: chatEditContent
    }

    const handlUpdateChatProject = async () => {
        if (dataUpdateChat.text.length > 0) {
            let res = await updateProjectChat(dataUpdateChat)
            if (res && +res.EC === 0) {
                await getProjects()
                setChangeStatusChatProject(false)

            } else {
                toast.error(res.EM)
            }
        }
        if (dataUpdateChat.text.length === 0) {
            toast.error("comment do not empty")
            return;
        }

    }
    const handlDeleteChatProject = async (id) => {
        let res = await deleteChatProject(id)
        if (res && +res.EC === 0) {
            await getProjects()

        } else {
            toast.error(res.EM)
        }
    }
    const getImagebyUser = async () => {
        let res = await fetchImagebyUser(user.account.email)
        if (res && +res.EC === 0) {
            if (res.DT[0]?.image) {
                let imagebase64 = new Buffer(res.DT[0]?.image, 'base64').toString("binary")
                setImageUser(imagebase64)
            } else {
                setImageUser("")

            }


        } else {
            toast.error(res.EM)
        }
    }

    let dataChat = {
        ProductId: ProductId,
        image: imageUser,
        chatContent: chatContent,
        CreatedByName: user.account.Position,
        CreatedByPhone: user.account.phone,

    }
    const createChat = async () => {
        if (dataChat && !dataChat.chatContent) {
            return
        }
        if (dataChat) {
            let res = await createChatProject(dataChat)
            if (res && +res.EC === 0) {
                await createNotification(projects.id, projects.order, "nhân viên vừa chat", user.account.Position, projects.createdBy, 0, 1, projects.shippingUnit_Id)

                await getProjects()
                setchatContent("")

            }
        }

    }
    useEffect(() => {
        getProjects()
        getImagebyUser()

    }, [dataChatOne])
    const refesh = () => {
        getProjects()

    }
    return (
        <>
            <Modal show={showModal} onHide={handleShowModal} animation={false} size='xl' onClick={() => refesh()} >
                <Modal.Header closeButton>
                    <Modal.Title >Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className=' chat mt-3'>
                        <h5 className='mb-3 d-flex align-item-center justify-content-center' style={{ color: "#637381" }}> Nhắn tin với người tạo đơn</h5>
                        <div className="chat-all mb-2 ">
                            <div className='container'>
                                {projects && projects.Chats &&
                                    projects.Chats.map((item, index) => {
                                        let imagebase64 = ""
                                        if (item.image) {
                                            imagebase64 = new Buffer(item.image, "base64").toString("binary")
                                        }
                                        return (
                                            <>
                                                <div className='chat-all-item col-12' key={`image-chat-${index}`}>
                                                    <div className='container'>
                                                        <div className="row d-flex align-item-center justify-content-center">
                                                            {imagebase64 ?
                                                                <div className='image col-2 my-4'
                                                                    title="Xem chi tiết hình ảnh">
                                                                    <img src={imagebase64} alt="" />

                                                                </div>
                                                                :
                                                                <div className='image col-2 my-4'
                                                                    title="Xem chi tiết hình ảnh">
                                                                    <img src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" alt="" />

                                                                </div>
                                                            }


                                                            {changeStatusChatProject === true && dataChatProduct.id === item.id


                                                                ?
                                                                <>
                                                                    <div className={item.CreatedBy === user.account.username ? "input-more col-8 d-flex flex-column" : " input-more-sub  col-8 d-flex flex-column"}>
                                                                        <div className='time d-flex justify-content-end '>
                                                                            {moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}                                                                                                            </div>
                                                                        <div className='my-1' >
                                                                            <div className='container'>
                                                                                <input type="text"
                                                                                    className='form-control '
                                                                                    onChange={(event) => setchatEditContent(event.target.value)}
                                                                                    value={chatEditContent}
                                                                                />
                                                                            </div>

                                                                        </div>
                                                                        <div className='create-by-user d-flex justify-content-end'>
                                                                            Send by:  {item.CreatedBy}
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-2 d-flex align-items-center' style={{ paddingBottom: "61px" }}>
                                                                        <button className='btn btn-warning ' style={{ borderRadius: "50%" }} onClick={() => handlUpdateChatProject()}>
                                                                            <i class="fa fa-floppy-o" aria-hidden="true"></i>
                                                                        </button>
                                                                        <button className='btn btn-danger mx-3' style={{ borderRadius: "50%" }} onClick={() => handleCancelChangeStatusEditChat()}>
                                                                            <i class="fa fa-times-circle" aria-hidden="true"></i>
                                                                        </button>
                                                                    </div>


                                                                </>
                                                                :
                                                                <>
                                                                    <div className={item.CreatedBy === user.account.username ? "input-more col-8 d-flex flex-column" : " input-more-sub  col-8 d-flex flex-column"}>
                                                                        <div className='time d-flex justify-content-end '>
                                                                            {moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}                                                                                                            </div>
                                                                        <div className='input-title my-1' >
                                                                            <div className='container'>
                                                                                <span >
                                                                                    {item.text}
                                                                                </span>
                                                                            </div>

                                                                        </div>
                                                                        <div className='create-by-user d-flex justify-content-end'>
                                                                            Send by:  {item.CreatedByName}
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-2 d-flex align-items-center' style={{ paddingBottom: "61px" }}>
                                                                        {item.CreatedByPhone === user.account.phone
                                                                            &&
                                                                            <>
                                                                                <button className='btn btn-warning ' style={{ borderRadius: "50%" }} onClick={() => handleChangeStatusEditChat(item)}>
                                                                                    <i class="fa fa-pencil-square" aria-hidden="true"></i>
                                                                                </button>
                                                                                <button className='btn btn-danger mx-3' style={{ borderRadius: "50%" }} onClick={() => handlDeleteChatProject(item.id)}>
                                                                                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                                                                                </button>
                                                                            </>

                                                                        }

                                                                    </div>


                                                                </>
                                                            }


                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }





                            </div>
                        </div>
                        <SRLWrapper>
                            <div className='chat-content  '>
                                <div className='container'>
                                    <div className='row d-flex align-item-center justify-content-center '>
                                        {imageUser
                                            ?
                                            <>
                                                <div className='image-user col-1'>
                                                    <img src={imageUser} alt="" />
                                                </div>
                                                <input type="text"
                                                    placeholder='Trò chuyện với Người tạo đơn'
                                                    className='chat-input col-8'
                                                    onChange={(event) => setchatContent(event.target.value)}
                                                    value={chatContent}
                                                />

                                                <div className='icon col-1'>

                                                    <span className='send' >
                                                        <button className='btn btn-primary' onClick={() => createChat()}> Send</button>
                                                    </span>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className='image-user col-1'>
                                                    <img src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" alt="" />
                                                </div>
                                                <input type="text"
                                                    placeholder='Trò chuyện với nhân viên'
                                                    className='chat-input col-8'
                                                    onChange={(event) => setchatContent(event.target.value)}
                                                    value={chatContent}
                                                />

                                                <div className='icon col-1'>

                                                    <span className='send' >
                                                        <button className='btn btn-primary' onClick={() => createChat()}> Send</button>
                                                    </span>
                                                </div>
                                            </>
                                        }

                                    </div>
                                </div>

                            </div>
                        </SRLWrapper>

                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleShowModal()}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal >
        </>
    );
}

export default ModalChatWithCutomer;