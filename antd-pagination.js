import {AutoComplete, Button, Form, Input, PageHeader, Select, Space, Table, Tag, Typography} from 'antd';
import {useQuery} from 'react-query'
import {Link} from "react-router-dom";
import axios from 'axios'
import {useUpdateStatus} from './hooks/useUpdateStatus';
import {CheckOutlined, LockOutlined} from "@ant-design/icons";
import './TableSharedStyle.css'
import {useResolveSelectedTickets} from './hooks/useResolveSelectedTickets';
import React, {useContext, useEffect, useRef, useState} from 'react';
import CustomLoader from '../components/custom/CustomLoader';
import useAuth from "../../../auth/hook/useAuth";
import {API_URL, API_USER_URL} from "../../../global/axios";
import moment from "moment/moment";

const {Option} = Select;
const EditableContext = React.createContext(null);

//Editable Row component
const EditableRow = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

//Editable Cell component
const EditableCell = ({title, editable, children, dataIndex, record, handleSave, components, type, ...restProps}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            //[dataIndex]: record[dataIndex]
            [dataIndex]: ""
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            setEditing(!editing);
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <>
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `Ce champs est requis`,
                        },
                    ]}
                >
                    {components({onChange: save, onBlur: toggleEdit, ref: inputRef, record: record})}
                </Form.Item>
            </>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

