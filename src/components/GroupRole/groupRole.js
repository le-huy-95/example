
import './groupRole.scss'
import { GetGroup } from "../services/userService"
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getRole, fetchRoleByGroup, SaveChangleRole } from "../services/RoleService"
import _ from "lodash"
const GroupRole = (props) => {
    const [userGroup, setUserGroup] = useState([])
    const [selectGroup, setSelectGroup] = useState('')
    const [listRole, setListRole] = useState([])
    const [assignRoleByGroup, setassignRoleByGroup] = useState([])


    // all group

    const getAllGroup = async () => {
        let res = await GetGroup()
        if (res && +res.EC === 0) {
            setUserGroup(res.DT)

        } else {
            toast.error(res.EM)
        }
    }
    // all role

    const fetchUserRole = async () => {

        let res = await getRole()

        if (res && +res.EC === 0) {
            setListRole(res.DT)
        }
    }
    // khi thay doi cac group thi se hien thi ra cac role cua group day

    const handleOnchangeGroup = async (value) => {
        setSelectGroup(value)
        if (value) {
            let res = await fetchRoleByGroup(value)

            if (res && +res.EC === 0) {
                let data = buildDataRolesByGroup(res.DT.Roles, listRole)
                setassignRoleByGroup(data)
            }

        }
    }
    // so sanh allrole va role cua tung group
    const buildDataRolesByGroup = (groupRole, allRoles) => {
        let result = []
        if (allRoles && allRoles.length > 0) {
            allRoles.map(role => {
                let object = {};
                object.url = role.url
                object.id = role.id
                object.description = role.description
                object.isAssigned = false
                if (groupRole && groupRole.length > 0) {
                    object.isAssigned = groupRole.some(item => item.url === object.url)

                }
                result.push(object)
            })
        }
        return result
    }
    // khi chon vao moi o check box
    const handleSelectRole = (value) => {
        // copy gia tri role cua moi group
        const _assignRoleByGroup = _.cloneDeep(assignRoleByGroup);

        // lay chi so id cua moi thang checkbox trung voi id cua role
        let foundIndex = _assignRoleByGroup.findIndex(item => +item.id === +value)
        // neu co chi so id thi gan lai check box do
        if (foundIndex > -1) {
            _assignRoleByGroup[foundIndex].isAssigned = !_assignRoleByGroup[foundIndex].isAssigned
        }
        setassignRoleByGroup(_assignRoleByGroup)

    }


    const builDataRoleToSave = () => {
        const _assignRoleByGroup = _.cloneDeep(assignRoleByGroup);
        let result = {}
        result.groupId = selectGroup
        let group_role = _assignRoleByGroup.filter(item => item.isAssigned === true)
        // result.groupRole = group_role
        let dataAfterBulid = group_role.map(item => {
            let childItem = { groupId: +selectGroup, roleId: item.id }
            return childItem
        })
        result.GroupRole = dataAfterBulid;
        return result;
    }


    const handleSaveRoleChange = async () => {
        let data = builDataRoleToSave()
        let res = await SaveChangleRole(data)
        if (res && +res.EC === 0) {
            toast.success(res.EM)
        } else {
            toast.error(res.EM)

        }

    }

    useEffect(() => {
        getAllGroup()
        fetchUserRole()
    }, [])




    return (
        <div className=" GroupRole-container">
            <div className='container'>
                <h3> Group_role :</h3>

                <div className='container '>
                    <div className='row'>
                        <div className='assign-group-role col-sm-6 mb-3'>
                            <b className='my-3'>Select Group (chọn group được gán quyền):</b>
                            <div className='col-12 col-sm-8 form-group'>
                                <select className="form-select" onChange={(event) => handleOnchangeGroup(event.target.value)} >

                                    <option value="" > Please select your group ... </option>

                                    {userGroup && userGroup.length > 0 &&
                                        userGroup.map((item, index) => {
                                            return (
                                                <option key={`group-${index}`} value={item.id}>{item.name}</option>

                                            )
                                        })}



                                </select >
                            </div>

                        </div>
                        <div className='view-all-role col-sm-6'>
                            <h3>Assign Role for group ( gán quyền cho group)</h3>
                            <hr />
                            {selectGroup &&
                                <div className='roles col-sm-6 mx-3 my-3'>
                                    {assignRoleByGroup && assignRoleByGroup.length > 0 &&
                                        assignRoleByGroup.map((item, index) => {
                                            return (
                                                <div className="form-check" key={`list-role-${index}`}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={item.id}
                                                        id={`list-role-${index}`}
                                                        checked={item.isAssigned}
                                                        onChange={(event) => handleSelectRole(event.target.value)
                                                        }
                                                    />
                                                    <label className="form-check-label" htmlfor={`list-role-${index}`}>
                                                        {item.url}
                                                    </label>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className='mt-3'>
                                        <button className='btn btn-warning' onClick={() => handleSaveRoleChange()}> Save</button>
                                    </div>
                                </div>}

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}


export default GroupRole