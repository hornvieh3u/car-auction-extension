import { Box, SimpleGrid } from "@chakra-ui/react";
import ProxyTable from "./components/proxyTable";
import React, { useEffect, useState } from "react";
import ProxyApi from "api/proxy";

export default function Proxys() {
    const fetchProxies = () => {
        ProxyApi.getAll().then(res => {
            setProxies(res.data)
        })
    }
    const columns = [
        {
            Header: "ID",
            accessor: "id",
        },
        {
            Header: "IP",
            accessor: "ip",
        },
        {
            Header: "PORT",
            accessor: "port",
        },
        {
            Header: "DOMAIN",
            accessor: "domain",
        },
        {
            Header: "ACTION",
        },
    ];

    const [ proxies, setProxies ] = useState([])

    useEffect(() => {
        fetchProxies();
    }, [])
    
    // Chakra Color Mode
    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <SimpleGrid
                mb='20px'
                columns={{ sm: 1, md: 1 }}
                spacing={{ base: "20px", xl: "20px" }}>
                <ProxyTable
                    columnsData={columns}
                    tableData={proxies}
                    fetchProxies={fetchProxies}
                />
            </SimpleGrid>
        </Box>
    );
}
