import './dashboardProduct.scss'
import SidebarStaff from "../sidebar/sidebar staff"
import React, { useEffect, useState } from 'react'
import { getDataDashboardProduct, getDataDashboardProductWithAge, getDataDashboardProductWithTimeInWarehouse, getDataDashboardProductWithMounth, getDataDashboardProductWithUser } from "../services/ProjectService"
import { UserContext } from "../../contexApi/UserContext"
import _, { countBy } from "lodash"
import { DefinedRange } from 'react-date-range';
import { AreaChart, Area } from 'recharts';
import { addDays, format } from 'date-fns';
import moment from "moment"
import { Link, NavLink, useParams, useLocation } from "react-router-dom"
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    PieChart,
    Pie,
} from 'recharts';

const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
};
const DashboardProduct = (props) => {
    const { user } = React.useContext(UserContext);

    const [collapsed, setCollapsed] = useState(false)
    const [dataOne, setDataOne] = useState([])
    const [dataAge, setDataAge] = useState([])
    const [StartDateCalendar, setstartDateCalendar] = useState("")
    const [endDateCalendar, setendDateCalendar] = useState("")
    const [dataTime, setDataTime] = useState("")
    const [dataMounth, setDataMounth] = useState("")
    const [dataUser, setDataUser] = useState("")

    const dataAAge = [
        { name: 'Dưới 18 tuổi', value: dataAge?.under_18 },
        { name: 'Từ 18 đến dưới 30', value: dataAge?.From18AgeTo30Age },
        { name: 'Từ 30 đến dưới 50', value: dataAge?.From30AgeTo50Age },
        { name: 'trên 50 ', value: dataAge?.over50age },
    ];

    const getAllDataInDashboardWithUser = async () => {
        let res = await getDataDashboardProductWithUser(user.account.phone)
        if (res && +res.EC === 0) {
            console.log("res", res.DT)

            setDataUser(res.DT)
        }

    }
    const getAllDataInDashboardWithMounth = async () => {
        let res = await getDataDashboardProductWithMounth(user.account.phone)
        if (res && +res.EC === 0) {

            setDataMounth(res.DT[0])
        }

    }
    const getAllDataInDashboardWithTime = async () => {
        let res = await getDataDashboardProductWithTimeInWarehouse(user.account.phone, (moment().startOf('month').format('DD-MM-YYYY')), moment().endOf('month').format("DD-MM-YYYY"))
        if (res && +res.EC === 0) {
            let data = []
            res.DT.forEach((item) => {
                data.push({
                    Time: item.Time,
                    Number: item.number,
                })
            })
            setDataTime(data)
        }

    }
    const getAllDataInDashboardWithAge = async () => {
        let res = await getDataDashboardProductWithAge(user.account.phone)
        if (res && +res.EC === 0) {
            setDataAge(res.DT[0])
        }

    }
    const getAllDataInDashboard = async () => {
        let res = await getDataDashboardProduct(user.account.phone)
        if (res && +res.EC === 0) {
            setDataOne(res.DT[0])
        }

    }

    useEffect(() => {
        getAllDataInDashboard()
        getAllDataInDashboardWithAge()
        getAllDataInDashboardWithTime()
        setstartDateCalendar(moment().startOf('month').format('DD-MM-YYYY'))
        setendDateCalendar(moment().endOf('month').format("DD-MM-YYYY"))
        getAllDataInDashboardWithMounth()
        getAllDataInDashboardWithUser()

    }, [])

    const data_one = [
        {
            name: 'tháng 1 ',
            Number: dataMounth.tháng_1,

        },
        {
            name: 'tháng 2',
            Number: dataMounth.tháng_2,

        },
        {
            name: 'tháng 3',
            Number: dataMounth.tháng_3,
        },
        {
            name: 'tháng 4',
            Number: dataMounth.tháng_4,
        },
        {
            name: 'tháng 5',
            Number: dataMounth.tháng_5,
        },
        {
            name: 'tháng 6',
            Number: dataMounth.tháng_6,
        },
        {
            name: 'tháng 7',
            Number: dataMounth.tháng_7,
        },
        {
            name: 'tháng 8',
            Number: dataMounth.tháng_8,
        },
        {
            name: 'tháng 9',
            Number: dataMounth.tháng_9,
        },
        {
            name: 'tháng 10',
            Number: dataMounth.tháng_10,
        },
        {
            name: 'tháng 11',
            Number: dataMounth.tháng_11,
        },
        {
            name: 'tháng 12',
            Number: dataMounth.tháng_12,
        },

    ];



    const style = {
        top: '50%',
        right: 0,
        transform: 'translate(0, -50%)',
        lineHeight: '24px',
    };
    return (
        <div className='dashboard_Product-container'>
            <div className='left  '>
                <SidebarStaff collapsed={collapsed} />

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
                    <div className='container'>
                        <button className='btn btn-primary btn-Back mx-3 my-5'>
                            <span>
                                <i class="fa fa-arrow-left" aria-hidden="true"></i>
                            </span>
                            <Link to="/Products"> Trở lại trang trước </Link>
                        </button>                        <div className='first-charts'>
                            <div className='tittle'>
                                <div className='contnet'> Thống kế số lượng đặt hàng   <span> (đơn vị :đơn)</span>
                                    <br />
                                    <div>từ <b>{StartDateCalendar}</b>  đến <b>{endDateCalendar}</b></div>

                                </div>
                            </div>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        width={500}
                                        height={300}
                                        data={dataTime}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                        barSize={20}
                                    >
                                        <XAxis dataKey="Time" scale="point" padding={{ left: 10, right: 10 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Bar dataKey="Number" fill="#8884d8" background={{ fill: '#eee' }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className='second-charts my-5'>
                            <div className='tittle'>Thống kê cả năm (đơn vị : đơn)</div>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        width={500}
                                        height={400}
                                        data={data_one}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="Number" stroke="#8884d8" fill="#8884d8" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                        </div>
                        <div className="third-charts my-5 ">
                            <div className='row all_info'>
                                <div className='item col-3' >
                                    <div className='left-item my-5'>
                                        <span className='number'>{dataOne.all_product}</span>
                                        <span className='text'>Đã bán</span>
                                    </div>
                                    <div className='right-item my-5'>
                                        <span>
                                            <i class="fa fa-handshake-o" aria-hidden="true"></i>

                                        </span>
                                    </div>

                                </div>
                                <div className='item_one col-3' >
                                    <div className='left-item my-5'>
                                        <span className='number'>{dataOne.allUser}</span>
                                        <span className='text'>Người mua hàng</span>
                                    </div>
                                    <div className='right-item my-5'>
                                        <span>
                                            <i class="fa fa-universal-access" aria-hidden="true"></i>

                                        </span>
                                    </div>

                                </div>
                                <div className='item_two col-3' >
                                    <div className='left-item my-5'>
                                        <span className='number'>{dataOne.total} vnd</span>
                                        <span className='text'> Đã thu được </span>
                                    </div>
                                    <div className='right-item my-5'>
                                        <span>
                                            <i class="fa fa-money" aria-hidden="true"></i>

                                        </span>
                                    </div>

                                </div>



                            </div>
                            <div className='row all_info my-5'>
                                <div className='item_three col-3' >
                                    <div className='left-item my-5'>
                                        <span className='number'>{dataOne.best_seller}</span>
                                        <span className='text'> S/p bán chạy</span>
                                    </div>
                                    <div className='right-item my-5'>
                                        <span>
                                            <i class="fa fa-diamond" aria-hidden="true"></i>

                                        </span>
                                    </div>

                                </div>
                                <div className=' item_four col-3' >
                                    <div className='left-item my-5'>
                                        <span className='number'>{dataOne.done_Product}</span>
                                        <span className='text'>Đơn thành công</span>
                                    </div>
                                    <div className='right-item my-5'>
                                        <span>
                                            <i class="fa fa-shopping-basket" aria-hidden="true"></i>

                                        </span>
                                    </div>

                                </div>
                                <div className='item_five col-3' >
                                    <div className='left-item my-5'>
                                        <span className='number'>{dataOne.cancel_Status}</span>
                                        <span className='text'>Đơn bị hủy </span>
                                    </div>
                                    <div className='right-item my-5'>
                                        <span>
                                            <i class="fa fa-times" aria-hidden="true"></i>

                                        </span>
                                    </div>

                                </div>



                            </div>




                        </div>
                        <div className='row'>
                            <div className="Fourth-charts my-5 col-6 mx-3">
                                <div className='name my-3'>Thống kê độ tuổi khách hàng</div>
                                <div className='row'>
                                    <div className='col-7'>
                                        <div style={{ width: '100%', height: 300 }} >
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie dataKey="value" data={dataAAge} fill="#8884d8" label />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className='col-5'>
                                        <span style={{ fontSize: "20px" }}> Dưới 18 :</span>  <b style={{ fontSize: "20px" }}>{dataAge.under_18}</b> <b>%</b>
                                        <hr />
                                        <span style={{ fontSize: "20px" }}>Từ 18 đến dưới 30:</span> <b style={{ fontSize: "20px" }}>{dataAge.From18AgeTo30Age}</b> <b>%</b>
                                        <hr />
                                        <span style={{ fontSize: "20px" }}>Từ 30 đến dưới 50:</span> <b style={{ fontSize: "20px" }}>{dataAge.From30AgeTo50Age}</b> <b>%</b>
                                        <hr />
                                        <span style={{ fontSize: "20px" }}>Trên 50:</span> <b style={{ fontSize: "20px" }}>{dataAge.over50age}</b> <b>%</b>

                                    </div>
                                </div>


                            </div>
                            <div className="Five-charts my-5 col-5 mx-3">
                                <div className='name my-3'>
                                    Chi tiết Số điện thoại mua hàng
                                </div>
                                <div className='container'>
                                    {dataUser && dataUser.length > 0 &&
                                        dataUser.map((item, index) => {
                                            return (
                                                <>

                                                    <div className='user my-2' key={`user-${index}`}>
                                                        <div className='user-left'>
                                                            <span className='mx-2'><i class="fa fa-user-circle-o" aria-hidden="true"></i>
                                                            </span>
                                                            <span>{item.User_phone}</span>
                                                        </div>
                                                        <div className='user-right'>
                                                            {item.number_shopping}/lần
                                                        </div>
                                                    </div>
                                                    <hr />

                                                </>
                                            )
                                        })
                                    }

                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div >
        </div >


    )
}


export default DashboardProduct