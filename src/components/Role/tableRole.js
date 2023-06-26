import React, { useState, useEffect } from "react"
import { DeleteRole } from "../services/RoleService"
import { toast } from 'react-toastify';
import { useTranslation, Trans } from 'react-i18next';
import { UserContext } from "../../contexApi/UserContext"
import { NotificationContext } from "../../contexApi/NotificationContext"

const TableRole = (props) => {
    const { fetchUserRole, currentPage, currentLimit, setCurrentPage, listRole, totalPage } = props
    const { t, i18n } = useTranslation();
    const { list, getALlListNotification, listStaff } = React.useContext(NotificationContext);
    const { user } = React.useContext(UserContext);


    useEffect(() => {
        fetchUserRole();
        getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)

    }, [currentPage])


    const handleDeleteRow = async (role) => {
        let res = await DeleteRole(role)
        if (res && +res.EC === 0) {
            toast.success(res.EM)
            if (user?.account?.groupWithRound?.name === "Customer" || user?.account?.groupWithRound?.name === "Staff" && user.account.Position) {
                await getALlListNotification(+user.account.shippingUnit_Id, user.account.phone, user.account.Position)
            }
            if (user?.account?.groupWithRound?.name === "Dev") {
                await getALlListNotification(+user.account.shippingUnit_Id, "Dev")
            }
            await fetchUserRole();
        }
    }

    return (
        <div>
            <table className="table  table-hover table-bordered  table-striped container">
                <thead>
                    <tr>
                        <th scope="col" className='table-success'>
                            {t('Table.One')}
                        </th>
                        <th scope="col" className='table-success'>
                            {t('Table.Two')}
                        </th>
                        <th scope="col" className='table-success'>
                            {t('Table.Three')}
                        </th>
                        <th scope="col" className='table-success'>
                            {t('Table.Four')}
                        </th>
                        <th scope="col" className='table-success'>
                            {t('Table.Five')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {listRole && listRole.length > 0 ?
                        <>
                            {listRole.map((item, index) => {
                                return (
                                    <tr key={`row-${index}`}>
                                        <td className='table-light'>{(currentPage - 1) * currentLimit + index + 1}</td>
                                        <td className='table-light'>{item.id}</td>
                                        <td className='table-light'>{item.url}</td>
                                        <td className='table-light'>{item.description}</td>
                                        <td className='table-light  '>
                                            <button className='btn btn-warning mt-2 mx-2 ' title="Edit">
                                                <i className="fa fa-pencil button-space" ></i>
                                            </button>
                                            <button className='btn btn-danger mt-2 mx-2' title="Delete">
                                                <i className="fa fa-trash-o button-space" onClick={() => handleDeleteRow(item)} ></i> </button>


                                        </td>

                                    </tr>
                                )

                            })}

                        </> :
                        <tr>
                            <td colSpan={5}>   {t('Table.Six')}
                            </td>
                        </tr>

                    }


                </tbody>

            </table>



        </div >

    )
}


export default TableRole