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
    Select,
    useDisclosure,
    ModalFooter,
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
// import Menu from "components/menu/MainMenu";

// Assets
import { isEmpty } from "utilities";
import { toast } from "react-toastify";
import AccountApi from "api/account";
export default function AccountTable({ columnsData, tableData, fetchAccounts, users }) {

    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);

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

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ type, setType ] = useState('');

    const createAccount = () => {
        if(isEmpty( username ) || isEmpty(password) || isEmpty(type) ) {
            toast.error('Please input correct infomation.');
            return;
        }

        AccountApi.createOne({
            username,
            password,
            type,
        }).then(res => {
            if( res.status === 200 ) {
                toast.success('Account create successfully.');
                fetchAccounts();
            }

            onClose();
        })
    }

    const deleteAccount = id => {
        AccountApi.delete({ id }).then(res => {
            if( res.status === 200 ) {
                toast.success('Account delete successfully.');
                fetchAccounts();
            }
        })
    }

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
                    Accounts
                </Text>
                <Button size="md" colorScheme="blue" onClick={onOpen}>Create Account</Button>
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
                                    } else if (cell.column.Header === "USERNAME") {
                                        data = (
                                            <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                {cell.value}
                                            </Text>
                                        );
                                    } else if (cell.column.Header === "TYPE") {
                                        data = (
                                            <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                {cell.value}
                                            </Text>
                                        );
                                    } else if (cell.column.Header === "ACTION") {
                                        data = (
                                            <Button size="sm" colorScheme="red" onClick={() => deleteAccount(row.values.id)}>Delete</Button>
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
                    <ModalHeader>Create Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        
                        <FormControl id="username">
                            <FormLabel>Username</FormLabel>
                            <Input textColor={textColor} type="text" onChange={e => setUsername(e.target.value)} />
                        </FormControl>
                        <FormControl id="password" mt="3">
                            <FormLabel>Password</FormLabel>
                            <Input textColor={textColor} type="text" onChange={e => setPassword(e.target.value)} />
                        </FormControl>
                        <FormControl id="copart_type" mt="3">
                            <FormLabel>Type</FormLabel>
                            <Select placeholder="Select type" onChange={e => setType(e.target.value)} >
                                <option value="copart">copart</option>
                                <option value="manheim">manheim</option>
                                <option value="iaai">iaai</option>
                            </Select>
                        </FormControl>
                       
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={createAccount}>Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
}
