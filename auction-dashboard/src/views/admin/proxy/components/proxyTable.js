import {
    Flex,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    ModalFooter,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import {
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import { isEmpty, isIp } from "utilities";
import { toast } from "react-toastify";
import ProxyApi from "api/proxy";

// Assets
export default function ProxyTable({ columnsData, tableData, fetchProxies }) {

    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ip, setIp] = useState('');
    const [port, setPort] = useState(80);
    const [domain, setDomain] = useState('');

    const addProxy = () => {
        if( !isIp( ip ) || isEmpty( port ) ) {
            toast.error("Input correctly!");
            return;
        }

        ProxyApi.createOne({
            ip, port, domain
        }).then(res => {
            if( res.status === 200 ) {
                toast.success('Proxy add successfully.')
                onClose()
                fetchProxies()
            }
        })
    }

    const deleteProxy = id => {
        ProxyApi.delete({ id }).then(res => {
            if( res.status === 200 ) {
                toast.success('Proxy delete successfully.')
                fetchProxies()
            }
        })
    }

    const tableInstance = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        initialState,
    } = tableInstance;
    initialState.pageSize = 5;

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    return (
        <Card
            direction='column'
            w='100%'
            px='0px'
            overflowX={{ sm: "scroll", lg: "hidden" }}>
            <Flex px='25px' justify='space-between' mb='20px' align='center'>
                <Text
                    color={textColor}
                    fontSize='22px'
                    fontWeight='700'
                    lineHeight='100%'>
                    Proxies
                </Text>
                <Button size="md" colorScheme="blue" onClick={onOpen}>Add Proxy</Button>
            </Flex>
            <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
                <Thead>
                    {headerGroups.map((headerGroup, index) => (
                        <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                            {headerGroup.headers.map((column, index) => (
                                <Th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    pe='10px'
                                    key={index}
                                    borderColor={borderColor}>
                                    <Flex
                                        justify='space-between'
                                        align='center'
                                        fontSize={{ sm: "10px", lg: "12px" }}
                                        color='gray.400'>
                                        {column.render("Header")}
                                    </Flex>
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                    {page.map((row, index) => {
                        prepareRow(row);
                        return (
                            <Tr {...row.getRowProps()} key={index}>
                                {row.cells.map((cell, index) => {
                                    let data = "";
                                    if (cell.column.Header === "ID") {
                                        data = (
                                            <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                {cell.value}
                                            </Text>
                                        );
                                    } else if (cell.column.Header === "IP") {
                                        data = (
                                            <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                {cell.value}
                                            </Text>
                                        );
                                    } else if (cell.column.Header === "PORT") {
                                        data = (
                                            <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                {cell.value}
                                            </Text>
                                        );
                                    } else if (cell.column.Header === "DOMAIN") {
                                        data = (
                                            <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                {cell.value}
                                            </Text>
                                        );
                                    } else if (cell.column.Header === "ACTION") {
                                        data = (
                                           <Button size="sm" colorScheme="red" onClick={() => deleteProxy(row.values.id)}>Delete</Button>
                                        );
                                    }
                                    return (
                                        <Td
                                            {...cell.getCellProps()}
                                            key={index}
                                            fontSize={{ sm: "14px" }}
                                            minW={{ sm: "150px", md: "200px", lg: "auto" }}
                                            borderColor='transparent'>
                                            {data}
                                        </Td>
                                    );
                                })}
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Proxy</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="ip">
                            <FormLabel>Ip</FormLabel>
                            <Input type="text" onChange={e => setIp(e.target.value)} />
                        </FormControl>
                        <FormControl id="port" mt="3">
                            <FormLabel>Port</FormLabel>
                            <Input type="number" onChange={e => setPort(e.target.value)} />
                        </FormControl>
                        <FormControl id="domain" mt="3">
                            <FormLabel>Domain</FormLabel>
                            <Input type="text" onChange={e => setDomain(e.target.value)} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={addProxy}>Add</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
}
