import './detailProduct.scss'
import Sidebar from "../sidebar/sidebar"
import React, { useState } from 'react'
import { Link, NavLink, useParams, useLocation } from "react-router-dom"
import { useEffect } from 'react'
import { fetchProjectByid } from "../services/ProjectService"
import { toast } from 'react-toastify'
import moment from "moment"
import { UserContext } from "../../contexApi/UserContext"
import {
    CreateProject, getSaleChannel, getStastusPayment, updateProject, createChatProject, updateProjectChat, deleteChatProject, getNameProduct, getNumberProductinWarehouse,
    createNotification
} from "../services/ProjectService"
import { updateImage, updateImageIdandProjectId, fetchImagebyUser } from "../services/imageService"
import { SRLWrapper } from 'simple-react-lightbox'
import _ from "lodash"
import { fetchImagebyOrder, assignDataToProjectImage } from "../services/imageService"
import axios from "../../customizeAxios/axios"
import {
    getAllProvinceCustomer, getAllProvince, fetchDistrictCustomerByProvinceCustomer, fetchWarCustomerdByDistrictCustomer,
    fetchWardByDistrict, fetchDistrictByProvince
} from "../services/addressService"
import DeleteProduct from "./deleteModal"
import getBase64 from "../commondUtils/commondUtils"
import { useTranslation, Trans } from 'react-i18next';

