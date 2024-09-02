import { Box, SimpleGrid } from "@chakra-ui/react";
import UserTable from "./components/userTable";
import React, { useEffect, useState } from "react";
import UserApi from 'api/user'

export default function Users() {
    const fetchUsers = () => {
        UserApi.getAll().then(res => {
            setUsers( res.data )
        })
    }

    const columns = [
        {
            Header: "ID",
            accessor: "id",
        },
        {
            Header: "EMAIL",
            accessor: "email",
        },
        {
            Header: "ROLE",
            accessor: "role",
        },
        {
            Header: "LAST LOGIN DATE",
            accessor: "last_login_date",
        },
        {
            Header: "Action"
        }
    ]

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Chakra Color Mode
    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <SimpleGrid
                mb='20px'
                columns={{ sm: 1, md: 1 }}
                spacing={{ base: "20px", xl: "20px" }}>
                <UserTable
                    columnsData={columns}
                    tableData={users}
                    fetchUsers={fetchUsers}
                />
            </SimpleGrid>
        </Box>
    );
}