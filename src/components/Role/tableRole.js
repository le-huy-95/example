import { useState, useEffect } from "react"
import { DeleteRole } from "../services/RoleService"
import { toast } from 'react-toastify';
import { useTranslation, Trans } from 'react-i18next';

const TableRole = (props) => {
    const { fetchUserRole, currentPage, currentLimit, setCurrentPage, listRole, totalPage } = props
    const { t, i18n } = useTranslation();



    useEffect(() => {
        fetchUserRole();
    }, [currentPage])


    const handleDeleteRow = async (role) => {
        let res = await DeleteRole(role)
        if (res && +res.EC === 0) {
            toast.success(res.EM)

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