//Waitlist component
function WaitList() {
    //hooks
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const {mutate: markedAsResolvedOrClosed} = useResolveSelectedTickets();
    const {mutate: updateState} = useUpdateStatus();
    let [filteredData, setFilteredData] = useState([]);
    let [filteredUserData, setFilteredUserData] = useState([]);
    let {auth} = useAuth();
    let [defaultAgency, setDefaultAgency] = useState(auth.agency);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    //List WaitList
    const fetchWaitlist = (page, pageSize) => {
        return axios.get(API_URL + `tickets/waitlist?page=${page}&pageSize=${pageSize}&source=` + defaultAgency)

    }
    //List user
    const fetchUser = () => {
        return axios.get(API_USER_URL + "users")
    }
    //List Agency
    const fetchAgency = () => {
        return axios.get(API_USER_URL + "users/agencies")
    }
    //List Next Status
    const fetchNextStatus = (statusID) => {
        return axios.get(API_URL + "tickets/status?following="+statusID);
    }
    const {data: waitlist, refetch: refecthWaitList, isLoading} = useQuery(["waitlist", pagination.current, pagination.pageSize], () => fetchWaitlist(pagination.current, pagination.pageSize), {
        onSuccess: (data) => {
            setFilteredData(data?.data.content);
            setPagination({
                ...pagination, total: data?.data.totalElements
            });
            
        },
        keepPreviousData: true
    })
    const {data: users} = useQuery("userlist", fetchUser, {enabled: false})
    const {data: agencies, isAgencyLoading} = useQuery("agencieslist", fetchAgency)

    useEffect(() => {
        setFilteredUserData(users?.data.content);
    }, [users]);
    useEffect(() => {
        refecthWaitList();
    }, [defaultAgency])

    //functions
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        type: "checkbox",
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const markSelectedAsSolvedOrClosed = (action) => {
        selectedRowKeys.forEach((ticketId) => {
            markedAsResolvedOrClosed({ticketId: ticketId, status: action})
        })
    }
    //Filter users in table
    const onSearchUser = (value) => {
        if (value !== '') {
            setFilteredUserData(users?.data.filter((user) => user.username.toLowerCase().includes(value.toLowerCase())))
        } else {
            setFilteredUserData(users?.data);
        }
    };

    //Columns
    const defaultColumns = [
        {
            title: 'Intitulé',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => <Link to={`${record.id}`}>{text}</Link>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            className: 'table_cell--width',
            render: (text) => <p>{new DOMParser().parseFromString(text, 'text/html').body.textContent}</p>
        },
        {
            title: 'Emetteur',
            dataIndex: 'reporter',
            key: 'reporter',
            sorter: {
                compare: (a, b) => a.reporter.length - b.reporter.length,
                multiple: 1,
            }
        },
        {
            title: 'Attribuer à',
            dataIndex: 'assigned_to',
            key: 'assignee',
            editable: true,
            type: "select",
            sorter: {
                compare: (a, b) => a.assigned_to.length - b.assigned_to.length,
                multiple: 2,
            },
            components: ({onChange, onBlur, ref}) => {
                return (
                    <AutoComplete
                        style={{
                            width: 200,
                        }}
                        onSelect={onChange}
                        onBlur={onBlur}
                        onSearch={onSearchUser}
                        placeholder="Rechercher les utilisateurs" ref={ref}
                    >
                        {filteredUserData.map((user, key) => (
                            <Option key={user.username + key} value={user.username}>
                                {user.username}
                            </Option>
                        ))}
                    </AutoComplete>)
            },
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            filters: [
                {
                    text: 'Nouveau',
                    value: 'Nouveau',
                },
                {
                    text: 'Assigné',
                    value: 'Assigné',
                },
                {
                    text: 'En cours',
                    value: 'En cours',
                }
            ],
            onFilter: (value, record) => record.status.statusLabel.indexOf(value) === 0,
            render: (status, record) => {
                return (
                    <Select defaultValue={status.statusLabel} style={{width: "98px"}}
                            onChange={(status) => {
                                updateState({id: record.id, status: status})
                            }}>
                        <Option value={status.statusId}>{status.statusLabel}</Option>{/*
                        <Option value="Assigné">Assigné</Option>
                        <Option value="En cours">En cours</Option>
                        <Option value="Résolu">Résolu</Option>
                        <Option value="Fermé">Fermé</Option>*/}
                    </Select>
                )
            },
        },
        {
            title: 'Departement',
            dataIndex: 'department',
            key: 'department',
            sorter: {
                compare: (a, b) => a.department.length - b.department.length,
                multiple: 3,
            }
        },
        {
            title: 'Priorité',
            key: 'priority',
            dataIndex: 'priority',
            filters: [
                {
                    text: 'Urgent',
                    value: 'Urgent',
                },
                {
                    text: 'Important',
                    value: 'Important',
                },
                {
                    text: 'Moyen',
                    value: 'Moyen',
                },
                {
                    text: 'Normal',
                    value: 'Normal',
                }
            ],
            onFilter: (value, record) => record.priority.priorityLabel.indexOf(value) === 0,
            render: (priority) => {
                let color = priority.priorityLabel === 'Urgent' ? 'red' : priority.priorityLabel === 'Important' ? 'volcano' : priority.priorityLabel === 'Moyen' ? 'orange' : 'cyan';
                return (
                    <Tag color={color} key={priority}>
                        {priority.priorityLabel.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Catégorie',
            dataIndex: 'category',
            key: 'category',
            render: (category) => category.name
        },
        {
            title: 'Émis le',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => moment(created_at).fromNow()
        }
    ];
    // Search In table
    const onSearch = (value) => {
        if (value !== '') {
            setFilteredData(waitlist?.data.content.filter((data) => data.title.toLowerCase().includes(value.toLowerCase()) || data.description.toLowerCase().includes(value.toLowerCase())))
        } else {
            setFilteredData(waitlist?.data.content);
        }
    };
    //Custom Construct Data Colum and Cell
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    //Save change row in Data
    const handleSave = (row) => {
        const newData = [...filteredData];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {...item, ...row});
        setFilteredData(newData);
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                components: col.components,
                type: col.type,
                handleSave,
            }),
        };
    });

    return (
        <>
            <PageHeader
                title="Tous les tickets"
                extra={[
                    <Typography.Title level={5} key="title">Agence : </Typography.Title>,
                    (!isAgencyLoading && (
                        <Select key="select" size="large" style={{width: 200}} defaultValue={defaultAgency}
                                onChange={(value) => setDefaultAgency(value)}>
                            {agencies?.data.map((agency) => {
                                return (<Option key={agency.id} value={agency.name}>{agency.name}</Option>)
                            })}
                        </Select>))
                ]}
            />
            {hasSelected ? <Space style={{marginBottom: 12, display: 'flex', justifyContent: 'end'}}>
                <Button onClick={() => markSelectedAsSolvedOrClosed("Résolu")} icon={<CheckOutlined/>}>Marquer comme
                    résolu</Button>
                <Button onClick={() => markSelectedAsSolvedOrClosed("Fermé")} icon={<LockOutlined/>}>Fermer les
                    tickets</Button>
            </Space> : ''}
            <Input.Search placeholder="Recherche" onChange={(e) => onSearch(e.target.value)}
                          style={{width: 300, marginBottom: 20}}/>
            {!isLoading ? <Table
                components={components}//Add new Custom Cell and Row
                pagination={{
                    ...pagination, showSizeChanger: true, onChange: (page, pageSize) => {
                        setPagination({current: page, pageSize: pageSize})
                    }
                }}
                columns={columns} rowClassName="waitlist-table_row--shadow" rowSelection={rowSelection} rowKey="id"
                dataSource={filteredData} className="all-tickets_table" scroll={{x: "true"}}/> : <CustomLoader/>}

        </>
    )
}

export default WaitList