const DetailProduct = (props) => {
    const { t, i18n } = useTranslation();

    const param = useParams()
    const { user } = React.useContext(UserContext);
    const ProductId = param.id
    const [collapsed, setCollapsed] = useState(false)
    const [projects, setProjects] = useState({})
    const [projectsDefaut, setprojectsDefaut] = useState({})
    const [showDeleteProduct, setShowDeleteProduct] = useState(false);
    const [previewsImage, setPreviewsImage] = useState("")
    const [actionModalThree, setActionModalThree] = useState("")
    const [actionModalFour, setActionModalFour] = useState("")
    const [actionModalFive, setActionModalFive] = useState("")
    const [actionModalSix, setActionModalSix] = useState("")
    const [actionModalSeven, setActionModalSeven] = useState("")
    const [imageUpdate, setImageUpdate] = useState("")
    const [SaleChannel, setSaleChannel] = useState("")
    const [StatusPayment, setStatusPayment] = useState("")
    const [StatusDeleteImage, setStatusDeleteImage] = useState(false)
    const [image, setimage] = useState([])
    const [allProvinceCutomer, setAllProvinceCustomer] = useState("")
    const [allProvince, setAllProvince] = useState("")
    const [StatusProvinceCustomer, setStatusProvinceCustomer] = useState(true)
    const [StatusWardCustomer, setStatusWardCustomer] = useState(true)
    const [StatusDistrictCustomer, setStatusDistrictCustomer] = useState(true)
    const [StatusProvince, setStatusProvince] = useState(true)
    const [StatusDistrict, setStatusDistrict] = useState(true)
    const [StatusWard, setStatusWard] = useState(true)
    const [assignDistrictByProvince, setassignDistrictByProvince] = useState([])
    const [assignDistrictByProvinceOfReceipt, setassignDistrictByProvinceOfReceipt] = useState([])
    const [assignWardtByDistric, setassignWardtByDistric] = useState([])
    const [assignWardtByDistricOfReceipt, setassignWardtByDistricOfReceipt] = useState([])
    const [chatContent, setchatContent] = useState("")
    const [imageUser, setImageUser] = useState("")
    const [changeStatusChatProject, setChangeStatusChatProject] = useState(false)
    const [chatEditContent, setchatEditContent] = useState("")
    const [dataChatProduct, setdataChatProduct] = useState("")
    const [Product, SetProduct] = useState([])
    const [numberProduct, setNumberProduct] = useState("")

    const getnameProduct = async () => {
        let res = await getNameProduct()
        if (res && +res.EC === 0) {
            let data = res.DT.filter(item => item.product_statusId !== 3)
            SetProduct(data)
        }
    }
    const getNumberProduct = async (id) => {
        if (id !== "sản phẩm") {
            let res = await getNumberProductinWarehouse(+id)
            if (res && +res.EC === 0) {
                setNumberProduct(+res.DT?.product_number)
            }
        } else {
            setNumberProduct("")
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
    const handleShowDeleteModal = () => {
        setShowDeleteProduct(!showDeleteProduct)
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
    const getImagebyUser = async () => {
        let res = await fetchImagebyUser(user.account.email)
        if (res && +res.EC === 0) {
            if (res.DT[0].image) {
                let imagebase64 = new Buffer(res.DT[0].image, 'base64').toString("binary")
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
        CreatedByName: user.account.username

    }
    const createChat = async () => {
        if (dataChat && !dataChat.chatContent) {
            return
        }
        if (dataChat) {
            let res = await createChatProject(dataChat)
            if (res && +res.EC === 0) {
                await createNotification(projects.id, projects.order, "người tạo vừa chat", "", projects.createdBy, 1, 0, projects.shippingUnit_Id)

                await getProjects()
                setchatContent("")

            }
        }

    }
    const handleSelectProvince = (value) => {
        if (value > 0) {
            setStatusProvince(true)
            setStatusDistrict(false)
        }
        if (value === "Tỉnh/thành phố") {
            setStatusProvince(false)
            setStatusDistrict(false)
        }
        if (value == projects.Address_District.Address_provinceId) {
            setStatusDistrict(true)
        }

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

        if (+value == projects.District_customer.Province_customerId) {
            setStatusDistrictCustomer(true)
        }

    }
    const handleSelectDistrict = (value) => {
        if (value > 0) {
            setStatusDistrict(true)
            setStatusWard(false)

        } else {
            setStatusDistrict(false)
            setStatusWard(false)

        }
        if (+value == projects.Address_Ward.Address_DistrictId) {
            setStatusWard(true)
        }
    }
    const handleSelectDistrictCustomer = (value) => {
        if (value > 0) {

            setStatusDistrictCustomer(true)
            setStatusWardCustomer(false)

        } else {
            setStatusDistrictCustomer(false)
            setStatusWardCustomer(false)

        }
        if (+value == projects.Ward_customer.District_customerId) {
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
    const handleSelectWard = (value) => {
        if (value > 0) {
            setStatusWard(true)
        } else {
            setStatusWard(false)
        }
    }
    const handleRefeshPage = async () => {
        handleDeleteActionThree()
        handleDeleteActionFour()
        handleDeleteActionFive()
        handleDeleteActionSix()
        handleDeleteActionSeven()
        await getProjects()
    }
    const getProjects = async () => {
        let res = await fetchProjectByid(ProductId)
        if (res && +res.EC === 0) {
            console.log("res.DT[0]", res.DT[0])
            setProjects(res.DT[0])
            setprojectsDefaut(res.DT[0])
        }
        else {
            toast.error(res.EM)
        }
    }
    const handleOnchangeProviceCustomer = async (value) => {
        if (value) {
            let res = await fetchDistrictCustomerByProvinceCustomer(value)
            if (res && +res.EC === 0) {
                setassignDistrictByProvince(res?.DT?.District_customers)
            }

        }
    }
    const handleOnchangeProvice = async (value) => {
        if (value) {
            let res = await fetchDistrictByProvince(value)
            if (res && +res.EC === 0) {

                setassignDistrictByProvinceOfReceipt(res?.DT?.Address_Districts
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
    const handleOnchangeDistrict = async (value) => {
        if (value) {
            let res = await fetchWardByDistrict(value)
            if (res && +res.EC === 0) {
                setassignWardtByDistricOfReceipt(res?.DT?.Address_Wards)

            }
        }
    }
    const handleOnchangeInput = async (value, name) => {
        let _projects = _.cloneDeep(projects)
        _projects[name] = value
        if (name === "Province_customerId") {
            _projects[name] = +value
        }
        if (name === "District_customerId") {
            _projects[name] = +value
        }
        if (name === "Ward_customerId") {
            _projects[name] = +value
        }
        if (name === "Address_provinceId") {
            _projects[name] = +value
        }
        if (name === "Address_DistrictId") {
            _projects[name] = +value
        }
        if (name === "Address_WardId") {
            _projects[name] = +value
        }


        setProjects(_projects)

    }
    const handleUpdateImage = async () => {
        if (previewsImage.length > 0) {
            toast.error("please save image create")
            return;
        }
        if (StatusDeleteImage === true) {
            let order = projects.order
            if (imageUpdate) {
                let res = await updateImage(order, imageUpdate)
                if (res && +res.EC === 0) {

                    let projectId = projects.id
                    let image = res.DT
                    let dataUpdateImageIdandProjectId = await updateImageIdandProjectId(projectId, image)
                    if (dataUpdateImageIdandProjectId && +dataUpdateImageIdandProjectId.EC === 0) {

                        await getProjects()

                        setActionModalFour("")
                        setStatusDeleteImage(false)

                    }

                }
            }
        } else {
            handleDeleteActionFour()

            await getProjects()
            setStatusDeleteImage(false)

        }
    }
    const handleUpdateProject = async () => {
        const re = /^[0-9\b]+$/;
        if (!projects.quantity) {
            toast.error("Can not empty number ")
            return;
        }
        if (projects.quantity && !re.test(projects.quantity)) {
            toast.error("quantity only or number greater than 0")
            return;
        }
        if (projects.money && !re.test(projects.money)) {
            toast.error("number only or number greater than 0")
            return;
        }
        if (projects.quantity && !re.test(projects.Pricedrop)) {
            toast.error("Pricedrop only or number greater than 0")
            return;
        }
        if (projects.paid && !re.test(projects.paid)) {
            toast.error("paid only or number greater than 0")
            return;
        }
        if (projects.total && !re.test(projects.total)) {
            toast.error("total money only or number greater than 0")
            return;
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
        if (StatusProvince === false) {
            toast.error("please check Province user address")
            return;
        }


        if (StatusDistrict === false) {
            toast.error("please check District user address")
            return;
        }

        if (StatusWard === false) {
            toast.error("please check Ward user address")
            return;
        }
        if (!projects.addressDetail) {
            toast.error("please check address Detail ")
            return;
        }
        if (!projects.Detail_Place_of_receipt) {
            toast.error("please check address user Detail ")
            return;
        }
        let res = await updateProject(projects)

        const combinedObject = { ...projectsDefaut, ...projects }

        const diff = Object.entries(combinedObject).reduce((acc, [key, value]) => {
            if (
                !Object.values(projectsDefaut).includes(value) ||
                !Object.values(projects).includes(value)
            )
                acc[key] = value

            return acc
        }, {})

        if (res && +res.EC === 0) {
            console.log("diff", diff)


            if (diff && diff.money || diff.total || diff.Pricedrop || diff.paid || diff.statusPaymentId || diff.unit_money || diff.Notemore || diff.Note) {
                let abc = await createNotification(projects.id, projects.order, "thay đổi thông tin đơn hàng", "", projects.createdBy, 1, 0, projects.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    toast.success("update project success")

                    handleDeleteActionThree()
                    handleDeleteActionFour()
                    handleDeleteActionFive()
                    handleDeleteActionSix()
                    handleDeleteActionSeven()
                    await getProjects()

                }
            } else if (diff.age_customer || diff.name_customer || diff.phoneNumber_customer) {
                let abc = await createNotification(projects.id, projects.order, "thay đổi thông tin người nhận", "", projects.createdBy, 1, 0, projects.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    toast.success("update project success")

                    handleDeleteActionThree()
                    handleDeleteActionFour()
                    handleDeleteActionFive()
                    handleDeleteActionSix()
                    handleDeleteActionSeven()
                    await getProjects()

                }
            } else if (projects.Province_customerId !== 0 && projects.Province_customerId !== projectsDefaut.Province_customerId || projects.District_customerId !== 0 && projects.District_customerId !== projectsDefaut.District_customerId || projects.Ward_customerId !== 0 && projects.Ward_customerId !== projectsDefaut.Ward_customerId || diff && diff.addressDetail) {
                let abc = await createNotification(projects.id, projects.order, "thay đổi địa chỉ người nhận", "", projects.createdBy, 1, 0, projects.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    toast.success("update project success")

                    handleDeleteActionThree()
                    handleDeleteActionFour()
                    handleDeleteActionFive()
                    handleDeleteActionSix()
                    handleDeleteActionSeven()
                    await getProjects()

                }
            }
            else if (projects.Address_provinceId !== 0 && projects.Address_provinceId !== projectsDefaut.Address_provinceId || projects.Address_DistrictId !== 0 && projects.Address_DistrictId !== projectsDefaut.Address_DistrictId || projects.Address_WardId !== 0 && projects.Address_WardId !== projectsDefaut.Address_WardId || diff && diff.Detail_Place_of_receipt) {
                let abc = await createNotification(projects.id, projects.order, "thay đổi địa chỉ người bán", "", projects.createdBy, 1, 0, projects.shippingUnit_Id)
                if (abc && +abc.EC === 0) {
                    toast.success("update project success")

                    handleDeleteActionThree()
                    handleDeleteActionFour()
                    handleDeleteActionFive()
                    handleDeleteActionSix()
                    handleDeleteActionSeven()
                    await getProjects()

                }
            }
            else {
                toast.success("update project success")

                handleDeleteActionThree()
                handleDeleteActionFour()
                handleDeleteActionFive()
                handleDeleteActionSix()
                handleDeleteActionSeven()
                await getProjects()
            }

        }







        else {
            toast.error(res.EM)
        }




    }
    const handleDeleteImageAdd = (link) => {



        let numberdeleteImage = []
        for (let i = 0; i < previewsImage.length; i++) {
            if (previewsImage[i] === link) {
                numberdeleteImage.push(i)
            }
        }

        let abc = Object.values(image);
        let resultImage = abc.filter(item => item !== abc[numberdeleteImage])
        setimage(resultImage)

        let result = previewsImage.filter(item => item !== link)
        setPreviewsImage(result)

    }
    const handleOnchangeImage = async (value) => {

        setimage(value)

        const fileArray = Array.from(value).map((file) => URL.createObjectURL(file))

        setPreviewsImage(fileArray)
        // Array.from(value).map(
        //     (file) => URL.revokeObjectURL(file)

        // )
    }
    const handleSubmitImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        for (let i = 0; i < image.length; i++) {

            formData.append('multiple_image', image[i]);


        }
        formData.append("order", projects.order);

        let dataCreateImage = await axios.post("http://localhost:3030/api/v6/upload-multiple-pic", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (dataCreateImage && +dataCreateImage.EC === 1) {

            let projectId = projects.id

            let orders = projects.order
            console.log("orders", orders)
            let data = await fetchImagebyOrder(projects.order)
            if (data && +data.EC === 0) {

                let ImageId = data.DT;
                console.log("ImageId", data.DT)

                let dataAssignDataToProjectImage = await assignDataToProjectImage(projectId, ImageId)
                if (dataAssignDataToProjectImage && +dataAssignDataToProjectImage.EC === 0) {
                    toast.success(`add ${dataCreateImage.DT.length} image success`)
                    // handleDeleteActionFour()
                    setPreviewsImage("")
                    await getProjects()

                }
            } else {
                toast.error(data.EM)

            }
        } else if (dataCreateImage && +dataCreateImage.EC === -1) {
            console.log("aaa")
        }
    }
    const handleDeleteImage = (image) => {

        setStatusDeleteImage(true)
        let result = projects.Images.filter(item => item.url !== image)

        setImageUpdate(result)
        setProjects({ ...projects, Images: result })
    }
    const handleEditActionThree = async () => {
        setActionModalThree("3")
    }
    const handleEditActionFour = () => {
        setActionModalFour("4")
    }
    const handleEditActionFive = () => {
        setActionModalFive("5")
    }
    const handleEditActionSix = async () => {
        setActionModalSix("6")

        await handleOnchangeProviceCustomer(projects.Province_customerId)
        await handleOnchangeDistrictCustomer(projects.District_customerId)
    }
    const handleEditActionSeven = async () => {
        setActionModalSeven("7")

        await handleOnchangeProvice(projects.Address_provinceId)
        await handleOnchangeDistrict(projects.Address_DistrictId)
    }
    const handleDeleteActionThree = () => {
        setActionModalThree("")
        setProjects(projectsDefaut)
        setNumberProduct("")
    }
    const handleDeleteActionFour = async () => {
        setProjects(projectsDefaut)
        setActionModalFour("")
    }
    const handleDeleteActionFive = () => {
        setActionModalFive("")
        setProjects(projectsDefaut)

    }
    const handleDeleteActionSix = () => {
        setActionModalSix("")
        setStatusProvinceCustomer(true)
        setStatusDistrictCustomer(true)
        setStatusWardCustomer(true)
        setProjects(projectsDefaut)

    }
    const handleDeleteActionSeven = () => {
        setActionModalSeven("")
        setStatusProvince(true)
        setStatusDistrict(true)
        setStatusWard(true)
        setProjects(projectsDefaut)
    }
    useEffect(() => {
        getProjects()
        getImagebyUser()
    }, [ProductId])
    useEffect(() => {
        getAllStastusPayment()
        getnameProduct()
        getAllSaleChannel()

    }, [])
    useEffect(() => {
        getProvinceCustomer()
        getProvince()
        console.log(projects)

    }, [])

    return (
        <div className='Contact-container '>
            <div className='left  '>
                <Sidebar collapsed={collapsed} />

            </div>
            <div className='right  '>
                <div className='btn-toggle'>
                    <span onClick={() => setCollapsed(!collapsed)} className=" d-sm-block ">
                        {collapsed === false ?
                            <i className="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
                            :
                            <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>

                        }
                    </span>
                </div>
                <div className='right-body'>
                    <div className='container'>
                        <div className='header'>
                            <div className='location-path col'>
                                <Link to="/"> Home</Link>
                                <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                </span>


                                <Link to="/Products"> Product manager</Link>

                                <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                </span>
                                <Link to="/detailProduct"> Detail Product </Link>
                            </div>

                        </div>
                        <button className='btn btn-primary btn-BackPage mx-3'>
                            <span>
                                <i class="fa fa-arrow-left" aria-hidden="true"></i>
                            </span>
                            <Link to="/Products">
                                {t('detail.tittle')}
                            </Link>
                        </button>
                        <div className='body'>
                            <div className="container">
                                <div className='container'>

                                    <div className='name-page my-3'>
                                        <h4 className=''>
                                            {t('detail.tittleOne')}
                                            {projects?.flag == 1 &&
                                                <span className='mx-3' style={{ color: "red" }}>
                                                    <i class="fa fa-flag" aria-hidden="true"></i>
                                                    <span className='mx-2' style={{ fontSize: "15px" }}>
                                                        {t('detail.tittleTwo')}
                                                    </span>
                                                </span>
                                            }

                                        </h4>

                                        <div className='more'>
                                            <button className='btn btn-success' onClick={() => handleRefeshPage()}>
                                                <i class="fa fa-refresh" aria-hidden="true"></i>
                                                {t('detail.tittleFour')}
                                            </button>
                                            <button className='btn btn-danger' onClick={() => handleShowDeleteModal()}>
                                                <i className="fa fa-trash" aria-hidden="true"></i>
                                                {t('detail.tittleFive')}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className='container'>
                                    <div className='order-product my-3 d-flex align-items-start gap-3'>
                                        <span className='order-product-name'>
                                            {t('detail.tittleThree')}
                                        </span>
                                        <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                        </span>
                                        <span className='order-product-value'>{projects?.order ? projects?.order : ""}</span>
                                    </div>
                                    <div className='d-flex align-items-center' style={{ fontSize: "20px", fontWeight: "600", color: "red" }}>{projects?.Sub_money}</div>
                                    {projects?.done_status > 0 &&
                                        <div className='d-flex align-items-start mb-3' style={{ fontSize: "20px", fontWeight: "600", color: "green" }}>
                                            {t('detail.tittleSix')}
                                        </div>

                                    }

                                    <div className='col-12 infomation-status-one py-2 d-flex align-items-center justify-content-center '>
                                        <div className='container'>
                                            <div className='row'>
                                                <div className=" col-10" style={{ color: "#637381" }}>
                                                    <h2 className='d-flex align-items-center justify-content-center'>
                                                        {t('detail.Status-Orders.One')}
                                                    </h2>

                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12 infomation-status py-4'>
                                        <div className='container'>
                                            <div className='row'>
                                                <div className="order col-6">
                                                    <div className='name pb-3'>
                                                        {t('detail.Status-Orders.Two')}
                                                    </div>
                                                    <div className='status-order mx-3'>{projects.order ? projects.order : ""}</div>

                                                </div>

                                                <div className="order col-3 ">
                                                    <div className='name pb-3'>
                                                        {t('detail.Status-Orders.Three')}

                                                    </div>


                                                    <div className='status-SaleChannel'>
                                                        {projects.Sales_Channel && projects.Sales_Channel.name ? projects.Sales_Channel.name : "Đang cập nhật"}
                                                    </div>


                                                </div>
                                                <div className="order col-3 ">
                                                    <div className='name pb-3'>
                                                        {t('detail.Status-Orders.Four')}
                                                    </div>


                                                    <div className='status-payment'>
                                                        {projects.Status_Payment && projects.Status_Payment.status ? projects.Status_Payment.status : "Đang cập nhật"}
                                                    </div>


                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12 infomation-status-two py-4'>
                                        <div className='container'>
                                            <div className='row'>
                                                <div className="order col-3 ">
                                                    <div className='name pb-3'>
                                                        {t('detail.Status-Orders.Five')}
                                                    </div>
                                                    <div className='status-SaleChannel'>
                                                        {projects?.Status_Pickup && projects?.Status_Pickup?.status ? projects?.Status_Pickup?.status : "Đang xử lý"}
                                                    </div>
                                                </div>
                                                <div className="order col-3 ">
                                                    <div className='name pb-3'>
                                                        {t('detail.Status-Orders.Six')}
                                                    </div>
                                                    <div className='status-delivery'>
                                                        {projects?.Status_Warehouse && projects?.Status_Warehouse?.status ? projects?.Status_Warehouse?.status : "Đang xử lý"}
                                                    </div>

                                                </div>
                                                <div className="order col-3 ">
                                                    <div className='name pb-3'>
                                                        {t('detail.Status-Orders.Seven')}
                                                    </div>
                                                    <div className='status-payment'>
                                                        {projects?.Status_Delivery
                                                            && projects?.Status_Delivery?.status ? projects?.Status_Delivery.status : "Chưa giao hàng"}
                                                    </div>
                                                </div>
                                                <div className="order col-3 ">
                                                    <div className='name pb-3'>
                                                        {t('detail.Status-Orders.Eight')}
                                                    </div>
                                                    <div className='status-SaleChannel'>
                                                        {
                                                            projects?.Status_Received_money?.status
                                                                ? projects?.Status_Received_money?.status : "Đang đối soát"}
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='body-wrapper col-12'>
                                    <div className='container'>
                                        <div className='row'>
                                            <div className='left-body col-9 '>
                                                <div className='status'>
                                                    <div className='table-primer '>
                                                        <div className='container'>
                                                            <div className=' title d-flex align-items-center justify-content-between mb-3'>
                                                                <div className='title-left '>
                                                                    <h4 style={{ color: "#637381" }}>
                                                                        {t('detail.Status-payment.One')}
                                                                    </h4>
                                                                </div>
                                                                <div className='title-right '>
                                                                    {actionModalThree === "3" ?
                                                                        <div className='col-2 d-flex gap-3'>
                                                                            <div className="order  ">
                                                                                <button className=' btn btn-success' title='Save' style={{ borderRadius: "50%" }} onClick={() => handleUpdateProject()}>
                                                                                    <i class="fa fa-floppy-o" aria-hidden="true"></i>
                                                                                </button>



                                                                            </div>
                                                                            <div className="order  ">
                                                                                <button className=' btn btn-danger' title='cancel' style={{ borderRadius: "50%" }} onClick={() => handleDeleteActionThree()}>
                                                                                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                                                                                </button>

                                                                            </div>


                                                                        </div>

                                                                        :
                                                                        <button className='btn btn-warning' style={{ borderRadius: "50%" }} onClick={() => handleEditActionThree()}>

                                                                            <span title='edit'  >
                                                                                <i class="fa fa-pencil" aria-hidden="true"></i >
                                                                            </span>
                                                                        </button>

                                                                    }
                                                                </div>
                                                            </div>
                                                            {actionModalThree === "3" ?
                                                                <div className='body col-12'>
                                                                    <div className='container'>
                                                                        <div className='row'>
                                                                            <div className='left-item col-6 d-flex flex-column'>
                                                                                <h5 className='mb-2'>
                                                                                    {t('detail.Status-payment.Two')}
                                                                                </h5>
                                                                                <div className='text-note mb-5'>
                                                                                    <i className="fa fa-commenting blue" aria-hidden="true"></i> :

                                                                                    <input
                                                                                        id='input-note-customer'
                                                                                        type="text"
                                                                                        className='form-control'
                                                                                        value={projects.Note}
                                                                                        onChange={(event) => handleOnchangeInput(event.target.value, "Note")}


                                                                                    />
                                                                                </div>


                                                                            </div>

                                                                            <div className='right-item col-6 d-flex flex-column'>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='container'>
                                                                                        <div className='row'>
                                                                                            <div className='item-info_name  '>
                                                                                                {t('detail.Status-payment.Three')}
                                                                                            </div>
                                                                                            <select
                                                                                                className="form-select mt-2"
                                                                                                onChange={(event) => handleOnchangeInput(event.target.value, "statusPaymentId")}
                                                                                                value={
                                                                                                    projects.statusPaymentId
                                                                                                }


                                                                                            >
                                                                                                {StatusPayment && StatusPayment.length > 0 &&
                                                                                                    StatusPayment.map((item, index) => {
                                                                                                        return (
                                                                                                            <option key={`SaleChannel-${index}`} value={item.id}>{item.status}</option>

                                                                                                        )
                                                                                                    })
                                                                                                }



                                                                                            </select >
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                                <div className='right-item col-12 d-flex flex-column'>
                                                                                    <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                        <div className='container'>
                                                                                            <div className='row'>
                                                                                                <div className='item-info_name  '>
                                                                                                    {t('detail.Status-payment.Four')}                                                                                               </div>
                                                                                                <select
                                                                                                    className="form-select mt-2"
                                                                                                    onChange={(event) => handleOnchangeInput(event.target.value, "salesChannelId")}

                                                                                                    value={projects.salesChannelId}


                                                                                                >
                                                                                                    <option defaultValue="salesChannelId">...</option>
                                                                                                    {SaleChannel && SaleChannel.length > 0 &&
                                                                                                        SaleChannel.map((item, index) => {
                                                                                                            return (
                                                                                                                <option key={`SaleChannel-${index}`} value={item.id}>{item.name}</option>

                                                                                                            )
                                                                                                        })
                                                                                                    }



                                                                                                </select >
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                                {/* <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='container'>
                                                                                        <div className='row'>

                                                                                            <label htmlFor='input-name-product' className='mb-2' >Tên sản phẩm (<span className='red'>*</span>)</label>
                                                                                            <select
                                                                                                className="form-select "
                                                                                                onChange={(event) => handleOnchangeInput(event.target.value, "ProductId")}
                                                                                                readOnly
                                                                                                value={projects.ProductId}
                                                                                            >
                                                                                                <option value="sản phẩm">Chọn sản phẩm muốn giao</option>
                                                                                                {Product && Product.length > 0 &&
                                                                                                    Product.map((item, index) => {
                                                                                                        return (
                                                                                                            <option key={`Province - ${index}`} value={item.id}>{item.product}</option>

                                                                                                        )
                                                                                                    })
                                                                                                }


                                                                                            </select >

                                                                                        </div>
                                                                                    </div>
                                                                                </div> */}

                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='container'>
                                                                                        <div className='row'>
                                                                                            <div className='item-info_name col-12   '>
                                                                                                {t('detail.Status-payment.Five')}
                                                                                            </div>

                                                                                            <input
                                                                                                id='input-number-product col-12'
                                                                                                type="text"
                                                                                                readOnly
                                                                                                min="1" max="9999"
                                                                                                className="form-control mt-2 "
                                                                                                value={projects?.Warehouse?.product
                                                                                                    ? projects?.Warehouse?.product
                                                                                                    : " Đang cập nhật"}
                                                                                                onChange={(event) => handleOnchangeInput(event.target.value, "quantity")}


                                                                                            />

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='container'>
                                                                                        <div className='row'>
                                                                                            <div className='item-info_name col-12   '>
                                                                                                {t('detail.Status-payment.Six')}
                                                                                            </div>

                                                                                            <input
                                                                                                id='input-number-product col-12'
                                                                                                type="text"
                                                                                                readOnly
                                                                                                min="1" max="9999"
                                                                                                className="form-control mt-2 "
                                                                                                value={projects.quantity}
                                                                                                onChange={(event) => handleOnchangeInput(event.target.value, "quantity")}


                                                                                            />

                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='container'>
                                                                                        <div className='row'>
                                                                                            <div className='item-info_name col-12   '>
                                                                                                {t('detail.Status-payment.Seven')}
                                                                                            </div>

                                                                                            <input
                                                                                                id='input-number-product col-12'
                                                                                                type="text"
                                                                                                readOnly
                                                                                                min="1" max="9999"
                                                                                                className="form-control mt-2 "
                                                                                                value={projects.unit}
                                                                                                onChange={(event) => handleOnchangeInput(event.target.value, "unit")}


                                                                                            />

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='container'>
                                                                                        <div className='row'>
                                                                                            <div className='item-info_name col-12   '>
                                                                                                {t('detail.Status-payment.Night')}                                                                                            </div>

                                                                                            <input
                                                                                                id='input-number-product col-12'
                                                                                                type="text"
                                                                                                readOnly
                                                                                                min="1" max="9999"
                                                                                                className="form-control mt-2 "
                                                                                                value={projects?.Shipping_Unit?.NameUnit}


                                                                                            />

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='container'>
                                                                                        <div className='row'>
                                                                                            <div className='item-info_name col-12   '>
                                                                                                {t('detail.Status-payment.Eightteen')}
                                                                                            </div>

                                                                                            <select

                                                                                                className="form-control"
                                                                                                onChange={(event) => handleOnchangeInput(event.target.value, "unit_money")}
                                                                                                value={projects.unit_money}
                                                                                            >
                                                                                                <option value="Đơn vị">Lựa chọn </option>
                                                                                                <option value="VND">VND</option>
                                                                                                <option value="USD">USD</option>
                                                                                                <option value="RMB">RMB</option>
                                                                                            </select >
                                                                                        </div>
                                                                                    </div>
                                                                                </div>


                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='container'>
                                                                                        <div className='row'>
                                                                                            <div className='item-info_name  col-12 '>
                                                                                                {t('detail.Status-payment.Eight')}
                                                                                            </div>
                                                                                            <input
                                                                                                id='input-money-product'
                                                                                                type="text"
                                                                                                min="1" max="9999"
                                                                                                className="form-control col-12 mt-2"
                                                                                                value={projects.money}
                                                                                                onChange={(event) => handleOnchangeInput(event.target.value, "money")}


                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='container'>
                                                                                        <div className='row'>
                                                                                            <div className='item-info_name  col-12'>
                                                                                                {t('detail.Status-payment.Nightteen')}
                                                                                            </div>

                                                                                            <input
                                                                                                id='input-total-product'
                                                                                                type="text"
                                                                                                min="1" max="9999"
                                                                                                className="form-control col-12 mt-2"
                                                                                                value={projects.Pricedrop}
                                                                                                onChange={(event) => handleOnchangeInput(event.target.value, "Pricedrop")}


                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='container'>
                                                                                        <div className='row'>
                                                                                            <div className='item-info_name col-8 '>
                                                                                                {t('detail.Status-payment.Eleven')}
                                                                                            </div>
                                                                                            <div className='item-info_value col-4'>
                                                                                                {
                                                                                                    projects?.shipping_Cost

                                                                                                        ? projects.shipping_Cost


                                                                                                        : " Đang cập nhật"
                                                                                                }     {projects.unit_money}                                                                                                                                               </div>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                                {projects.statusPaymentId == "1" &&

                                                                                    < div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                        <div className='container'>
                                                                                            <div className='row'>
                                                                                                <div className='item-info_name col-12 '>
                                                                                                    {t('detail.Status-payment.Twele')}
                                                                                                </div>
                                                                                                <input
                                                                                                    id='input-total-product'
                                                                                                    type="text"
                                                                                                    min="1" max="9999"
                                                                                                    className="form-control col-12 mt-2"
                                                                                                    disabled

                                                                                                    value={projects.paid = Number(`${projects.money}`) * Number(`${projects.quantity}`) - Number(`${projects.Pricedrop ? projects.Pricedrop : "0"}`)}
                                                                                                    onChange={(event) => handleOnchangeInput(event.target.value, "paid")}

                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                {projects.statusPaymentId == "2" &&
                                                                                    < div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                        <div className='container'>
                                                                                            <div className='row'>
                                                                                                <div className='item-info_name col-12 '>
                                                                                                    {t('detail.Status-payment.Twele')}
                                                                                                </div>
                                                                                                <input
                                                                                                    id='input-total-product'
                                                                                                    type="text"
                                                                                                    min="1" max="9999"
                                                                                                    className="form-control col-12 mt-2"
                                                                                                    disabled

                                                                                                    value={projects.paid = "0"}
                                                                                                    onChange={(event) => handleOnchangeInput(event.target.value, "paid")}

                                                                                                />
                                                                                            </div>
                                                                                        </div>

                                                                                    </div>

                                                                                }

                                                                                {projects.statusPaymentId == "3" &&

                                                                                    < div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                        <div className='container'>
                                                                                            <div className='row'>
                                                                                                <div className='item-info_name col-12 '>
                                                                                                    {t('detail.Status-payment.Twele')}
                                                                                                </div>


                                                                                                <input
                                                                                                    id='input-total-product'
                                                                                                    type="text"
                                                                                                    min="1" max="9999"
                                                                                                    className="form-control col-12 mt-2"

                                                                                                    value={projects.paid}
                                                                                                    onChange={(event) => handleOnchangeInput(event.target.value, "paid")}

                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                <div className='item-info py-3 d-flex align-items-center justify-content-between'>
                                                                                    <div className='container'>
                                                                                        <div className='row'>

                                                                                            <div className='item-info_name  col-12'>
                                                                                                <b>{t('detail.Status-payment.Thirteen')}</b>
                                                                                                <br />
                                                                                                <span>{t('detail.Status-payment.Fourteen')}</span>

                                                                                            </div>
                                                                                            <input
                                                                                                id='input-total-product'
                                                                                                type="text"
                                                                                                min="1" max="9999"
                                                                                                disabled
                                                                                                className="form-control col-12 mt-2"

                                                                                                value={
                                                                                                    projects.total = Number(`${projects.money}`) * Number(`${projects.quantity}`) - Number(`${projects.Pricedrop ? projects.Pricedrop : "0"}`) - Number(`${projects.paid}`)
                                                                                                }


                                                                                            />
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between '>
                                                                                    <div className='container'>
                                                                                        <div className='row'>
                                                                                            <div className='item-info_name  '>
                                                                                                <b>{t('detail.Status-payment.fifteen')}</b>
                                                                                                <br />
                                                                                                <span>{t('detail.Status-payment.sixteen')}</span>

                                                                                            </div>

                                                                                            <input
                                                                                                id='input-total-product'
                                                                                                type="text"
                                                                                                min="1" max="9999"
                                                                                                className="form-control col-12 mt-2"
                                                                                                value={projects.totalWithShippingCost = projects.total + Number(`${projects.shipping_Cost}`)}
                                                                                                disabled

                                                                                            />
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className='body col-12'>
                                                                    <div className='container'>
                                                                        <div className='row'>
                                                                            <div className='left-item col-6 d-flex flex-column'>
                                                                                <h5 className='mb-2'>
                                                                                    {t('detail.Status-payment.Two')}                                                                                </h5>
                                                                                <div className='text-note mb-5'>

                                                                                    <div className='container'>
                                                                                        <i className="fa fa-commenting blue" aria-hidden="true"></i> :

                                                                                        <b className='my-3 ' style={{ overflowWrap: "anywhere" }}>
                                                                                            {
                                                                                                projects.Note
                                                                                                    ? projects.Note
                                                                                                    : " Chưa có ghi chú"
                                                                                            }
                                                                                        </b>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                            <div className='right-item col-6 d-flex flex-column'>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='item-info_name  '>
                                                                                        {t('detail.Status-payment.Three')}

                                                                                    </div>
                                                                                    <b className='item-info_value '>
                                                                                        {projects.Status_Payment &&
                                                                                            projects.Status_Payment.status ?
                                                                                            projects.Status_Payment.status :
                                                                                            "Đang cập nhật"}
                                                                                    </b>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='item-info_name  '>
                                                                                        {t('detail.Status-payment.Four')}

                                                                                    </div>
                                                                                    <b className='item-info_value '>
                                                                                        {projects.Sales_Channel && projects.Sales_Channel.name ? projects.Sales_Channel.name : "Đang cập nhật"}
                                                                                    </b>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='item-info_name  '>
                                                                                        {t('detail.Status-payment.Five')}
                                                                                    </div>
                                                                                    <b className='item-info_value'>
                                                                                        {
                                                                                            projects?.Warehouse?.product
                                                                                                ? projects?.Warehouse?.product
                                                                                                : " Đang cập nhật"
                                                                                        }
                                                                                    </b>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='item-info_name  '>
                                                                                        {t('detail.Status-payment.Six')}
                                                                                    </div>
                                                                                    <b className='item-info_value'>
                                                                                        {
                                                                                            projects.quantity

                                                                                                ? projects.quantity
                                                                                                : " Đang cập nhật"
                                                                                        }
                                                                                    </b>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='item-info_name  '>
                                                                                        {t('detail.Status-payment.Seven')}
                                                                                    </div>
                                                                                    <b className='item-info_value'>
                                                                                        {
                                                                                            projects.unit

                                                                                                ? projects.unit
                                                                                                : " Đang cập nhật"
                                                                                        }
                                                                                    </b>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='item-info_name  '>
                                                                                        {t('detail.Status-payment.Eight')}
                                                                                    </div>
                                                                                    <b className='item-info_value'>
                                                                                        {
                                                                                            projects.money
                                                                                                ? projects.money
                                                                                                : " Đang cập nhật"
                                                                                        }       <span style={{ color: "#7790b6" }}> {projects.unit_money}</span>
                                                                                    </b>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='item-info_name  '>
                                                                                        {t('detail.Status-payment.Night')}
                                                                                    </div>
                                                                                    <b className='item-info_value'>
                                                                                        {
                                                                                            projects?.Shipping_Unit?.NameUnit
                                                                                                ? projects?.Shipping_Unit?.NameUnit
                                                                                                : " Đang cập nhật"
                                                                                        }

                                                                                    </b>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='item-info_name  '>
                                                                                        {t('detail.Status-payment.Ten')}
                                                                                    </div>
                                                                                    <b className='item-info_value'>
                                                                                        {
                                                                                            projects.Pricedrop

                                                                                                ? projects.Pricedrop

                                                                                                : " Đang cập nhật"
                                                                                        }     <span style={{ color: "#7790b6" }}> {projects.unit_money}</span>
                                                                                    </b>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='item-info_name  '>
                                                                                        {t('detail.Status-payment.Eleven')}
                                                                                    </div>
                                                                                    <b className='item-info_value'>
                                                                                        {
                                                                                            projects?.shipping_Cost

                                                                                                ? projects.shipping_Cost


                                                                                                : " Đang cập nhật"

                                                                                        }    <span style={{ color: "#7790b6" }}> {projects.unit_money}</span>
                                                                                    </b>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between'>
                                                                                    <div className='item-info_name  '>
                                                                                        {t('detail.Status-payment.Twele')}
                                                                                    </div>
                                                                                    <b className='item-info_value'>
                                                                                        {projects.paid
                                                                                            ? projects.paid
                                                                                            : "Đang cập nhật"} <span style={{ color: "#7790b6" }}> {projects.unit_money}</span>
                                                                                    </b>
                                                                                </div>
                                                                                <div className='item-info py-3 d-flex align-items-center justify-content-between'>
                                                                                    <div className='item-info_name  '>
                                                                                        <b>{t('detail.Status-payment.Thirteen')}</b>
                                                                                        <br />
                                                                                        <span> {t('detail.Status-payment.Fourteen')}</span>
                                                                                    </div>
                                                                                    <div className='item-info_value'>
                                                                                        <b>
                                                                                            {projects?.total ? projects?.total : " 0"}
                                                                                            <span style={{ color: "#7790b6" }}> {projects.unit_money}</span>

                                                                                        </b>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='item-info py-1 d-flex align-items-center justify-content-between '>
                                                                                    <div className='item-info_name  '>
                                                                                        <b>{t('detail.Status-payment.fifteen')}</b>
                                                                                        <br />
                                                                                        <span>{t('detail.Status-payment.sixteen')}</span>

                                                                                    </div>

                                                                                    <b className='item-info_value'>
                                                                                        {projects?.totalWithShippingCost ? projects?.totalWithShippingCost : " Đang cập nhật"}
                                                                                        <span style={{ color: "#7790b6" }}> {projects.unit_money}</span>


                                                                                    </b>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }

                                                        </div>
                                                    </div>
                                                    <div className='show-image mt-3 '>

                                                        <div className='container'>

                                                            <div className='row d-flex align-items-center'>

                                                                {actionModalFour === "4" ?
                                                                    <>
                                                                        <h4 className='my-3 title col-10' style={{ color: "#637381" }}>
                                                                            {t('detail.Image.One')}
                                                                        </h4>


                                                                        <div className=' item col-1'>
                                                                            <div className=' col-1 d-flex gap-3'>
                                                                                <div className="order  " >
                                                                                    <div className=' btn btn-success' title='Save' style={{ borderRadius: "50%" }} onClick={() =>
                                                                                        handleUpdateImage()} >
                                                                                        <i class="fa fa-floppy-o" aria-hidden="true"></i>
                                                                                    </div>



                                                                                </div>
                                                                                <div className="order  ">
                                                                                    <div className=' btn btn-danger' title='cancel' style={{ borderRadius: "50%" }} onClick={() => handleDeleteActionFour()}>
                                                                                        <i class="fa fa-times-circle" aria-hidden="true"></i>
                                                                                    </div>

                                                                                </div>


                                                                            </div>

                                                                        </div>

                                                                    </>
                                                                    :
                                                                    <>
                                                                        <h4 className='my-3 title col-10' style={{ color: "#637381" }}>
                                                                            {t('detail.Image.One')}
                                                                        </h4>

                                                                        <div className='col-1'></div>

                                                                        <div className=' item col-1' onClick={() => handleEditActionFour()}>

                                                                            <button className='btn btn-warning' style={{ borderRadius: "50%" }}>

                                                                                <span title='edit'  >
                                                                                    <i class="fa fa-pencil" aria-hidden="true"></i >
                                                                                </span>
                                                                            </button>
                                                                        </div>
                                                                    </>


                                                                }

                                                            </div>
                                                        </div>
                                                        <div className='container'>
                                                            <form
                                                                onSubmit={handleSubmitImage}
                                                                method='POST'
                                                                encType='multipart/form-data'
                                                                action='upload-multiple-pic'
                                                            >
                                                                {actionModalFour === "4" ?

                                                                    <SRLWrapper >

                                                                        <div className='d-flex align-items-start gap-5 '>

                                                                            <fieldset className='border rounded-3 p-3' style={{ width: "50%" }}>
                                                                                <legend className='float-none w-auto px-3'>
                                                                                    {t('detail.Image.One')}


                                                                                </legend>


                                                                                <div className='image-detail-one '>
                                                                                    {projects && projects.Images.length > 0 ?
                                                                                        projects.Images.map((item, index) => {
                                                                                            let imageRender = item.url
                                                                                            return (


                                                                                                <div className='image-item ' key={`image-${index}`}

                                                                                                >

                                                                                                    {actionModalFour === "4" ?
                                                                                                        <>

                                                                                                            <img src={"http://localhost:3030/image/" + imageRender} alt="" title='View detail image' />

                                                                                                            <h5 class="card-title" onClick={() => handleDeleteImage(imageRender)}> <i class="fa fa-times-circle" aria-hidden="true"></i></h5>

                                                                                                        </>
                                                                                                        :
                                                                                                        <img src={"http://localhost:3030/image/" + imageRender} alt="" title='View detail image' />


                                                                                                    }


                                                                                                </div>
                                                                                            )
                                                                                        })
                                                                                        :
                                                                                        <div> {t('detail.Image.Three')}</div>



                                                                                    }




                                                                                </div>
                                                                            </fieldset>
                                                                            <fieldset className='border rounded-3 p-3' style={{ width: "43%" }}>
                                                                                <legend className='float-none w-auto px-3'>
                                                                                    <div className='d-flex align-items-center '>
                                                                                        <div>
                                                                                            {t('detail.Image.Two')}
                                                                                        </div>
                                                                                        <div className=' btn btn-primary Update-image mx-3' title='Add new image'

                                                                                        >

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
                                                                                                style={{ cursor: "pointer" }}

                                                                                            >
                                                                                                <span>
                                                                                                    <i className="fa fa-upload " aria-hidden="true"></i>
                                                                                                </span>

                                                                                            </label>
                                                                                        </div>

                                                                                    </div>

                                                                                </legend>
                                                                                <div className='image-add'>

                                                                                    {previewsImage && previewsImage.length > 0 ?
                                                                                        previewsImage.map((item, index) => {
                                                                                            return (


                                                                                                <div className='image-item ' key={`image-${index}`}

                                                                                                >



                                                                                                    <img src={item} alt="" title='View detail image' />

                                                                                                    <h5 class="card-title" onClick={() => handleDeleteImageAdd(item)}> <i class="fa fa-times-circle" aria-hidden="true"></i></h5>




                                                                                                </div>
                                                                                            )
                                                                                        })
                                                                                        :
                                                                                        <div>
                                                                                            {t('detail.Image.Four')}
                                                                                        </div>
                                                                                    }
                                                                                </div>
                                                                                {previewsImage.length > 0 &&
                                                                                    <div className='container' onClick={handleSubmitImage}>
                                                                                        <div className='row'>
                                                                                            <button className='btn btn-success' >
                                                                                                {t('detail.Image.Six')}
                                                                                            </button>

                                                                                        </div>

                                                                                    </div>
                                                                                }



                                                                            </fieldset>
                                                                        </div>

                                                                    </SRLWrapper>
                                                                    :
                                                                    <SRLWrapper >
                                                                        <div className='d-flex align-items-center justify-content-center '>

                                                                            <div className='image-detail '>
                                                                                <div className='container'>
                                                                                    <div className='row'>


                                                                                        {projects && projects.Images &&
                                                                                            projects.Images.map((item, index) => {
                                                                                                let imageRender = item.url
                                                                                                return (
                                                                                                    <div className='image-item ' key={`image-${index}`}                                                                                                  >
                                                                                                        {actionModalFour === "4" ?
                                                                                                            <>

                                                                                                                <img src={"http://localhost:3030/image/" + imageRender} alt="" title='View detail image' />

                                                                                                                <h5 class="card-title" onClick={() => handleDeleteImage(imageRender)}> <i class="fa fa-times-circle" aria-hidden="true"></i></h5>

                                                                                                            </>
                                                                                                            :
                                                                                                            <img src={"http://localhost:3030/image/" + imageRender} alt="" title='View detail image' />


                                                                                                        }


                                                                                                    </div>
                                                                                                )
                                                                                            })
                                                                                        }


                                                                                    </div>
                                                                                </div>

                                                                            </div>

                                                                        </div>

                                                                    </SRLWrapper>

                                                                }
                                                            </form>
                                                        </div>
                                                    </div>


                                                    <div className=' chat mt-3'>
                                                        <h5 className='mb-3' style={{ color: "#637381" }}>
                                                            {t('detail.Chat.One')}
                                                        </h5>
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
                                                                                        <div className="row">
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
                                                                                                            {t('detail.Chat.Two')}  {item.CreatedByName}
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
                                                                                                            {t('detail.Chat.Two')}  {item.CreatedByName}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className='col-2 d-flex align-items-center' style={{ paddingBottom: "61px" }}>
                                                                                                        <button className='btn btn-warning ' style={{ borderRadius: "50%" }} onClick={() => handleChangeStatusEditChat(item)}>
                                                                                                            <i class="fa fa-pencil-square" aria-hidden="true"></i>
                                                                                                        </button>
                                                                                                        <button className='btn btn-danger mx-3' style={{ borderRadius: "50%" }} onClick={() => handlDeleteChatProject(item.id)}>
                                                                                                            <i class="fa fa-trash-o" aria-hidden="true"></i>
                                                                                                        </button>
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
                                                                    <div className='row'>
                                                                        {imageUser
                                                                            ?
                                                                            <>
                                                                                <div className='image-user col-1'>
                                                                                    <img src={imageUser} alt="" />
                                                                                </div>
                                                                                <input type="text"
                                                                                    placeholder='Trò chuyện với nhân viên'
                                                                                    className='chat-input col-8'
                                                                                    onChange={(event) => setchatContent(event.target.value)}
                                                                                    value={chatContent}
                                                                                />

                                                                                <div className='icon col-1'>

                                                                                    <span className='send' >
                                                                                        <button className='btn btn-primary' onClick={() => createChat()}>
                                                                                            {t('detail.Chat.Three')}
                                                                                        </button>
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
                                                                                        <button className='btn btn-primary' onClick={() => createChat()}>
                                                                                            {t('detail.Chat.Three')}

                                                                                        </button>
                                                                                    </span>
                                                                                </div>
                                                                            </>
                                                                        }

                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </SRLWrapper>

                                                    </div>

                                                    <div class="container history py-5">
                                                        <h5 style={{ color: "#637381" }}>
                                                            {t('detail.history.One')}
                                                        </h5>

                                                        <div class="row">
                                                            <div class="col-md-12">
                                                                <div id="content">

                                                                    <ul class="timeline-1 text-black" >
                                                                        <li class="event" data-date={moment(`${projects.createdAt}`).format(" DD/MM/YYYY  HH:mm:ss ")}>
                                                                            <h4 class="mb-3" >
                                                                                {t('detail.history.Two')}
                                                                            </h4>

                                                                        </li>
                                                                        {!projects.statuspickupId &&
                                                                            <li class="event" style={{ opacity: "0.7" }}>
                                                                                <h4 class="mb-3 pt-3">
                                                                                    {t('detail.history.Ten')}                                                                                </h4>
                                                                            </li>
                                                                        }
                                                                        {projects.statuspickupId === 1 &&
                                                                            <li class="event" data-date={moment(`${projects?.pickup_time}`).format(" DD/MM/YYYY  HH:mm:ss ")}>
                                                                                <h4 class="mb-3">{projects?.Status_Pickup?.status}</h4>
                                                                                <span> {t('detail.history.Three')} <b>{projects?.User_PickUp}</b>  </span>
                                                                                <br />
                                                                                <span> {t('detail.history.Four')} <b>{projects?.Number_PickUp}</b>  </span>

                                                                            </li>

                                                                        }
                                                                        {projects.statuspickupId === 2 &&
                                                                            <li class="event" data-date={moment(`${projects?.pickupDone_time}`).format(" DD/MM/YYYY  HH:mm:ss ")}>
                                                                                <h4 class="mb-3">{projects?.Status_Pickup?.status}</h4>
                                                                                <span> {t('detail.history.Three')} <b>{projects?.User_PickUp}</b>  </span>
                                                                                <br />
                                                                                <span> {t('detail.history.Four')} <b>{projects?.Number_PickUp}</b>  </span>

                                                                            </li>

                                                                        }
                                                                        {!projects.statuswarehouseId &&
                                                                            <li class="event" style={{ opacity: "0.7" }} >
                                                                                <h4 class="mb-3 pt-3">
                                                                                    {t('detail.history.Eleven')}
                                                                                </h4>
                                                                            </li>
                                                                        }
                                                                        {projects?.statuswarehouseId === 1 &&
                                                                            <li class="event" data-date={moment(`${projects?.warehouse_time}`).format("DD/MM/YYYY  HH:mm:ss ")}>
                                                                                <h4 class="mb-3">{projects?.Status_Warehouse?.status}</h4>
                                                                                <span> {t('detail.history.Five')} <b>{projects?.User_Warehouse}</b>  </span>
                                                                                <br />
                                                                                <span> {t('detail.history.Four')} <b>{projects?.Number_Warehouse}</b>  </span>

                                                                            </li>

                                                                        }
                                                                        {projects?.statuswarehouseId === 2 &&
                                                                            <li class="event" data-date={moment(`${projects?.warehouseDone_time}`).format("DD/MM/YYYY  HH:mm:ss ")}>
                                                                                <h4 class="mb-3">{projects?.Status_Warehouse?.status}</h4>
                                                                                <span> {t('detail.history.Five')} <b>{projects?.User_Warehouse}</b>  </span>
                                                                                <br />
                                                                                <span> {t('detail.history.Four')} <b>{projects?.Number_Warehouse}</b>  </span>

                                                                            </li>

                                                                        }
                                                                        {!projects.statusDeliveryId &&
                                                                            <li class="event" style={{ opacity: "0.7" }} >
                                                                                <h4 class="mb-3 pt-3">
                                                                                    {t('detail.history.Twele')}
                                                                                </h4>
                                                                            </li>
                                                                        }
                                                                        {projects?.statusDeliveryId === 1 && !projects?.Notice_Delivery &&
                                                                            <li class="event" data-date={moment(`${projects?.Delivery_time}`).format("DD/MM/YYYY  HH:mm:ss ")}>
                                                                                <h4 class="mb-3">{projects?.Status_Delivery?.status}</h4>
                                                                                <span> {t('detail.history.Six')} <b>{projects?.User_Delivery}</b>  </span>
                                                                                <br />
                                                                                <span> {t('detail.history.Four')} <b>{projects?.Number_Delivery}</b>  </span>

                                                                            </li>

                                                                        }
                                                                        {projects?.statusDeliveryId === 2 &&
                                                                            <li class="event" data-date={moment(`${projects?.DeliveryDone_time}`).format("DD/MM/YYYY  HH:mm:ss ")}>
                                                                                <h4 class="mb-3">{projects?.Status_Delivery?.status}</h4>
                                                                                <span> {t('detail.history.Six')} <b>{projects?.User_Delivery}</b>  </span>
                                                                                <br />
                                                                                <span> {t('detail.history.Four')} <b>{projects?.Number_Delivery}</b>  </span>

                                                                            </li>

                                                                        }
                                                                        {projects?.statusDeliveryId === 3 &&
                                                                            <li class="event" data-date={moment(`${projects?.DeliveryDone_time}`).format("DD/MM/YYYY  HH:mm:ss ")}>
                                                                                <h4 class="mb-3">{projects?.Status_Delivery?.status}</h4>
                                                                                <span> {t('detail.history.Six')} <b>{projects?.User_Delivery}</b>  </span>
                                                                                <br />
                                                                                <span> {t('detail.history.Four')} <b>{projects?.Number_Delivery}</b>  </span>
                                                                                <br />
                                                                                <span> {t('detail.history.Seven')} <b>{projects?.Cancel_reason}</b>  </span>
                                                                            </li>

                                                                        }
                                                                        {projects?.statusDeliveryId === 1 && projects?.Notice_Delivery &&
                                                                            <li class="event" data-date={moment(`${projects?.Delivery_time}`).format("DD/MM/YYYY  HH:mm:ss ")}>
                                                                                <h4 class="mb-3">Giao lại</h4>
                                                                                <span> {t('detail.history.Six')} <b>{projects?.User_Delivery}</b>  </span>
                                                                                <br />
                                                                                <span> {t('detail.history.Four')} <b>{projects?.Number_Delivery}</b>  </span>
                                                                                <br />
                                                                                <span> {t('detail.history.Eight')} <b>{projects?.Cancel_reason}</b>  </span>
                                                                            </li>

                                                                        }
                                                                        {!projects.receiveMoneyId &&
                                                                            <li class="event" style={{ opacity: "0.7" }} >
                                                                                <h4 class="mb-3 pt-3">
                                                                                    {t('detail.history.Thirteen')}
                                                                                </h4>
                                                                            </li>
                                                                        }
                                                                        {projects?.receiveMoneyId === 1 &&
                                                                            <li class="event" data-date={moment(`${projects?.Overview_time}`).format("DD/MM/YYYY  HH:mm:ss ")}>
                                                                                <h4 class="mb-3">{projects?.Status_Received_money?.status}</h4>
                                                                                <span> {t('detail.history.Night')} <b>{projects?.User_Overview}</b>  </span>
                                                                                <br />
                                                                                <span> {t('detail.history.Four')} <b>{projects?.Number_Overview}</b>  </span>

                                                                            </li>

                                                                        }
                                                                        {projects?.receiveMoneyId === 2 || projects?.receiveMoneyId === 3 &&
                                                                            <li class="event" data-date={moment(`${projects?.OverviewDone_time}`).format("DD/MM/YYYY  HH:mm:ss ")}>
                                                                                <h4 class="mb-3">{projects?.Status_Received_money?.status}</h4>
                                                                                <span> {t('detail.history.Night')} <b>{projects?.User_Overview}</b>  </span>
                                                                                <br />
                                                                                <span> {t('detail.history.Four')} <b>{projects?.Number_Overview}</b>  </span>

                                                                            </li>

                                                                        }
                                                                    </ul>


                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='right-body col-3'>
                                                <div className='Created-Date d-flex flex-column my-3'>
                                                    <b className='title  d-flex justify-content-center mt-3' style={{ color: "#637381" }}>
                                                        {t('detail.Create-time.Three')}
                                                    </b>

                                                    <hr />
                                                    <div className='container'>
                                                        <div className='value-day d-flex justify-content-around align-items-center'>
                                                            <span>
                                                                {t('detail.Create-time.One')}

                                                            </span>
                                                            <b className='mx-1'>
                                                                {moment(`${projects
                                                                    .createdAt}`).format("HH:mm:ss ")}
                                                            </b>                                                    </div>
                                                        <div className='value-time d-flex justify-content-around align-items-center'>
                                                            <span >
                                                                {t('detail.Create-time.Two')}
                                                            </span>
                                                            <b >
                                                                {moment(`${projects
                                                                    .createdAt}`).format("DD/MM/YYYY ")}
                                                            </b>
                                                        </div>
                                                    </div>


                                                </div>
                                                <div className="MoreNote mb-3 ">
                                                    <div className='container col-12'>
                                                        <div className='row '>
                                                            <div className='d-flex justify-content-around align-items-center mt-2'>

                                                                {actionModalFive === "5" ?
                                                                    <>

                                                                        <b className='customer-name col-8 ' style={{ color: "#637381" }}>
                                                                            {t('detail.Extral-note.One')}
                                                                        </b>
                                                                        <div className='col-4 mx-1'>

                                                                            <div className='d-flex '>
                                                                                <div className="order mx-2" onClick={() => handleUpdateProject()}>
                                                                                    <button className='btn btn-success' title='Save' style={{ borderRadius: "50%" }} >
                                                                                        <i class="fa fa-floppy-o" aria-hidden="true"></i>
                                                                                    </button>



                                                                                </div>
                                                                                <div className="order   " onClick={() => handleDeleteActionFive()}>
                                                                                    <button className=' btn btn-danger' title='cancel' style={{ borderRadius: "50%" }} >
                                                                                        <i class="fa fa-times-circle" aria-hidden="true"></i>
                                                                                    </button>

                                                                                </div>


                                                                            </div>
                                                                        </div>
                                                                    </>

                                                                    :
                                                                    <>
                                                                        <b className='customer-name col-10 ' style={{ color: "#637381" }}>
                                                                            {t('detail.Extral-note.Two')}
                                                                        </b>

                                                                        <button className='btn btn-warning' style={{ borderRadius: "50%" }} onClick={() => handleEditActionFive()}>
                                                                            <span title='edit'  >
                                                                                <i class="fa fa-pencil" aria-hidden="true"></i >
                                                                            </span>
                                                                        </button>
                                                                    </>


                                                                }
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <hr />
                                                    {actionModalFive === "5" ?
                                                        <div className='text-note mb-3'>
                                                            <div className='container'>
                                                                <span className=''>
                                                                    <i class="fa fa-flag blue " aria-hidden="true"></i> :
                                                                </span>
                                                                <input
                                                                    id='input-note-customer'
                                                                    type="text"
                                                                    className='form-control '
                                                                    value={projects.Notemore}
                                                                    onChange={(event) => handleOnchangeInput(event.target.value, "Notemore")}


                                                                />
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className='salesman-valued d-flex flex-column'>
                                                            <div className='container'>
                                                                <div className='my-3 '>
                                                                    <i class="fa fa-flag blue mr-2" aria-hidden="true"></i> :
                                                                    <b style={{ overflowWrap: "anywhere" }}> {projects.Notemore ? projects.Notemore : `${t('detail.Extral-note.Two')}`}</b>

                                                                </div>

                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div className='customer-info d-flex flex-column '>
                                                    <div className='container'>
                                                        <div className='row'>
                                                            <div className='d-flex justify-content-around align-items-center mt-2'>


                                                                {actionModalSix === "6" ?
                                                                    <>
                                                                        <b className='customer-name col-8 ' style={{ color: "#637381" }}>
                                                                            {t('detail.Customer-infomation.One')}

                                                                        </b>
                                                                        <div className='col-4 mx-1'>

                                                                            <div className='d-flex '>
                                                                                <div className="order mx-2" onClick={() => handleUpdateProject()}>
                                                                                    <button className=' btn btn-success' title='Save' style={{ borderRadius: "50%" }} >
                                                                                        <i class="fa fa-floppy-o" aria-hidden="true"></i>
                                                                                    </button>
                                                                                </div>
                                                                                <div className="order   " onClick={() => handleDeleteActionSix()}>
                                                                                    <button className=' btn btn-danger' title='cancel' style={{ borderRadius: "50%" }} >
                                                                                        <i class="fa fa-times-circle" aria-hidden="true"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <b className='customer-name col-10 ' style={{ color: "#637381" }}>
                                                                            {t('detail.Customer-infomation.One')}
                                                                        </b>

                                                                        <button className='btn btn-warning' style={{ borderRadius: "50%" }} onClick={() => handleEditActionSix()}>
                                                                            <span title='edit'  >
                                                                                <i class="fa fa-pencil" aria-hidden="true"></i >
                                                                            </span>
                                                                        </button>
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    {actionModalSix === "6" ?
                                                        <div className='customer-valued d-flex flex-column'>
                                                            <div className='container'>
                                                                <div className='my-2'>
                                                                    <span>
                                                                        <i class="fa fa-user" aria-hidden="true"></i>
                                                                        <span className='mx-1'>
                                                                            {t('detail.Customer-infomation.Two')}
                                                                        </span>
                                                                    </span>
                                                                    <input
                                                                        id='input-name-customer'
                                                                        type="text"
                                                                        className="form-control my-3"
                                                                        value={projects.name_customer}
                                                                        onChange={(event) => handleOnchangeInput(event.target.value, "name_customer")}

                                                                    />
                                                                </div>

                                                                <div className='my-2'>
                                                                    <span>
                                                                        <i class="fa fa-phone-square" aria-hidden="true"></i>
                                                                        <span className='mx-1'>
                                                                            {t('detail.Customer-infomation.Three')}
                                                                        </span>
                                                                    </span>
                                                                    <input
                                                                        id='input-name-customer'
                                                                        type="text"
                                                                        className="form-control my-3"
                                                                        value={projects.phoneNumber_customer}
                                                                        onChange={(event) => handleOnchangeInput(event.target.value, "phoneNumber_customer")}

                                                                    />
                                                                </div>
                                                                <div className='my-2'>
                                                                    <span>
                                                                        <i class="fa fa-child" aria-hidden="true"></i>
                                                                        <span className='mx-1'>
                                                                            {t('detail.Customer-infomation.Four')}
                                                                        </span></span>
                                                                    <input
                                                                        id='input-name-customer'
                                                                        type="text"
                                                                        className="form-control my-3"
                                                                        value={projects.age_customer}
                                                                        onChange={(event) => handleOnchangeInput(event.target.value, "age_customer")}

                                                                    />
                                                                </div>

                                                                <div className='my-2'>
                                                                    <div>
                                                                        <i class="fa fa-map" aria-hidden="true"></i>
                                                                        <span className='mx-1'> <b>
                                                                            {t('detail.Customer-infomation.Six')}
                                                                        </b></span></div>
                                                                    <div>
                                                                        <span className='mt-3'>
                                                                            <i class="fa fa-home" aria-hidden="true"></i>
                                                                            -{t('detail.Customer-infomation.Seven')}</span>
                                                                        <br />

                                                                        <select
                                                                            id='selectProduct'
                                                                            className={StatusProvinceCustomer === true ? "form-select my-2" : "form-select  my-2 is-invalid"}
                                                                            onChange={(event) => {
                                                                                handleSelectProvinceCustomer(event.target.value);
                                                                                handleOnchangeProviceCustomer(event.target.value);
                                                                                handleOnchangeInput(event.target.value, "Province_customerId")
                                                                            }}

                                                                            value={projects.Province_customerId}
                                                                        >
                                                                            <option value="Tỉnh/thành phố" >Tỉnh/thành phố</option>


                                                                            {allProvinceCutomer && allProvinceCutomer.length > 0
                                                                                ?

                                                                                allProvinceCutomer.map((item, index) => {
                                                                                    return (
                                                                                        <option key={`Province - ${index}`} value={item.id}
                                                                                        > {item.name}</option>

                                                                                    )
                                                                                })

                                                                                :
                                                                                <option value={projects.Province_customerId} >{projects.Province_customer.name}</option>

                                                                            }
                                                                        </select >
                                                                    </div>
                                                                    <hr />
                                                                    <div>
                                                                        <span >
                                                                            <i class="fa fa-home" aria-hidden="true"></i>
                                                                            -{t('detail.Customer-infomation.Eight')}</span>
                                                                        <br />

                                                                        <select
                                                                            className={StatusDistrictCustomer === true ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                                            onChange={(event) => {
                                                                                handleSelectDistrictCustomer(event.target.value);
                                                                                handleOnchangeDistrictCustomer(event.target.value);
                                                                                handleOnchangeInput(event.target.value, "District_customerId")
                                                                            }}
                                                                            value={
                                                                                projects.District_customerId
                                                                            }

                                                                        >
                                                                            <option value="0">Quận/huyện</option>

                                                                            {assignDistrictByProvince && assignDistrictByProvince.length > 0
                                                                                ?
                                                                                assignDistrictByProvince.map((item, index) => {
                                                                                    return (
                                                                                        <option key={`District - ${index}`} value={item.id}>{item.name}</option>

                                                                                    )
                                                                                })
                                                                                :
                                                                                <option value={projects.District_customerId} >{projects.District_customer.name}</option>

                                                                            }
                                                                        </select >
                                                                    </div>
                                                                    <hr />
                                                                    <div>
                                                                        <span >
                                                                            <i class="fa fa-home" aria-hidden="true"></i>
                                                                            -{t('detail.Customer-infomation.Night')}</span>
                                                                        <br />

                                                                        <select
                                                                            className={StatusWardCustomer === true ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                                            onChange={(event) => {
                                                                                handleOnchangeInput(event.target.value, "Ward_customerId");
                                                                                handleSelectWardCustomer(event.target.value)
                                                                            }}
                                                                            value={projects.Ward_customerId}


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
                                                                                <option value={projects.Ward_customerId} >{projects.Ward_customer.name}</option>

                                                                            }
                                                                        </select >
                                                                    </div>
                                                                    <hr />
                                                                    <div>
                                                                        <span  >
                                                                            <i class="fa fa-home" aria-hidden="true"></i>
                                                                            -{t('detail.Customer-infomation.Ten')}</span>
                                                                        <br />
                                                                        <input
                                                                            id='input-total-product'
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder='địa chỉ gửi hàng chi tiết '
                                                                            value={projects.addressDetail}
                                                                            onChange={(event) => handleOnchangeInput(event.target.value, "addressDetail")}

                                                                        />
                                                                    </div>


                                                                </div>

                                                            </div>
                                                        </div>
                                                        :
                                                        <>
                                                            <div className='customer-valued d-flex flex-column'>
                                                                <div className='container'>
                                                                    <div className='my-2'>
                                                                        <span>
                                                                            <i class="fa fa-user" aria-hidden="true"></i>
                                                                            <span className='mx-1'>
                                                                                {t('detail.Customer-infomation.Two')}
                                                                            </span>
                                                                        </span>
                                                                        <br />

                                                                        <b style={{ overflowWrap: "anywhere" }}
                                                                        >{projects.name_customer ? projects.name_customer : "Đang cập nhật"}</b>
                                                                    </div>

                                                                    <div className='my-2'>
                                                                        <span>
                                                                            <i class="fa fa-phone-square" aria-hidden="true"></i>
                                                                            <span className='mx-1'>
                                                                                {t('detail.Customer-infomation.Three')}
                                                                            </span>
                                                                        </span>
                                                                        <br />

                                                                        <b>{projects.phoneNumber_customer ? projects.phoneNumber_customer : "Đang cập nhật"}</b>

                                                                    </div>
                                                                    <div className='my-2'>
                                                                        <span>
                                                                            <i class="fa fa-child" aria-hidden="true"></i>
                                                                            <span className='mx-1'>
                                                                                {t('detail.Customer-infomation.Four')}
                                                                            </span>
                                                                        </span>
                                                                        <br />

                                                                        <b>{projects.age_customer ? projects.age_customer : "Đang cập nhật"}</b>

                                                                    </div>
                                                                    <div className='my-2'>
                                                                        <div>
                                                                            <i class="fa fa-map" aria-hidden="true"></i>
                                                                            <span className='mx-1'>
                                                                                <b>
                                                                                    {t('detail.Customer-infomation.Six')}
                                                                                </b>
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <span >
                                                                                <i class="fa fa-home" aria-hidden="true"></i>/
                                                                                {t('detail.Customer-infomation.Seven')}
                                                                            </span>
                                                                            <br />
                                                                            <b>{projects?.Province_customer?.name


                                                                                ? projects?.Province_customer?.name
                                                                                : "Đang cập nhật"}</b>

                                                                        </div>
                                                                        <hr />
                                                                        <div>
                                                                            <span >
                                                                                <i class="fa fa-home" aria-hidden="true"></i>/
                                                                                {t('detail.Customer-infomation.Eight')}
                                                                            </span>
                                                                            <br />
                                                                            <b>{projects?.District_customer && projects?.District_customer?.name ? projects?.District_customer?.name : "Đang cập nhật"}</b>

                                                                        </div>
                                                                        <hr />
                                                                        <div>
                                                                            <span >
                                                                                <i class="fa fa-home" aria-hidden="true"></i>/
                                                                                {t('detail.Customer-infomation.Night')}
                                                                            </span>
                                                                            <br />
                                                                            <b>{projects?.Ward_customer && projects?.Ward_customer?.name ? projects?.Ward_customer?.name : "Đang cập nhật"}</b>

                                                                        </div>
                                                                        <hr />
                                                                        <div>
                                                                            <span  >
                                                                                <i class="fa fa-home" aria-hidden="true"></i>/
                                                                                {t('detail.Customer-infomation.Ten')}
                                                                            </span>
                                                                            <br />
                                                                            <b>{projects?.addressDetail && projects?.addressDetail ? projects?.addressDetail : "Đang cập nhật"}</b>

                                                                        </div>


                                                                    </div>

                                                                </div>
                                                            </div>

                                                        </>
                                                    }

                                                </div>
                                                <div className="salesman-info d-flex flex-column mt-3 ">
                                                    <div className='container'>
                                                        <div className='row'>
                                                            <div className='d-flex justify-content-around align-items-center mt-2 '>
                                                                {actionModalSeven === "7" ?
                                                                    <>
                                                                        <b className='customer-name col-8 ' style={{ color: "#637381" }}>
                                                                            {t('detail.Seller-infomation.One')}
                                                                        </b>
                                                                        <div className='col-4 mx-1'>

                                                                            <div className='d-flex '>
                                                                                <div className="order mx-2" onClick={() => handleUpdateProject()}>
                                                                                    <button className=' btn btn-success' title='Save' style={{ borderRadius: "50%" }} >
                                                                                        <i class="fa fa-floppy-o" aria-hidden="true"></i>
                                                                                    </button>
                                                                                </div>
                                                                                <div className="order   " onClick={() => handleDeleteActionSeven()}>
                                                                                    <button className=' btn btn-danger' title='cancel' style={{ borderRadius: "50%" }} >
                                                                                        <i class="fa fa-times-circle" aria-hidden="true"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <b className='customer-name col-10 ' style={{ color: "#637381" }}>
                                                                            {t('detail.Seller-infomation.One')}
                                                                        </b>

                                                                        <button className='btn btn-warning' style={{ borderRadius: "50%" }} onClick={() => handleEditActionSeven()}>
                                                                            <span title='edit'  >
                                                                                <i class="fa fa-pencil" aria-hidden="true"></i >
                                                                            </span>
                                                                        </button>
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    {actionModalSeven === "7" ?

                                                        <div className='salesman-valued d-flex flex-column'>
                                                            <div className='container'>
                                                                <div className='my-3'>
                                                                    <i class="fa fa-user" aria-hidden="true"></i>
                                                                    <span className='mx-2'>
                                                                        {t('detail.Seller-infomation.Two')}
                                                                    </span>
                                                                    <br />
                                                                    <b> {projects.createdByName ? projects.createdByName : "Đang cập nhật"}</b>

                                                                </div>
                                                                <div className='my-3'>
                                                                    <i class="fa fa-phone-square" aria-hidden="true"></i>
                                                                    <span className='mx-2'>
                                                                        {t('detail.Seller-infomation.Three')}
                                                                    </span>
                                                                    <br />
                                                                    <b>
                                                                        {projects.createdBy ? projects.createdBy : "Đang cập nhật"}                                                                    </b>

                                                                </div>
                                                                <div className='my-2'>
                                                                    <div>
                                                                        <i class="fa fa-map" aria-hidden="true"></i>
                                                                        <span className='mx-1'> <b>
                                                                            {t('detail.Seller-infomation.Six')}
                                                                        </b>
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className='mt-3'>
                                                                            <i class="fa fa-home" aria-hidden="true"></i>
                                                                            -{t('detail.Seller-infomation.Seven')}</span>
                                                                        <br />

                                                                        <select
                                                                            id='selectProduct'
                                                                            className={StatusProvince === true ? "form-select my-2" : "form-select  my-2 is-invalid"}
                                                                            onChange={(event) => {
                                                                                handleSelectProvince(event.target.value);
                                                                                handleOnchangeProvice(event.target.value);
                                                                                handleOnchangeInput(event.target.value, "Address_provinceId")
                                                                            }}

                                                                            value={projects.Address_provinceId
                                                                            }
                                                                        >
                                                                            <option value="Tỉnh/thành phố" >Tỉnh/thành phố</option>


                                                                            {allProvince && allProvince.length > 0
                                                                                ?

                                                                                allProvince.map((item, index) => {
                                                                                    return (
                                                                                        <option key={`Province-user-${index}`} value={item.id}
                                                                                        > {item.name}</option>

                                                                                    )
                                                                                })

                                                                                :
                                                                                <option value={projects.Address_provinceId} >{projects.Address_province.name}</option>

                                                                            }
                                                                        </select >
                                                                    </div>
                                                                    <hr />
                                                                    <div>
                                                                        <span >
                                                                            <i class="fa fa-home" aria-hidden="true"></i>
                                                                            -{t('detail.Seller-infomation.Eight')}</span>
                                                                        <br />

                                                                        <select
                                                                            className={StatusDistrict === true ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                                            onChange={(event) => {
                                                                                handleSelectDistrict(event.target.value);
                                                                                handleOnchangeDistrict(event.target.value);
                                                                                handleOnchangeInput(event.target.value, "Address_DistrictId")
                                                                            }}
                                                                            value={
                                                                                projects.Address_DistrictId
                                                                            }

                                                                        >
                                                                            <option value="0">Quận/huyện</option>

                                                                            {assignDistrictByProvinceOfReceipt && assignDistrictByProvinceOfReceipt.length > 0
                                                                                ?
                                                                                assignDistrictByProvinceOfReceipt.map((item, index) => {
                                                                                    return (
                                                                                        <option key={`District-user-${index}`} value={item.id}>{item.name}</option>

                                                                                    )
                                                                                })
                                                                                :
                                                                                <option value={projects.Address_DistrictId} >{projects?.Address_District?.name}</option>

                                                                            }
                                                                        </select >



                                                                    </div>
                                                                    <hr />
                                                                    <div>
                                                                        <span >
                                                                            <i class="fa fa-home" aria-hidden="true"></i>
                                                                            -{t('detail.Seller-infomation.Night')}</span>
                                                                        <br />

                                                                        <select
                                                                            className={StatusWard === true ? "form-select my-2" : "form-select my-2 is-invalid"}
                                                                            onChange={(event) => {
                                                                                handleOnchangeInput(event.target.value, "Address_WardId");
                                                                                handleSelectWard(event.target.value)
                                                                            }}
                                                                            value={projects.Address_WardId}


                                                                        >
                                                                            <option value="Phường/xã">Phường/xã</option>
                                                                            {assignWardtByDistricOfReceipt && assignWardtByDistricOfReceipt.length > 0
                                                                                ?
                                                                                assignWardtByDistricOfReceipt.map((item, index) => {
                                                                                    return (
                                                                                        <option key={`Ward-user-${index}`} value={item.id}>{item.name}</option>

                                                                                    )
                                                                                })
                                                                                :
                                                                                <option value={projects.Address_WardId}>{projects.Address_Ward.name}</option>

                                                                            }







                                                                        </select >
                                                                    </div>
                                                                    <hr />
                                                                    <div>
                                                                        <span  >
                                                                            <i class="fa fa-home" aria-hidden="true"></i>
                                                                            -{t('detail.Seller-infomation.Ten')}</span>
                                                                        <br />
                                                                        <input
                                                                            id='input-total-product'
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder='địa chỉ gửi hàng chi tiết '
                                                                            value={projects.Detail_Place_of_receipt}
                                                                            onChange={(event) => handleOnchangeInput(event.target.value, "Detail_Place_of_receipt")}
                                                                        />
                                                                    </div>


                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className='salesman-valued d-flex flex-column'>
                                                            <div className='container'>
                                                                <div className='my-3'>
                                                                    <i class="fa fa-user" aria-hidden="true"></i>
                                                                    <span className='mx-2'>
                                                                        {t('detail.Seller-infomation.Two')}

                                                                    </span>
                                                                    <br />
                                                                    <b> {projects.createdByName ? projects.createdByName : "Đang cập nhật"}</b>

                                                                </div>
                                                                <div className='my-3'>
                                                                    <i class="fa fa-phone-square" aria-hidden="true"></i>
                                                                    <span className='mx-2'>
                                                                        {t('detail.Seller-infomation.Three')}

                                                                    </span>
                                                                    <br />
                                                                    <b>
                                                                        <b> {projects.createdBy ? projects.createdBy : "Đang cập nhật"}</b>
                                                                    </b>

                                                                </div>
                                                                <div className='my-3'>
                                                                    <div>
                                                                        <i class="fa fa-map" aria-hidden="true"></i>
                                                                        <span className='mx-1'>
                                                                            <b>
                                                                                {t('detail.Seller-infomation.Six')}
                                                                            </b>
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span >
                                                                            <i class="fa fa-home" aria-hidden="true"></i>/

                                                                            {t('detail.Seller-infomation.Seven')}
                                                                        </span>
                                                                        <br />
                                                                        <b>{projects?.Address_Province?.name


                                                                            ? projects?.Address_Province?.name
                                                                            : "Đang cập nhật"}</b>

                                                                    </div>
                                                                    <hr />
                                                                    <div>
                                                                        <span >
                                                                            <i class="fa fa-home" aria-hidden="true"></i>/

                                                                            {t('detail.Seller-infomation.Eight')}
                                                                        </span>
                                                                        <br />
                                                                        <b>{projects?.Address_District?.name && projects?.Address_District?.name ? projects?.Address_District?.name : "Đang cập nhật"}</b>

                                                                    </div>
                                                                    <hr />
                                                                    <div>
                                                                        <span >
                                                                            <i class="fa fa-home" aria-hidden="true"></i>/

                                                                            {t('detail.Seller-infomation.Night')}
                                                                        </span>
                                                                        <br />
                                                                        <b>{projects?.Address_Ward
                                                                            && projects?.Address_Ward
                                                                                ?.name ? projects?.Address_Ward
                                                                            ?.name : "Đang cập nhật"}</b>

                                                                    </div>
                                                                    <hr />
                                                                    <div>
                                                                        <span >
                                                                            <i class="fa fa-home" aria-hidden="true"></i>/

                                                                            {t('detail.Seller-infomation.Ten')}
                                                                        </span>
                                                                        <br />
                                                                        <b>{projects?.Detail_Place_of_receipt && projects?.Detail_Place_of_receipt ? projects?.Detail_Place_of_receipt : "Đang cập nhật"}</b>

                                                                    </div>



                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>
                </div>
            </div >

            <DeleteProduct
                order={projects.order}
                ProductId={ProductId}
                showDeleteProduct={showDeleteProduct}
                handleShowDeleteModal={handleShowDeleteModal}
                projects={projects}
            />
        </div >
    )
}


export default DetailProduct