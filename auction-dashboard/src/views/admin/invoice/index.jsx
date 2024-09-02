import { Box, SimpleGrid } from "@chakra-ui/react";
import InvoiceTable from "./components/invoiceTable";
import React, { useEffect, useState } from "react";
import InvoiceApi from "api/invoice";

export default function Invoices() {
    const fetchInvoices = () => {
        InvoiceApi.getAll().then(res => {
            setInvoices(res.data)
        })
    }
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
            Header: "MONITOR",
            accessor: "monitor",
        },
        {
            Header: "STATUS",
            accessor: "status",
        },
        {
            Header: "COMMENT",
            accessor: "comment"
        },
        {
            Header: "ACTION",
        },
    ];

    const [ invoices, setInvoices ] = useState([]);

    useEffect(() => {
        fetchInvoices();
    }, [])
    
    // Chakra Color Mode
    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <SimpleGrid
                mb='20px'
                columns={{ sm: 1, md: 1 }}
                spacing={{ base: "20px", xl: "20px" }}>
                <InvoiceTable
                    columnsData={columns}
                    tableData={invoices}
                    fetchInvoices={fetchInvoices}
                />
            </SimpleGrid>
        </Box>
    );
}
