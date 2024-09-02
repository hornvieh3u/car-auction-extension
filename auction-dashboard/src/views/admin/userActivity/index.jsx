import { Box, SimpleGrid } from "@chakra-ui/react";
import UserActivityTable from "./components/userActivityTable";
import React, { useEffect, useState } from "react";
import UserActivityApi from "api/userActivity";

export default function UserActivities() {
    const fetchActivities = () => [
        UserActivityApi.getAll().then(res => {
            setActivities(res.data)
        })
    ]

    const columns = [
        {
            Header: "ID",
            accessor: "id",
        },
        {
            Header: "EMAIL",
            accessor: "account",
        },
        {
            Header: "TYPE",
            accessor: "type",
        },
        {
            Header: "BIDPRICE",
            accessor: "bid_price",
        },
        {
            Header: "LOTID",
            accessor: "lot_id",
        },
        {
            Header: "VINCODE",
            accessor: "vin_code",
        },
    ];

    const [ activities, setActivities ] = useState([])

    useEffect(() => {
        fetchActivities();
    }, [])
    
    // Chakra Color Mode
    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <SimpleGrid
                mb='20px'
                columns={{ sm: 1, md: 1 }}
                spacing={{ base: "20px", xl: "20px" }}>
                <UserActivityTable
                    columnsData={columns}
                    tableData={activities}
                />
            </SimpleGrid>
        </Box>
    );
}
