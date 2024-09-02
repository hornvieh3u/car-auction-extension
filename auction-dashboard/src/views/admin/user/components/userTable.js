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
    Badge,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Select,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import {
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable,
} from "react-table";

import { toast } from 'react-toastify'
import moment from 'moment';
import UserApi from 'api/user'

// Custom components
import Card from "components/card/Card";
import { isEmpty, isEmail } from "utilities";

// Assets
export default function UserTable({ columnsData, tableData, fetchUsers }) {

    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [ email, setEmail ] = useState('');
    const [ role, setRole ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

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

    const createUser = () => {

        if( isEmpty( email ) || isEmpty( role ) || isEmpty( password ) || isEmpty( confirmPassword ) ) {
            toast.error('Please input correct infomation.');
            return;
        }

        if( !isEmail( email ) ) {
            toast.error('Incorrect email.');
            return;
        }

        if( password !== confirmPassword ) {
            toast.error('Confirm Password is matched with password.');
            return;
        }

        UserApi.createOne({
            email,
            password,
            role
        }).then(res => {
            if (res.status === 200) {
                toast.success('Create successful.');
                fetchUsers();
            } else {
                toast.error('Error is incorrect.');
            }

            onClose();
        });
    }

    // const editUser = () => {
        
    // }

    const deleteUser = (id) => {
        UserApi.delete({id}).then(res => {
            if(res.status === 200) {
                toast.success('Deleted Success')
                fetchUsers()
            }
        })
    }

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
                    Users
                </Text>
                <Button size="md" colorScheme="blue" onClick={onOpen}>Create User</Button>
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
                                    } else if (cell.column.Header === "EMAIL") {
                                        data = (
                                            <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                {cell.value}
                                            </Text>
                                        );
                                    } else if (cell.column.Header === "ROLE") {
                                        data = (
                                            <Badge colorScheme={ cell.value === "admin" ? "red" : "blue" } variant="solid">
                                                <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                    {cell.value}
                                                </Text>
                                            </Badge>
                                        );
                                    } else if (cell.column.Header === "LAST LOGIN DATE") {
                                        data = (
                                            <Text color={textColor} fontSize='sm' fontWeight='700'>
                                                { !isEmpty(cell.value) ? moment(cell.value * 1).format('YYYY-MM-DD hh:mm:ss') : '' }
                                            </Text>
                                        );
                                    } else {
                                        data = (
                                            <Flex>
                                                {/* <Button colorScheme="yellow" size="sm" mr="1" onClick={editUser}>Edit</Button> */}
                                                <Button colorScheme="red" size="sm" onClick={() => deleteUser(row.values.id)}>Delete</Button>
                                            </Flex>
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
                    <ModalHeader>Create User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input textColor={textColor} type="email" onChange={e => setEmail(e.target.value)} />
                        </FormControl>
                        <FormControl id="role" mt="3">
                            <FormLabel>Role</FormLabel>
                            <Select placeholder="Select user role" onChange={e => setRole(e.target.value)} >
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </Select>
                        </FormControl>
                        <FormControl id="password" mt="3">
                            <FormLabel>Password</FormLabel>
                            <Input textColor={textColor} type="password" onChange={e => setPassword(e.target.value)} />
                        </FormControl>
                        <FormControl id="confirm_password" mt="3">
                            <FormLabel>Confirm Password</FormLabel>
                            <Input textColor={textColor} type="password" onChange={e => setConfirmPassword(e.target.value)} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={createUser}>Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
}
