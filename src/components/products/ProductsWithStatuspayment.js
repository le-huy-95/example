import './products.scss'
import Sidebar from "../sidebar/sidebar"
import { Link, NavLink, useHistory } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { getProjectWithPaginationStatusPayment } from "../services/ProjectService"
import moment from "moment"
import CreateNewProject from "./createProject"
import NotificationSuccessModal from "./notification-create-success"
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from "../../contexApi/UserContext"
import { fetchImagebyOrder, assignDataToProjectImage } from "../services/imageService"
import { CreateProject, getDataWithTime } from "../services/ProjectService"
import { toast } from 'react-toastify';
import _, { debounce } from "lodash"
import { getDataSearch } from "../services/ProjectService"
import { Calendar, DateRangePicker, DateRange, DefinedRange } from 'react-date-range';
import { addDays, format } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useRef } from 'react';
import { Bars } from 'react-loader-spinner'
import * as XLSX from 'xlsx';
import { getProjectWithPagination, updateProject, updateNumberProductInWarehouse } from "../services/ProjectService"
import { useTranslation, Trans } from 'react-i18next';
import { NotificationContext } from "../../contexApi/NotificationContext"

const ProductsWithStatuspayment = (props) => {
    let history = useHistory()
    let refCalendar = useRef(null)
    const { user } = React.useContext(UserContext);
    const { t, i18n } = useTranslation();
    const { list, getALlListNotification, listStaff } = React.useContext(NotificationContext);

    const defaultUserData = {
        order: "",
        name_Product: "",
        number: "",
        money: "",
        totalMoney: "",
        totalWithShippingCost: "",
        price_drop: "",
        paid: "",
        customer_name: "",
        customer_name_phone: "",
        note: "",
        age: "",
        Province_customer: "",
        District_customer: "",
        Ward_customer: "",
        detail_address_customer: "",
        Note_More: "",
        createdByName: user.account.username,
        createdBy: user.account.phone,
        shippingUnitId: "",
        shipping_Cost: "",
        From_address: "",
        To_address: "",
        salesChannel: "",
        StatusPaymentId: "",
        Province_of_receipt: "",
        District_of_receipt: "",
        Ward_of_receipt: "",
        Detail_Place_of_receipt: "",
        flag: 0,
        done_status: 0,
        unit: "",
        unit_money: "",
        name_account: "",
        Mode_of_payment: "",
        Bank_name: "",
        Main_Account: ""

    }


    const ValidInputsDefault = {
        order: true,
        name_Product: true,
        number: true,
        money: true,
        totalMoney: true,
        totalWithShippingCost: true,
        price_drop: true,
        paid: true,
        customer_name: true,
        customer_name_phone: true,
        note: true,
        age: true,
        Province_customer: true,
        District_customer: true,
        Ward_customer: true,
        detail_address_customer: true,
        Province_of_receipt: true,
        District_of_receipt: true,
        Ward_of_receipt: true,
        Detail_Place_of_receipt: true,
        image: true,
        Note_More: true,
        createdBy: true,
        shippingUnitId: true,
        shipping_Cost: true,
        From_address: true,
        To_address: true,
        salesChannel: true,
        StatusPaymentId: true,
        flag: true,
        done_status: true,
        unit: true,
        unit_money: true,
        name_account: true,
        Mode_of_payment: true,
        Bank_name: true,
        Main_Account: true



    }

    const [previreImage, setprevireImage] = useState([])

    const [userdata, setUserdata] = useState(defaultUserData)
    const [validInput, setValidInput] = useState(ValidInputsDefault)

    const [selecCheckSubtmitImage, setSelecCheckSubtmitImage] = useState(false)

    const [productAfterCreate, setProductAfterCreate] = useState({})

    const [currentPage, setCurrentPage] = useState(
        localStorage.getItem("infomation Page 1") ? localStorage.getItem("infomation Page 1") : 1

    )
    const [currentLimit, setCurrentLimit] = useState(6)

    const [listProjectbyUser, setListProjectbyUser] = useState([])
    const [totalPage, setTotalPage] = useState(0)

    let orderNumber = Math.floor(Math.random() * 1000000)

    const [order, setOrder] = useState(`${orderNumber}`)
    const [projectId, setProjectId] = useState("")

    const [showModalCreatNewProject, setShowModalCreatNewProject] = useState(false);

    const [showNotificationCreateSuccess, setShowNotificationCreateSuccess] = useState(false);
    const [sortBy, setSortBy] = useState("")
    const [fieldSort, setFieldSort] = useState("")
    const [lengProject, setLengProject] = useState("")

    const [sortId, setSortId] = useState(false)
    const [sorttime, setSortTime] = useState(false)
    const [sortmoney, setSortmoney] = useState(false)
    const [sortDataSearch, setSortDataSearch] = useState(false)
    const [sortDataSearchWithTime, setSortDataSearchWithTime] = useState(false)
    const [isLoadingOne, SetIsLoadingOne] = useState(false)
    const [numberProduct, setNumberProduct] = useState("")
    const [id, setId] = useState("")
    const [listDataSearch, setListDataSearch] = useState([])
    const [Product, SetProduct] = useState([])
    const [ProductNumber, SetProductNumber] = useState([])
    const [stateDate, setStateDate] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);
    const [isOpenCalendar, setIsOpenCalendar] = useState(false)
    const [StartDateCalendar, setstartDateCalendar] = useState("")
    const [endDateCalendar, setendDateCalendar] = useState("")

    const [listDataSearchNotime, setListDataSearchNotime] = useState([])

    const handleOnchangeInput = async (value, name) => {
        let _userdata = _.cloneDeep(userdata)
        _userdata[name] = value
        setUserdata(_userdata)
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
    }
    const clickMouseOusideCalendar = (event) => {

        if (refCalendar.current && !refCalendar.current.contains(event.target)) {
            setIsOpenCalendar(false)
        }

    }

    useEffect(() => {
        document.addEventListener("click", clickMouseOusideCalendar, true)
    })

    const handleChangDate = async (item) => {

        setStateDate([item.selection])
        setstartDateCalendar(format(item.selection.startDate, "dd-MM-yyyy"))
        setendDateCalendar(format(item.selection.endDate, "dd-MM-yyyy"))
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }

    }
    const handlegetAllProject = async () => {
        setstartDateCalendar("")
        setendDateCalendar("")
        setSortDataSearch(false)
        setSortDataSearchWithTime(false)

        await fetchProjectUser()
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
    }


    const handleChangsortItem = async (sortBy, fieldSort) => {
        setSortBy(sortBy);
        setFieldSort(fieldSort)
        if (fieldSort && fieldSort === "id") {
            setSortId(!sortId)
            let _listProjectbyUser = _.cloneDeep(listProjectbyUser)
            _listProjectbyUser = _.orderBy(_listProjectbyUser, [fieldSort], [sortBy])
            setListProjectbyUser(_listProjectbyUser)
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
        }
        if (fieldSort === "createdAt") {
            setSortTime(!sorttime)
            let _listProjectbyUser = _.cloneDeep(listProjectbyUser)
            _listProjectbyUser = _.orderBy(_listProjectbyUser, [fieldSort], [sortBy])
            setListProjectbyUser(_listProjectbyUser)
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
        }
        if (fieldSort === "total") {
            setSortmoney(!sortmoney)
            let _listProjectbyUser = _.cloneDeep(listProjectbyUser)
            _listProjectbyUser = _.orderBy(_listProjectbyUser, [fieldSort], [sortBy])
            setListProjectbyUser(_listProjectbyUser)
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
        }

    }

    const handleShowNotificationCreateSuccess = async () => {
        setShowNotificationCreateSuccess(!showNotificationCreateSuccess)
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
    }


    const handleSearch = debounce(async (event) => {

        let data = event.target.value
        if (data) {
            setSortDataSearchWithTime(false)
            setstartDateCalendar("")
            setendDateCalendar("")
            setSortDataSearch(true)


            let res = await getDataSearch(data, user.account.phone)
            if (res && +res.EC === 0) {
                let data = res.DT
                let resultsFindProjectByUser = data.filter(item => +item.statusPaymentId === 2)

                setListDataSearchNotime(resultsFindProjectByUser)
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
            }

        }
        if (!data) {
            setSortDataSearch(false)
            await fetchProjectUser()

        }
    }, 300)



    const handleShowHideModalCreatNewProject = async () => {
        setShowModalCreatNewProject(!showModalCreatNewProject)
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
    }

    const handleViewProduct = async (item) => {
        history.push(`/detailProduct/${item.id}`)
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
    }


    const handlePageClick = (event) => {

        setCurrentPage(+event.selected + 1)


        localStorage.setItem("infomation Page 1", event.selected + 1)


    }
    const handledeleteSortTime = async () => {
        setstartDateCalendar("")
        setendDateCalendar("")
        await fetchProjectUser()
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
    }

    const fetchProjectUser = async () => {
        let statuspaymentId = 2
        let res = await getProjectWithPaginationStatusPayment(+currentPage, +currentLimit, user.account.phone, +statuspaymentId)


        if (res && +res.EC === 0) {
            SetIsLoadingOne(true)

            setTotalPage(+res.DT.totalPage)
            if (res.DT.totalPage > 0 && res.DT.dataProject.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await getProjectWithPaginationStatusPayment(+res.DT.totalPage, +currentLimit, user.account.phone, +statuspaymentId)
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
            }
            if (res.DT.totalPage > 0 && res.DT.dataProject.length > 0) {
                let data = res.DT.dataProject
                let resultsFindProjectByUser = data.filter(item => item.createdBy === user.account.phone)

                if (resultsFindProjectByUser) {

                    if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupWithRound?.name === "Dev") {
                        await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                    }
                    setListProjectbyUser(resultsFindProjectByUser)

                }
                if (!resultsFindProjectByUser) {
                    if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupWithRound?.name === "Dev") {
                        await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                    }
                    setListProjectbyUser([])

                }
            } if (res.DT.totalPage === 0 && res.DT.dataProject.length === 0) {
                let data = res.DT.dataProject
                if (data && data.length > 0) {
                    setListProjectbyUser(data)
                    if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupWithRound?.name === "Dev") {
                        await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                    }
                } else {
                    setListProjectbyUser([])
                    if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupWithRound?.name === "Dev") {
                        await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                    }

                }
            }

        }


    }


    useEffect(() => {
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
        fetchProjectUser();
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('page', currentPage);
        currentUrlParams.set("limit", currentLimit);

        history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }, [currentPage])



    const dataWithSortTime = async () => {
        let res = await getDataWithTime(StartDateCalendar, endDateCalendar)
        if (StartDateCalendar && endDateCalendar) {
            setSortDataSearchWithTime(true)
            setSortDataSearch(false)

            if (res && +res.EC === 0) {
                let data = res.DT
                let resultsSearch = data.filter(item => item?.createdBy === user.account.phone)
                setListDataSearch(resultsSearch)
                setIsOpenCalendar(false)
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
            } else {
                setSortDataSearchWithTime(false)

                await fetchProjectUser()

            }
        } else {
            setSortDataSearchWithTime(false)

        }

    }
    useEffect(() => {
        dataWithSortTime()
        setIsOpenCalendar(false)
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
    }, [StartDateCalendar, endDateCalendar])

    const getDataWithcurrentPage = async () => {
        let statuspaymentId = 2
        let currentPageAfterRefesh = +localStorage.getItem("infomation Page 1")
        let res = await getProjectWithPaginationStatusPayment(currentPageAfterRefesh, +currentLimit, user.account.phone, +statuspaymentId)
        if (res && +res.EC === 0) {
            SetIsLoadingOne(true)
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
            setTotalPage(+res.DT.totalPage)
            if (res.DT.totalPage > 0 && res.DT.dataProject.length === 0) {
                setCurrentPage(+res.DT.totalPage)
                await getProjectWithPaginationStatusPayment(+res.DT.totalPage, +currentLimit, user.account.phone, +statuspaymentId)
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
            }
            if (res.DT.totalPage > 0 && res.DT.dataProject.length > 0) {
                let data = res.DT.dataProject
                let resultsFindProjectByUser = data.filter(item => item.createdBy === user.account.phone)
                let results = resultsFindProjectByUser.filter(item => item.statusPaymentId === 2)

                if (results) {
                    setListProjectbyUser(results)
                    if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupWithRound?.name === "Dev") {
                        await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                    }
                }
                if (!results) {
                    setListProjectbyUser([])
                    if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                        await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                    }
                    if (user?.account?.groupWithRound?.name === "Dev") {
                        await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                    }
                }
            }

        }
        else {
            toast.error(res.EM)
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
        }
    }


    useEffect(() => {
        localStorage.setItem("infomation Page 1", 1)

    }, [])


    useEffect(() => {
        window.history.pushState('', '', `?page=${localStorage.getItem("infomation Page 1")}&limit=${currentLimit}`);
        getDataWithcurrentPage()
        if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
            getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
        }
        if (user?.account?.groupWithRound?.name === "Dev") {
            getALlListNotification(+user.account.shippingUnit_Id, "Dev")
        }
    }, [window.location.reload])



    const [collapsed, setCollapsed] = useState(false)

    const checkValueDate = () => {
        setValidInput(ValidInputsDefault)
        let arr = ["name_Product", "number", "unit", "salesChannel", "money", "price_drop", "StatusPaymentId", "paid", "totalMoney", "unit_money",
            "customer_name", "customer_name_phone", "age",
            "Province_customer", "District_customer", "Ward_customer", "detail_address_customer",
            "Province_of_receipt", "District_of_receipt", "Ward_of_receipt", "Detail_Place_of_receipt",
            "shippingUnitId", "From_address",
            "To_address", "shipping_Cost", "Mode_of_payment"
        ]
        let check = true
        const re = /^[0-9\b]+$/;
        const regxPhone = /^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/;


        if (userdata[arr[0]] === "sản phẩm") {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[0]] = false
            setValidInput(_validInput)
            toast.error(`Empty input ${arr[0]}`)
            return;
        }
        if (userdata[arr[1]] && !re.test(userdata[arr[1]])) {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[1]] = false
            setValidInput(_validInput)
            toast.error("number only or number greater than 0")
            return;
        }

        if (+userdata[arr[1]] > +numberProduct) {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[1]] = false
            setValidInput(_validInput)
            toast.error("numberProduct selected  greater than numberProduct in warehouse")
            return
        }
        if (userdata[arr[3]] && !re.test(userdata[arr[3]])) {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[3]] = false
            setValidInput(_validInput)
            toast.error("money is number only or money greater than 0")
            return;
        }
        if (userdata[arr[4]] && !re.test(userdata[arr[4]])) {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[4]] = false
            setValidInput(_validInput)
            toast.error("price_drop is number only or price_drop greater than 0")
            return;

        }

        if (userdata[arr[6]] && !re.test(userdata[arr[6]])) {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[6]] = false
            setValidInput(_validInput)
            toast.error("paid is number only")
            return;

        }
        if (userdata[arr[7]] < 0) {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[7]] = false
            setValidInput(_validInput)
            toast.error("total money is number only greater than 0")
            return;

        }

        if (userdata[arr[11]] && !regxPhone.test(userdata[arr[11]])) {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[11]] = false
            setValidInput(_validInput)
            toast.error("please enter a valid Phone Number")
            return;

        }

        if (userdata[arr[12]] && !re.test(userdata[arr[12]])) {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[12]] = false
            setValidInput(_validInput)
            toast.error("age is number only")
            return;

        }
        if (userdata[arr[10]] && userdata[arr[10]] === "Tỉnh/thành phố") {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[10]] = false
            setValidInput(_validInput)
            toast.error("Empty Province customer")
            return;

        }
        if (userdata[arr[12]] && userdata[arr[12]] === "Quận/huyện") {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[12]] = false
            setValidInput(_validInput)
            toast.error("Empty District customer")
            return;

        }
        if (userdata[arr[13]] && userdata[arr[13]] === "Phường/xã") {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[13]] = false
            setValidInput(_validInput)
            toast.error("Empty Ward customer")
            return;

        }

        if (userdata[arr[15]] && userdata[arr[15]] === "Tỉnh/thành phố") {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[15]] = false
            setValidInput(_validInput)
            toast.error("Empty Province Of Receipt")
            return;

        }
        if (userdata[arr[16]] && userdata[arr[16]] === "Quận/huyện") {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[16]] = false
            setValidInput(_validInput)
            toast.error("Empty District Of Receipt")
            return;

        }
        if (userdata[arr[17]] && userdata[arr[17]] === "Phường/xã") {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput[arr[17]] = false
            setValidInput(_validInput)
            toast.error("Empty Ward Of Receipt")
            return;

        }
        if (userdata[arr[25]] === "Nhận tiền thanh toán qua tài khoản ngân hàng" && !userdata.name_account) {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput.name_account = false
            setValidInput(_validInput)
            toast.error("can not empty Account name")
            return;
        }
        if (userdata[arr[25]] === "Nhận tiền thanh toán qua tài khoản ngân hàng" && !userdata.Bank_name) {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput.Bank_name = false
            setValidInput(_validInput)
            toast.error("can not empty Bank name")
            return;
        }
        if (userdata[arr[25]] === "Nhận tiền thanh toán qua tài khoản ngân hàng" && !userdata.Main_Account) {
            let _validInput = _.cloneDeep(ValidInputsDefault);
            _validInput.Main_Account = false
            setValidInput(_validInput)
            toast.error("can not empty Main Account")
            return;
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

        }
        return check
    }






    const handleConfirmUser = async () => {
        console.log("userdata", userdata)
        let check = checkValueDate();

        if (check === true && previreImage.length === 0) {
            toast.error("please add image !!!")

        }
        if (check === true && previreImage.length > 0 && selecCheckSubtmitImage === false) {
            toast.error("please save image !!!")
            return
        }

        if (check === true && previreImage && previreImage.length > 0 && selecCheckSubtmitImage === true) {

            let res =

                await CreateProject({ ...userdata })

            if (res && +res.EC === 0) {
                setProductAfterCreate(res.DT)


                let projectId = res.DT.id
                let order = res.DT.order
                let data = await fetchImagebyOrder(order)

                if (data && +data.EC === 0) {
                    let ImageId = data.DT;
                    await assignDataToProjectImage(projectId, ImageId)



                } else {
                    toast.error(res.EM)

                }

                setSelecCheckSubtmitImage(false)
                setShowModalCreatNewProject(false)
                setUserdata(defaultUserData)
                setprevireImage("")
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
                await fetchProjectUser()
                setShowNotificationCreateSuccess(true)


            } else {
                toast.error(res.EM)
                if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                    await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
                }
                if (user?.account?.groupWithRound?.name === "Dev") {
                    await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
                }
            }
        }

    }
    const handleExportData = () => {
        if (listProjectbyUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listProjectbyUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "listProduct");
            XLSX.writeFile(workbook, "ExportListProduct.csv")
        }
    }
    const handleCreateFlag = async (item) => {
        let res = await updateProject({ ...item, flag: true })
        if (res && +res.EC === 0) {
            setSortDataSearch(false)
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
            await fetchProjectUser()
        }
    }
    const handleCancelFlag = async (item) => {
        let res = await updateProject({ ...item, flag: false })
        if (res && +res.EC === 0) {
            setSortDataSearch(false)
            await fetchProjectUser()
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
        }
    }
    return (
        <div className='Contact-container'>
            <div className='left d-none d-lg-block '>
                <Sidebar collapsed={collapsed} />

            </div>

            <div className='right  '>
                <div className='btn-toggle d-none d-lg-block'>
                    <span onClick={() => setCollapsed(!collapsed)} className=" d-sm-block ">
                        {collapsed === false ?
                            <i className="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
                            :
                            <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>

                        }
                    </span>
                </div>
                <div className='right-body '>
                    <div className='container'>
                        <div className='row'>
                            <div className='header mt-2'>
                                <div className='container'>
                                    <div className='row'>
                                        <div className='location-path col-12 col-lg-6'>
                                            <Link to="/"> Home</Link>

                                            <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                            </span>
                                            <Link to="/Products"> Product manager </Link>
                                        </div>
                                        <div className='col-12 mt-2 col-lg-6 search'>
                                            <div className='search-icon'>
                                                <i className="fa fa-search" aria-hidden="true"></i>

                                            </div>
                                            <input
                                                type="text"
                                                placeholder='Search infomation'
                                                onChange={(event) => handleSearch(event)}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className='body '>
                                <div className="container">
                                    <div className='row  '>
                                        <div className='name-page d-none d-lg-block col-lg-12'>
                                            <div className='row'>

                                                <div className='title_name_page col-7'>
                                                    <h4>
                                                        {t('Product.tittleOne')}
                                                    </h4>
                                                    <Link to="/dashboard_Product" style={{ textDecoration: "none", color: "#474141" }}>
                                                        <button className='btn btn-primary'>
                                                            <span>
                                                                <i class="fa fa-line-chart" aria-hidden="true"></i>
                                                            </span>
                                                            <span className='mx-3'>
                                                                {t('Product.tittleTwo')}
                                                            </span>
                                                        </button>
                                                    </Link>
                                                </div>
                                                <div className='more col-5 '>

                                                    <button className='btn btn-warning' onClick={() => handleExportData()}>
                                                        <i class="fa fa-cloud-download" aria-hidden="true"></i>
                                                        {t('Product.tittleThree')}
                                                    </button>
                                                    <button className='btn btn-primary' onClick={() => handleShowHideModalCreatNewProject()}>
                                                        <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                                        {t('Product.tittleFour')}
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                        <div className='name-page d-block d-lg-none col-lg-12'>
                                            {/* mobile */}

                                            <div className='row'>

                                                <div className='title_name_page-mobile col-12'>
                                                    <h4>
                                                        {t('Product.tittleOne')}
                                                    </h4>
                                                    <Link to="/dashboard_Product" style={{ textDecoration: "none", color: "#474141" }}>
                                                        <button className='btn btn-primary'>
                                                            <span>
                                                                <i class="fa fa-line-chart" aria-hidden="true"></i>
                                                            </span>
                                                            <span className='mx-3'>
                                                                {t('Product.tittleTwo')}
                                                            </span>
                                                        </button>
                                                    </Link>
                                                </div>
                                                <div className='more-mobile mx-2 '>
                                                    <div className='container'>
                                                        <div className='row d-flex align-item-center justify-content-center '>
                                                            <button className='btn btn-warning col-5 my-3' onClick={() => handleExportData()}>
                                                                <span className='mx-1' style={{ fontSize: "13px" }}>{t('Product.tittleThree')}</span>
                                                            </button>
                                                            <div className='col-2'></div>
                                                            <button className='btn btn-primary col-5 my-3' style={{ fontSize: "13px" }} onClick={() => handleShowHideModalCreatNewProject()}>
                                                                <span className='mx-1'>{t('Product.tittleFour')}</span>
                                                            </button>
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>

                                        </div>
                                        <div className='table-wrapper'>
                                            <div className='row'>
                                                <div className=' d-none d-lg-block col-lg-12'>
                                                    <div className='header-table'>
                                                        <span onClick={() => handlegetAllProject()} style={{ borderBottom: "6px solid white " }} >
                                                            <Link to="/Products" style={{ textDecoration: "none", color: "#474141" }}>
                                                                {t('Product.tittleTable')}
                                                            </Link>
                                                        </span>
                                                        <span style={{ borderBottom: "6px solid #61dafb" }}>
                                                            {t('Product.tittleTableOne')}
                                                        </span>
                                                        <span style={{ borderBottom: "6px solid white" }}>
                                                            <Link to="/ProductsWithStatusdeliveryNull" style={{ textDecoration: "none", color: "#474141" }}>
                                                                {t('Product.tittleTableTwo')}
                                                            </Link>

                                                        </span>
                                                        <span style={{ borderBottom: "6px solid white" }}>
                                                            <Link to="/ProductsWithStatusdeliveryOne" style={{ textDecoration: "none", color: "#474141" }}>
                                                                {t('Product.tittleTableThree')}
                                                            </Link>

                                                        </span>
                                                        <span style={{ borderBottom: "6px solid white" }}>
                                                            <Link to="/ProductsWithStatusdeliveryTwo" style={{ textDecoration: "none", color: "#474141" }}>
                                                                {t('Product.tittleTableFoure')}
                                                            </Link>
                                                        </span>

                                                    </div>

                                                </div>
                                                <div className=' d-block d-lg-none col-lg-12'>
                                                    {/* mobile */}
                                                    <div className='header-table-mobile'>
                                                        <span onClick={() => handlegetAllProject()} style={{ borderBottom: "6px solid white " }} >
                                                            <Link to="/Products" style={{ textDecoration: "none", color: "#474141" }}>
                                                                {t('Product.tittleTable')}
                                                            </Link>
                                                        </span>
                                                        <span style={{ borderBottom: "6px solid #61dafb" }}>
                                                            {t('Product.tittleTableOne')}
                                                        </span>
                                                        <span style={{ borderBottom: "6px solid white" }}>
                                                            <Link to="/ProductsWithStatusdeliveryNull" style={{ textDecoration: "none", color: "#474141" }}>
                                                                {t('Product.tittleTableTwo')}
                                                            </Link>

                                                        </span>
                                                        <span style={{ borderBottom: "6px solid white" }}>
                                                            <Link to="/ProductsWithStatusdeliveryOne" style={{ textDecoration: "none", color: "#474141" }}>
                                                                {t('Product.tittleTableThree')}
                                                            </Link>

                                                        </span>
                                                        <span style={{ borderBottom: "6px solid white" }}>
                                                            <Link to="/ProductsWithStatusdeliveryTwo" style={{ textDecoration: "none", color: "#474141" }}>
                                                                {t('Product.tittleTableFoure')}
                                                            </Link>
                                                        </span>

                                                    </div>

                                                </div>
                                                <div className='title d-flex align-items-center justify-content-center my-2'>
                                                    <div className='container '>
                                                        <div className='row mobile'>
                                                            <div className='col-12 col-lg-3' style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                {t('Product.TimeTittle')}
                                                            </div>
                                                            <div className='col-12 col-lg-2'>
                                                                <input
                                                                    className="form-control my-3 "
                                                                    readOnly
                                                                    value={StartDateCalendar}
                                                                />
                                                            </div>
                                                            <div className='col-1' style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                <i class="fa fa-arrow-right" aria-hidden="true"></i>
                                                            </div>
                                                            <div className='col-12 col-lg-2'>
                                                                <input
                                                                    className="form-control my-3 "
                                                                    readOnly
                                                                    value={endDateCalendar}
                                                                />
                                                            </div>
                                                            <div className='col-6 col-lg-2 '
                                                                style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "black" }}
                                                                onClick={() => setIsOpenCalendar(!isOpenCalendar)}
                                                                title='Lọc đơn hàng theo thời gian'
                                                            >
                                                                <button className='btn btn-primary'>
                                                                    {t('Product.tittleTimeSelectButton')}
                                                                </button>

                                                            </div>

                                                            <div className='col-6 col-lg-2'
                                                                style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "black" }}
                                                                onClick={() => handledeleteSortTime()}
                                                                title='xóa thời gian đã chọn'
                                                            >

                                                                <button className='btn btn-danger'>
                                                                    {t('Product.tittleTimeDeleteButton')}

                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className='row '>
                                                            <div className='col-12 mt-3' ref={refCalendar} style={{ overflow: "auto" }}>
                                                                {isOpenCalendar === true &&
                                                                    <DateRangePicker
                                                                        onChange={item => handleChangDate(item)}
                                                                        showSelectionPreview={true}
                                                                        moveRangeOnFirstSelection={false}
                                                                        months={2}
                                                                        ranges={stateDate}
                                                                        direction="horizontal"
                                                                    />
                                                                }

                                                            </div>
                                                        </div>


                                                    </div>


                                                </div>

                                                <hr />
                                                {isLoadingOne === true
                                                    ?
                                                    <>
                                                        <div className='body-table d-none d-lg-block'>
                                                            <div className=' d-none d-lg-block col-lg-12'>
                                                                <div className='d-flex align-item-center justify-content-between flex-column'>
                                                                    <div className='my-2 d-flex align-item-center justify-content-around gap-3'>
                                                                        <div className='my-2 d-flex align-item-center gap-2'>
                                                                            <div style={{ backgroundColor: "blue", width: "30px", height: "30px", borderRadius: "50%" }}></div>
                                                                            <div style={{ fontSize: "20px", fontWeight: "700" }}>
                                                                                {t('Product.tittleBodyOne')}
                                                                            </div>
                                                                        </div>
                                                                        <div className='my-2 d-flex align-item-center gap-2'>
                                                                            <div style={{ backgroundColor: "violet", width: "30px", height: "30px", borderRadius: "50%" }}></div>
                                                                            <div style={{ fontSize: "20px", fontWeight: "700" }}>
                                                                                {t('Product.tittleBodyTwo')}
                                                                            </div>
                                                                        </div>
                                                                        <div className='my-2 d-flex align-item-center gap-2'>
                                                                            <div style={{ backgroundColor: "#A0522D", width: "30px", height: "30px", borderRadius: "50%" }}></div>
                                                                            <div style={{ fontSize: "20px", fontWeight: "700" }}>
                                                                                {t('Product.tittleBodyThree')}
                                                                            </div>
                                                                        </div>

                                                                    </div>

                                                                    {sortDataSearch === false && sortDataSearchWithTime === false
                                                                        &&
                                                                        <div className='pagination'>

                                                                            < ReactPaginate
                                                                                nextLabel="next >"
                                                                                onPageChange={handlePageClick}
                                                                                pageRangeDisplayed={2}
                                                                                marginPagesDisplayed={2}
                                                                                pageCount={totalPage}
                                                                                previousLabel="< previous"
                                                                                pageClassName="page-item"
                                                                                pageLinkClassName="page-link"
                                                                                previousClassName="page-item"
                                                                                previousLinkClassName="page-link"
                                                                                nextClassName="page-item"
                                                                                nextLinkClassName="page-link"
                                                                                breakLabel="..."
                                                                                breakClassName="page-item"
                                                                                breakLinkClassName="page-link"
                                                                                containerClassName="pagination"
                                                                                activeClassName="active"
                                                                                renderOnZeroPageCount={null}
                                                                                forcePage={+currentPage - 1}

                                                                            />
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>

                                                            <table className="table table-set table-hover ">
                                                                <thead className='table-success'>
                                                                    <tr>
                                                                        <th></th>
                                                                        <th scope="col">
                                                                            {t('Product.tittleBodyOrdersOne')}

                                                                        </th>
                                                                        {sortDataSearch === false && sortDataSearchWithTime === false
                                                                            &&
                                                                            <th scope="col" >
                                                                                {t('Product.tittleBodyOrdersTwo')}

                                                                            </th>
                                                                        }
                                                                        <th scope="col" style={{ width: "50px" }} >
                                                                            {t('Product.tittleBodyOrdersThree')}

                                                                        </th>
                                                                        <th scope="col" style={{ width: "70px" }} >
                                                                            {sortId === true ?
                                                                                <span>
                                                                                    {t('Product.tittleBodyOrdersFour')}
                                                                                    <span style={{ paddingLeft: "10px", cursor: "pointer" }}
                                                                                    >
                                                                                        <span onClick={() =>
                                                                                            handleChangsortItem("desc", "id")}
                                                                                        >
                                                                                            <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                                                                                        </span>

                                                                                    </span>
                                                                                </span>
                                                                                :
                                                                                <span>
                                                                                    {t('Product.tittleBodyOrdersFour')}
                                                                                    <span style={{ paddingLeft: "10px", cursor: "pointer" }}
                                                                                    >
                                                                                        <span onClick={() =>
                                                                                            handleChangsortItem("asc", "id")}
                                                                                        >
                                                                                            <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
                                                                                        </span>

                                                                                    </span>
                                                                                </span>
                                                                            }


                                                                        </th>

                                                                        <th>
                                                                            {sorttime === true ?
                                                                                <span>
                                                                                    {t('Product.tittleBodyOrdersFive')}
                                                                                    <span style={{ paddingLeft: "10px", cursor: "pointer" }}
                                                                                    >
                                                                                        <span onClick={() =>
                                                                                            handleChangsortItem("desc", "createdAt")}
                                                                                        >
                                                                                            <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                                                                                        </span>

                                                                                    </span>
                                                                                </span>
                                                                                :
                                                                                <span>
                                                                                    {t('Product.tittleBodyOrdersFive')}
                                                                                    <span style={{ paddingLeft: "10px", cursor: "pointer" }}
                                                                                    >
                                                                                        <span onClick={() =>
                                                                                            handleChangsortItem("asc", "createdAt")}
                                                                                        >
                                                                                            <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
                                                                                        </span>

                                                                                    </span>
                                                                                </span>
                                                                            }



                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdesSix')}

                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdesSeven')}
                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdesEight')}

                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdesNight')}

                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdesTen')}

                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdeseleven')}

                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdestwelve')}

                                                                        </th>

                                                                    </tr>
                                                                </thead>

                                                                {sortDataSearch === false && sortDataSearchWithTime === false
                                                                    &&
                                                                    < tbody >

                                                                        {listProjectbyUser && listProjectbyUser.length > 0
                                                                            ?

                                                                            listProjectbyUser.map((item, index) => {
                                                                                return (
                                                                                    <>    <tr key={`row-${index}`}>
                                                                                        {item?.flag === true ?
                                                                                            <td>
                                                                                                <span style={{ fontSize: "20px", color: "red" }}>
                                                                                                    <i class="fa fa-flag" aria-hidden="true"></i>
                                                                                                </span>
                                                                                            </td>
                                                                                            :
                                                                                            <td></td>

                                                                                        }

                                                                                        {item?.done_status == 1
                                                                                            &&
                                                                                            <td>
                                                                                                <div class="form-check">
                                                                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" checked />

                                                                                                </div>
                                                                                            </td>

                                                                                        }
                                                                                        {item?.done_status == 0
                                                                                            &&
                                                                                            <td>
                                                                                                <div class="form-check">
                                                                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" disabled />

                                                                                                </div>
                                                                                            </td>

                                                                                        }

                                                                                        <td scope="row">{(currentPage - 1) * currentLimit + index + 1}</td>

                                                                                        <td scope="row">{item.order}

                                                                                        </td>
                                                                                        <td scope="row" >{item.id}</td>
                                                                                        {/* <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td> */}
                                                                                        <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                                                        <td>{item?.name_customer?.toLocaleUpperCase() ? item?.name_customer?.toLocaleUpperCase() : "chưa cập nhật "}</td>
                                                                                        <td>{item?.Warehouse?.product
                                                                                            ? item?.Warehouse?.product
                                                                                            : "chưa cập nhật "}
                                                                                        </td>
                                                                                        {item?.Status_Payment?.status === "Đã thanh toán toàn bộ"
                                                                                            &&
                                                                                            <td >{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "blue", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                :
                                                                                                "Đang xử lý"
                                                                                            }</td>

                                                                                        }
                                                                                        {item?.Status_Payment?.status === "Thanh toán khi giao hàng"
                                                                                            &&
                                                                                            <td style={{ color: "violet", fontWeight: "700" }}>{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "violet", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                : "Đang xử lý"}</td>

                                                                                        }
                                                                                        {item?.Status_Payment?.status === "Đã thanh toán trước một phần"
                                                                                            &&
                                                                                            <td style={{ color: "#A0522D", fontWeight: "700" }} >{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "#A0522D", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                : "Đang xử lý"}</td>

                                                                                        }


                                                                                        {item?.Status_Delivery?.status &&
                                                                                            <td > {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "Đang xử lý"}</td>

                                                                                        }
                                                                                        {!item?.Status_Delivery?.status &&
                                                                                            <td > {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "Đang xử lý"}</td>

                                                                                        }
                                                                                        <td>{item.total}</td>
                                                                                        <td>{item?.Sales_Channel?.name}</td>
                                                                                        <td >
                                                                                            <div className='d-flex'>
                                                                                                <button className='btn btn-primary' style={{ cursor: "pointer", borderRadius: "50%" }} title="Chi tiết đơn hàng" onClick={() => handleViewProduct(item)}>
                                                                                                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                                                                                                </button>
                                                                                                {item?.flag == 0 &&
                                                                                                    <button className='btn btn-danger mx-2' style={{ cursor: "pointer", borderRadius: "50%" }} title="Giục giao hàng nhanh" onClick={() => handleCreateFlag(item)} >
                                                                                                        <i class="fa fa-flag" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                }
                                                                                                {item?.flag == 1 &&
                                                                                                    <button className='btn btn-danger mx-2' style={{ cursor: "pointer", borderRadius: "50%" }} title="Tắt giục giao hàng nhanh" onClick={() => handleCancelFlag(item)} >
                                                                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                }
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>

                                                                                    </>
                                                                                )
                                                                            })
                                                                            :
                                                                            <tr>
                                                                                <td colSpan={13}>
                                                                                    <div className='image'>
                                                                                        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/open-box-7072010-5751948.png?f=webp" alt="" />
                                                                                        <h3> Not Found</h3>

                                                                                    </div>
                                                                                </td>

                                                                            </tr>

                                                                        }



                                                                    </tbody>
                                                                }



                                                                {sortDataSearch === true && sortDataSearchWithTime === false &&
                                                                    < tbody >
                                                                        {listDataSearchNotime && listDataSearchNotime.length > 0
                                                                            ?

                                                                            listDataSearchNotime.map((item, index) => {
                                                                                return (
                                                                                    <>    <tr key={`row-${index}`}>
                                                                                        {item?.flag === true ?
                                                                                            <td>
                                                                                                <span style={{ fontSize: "20px", color: "red" }}>
                                                                                                    <i class="fa fa-flag" aria-hidden="true"></i>
                                                                                                </span>
                                                                                            </td>
                                                                                            :
                                                                                            <td></td>

                                                                                        }

                                                                                        {item?.done_status == 1
                                                                                            &&
                                                                                            <td>
                                                                                                <div class="form-check">
                                                                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" checked />

                                                                                                </div>
                                                                                            </td>

                                                                                        }
                                                                                        {item?.done_status == 0
                                                                                            &&
                                                                                            <td>
                                                                                                <div class="form-check">
                                                                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" disabled />

                                                                                                </div>
                                                                                            </td>

                                                                                        }


                                                                                        <td scope="row">{item.order}

                                                                                        </td>
                                                                                        <td scope="row" >{item.id}</td>
                                                                                        {/* <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td> */}
                                                                                        <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                                                        <td>{item?.name_customer?.toLocaleUpperCase() ? item?.name_customer?.toLocaleUpperCase() : "chưa cập nhật "}</td>
                                                                                        <td>{item?.Warehouse?.product
                                                                                            ? item?.Warehouse?.product
                                                                                            : "chưa cập nhật "}
                                                                                        </td>
                                                                                        {item?.Status_Payment?.status === "Đã thanh toán toàn bộ"
                                                                                            &&
                                                                                            <td >{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "blue", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                :
                                                                                                "Đang xử lý"
                                                                                            }</td>

                                                                                        }
                                                                                        {item?.Status_Payment?.status === "Thanh toán khi giao hàng"
                                                                                            &&
                                                                                            <td style={{ color: "violet", fontWeight: "700" }}>{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "violet", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                : "Đang xử lý"}</td>

                                                                                        }
                                                                                        {item?.Status_Payment?.status === "Đã thanh toán trước một phần"
                                                                                            &&
                                                                                            <td style={{ color: "#A0522D", fontWeight: "700" }} >{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "#A0522D", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                : "Đang xử lý"}</td>

                                                                                        }


                                                                                        {item?.Status_Delivery?.status &&
                                                                                            <td > {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "Đang xử lý"}</td>

                                                                                        }
                                                                                        {!item?.Status_Delivery?.status &&
                                                                                            <td > {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "Đang xử lý"}</td>

                                                                                        }
                                                                                        <td>{item.total}</td>
                                                                                        <td>{item?.Sales_Channel?.name}</td>
                                                                                        <td >
                                                                                            <div className='d-flex'>
                                                                                                <button className='btn btn-primary' style={{ cursor: "pointer", borderRadius: "50%" }} title="Chi tiết đơn hàng" onClick={() => handleViewProduct(item)}>
                                                                                                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                                                                                                </button>
                                                                                                {item?.flag == 0 &&
                                                                                                    <button className='btn btn-danger mx-2' style={{ cursor: "pointer", borderRadius: "50%" }} title="Giục giao hàng nhanh" onClick={() => handleCreateFlag(item)} >
                                                                                                        <i class="fa fa-flag" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                }
                                                                                                {item?.flag == 1 &&
                                                                                                    <button className='btn btn-danger mx-2' style={{ cursor: "pointer", borderRadius: "50%" }} title="Tắt giục giao hàng nhanh" onClick={() => handleCancelFlag(item)} >
                                                                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                }
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>

                                                                                    </>
                                                                                )
                                                                            })
                                                                            :
                                                                            <tr>
                                                                                <td colSpan={13}>
                                                                                    <div className='image'>
                                                                                        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/open-box-7072010-5751948.png?f=webp" alt="" />
                                                                                        <h3> Not Found</h3>

                                                                                    </div>
                                                                                </td>

                                                                            </tr>

                                                                        }




                                                                    </tbody>
                                                                }
                                                                {sortDataSearchWithTime === true && sortDataSearch === false
                                                                    &&
                                                                    < tbody >
                                                                        {listDataSearch && listDataSearch.length > 0
                                                                            ?
                                                                            listDataSearch.map((item, index) => {
                                                                                return (
                                                                                    <>    <tr key={`row-${index}`}>
                                                                                        {item?.flag === true ?
                                                                                            <td>
                                                                                                <span style={{ fontSize: "20px", color: "red" }}>
                                                                                                    <i class="fa fa-flag" aria-hidden="true"></i>
                                                                                                </span>
                                                                                            </td>
                                                                                            :
                                                                                            <td></td>

                                                                                        }

                                                                                        {item?.done_status == 1
                                                                                            &&
                                                                                            <td>
                                                                                                <div class="form-check">
                                                                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" checked />

                                                                                                </div>
                                                                                            </td>

                                                                                        }
                                                                                        {item?.done_status == 0
                                                                                            &&
                                                                                            <td>
                                                                                                <div class="form-check">
                                                                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" disabled />

                                                                                                </div>
                                                                                            </td>

                                                                                        }


                                                                                        <td scope="row">{item.order}

                                                                                        </td>
                                                                                        <td scope="row" >{item.id}</td>
                                                                                        {/* <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td> */}
                                                                                        <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                                                        <td>{item?.name_customer?.toLocaleUpperCase() ? item?.name_customer?.toLocaleUpperCase() : "chưa cập nhật "}</td>
                                                                                        <td>{item?.Warehouse?.product
                                                                                            ? item?.Warehouse?.product
                                                                                            : "chưa cập nhật "}
                                                                                        </td>
                                                                                        {item?.Status_Payment?.status === "Đã thanh toán toàn bộ"
                                                                                            &&
                                                                                            <td >{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "blue", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                :
                                                                                                "Đang xử lý"
                                                                                            }</td>

                                                                                        }
                                                                                        {item?.Status_Payment?.status === "Thanh toán khi giao hàng"
                                                                                            &&
                                                                                            <td style={{ color: "violet", fontWeight: "700" }}>{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "violet", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                : "Đang xử lý"}</td>

                                                                                        }
                                                                                        {item?.Status_Payment?.status === "Đã thanh toán trước một phần"
                                                                                            &&
                                                                                            <td style={{ color: "#A0522D", fontWeight: "700" }} >{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "#A0522D", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                : "Đang xử lý"}</td>

                                                                                        }


                                                                                        {item?.Status_Delivery?.status &&
                                                                                            <td > {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "Đang xử lý"}</td>

                                                                                        }
                                                                                        {!item?.Status_Delivery?.status &&
                                                                                            <td > {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "Đang xử lý"}</td>

                                                                                        }
                                                                                        <td>{item.total}</td>
                                                                                        <td>{item?.Sales_Channel?.name}</td>
                                                                                        <td >
                                                                                            <div className='d-flex'>
                                                                                                <button className='btn btn-primary' style={{ cursor: "pointer", borderRadius: "50%" }} title="Chi tiết đơn hàng" onClick={() => handleViewProduct(item)}>
                                                                                                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                                                                                                </button>
                                                                                                {item?.flag == 0 &&
                                                                                                    <button className='btn btn-danger mx-2' style={{ cursor: "pointer", borderRadius: "50%" }} title="Giục giao hàng nhanh" onClick={() => handleCreateFlag(item)} >
                                                                                                        <i class="fa fa-flag" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                }
                                                                                                {item?.flag == 1 &&
                                                                                                    <button className='btn btn-danger mx-2' style={{ cursor: "pointer", borderRadius: "50%" }} title="Tắt giục giao hàng nhanh" onClick={() => handleCancelFlag(item)} >
                                                                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                }
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>

                                                                                    </>
                                                                                )
                                                                            })
                                                                            :
                                                                            <tr>
                                                                                <td colSpan={13}>
                                                                                    <div className='image'>
                                                                                        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/open-box-7072010-5751948.png?f=webp" alt="" />
                                                                                        <h3> Not Found</h3>

                                                                                    </div>
                                                                                </td>

                                                                            </tr>

                                                                        }



                                                                    </tbody>
                                                                }

                                                            </table>
                                                        </div>

                                                        <div className='body-table d-block d-lg-none'>

                                                            <div className=' d-block d-lg-none col-lg-12 mobile'>
                                                                {/* mobile */}
                                                                <div className='row'>
                                                                    <div className='my-2 col-12 '>

                                                                        <div style={{ backgroundColor: "blue", width: "30px", height: "30px", borderRadius: "50%", margin: "auto" }}></div>
                                                                        <div className='item' style={{ fontSize: "20px", fontWeight: "700" }}>
                                                                            {t('Product.tittleBodyOne')}
                                                                        </div>
                                                                    </div>
                                                                    <div className='my-2 col-12'>
                                                                        <div style={{ backgroundColor: "violet", width: "30px", height: "30px", borderRadius: "50%", margin: "auto" }}></div>
                                                                        <div className='item' style={{ fontSize: "20px", fontWeight: "700" }}>
                                                                            {t('Product.tittleBodyTwo')}
                                                                        </div>
                                                                    </div>
                                                                    <div className='my-2 col-12'>
                                                                        <div style={{ backgroundColor: "#A0522D", width: "30px", height: "30px", borderRadius: "50%", margin: "auto" }}></div>
                                                                        <div className='item' style={{ fontSize: "20px", fontWeight: "700" }}>
                                                                            {t('Product.tittleBodyThree')}
                                                                        </div>
                                                                    </div>

                                                                </div>

                                                                {sortDataSearch === false && sortDataSearchWithTime === false
                                                                    &&

                                                                    <div className='pagination-mobile my-3'>
                                                                        < ReactPaginate
                                                                            nextLabel="next >"
                                                                            onPageChange={handlePageClick}
                                                                            pageRangeDisplayed={1}
                                                                            marginPagesDisplayed={1}
                                                                            pageCount={totalPage}
                                                                            previousLabel="< previous"
                                                                            pageClassName="page-item"
                                                                            pageLinkClassName="page-link"
                                                                            previousClassName="page-item"
                                                                            previousLinkClassName="page-link"
                                                                            nextClassName="page-item"
                                                                            nextLinkClassName="page-link"
                                                                            breakLabel="..."
                                                                            breakClassName="page-item"
                                                                            breakLinkClassName="page-link"
                                                                            containerClassName="pagination"
                                                                            activeClassName="active"
                                                                            renderOnZeroPageCount={null}
                                                                            forcePage={+currentPage - 1}

                                                                        />
                                                                    </div>


                                                                }
                                                            </div>
                                                            <table className="table table-set table-hover ">
                                                                <thead className='table-success'>
                                                                    <tr>
                                                                        <th></th>
                                                                        <th scope="col">
                                                                            {t('Product.tittleBodyOrdersOne')}

                                                                        </th>
                                                                        {sortDataSearch === false && sortDataSearchWithTime === false
                                                                            &&
                                                                            <th scope="col" >
                                                                                {t('Product.tittleBodyOrdersTwo')}

                                                                            </th>
                                                                        }
                                                                        <th scope="col" style={{ width: "50px" }} >
                                                                            {t('Product.tittleBodyOrdersThree')}

                                                                        </th>
                                                                        <th scope="col" style={{ width: "80px" }} >
                                                                            {sortId === true ?
                                                                                <span>
                                                                                    {t('Product.tittleBodyOrdersFour')}
                                                                                    <span style={{ paddingLeft: "10px", cursor: "pointer" }}
                                                                                    >
                                                                                        <span onClick={() =>
                                                                                            handleChangsortItem("desc", "id")}
                                                                                        >
                                                                                            <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                                                                                        </span>

                                                                                    </span>
                                                                                </span>
                                                                                :
                                                                                <span>
                                                                                    {t('Product.tittleBodyOrdersFour')}
                                                                                    <span style={{ paddingLeft: "10px", cursor: "pointer" }}
                                                                                    >
                                                                                        <span onClick={() =>
                                                                                            handleChangsortItem("asc", "id")}
                                                                                        >
                                                                                            <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
                                                                                        </span>

                                                                                    </span>
                                                                                </span>
                                                                            }


                                                                        </th>

                                                                        <th>
                                                                            {sorttime === true ?
                                                                                <span>
                                                                                    {t('Product.tittleBodyOrdersFive')}
                                                                                    <span style={{ paddingLeft: "10px", cursor: "pointer" }}
                                                                                    >
                                                                                        <span onClick={() =>
                                                                                            handleChangsortItem("desc", "createdAt")}
                                                                                        >
                                                                                            <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>
                                                                                        </span>

                                                                                    </span>
                                                                                </span>
                                                                                :
                                                                                <span>
                                                                                    {t('Product.tittleBodyOrdersFive')}
                                                                                    <span style={{ paddingLeft: "10px", cursor: "pointer" }}
                                                                                    >
                                                                                        <span onClick={() =>
                                                                                            handleChangsortItem("asc", "createdAt")}
                                                                                        >
                                                                                            <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
                                                                                        </span>

                                                                                    </span>
                                                                                </span>
                                                                            }



                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdesSix')}

                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdesSeven')}
                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdesEight')}

                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdesNight')}

                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdesTen')}

                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdeseleven')}

                                                                        </th>
                                                                        <th scope="col" >
                                                                            {t('Product.tittleBodyOrdestwelve')}

                                                                        </th>

                                                                    </tr>
                                                                </thead>

                                                                {sortDataSearch === false && sortDataSearchWithTime === false &&
                                                                    < tbody >

                                                                        {listProjectbyUser && listProjectbyUser.length > 0
                                                                            ?

                                                                            listProjectbyUser.map((item, index) => {
                                                                                return (
                                                                                    <>    <tr key={`row-${index}`}>
                                                                                        {item?.flag === true ?
                                                                                            <td>
                                                                                                <span style={{ fontSize: "20px", color: "red" }}>
                                                                                                    <i class="fa fa-flag" aria-hidden="true"></i>
                                                                                                </span>
                                                                                            </td>
                                                                                            :
                                                                                            <td></td>

                                                                                        }

                                                                                        {item?.done_status == 1
                                                                                            &&
                                                                                            <td>
                                                                                                <div class="form-check">
                                                                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" checked />

                                                                                                </div>
                                                                                            </td>

                                                                                        }
                                                                                        {item?.done_status == 0
                                                                                            &&
                                                                                            <td>
                                                                                                <div class="form-check">
                                                                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" disabled />

                                                                                                </div>
                                                                                            </td>

                                                                                        }

                                                                                        <td scope="row">{(currentPage - 1) * currentLimit + index + 1}</td>

                                                                                        <td scope="row">{item.order}

                                                                                        </td>
                                                                                        <td scope="row" >{item.id}</td>
                                                                                        {/* <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td> */}
                                                                                        <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                                                        <td>{item?.name_customer?.toLocaleUpperCase() ? item?.name_customer?.toLocaleUpperCase() : "chưa cập nhật "}</td>
                                                                                        <td>{item?.Warehouse?.product
                                                                                            ? item?.Warehouse?.product
                                                                                            : "chưa cập nhật "}
                                                                                        </td>
                                                                                        {item?.Status_Payment?.status === "Đã thanh toán toàn bộ"
                                                                                            &&
                                                                                            <td >{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "blue", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                :
                                                                                                "Đang xử lý"
                                                                                            }</td>

                                                                                        }
                                                                                        {item?.Status_Payment?.status === "Thanh toán khi giao hàng"
                                                                                            &&
                                                                                            <td style={{ color: "violet", fontWeight: "700" }}>{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "violet", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                : "Đang xử lý"}</td>

                                                                                        }
                                                                                        {item?.Status_Payment?.status === "Đã thanh toán trước một phần"
                                                                                            &&
                                                                                            <td style={{ color: "#A0522D", fontWeight: "700" }} >{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "#A0522D", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                : "Đang xử lý"}</td>

                                                                                        }


                                                                                        {item?.Status_Delivery?.status &&
                                                                                            <td > {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "Đang xử lý"}</td>

                                                                                        }
                                                                                        {!item?.Status_Delivery?.status &&
                                                                                            <td > {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "Đang xử lý"}</td>

                                                                                        }
                                                                                        <td>{item.total}</td>
                                                                                        <td>{item?.Sales_Channel?.name}</td>
                                                                                        <td >
                                                                                            <div className='d-flex'>
                                                                                                <button className='btn btn-primary' style={{ cursor: "pointer", borderRadius: "50%" }} title="Chi tiết đơn hàng" onClick={() => handleViewProduct(item)}>
                                                                                                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                                                                                                </button>
                                                                                                {item?.flag == 0 &&
                                                                                                    <button className='btn btn-danger mx-2' style={{ cursor: "pointer", borderRadius: "50%" }} title="Giục giao hàng nhanh" onClick={() => handleCreateFlag(item)} >
                                                                                                        <i class="fa fa-flag" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                }
                                                                                                {item?.flag == 1 &&
                                                                                                    <button className='btn btn-danger mx-2' style={{ cursor: "pointer", borderRadius: "50%" }} title="Tắt giục giao hàng nhanh" onClick={() => handleCancelFlag(item)} >
                                                                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                }
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>

                                                                                    </>
                                                                                )
                                                                            })
                                                                            :
                                                                            <tr>
                                                                                <td colSpan={13}>
                                                                                    <div className='image'>
                                                                                        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/open-box-7072010-5751948.png?f=webp" alt="" />
                                                                                        <h3> Not Found</h3>

                                                                                    </div>
                                                                                </td>

                                                                            </tr>

                                                                        }





                                                                    </tbody>
                                                                }




                                                                {sortDataSearch === true &&
                                                                    < tbody >
                                                                        {listDataSearchNotime && listDataSearchNotime.length > 0
                                                                            ?

                                                                            listDataSearchNotime.map((item, index) => {
                                                                                return (
                                                                                    <>    <tr key={`row-${index}`}>
                                                                                        {item?.flag === true ?
                                                                                            <td>
                                                                                                <span style={{ fontSize: "20px", color: "red" }}>
                                                                                                    <i class="fa fa-flag" aria-hidden="true"></i>
                                                                                                </span>
                                                                                            </td>
                                                                                            :
                                                                                            <td></td>

                                                                                        }

                                                                                        {item?.done_status == 1
                                                                                            &&
                                                                                            <td>
                                                                                                <div class="form-check">
                                                                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" checked />

                                                                                                </div>
                                                                                            </td>

                                                                                        }
                                                                                        {item?.done_status == 0
                                                                                            &&
                                                                                            <td>
                                                                                                <div class="form-check">
                                                                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" disabled />

                                                                                                </div>
                                                                                            </td>

                                                                                        }


                                                                                        <td scope="row">{item.order}

                                                                                        </td>
                                                                                        <td scope="row" >{item.id}</td>
                                                                                        {/* <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td> */}
                                                                                        <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                                                        <td>{item?.name_customer?.toLocaleUpperCase() ? item?.name_customer?.toLocaleUpperCase() : "chưa cập nhật "}</td>
                                                                                        <td>{item?.Warehouse?.product
                                                                                            ? item?.Warehouse?.product
                                                                                            : "chưa cập nhật "}
                                                                                        </td>
                                                                                        {item?.Status_Payment?.status === "Đã thanh toán toàn bộ"
                                                                                            &&
                                                                                            <td >{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "blue", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                :
                                                                                                "Đang xử lý"
                                                                                            }</td>

                                                                                        }
                                                                                        {item?.Status_Payment?.status === "Thanh toán khi giao hàng"
                                                                                            &&
                                                                                            <td style={{ color: "violet", fontWeight: "700" }}>{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "violet", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                : "Đang xử lý"}</td>

                                                                                        }
                                                                                        {item?.Status_Payment?.status === "Đã thanh toán trước một phần"
                                                                                            &&
                                                                                            <td style={{ color: "#A0522D", fontWeight: "700" }} >{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "#A0522D", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                : "Đang xử lý"}</td>

                                                                                        }


                                                                                        {item?.Status_Delivery?.status &&
                                                                                            <td > {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "Đang xử lý"}</td>

                                                                                        }
                                                                                        {!item?.Status_Delivery?.status &&
                                                                                            <td > {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "Đang xử lý"}</td>

                                                                                        }
                                                                                        <td>{item.total}</td>
                                                                                        <td>{item?.Sales_Channel?.name}</td>
                                                                                        <td >
                                                                                            <div className='d-flex'>
                                                                                                <button className='btn btn-primary' style={{ cursor: "pointer", borderRadius: "50%" }} title="Chi tiết đơn hàng" onClick={() => handleViewProduct(item)}>
                                                                                                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                                                                                                </button>
                                                                                                {item?.flag == 0 &&
                                                                                                    <button className='btn btn-danger mx-2' style={{ cursor: "pointer", borderRadius: "50%" }} title="Giục giao hàng nhanh" onClick={() => handleCreateFlag(item)} >
                                                                                                        <i class="fa fa-flag" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                }
                                                                                                {item?.flag == 1 &&
                                                                                                    <button className='btn btn-danger mx-2' style={{ cursor: "pointer", borderRadius: "50%" }} title="Tắt giục giao hàng nhanh" onClick={() => handleCancelFlag(item)} >
                                                                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                }
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>

                                                                                    </>
                                                                                )
                                                                            })
                                                                            :
                                                                            <tr>
                                                                                <td colSpan={13}>
                                                                                    <div className='image'>
                                                                                        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/open-box-7072010-5751948.png?f=webp" alt="" />
                                                                                        <h3> Not Found</h3>

                                                                                    </div>
                                                                                </td>

                                                                            </tr>

                                                                        }




                                                                    </tbody>
                                                                }
                                                                {sortDataSearchWithTime === true &&
                                                                    < tbody >
                                                                        {listDataSearch && listDataSearch.length > 0
                                                                            ?
                                                                            listDataSearch.map((item, index) => {
                                                                                return (
                                                                                    <>    <tr key={`row-${index}`}>
                                                                                        {item?.flag === true ?
                                                                                            <td>
                                                                                                <span style={{ fontSize: "20px", color: "red" }}>
                                                                                                    <i class="fa fa-flag" aria-hidden="true"></i>
                                                                                                </span>
                                                                                            </td>
                                                                                            :
                                                                                            <td></td>

                                                                                        }

                                                                                        {item?.done_status == 1
                                                                                            &&
                                                                                            <td>
                                                                                                <div class="form-check">
                                                                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" checked />

                                                                                                </div>
                                                                                            </td>

                                                                                        }
                                                                                        {item?.done_status == 0
                                                                                            &&
                                                                                            <td>
                                                                                                <div class="form-check">
                                                                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" disabled />

                                                                                                </div>
                                                                                            </td>

                                                                                        }


                                                                                        <td scope="row">{item.order}

                                                                                        </td>
                                                                                        <td scope="row" >{item.id}</td>
                                                                                        {/* <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td> */}
                                                                                        <td>{moment(`${item.createdAt}`).format("DD/MM/YYYY HH:mm:ss")}</td>
                                                                                        <td>{item?.name_customer?.toLocaleUpperCase() ? item?.name_customer?.toLocaleUpperCase() : "chưa cập nhật "}</td>
                                                                                        <td>{item?.Warehouse?.product
                                                                                            ? item?.Warehouse?.product
                                                                                            : "chưa cập nhật "}
                                                                                        </td>
                                                                                        {item?.Status_Payment?.status === "Đã thanh toán toàn bộ"
                                                                                            &&
                                                                                            <td >{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "blue", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                :
                                                                                                "Đang xử lý"
                                                                                            }</td>

                                                                                        }
                                                                                        {item?.Status_Payment?.status === "Thanh toán khi giao hàng"
                                                                                            &&
                                                                                            <td style={{ color: "violet", fontWeight: "700" }}>{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "violet", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                : "Đang xử lý"}</td>

                                                                                        }
                                                                                        {item?.Status_Payment?.status === "Đã thanh toán trước một phần"
                                                                                            &&
                                                                                            <td style={{ color: "#A0522D", fontWeight: "700" }} >{item?.Status_Payment?.status ?
                                                                                                <div style={{ backgroundColor: "#A0522D", width: "20px", height: "20px", borderRadius: "50%" }}></div>
                                                                                                : "Đang xử lý"}</td>

                                                                                        }


                                                                                        {item?.Status_Delivery?.status &&
                                                                                            <td > {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "Đang xử lý"}</td>

                                                                                        }
                                                                                        {!item?.Status_Delivery?.status &&
                                                                                            <td > {item?.Status_Delivery?.status ? item?.Status_Delivery?.status : "Đang xử lý"}</td>

                                                                                        }
                                                                                        <td>{item.total}</td>
                                                                                        <td>{item?.Sales_Channel?.name}</td>
                                                                                        <td >
                                                                                            <div className='d-flex'>
                                                                                                <button className='btn btn-primary' style={{ cursor: "pointer", borderRadius: "50%" }} title="Chi tiết đơn hàng" onClick={() => handleViewProduct(item)}>
                                                                                                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                                                                                                </button>
                                                                                                {item?.flag == 0 &&
                                                                                                    <button className='btn btn-danger mx-2' style={{ cursor: "pointer", borderRadius: "50%" }} title="Giục giao hàng nhanh" onClick={() => handleCreateFlag(item)} >
                                                                                                        <i class="fa fa-flag" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                }
                                                                                                {item?.flag == 1 &&
                                                                                                    <button className='btn btn-danger mx-2' style={{ cursor: "pointer", borderRadius: "50%" }} title="Tắt giục giao hàng nhanh" onClick={() => handleCancelFlag(item)} >
                                                                                                        <i class="fa fa-times" aria-hidden="true"></i>
                                                                                                    </button>
                                                                                                }
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>

                                                                                    </>
                                                                                )
                                                                            })
                                                                            :
                                                                            <tr>
                                                                                <td colSpan={13}>
                                                                                    <div className='image'>
                                                                                        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/open-box-7072010-5751948.png?f=webp" alt="" />
                                                                                        <h3> Not Found</h3>

                                                                                    </div>
                                                                                </td>

                                                                            </tr>

                                                                        }



                                                                    </tbody>
                                                                }

                                                            </table>
                                                        </div>
                                                    </>
                                                    :
                                                    <tr className=' d-flex align-items-center justify-content-center'>
                                                        <td colSpan={13}>
                                                            <div className='loading-data-container '>
                                                                <Bars
                                                                    height={100}
                                                                    width={100}
                                                                    radius={5}
                                                                    color="#1877f2"
                                                                    ariaLabel="ball-triangle-loading"
                                                                    wrapperClass={{}}
                                                                    wrapperStyle=""
                                                                    visible={true}
                                                                />
                                                                <h3>...Loading</h3>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                }

                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>


                        </div>
                    </div>
                    <CreateNewProject
                        showModalCreatNewProject={showModalCreatNewProject}
                        setShowModalCreatNewProject={setShowModalCreatNewProject}
                        handleShowHideModalCreatNewProject={handleShowHideModalCreatNewProject}
                        listProjectbyUser={listProjectbyUser}
                        fetchProjectUser={fetchProjectUser}
                        setShowNotificationCreateSuccess={setShowNotificationCreateSuccess}
                        userdata={userdata}
                        setUserdata={setUserdata}
                        order={order}
                        validInput={validInput}
                        setValidInput={setValidInput}
                        defaultUserData={defaultUserData}
                        ValidInputsDefault={ValidInputsDefault}
                        productAfterCreate={productAfterCreate}
                        setProductAfterCreate={setProductAfterCreate}
                        selecCheckSubtmitImage={selecCheckSubtmitImage}
                        setSelecCheckSubtmitImage={setSelecCheckSubtmitImage}
                        previreImage={previreImage}
                        setprevireImage={setprevireImage}
                        handleConfirmUser={handleConfirmUser}
                        Product={Product}
                        SetProduct={SetProduct}
                        ProductNumber={ProductNumber}
                        SetProductNumber={SetProductNumber}
                        handleOnchangeInput={handleOnchangeInput}
                        numberProduct={numberProduct}
                        setNumberProduct={setNumberProduct}
                        setId={setId}
                        id={id}

                    />
                    <NotificationSuccessModal
                        showNotificationCreateSuccess={showNotificationCreateSuccess}
                        handleShowNotificationCreateSuccess={handleShowNotificationCreateSuccess}
                        order={order}
                        productAfterCreate={productAfterCreate}
                        projectId={projectId}
                        numberProduct={numberProduct}
                        userdata={userdata}
                        id={id}

                    />
                </div>

            </div>
        </div >
    )
}


export default ProductsWithStatuspayment