import './dashboardWarehouse.scss'
import Sidebar from "../sidebar/sidebar"
import React, { useEffect, useState } from 'react'
import { getWarehouseForDashboard, getAllNumberSatusProductInWarehouse, getAllNumberMoneyInWarehouse, getDataWithTimeInWarehouse } from "../services/ProjectService"
import { UserContext } from "../../contexApi/UserContext"
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import _, { countBy } from "lodash"
import { DefinedRange } from 'react-date-range';
import { AreaChart, Area } from 'recharts';
import { addDays, format } from 'date-fns';
import moment from "moment"
import { Link, NavLink, useParams, useLocation } from "react-router-dom"
import { useTranslation, Trans } from 'react-i18next';



const DashboardWarehouse = (props) => {
    const { t, i18n } = useTranslation();
    const { user } = React.useContext(UserContext);
    const [StartDateCalendar, setstartDateCalendar] = useState("")
    const [endDateCalendar, setendDateCalendar] = useState("")
    const [collapsed, setCollapsed] = useState(false)
    const [allWarehouseLenght, setAllWarehouseLenght] = useState("")
    const [dataChart, setDataChart] = useState("")
    const [MaxValue, setMaxValue] = useState("")
    const [Maxkeys, setMaxkeys] = useState("")
    const [MaxkeysOne, setMaxkeysOne] = useState("")
    const [totalMoney, setTotalMoney] = useState("")

    const [dataTime, setDataTime] = useState("")

    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);

    const getdata = async () => {
        let res = await getWarehouseForDashboard(user.account.phone)
        if (res && +res.EC === 0) {
            if (res.DT.length > 0) {
                const data = _.countBy(res.DT, 'product')
                let max_key = Object.keys(data).reduce(function (a, b) { return data[a] > data[b] ? a : b });
                let arr = Object.values(data);
                let max_value = Math.max(...arr);
                setMaxkeys(max_key)
                setMaxValue(max_value)
                const dataOne = _.countBy(res.DT, 'Suppliers')
                let max_key_one = Object.keys(dataOne).reduce(function (a, b) { return dataOne[a] > dataOne[b] ? a : b });
                setMaxkeysOne(max_key_one)
            }

        }
    }
    const getTotalMoney = async () => {
        let res = await getAllNumberMoneyInWarehouse(user.account.phone)
        if (res && +res.EC === 0) {
            setTotalMoney(res.DT)
        }
    }
    const getDataWithTime = async () => {

        let res = await getDataWithTimeInWarehouse(user.account.phone, StartDateCalendar, endDateCalendar)
        if (res && +res.EC === 0) {
            let data = []
            res.DT.forEach((item) => {
                data.push({
                    Time: item.Time,
                    Number: item.number,
                })
            })
            console.log("data", data)
            setDataTime(data)
        }
    }



    const getAllInWarehouse = async () => {
        let res = await getAllNumberSatusProductInWarehouse(user.account.phone)
        if (res && +res.EC === 0) {
            setAllWarehouseLenght(res.DT)
            let Tất_cả_mặt_hàng = res.DT[0]?.AllProduct ?? 0
            let Sản_phẩm_mới_nhập = res.DT[0]?.product_statusId1 ?? 0
            let Sản_phẩm_đang_bán = res.DT[0]?.product_statusId4 ?? 0
            let Sản_phẩm_hết_hàng = res.DT[0]?.product_statusId2 ?? 0
            let Sản_phẩm_bị_hủy = res.DT[0]?.product_statusId3 ?? 0

            const data = [
                {
                    name: 'Tất_cả_mặt_hàng',
                    Tất_cả_mặt_hàng: Tất_cả_mặt_hàng,
                },
                {
                    name: 'Hàng_mới_nhập',
                    Hàng_mới_nhập: Sản_phẩm_mới_nhập,
                },
                {
                    name: 'Hàng_đang_bán',
                    Hàng_đang_bán: Sản_phẩm_đang_bán,
                },
                {
                    name: 'Hàng_đã_hết',
                    Hàng_đã_hết: Sản_phẩm_hết_hàng,
                },
                {
                    name: 'Hàng_đã_hủy',
                    Hàng_đã_hủy: Sản_phẩm_bị_hủy,
                },
            ];
            setDataChart(data)
            const dataOne = [

                {
                    name: 'Hàng_mới_nhập',
                    Hàng_mới_nhập: Sản_phẩm_mới_nhập,
                },
                {
                    name: 'Hàng_đang_bán',
                    Hàng_đang_bán: Sản_phẩm_đang_bán,
                },
                {
                    name: 'Hàng_đã_hết',
                    Hàng_đã_hết: Sản_phẩm_hết_hàng,
                },

            ];
        }

    }

    const handleChangDate = async (item) => {

        setState([item.selection])
        setstartDateCalendar(format(item.selection.startDate, "dd-MM-yyyy"))
        setendDateCalendar(format(item.selection.endDate, "dd-MM-yyyy"))



    }

    useEffect(() => {
        getAllInWarehouse()
        getdata()
        getTotalMoney()
        setstartDateCalendar(moment().startOf('month').format('DD-MM-YYYY'))
        setendDateCalendar(moment().endOf('month').format("DD-MM-YYYY"))
    }, [])
    useEffect(() => {
        getDataWithTime()
    }, [StartDateCalendar, endDateCalendar])
    return (
        <div className=' dashboard_warehouse-container'>
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
                <div className='right-body my-3'>

                    <div class="container">
                        <div className='location-path-dasboard-warehouse col my-3'>
                            <Link to="/"> Home</Link>

                            <span> <i className="fa fa-arrow-right" aria-hidden="true"></i>
                            </span>
                            <Link to="/dashboard_Warehouse">Dashboard Warehouse </Link>
                        </div>
                        <button className='btn btn-primary btn-Back mx-3'>
                            <span>
                                <i class="fa fa-arrow-left" aria-hidden="true"></i>
                            </span>
                            <Link to="/Warehouse">
                                {t('DashboardWareouse.tittleOne')}

                            </Link>
                        </button>
                        <div className='content'>
                            <span className='icon-charts mx-3'>
                                <i class="fa fa-plane" aria-hidden="true"></i>

                            </span>
                            <span className='name'>
                                {t('DashboardWareouse.tittleTwo')}
                            </span>
                        </div>
                        <div className='container'>
                            <div className='row all    my-3'>
                                <div className='title-all my-3'>
                                    <span className='icon-all mx-3'>
                                        <i class="fa fa-info" aria-hidden="true"></i>

                                    </span>
                                    <span className='name-all'>
                                        {t('DashboardWareouse.tittleThree')}
                                    </span>
                                </div>

                                <hr />
                                <div className='content-left col-6'>
                                    <div className='container'>
                                        <h5 className='mx-2'>
                                            <span className='mx-3'>
                                                {t('DashboardWareouse.tittleFour')}
                                            </span>
                                            <span style={{ color: "#7790b6" }}>
                                                {t('DashboardWareouse.tittleFive')}
                                            </span>
                                        </h5>
                                        <div className='row'>
                                            {allWarehouseLenght && allWarehouseLenght.length > 0
                                                &&
                                                allWarehouseLenght.map((item, index) => {
                                                    return (
                                                        <>

                                                            <div className='item col-5 ' >
                                                                <div className='icon' style={{ color: "green" }}>
                                                                    <i class="fa fa-battery-full" aria-hidden="true"></i>

                                                                </div>
                                                                <div className='title'>
                                                                    {t('DashboardWareouse.tittleSix')}
                                                                </div>
                                                                <div className='number' style={{ color: "green" }}>
                                                                    {item.product_statusId1 ? item.product_statusId1 : "0"}
                                                                </div>
                                                            </div>
                                                            <div className='item col-5 '>
                                                                <div className='icon' style={{ color: "blue" }}>
                                                                    <i class="fa fa-battery-half" aria-hidden="true"></i>

                                                                </div>
                                                                <div className='title'>
                                                                    {t('DashboardWareouse.tittleSeven')}
                                                                </div>
                                                                <div className='number' style={{ color: "blue" }}>
                                                                    {item.product_statusId4 ? item.product_statusId4 : "0"}
                                                                </div>

                                                            </div>
                                                            <div className='item col-11 '>
                                                                <div className='icon'>
                                                                    <i class="fa fa-shopping-bag" aria-hidden="true"></i>

                                                                </div>
                                                                <div className='title'>
                                                                    {t('DashboardWareouse.tittleEight')}
                                                                </div>
                                                                <div className='number'>{item.AllProduct ? item.AllProduct : "0"}</div>

                                                            </div>
                                                            <div className='item col-5 '>
                                                                <div className='icon' style={{ color: "red" }}>
                                                                    <i class="fa fa-battery-empty" aria-hidden="true"></i>

                                                                </div >
                                                                <div className='title'>
                                                                    {t('DashboardWareouse.tittleNight')}
                                                                </div>
                                                                <div className='number' style={{ color: "red" }}>
                                                                    {item.product_statusId2 ? item.product_statusId2 : "0"}
                                                                </div>

                                                            </div>

                                                            <div className='item col-5 '>
                                                                <div className='icon' style={{ color: "orange" }}>
                                                                    <i class="fa fa-trash" aria-hidden="true"></i>

                                                                </div>
                                                                <div className='title'>
                                                                    {t('DashboardWareouse.tittleTen')}
                                                                </div>
                                                                <div className='number' style={{ color: "orange" }}>{item.product_statusId3 ? item.product_statusId3 : "0"}</div>

                                                            </div>
                                                        </>
                                                    )
                                                })
                                            }


                                        </div>

                                    </div>


                                </div>
                                <div className='content-right col-6'>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            width={300}
                                            height={300}
                                            data={dataChart}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <XAxis dataKey="Tổng_sản_phẩm" />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="Tất_cả_mặt_hàng" fill="Black" />
                                            <Bar dataKey="Hàng_mới_nhập" fill="green" />
                                            <Bar dataKey="Hàng_đang_bán" fill="blue" />
                                            <Bar dataKey="Hàng_đã_hết" fill="red" />

                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                        <div className=' main my-5'>
                            <div className='container '>
                                <div className='row d-flex justify-content-between'>
                                    <div className='max-value col-3'>
                                        <div className='header'>
                                            {t('DashboardWareouse.tittleTwele')}
                                        </div>


                                        <div className='value-title'>
                                            <span className='mx-2 '>{Maxkeys ? Maxkeys : 0}</span>
                                            (<div className='value-number'>
                                                <span className='one'>{MaxValue ? MaxValue : 0}</span>
                                                <span className='Two'>/lượt</span>
                                            </div>)
                                        </div>

                                    </div>



                                    <div className='max-value-Suppliers col-3 '>
                                        <div className='header'>
                                            {t('DashboardWareouse.tittleThirteen')}
                                        </div>


                                        <div className='value-title'>{MaxkeysOne ? MaxkeysOne : 0}</div>

                                    </div>


                                    <div className='max-money col-3'>
                                        <div className='header'>
                                            {t('DashboardWareouse.tittleFourteen')}
                                        </div>
                                        <div className='value-number '>
                                            <span className='one'>{totalMoney ? totalMoney : 0}</span>
                                            <span className='Two'>/vnd</span>
                                        </div>


                                    </div>

                                </div>
                            </div>

                        </div>
                        <div className='time'>
                            <div className='container'>
                                <div className='header-time'>
                                    <span>
                                        {t('DashboardWareouse.tittleFifteen')}
                                        (<span className='sub'>
                                            {t('DashboardWareouse.tittleFour')}
                                            : lượt</span>)</span>
                                    <span className='sub'>
                                        {t('DashboardWareouse.tittleSixteen')}
                                        <b>{StartDateCalendar ? StartDateCalendar : 0}</b>  {t('DashboardWareouse.tittleSeventeen')}
                                        <b>{endDateCalendar ? endDateCalendar : 0}</b> </span>
                                </div>
                                <div className='row'>
                                    <div className='col-3'>
                                        <DefinedRange
                                            onChange={item => handleChangDate(item)}
                                            ranges={state}
                                        />;
                                    </div>
                                    <div className='col-9'>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                width={500}
                                                height={400}
                                                data={dataTime}
                                                margin={{
                                                    top: 10,
                                                    right: 30,
                                                    left: 0,
                                                    bottom: 0,
                                                }}
                                            >
                                                <XAxis dataKey="Time" />
                                                <YAxis />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="Number" stroke="#8884d8" fill="#8884d8" />
                                            </AreaChart>
                                        </ResponsiveContainer>




                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}


export default DashboardWarehouse