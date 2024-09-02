import { Box, SimpleGrid } from "@chakra-ui/react";
import AccountTable from "./components/accountTable";
import React, { useState, useEffect } from "react";
import AccountApi from 'api/account'
import UserApi from "api/user";

export default function Account() {
    const fetchAccounts = () => {
        AccountApi.getAll().then(res => {
            setAccounts(res.data)
        })
    }

    const fetchUsers = () => {
        UserApi.getAll().then(res => {
            setUsers(res.data);
        });
    }

    const columnsDataInvoice = [
        {
            Header: "ID",
            accessor: "id",
        },
        {
            Header: "USERNAME",
            accessor: "username",
        },
        {
            Header: "TYPE",
            accessor: "type",
        },
        {
            Header: "ACTION",
        }
    ];

    const [accounts, setAccounts] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchAccounts();
        fetchUsers();
    }, [])
    
    // Chakra Color Mode
    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <SimpleGrid
                mb='20px'
                columns={{ sm: 1, md: 1 }}
                spacing={{ base: "20px", xl: "20px" }}>
                <AccountTable
                    columnsData={columnsDataInvoice}
                    tableData={accounts}
                    fetchAccounts={fetchAccounts}
                    users={users}
                />
            </SimpleGrid>
        </Box>
    );
}
