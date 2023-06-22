import "react-pro-sidebar/dist/css/styles.css";
import { NavLink, NavNavLink } from "react-router-dom";
import { useState, useEffect } from "react";

import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
} from "react-pro-sidebar";
import {
    FaTachometerAlt,
    AiFillSetting,
    FaGem,
    FaGithub,
    FaRegLaughWink,
    FaHeart,
} from "react-icons/fa";
import { DiReact } from "react-icons/di";
import { MdOutlinePermDataSetting } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import "./sidebar.scss";


const SidebarStaff = ({ image, collapsed, toggled, handleToggleSidebar, setCollapsed }) => {

    return (
        <>
            <div className="sidebar-container">
                <ProSidebar
                    collapsed={collapsed}
                    toggled={toggled}
                    onToggle={handleToggleSidebar}
                >

                    <SidebarContent>


                        <Menu iconShape="circle">
                            <MenuItem icon={<FaGem />}>
                                <NavLink to="">Homepage</NavLink>{" "}
                            </MenuItem>
                            <MenuItem
                                icon={<MdOutlinePermDataSetting />}
                                suffix={<span className="badge red"></span>}
                            >
                                <NavLink to="/Workspace">Workspace list</NavLink>{" "}
                            </MenuItem>
                            <MenuItem icon={<FiSettings />}>
                                <NavLink to="">project list</NavLink>{" "}

                            </MenuItem>

                            <MenuItem icon={<FaGem />}>
                                <NavLink to="">project list</NavLink>{" "}
                            </MenuItem>
                        </Menu>
                        <Menu iconShape="circle">
                            <SubMenu
                                title={"hello"}
                                suffix={<span className="badge yellow">aaa3</span>}
                                icon={<FaRegLaughWink />}
                            >
                                <MenuItem icon={<FaGem />}>
                                    <NavLink to="">project list</NavLink>{" "}
                                </MenuItem>
                                <MenuItem icon={<FaGem />}>
                                    <NavLink to="">project list</NavLink>{" "}
                                </MenuItem>
                                <MenuItem icon={<FaGem />}>
                                    <NavLink to="">project list</NavLink>{" "}
                                </MenuItem>
                            </SubMenu>
                        </Menu>
                    </SidebarContent>


                </ProSidebar>
            </div>
        </>
    );
};
export default SidebarStaff;
