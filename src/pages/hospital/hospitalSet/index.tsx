import { Button, Card, Form, Input, message, Result, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import {SearchOutlined,EditOutlined ,DeleteOutlined,ExclamationCircleFilled} from "@ant-design/icons";
import { ColumnsType } from 'antd/lib/table';
import { reqBatchRemoveHospitalList, reqGetHospitalSetList, reqRemoveHospital } from '@/api/hospital/hospitalSet';
import { HospitalSetList } from '@/api/hospital/model/hospitalSetTypes';
import { useForm } from 'antd/lib/form/Form';
import { useNavigate } from 'react-router-dom';
import confirm from 'antd/lib/modal/confirm';

export default function HospitalSet() {

    //设置 每页总数 状态
    let [total,setTotal]= useState(0);
    //设置 当前页码
    let [current,setCurrent] = useState(1);
    //设置每页展示数量
    let [pageSize,setPageSize] = useState(5);

    //设置 医院列表状态
    let [hospital,setHospital] = useState<HospitalSetList>([]);

    //设置 加载中状态
    let [loading,setLoading] = useState(false);

    //设置批量删除按钮 禁用状态
    let [listId,setListId] = useState<React.Key[]>([]);

    // 获取 navigate
    let navigate = useNavigate();

    //获取 表单hook
    let [form] = useForm();
    //提交搜索表单方法
    let finish = ()=>{
        gethospital();
    }

    //清空搜索表单
    let reset = ()=>{
        //  清空表单
        form.resetFields();
         //设置页码
         setCurrent(1);
         //设置每页展示数量
         setPageSize(5);
        // 重新请求 api方法
        gethospital();
    }

    //删除单个医院
    let remove =  (id:number,hosname:string)=>{
        return  ()=>{

            confirm({
                title: `确定删除 ${hosname} 吗?`,
                icon: <ExclamationCircleFilled style={{color:"red"}} />,
                cancelText:"取消",
                okText:"确定",
                async onOk() {
                  await reqRemoveHospital(id);
                //成功提示
                message.success("删除成功！");
                //重新请求数据
                gethospital();
                }
              });
            
        }
    }

    //表格表头信息
    const columns:ColumnsType<any> = [
        {
            title:"序号",   //表格列表名称
            width:80,
            align:"center",
            // dataIndex:"id",  //表格列表对应的数据
            render:(key:any,row:any,index:number)=>{  //自定义渲染
                //  key  ==>  dataIndex值
                // row   ====>  一行输数据
                //  index   ===>  数据的下标
                return index+1;
            }
        },
        {
            title:"医院名称",
            dataIndex:"hosname",
            align:"center",
        },
        {
            title:"医院编号",
            dataIndex:"hoscode",
            align:"center",
        },
        {
            title:"api基础路径",
            dataIndex:"apiUrl",
            align:"center",
        },
        {
            title:"签名",
            dataIndex:"signKey",
            align:"center",
        },
        {
            title:"联系人姓名",
            dataIndex:"contactsName",
            align:"center",
        },
        {
            title:"联系人手机",
            dataIndex:"contactsPhone",
            align:"center",
        },
        {
            title:"操作",
            fixed:"right",
            align:"center",
            // dataIndex:"hosname",
            render:(row)=>{
                // render  
                //1. 如果 配置中有 dataIndex 值，此时，
                //    render 第一个参数就指向dataIndex
                //    render 第二个参数就指向这一行数据
                //    render 第一个参数就指向 数据 index下标

                 //1. 如果 配置中没有 dataIndex 值，此时，
                //    render 第一个参数就指向 这一行数据 
            
                return <span>
                    <Button onClick={()=>{
                        navigate(`/syt/hospital/hospitalSet/edit/${row.id}`);
                    }} icon={<EditOutlined />} type="primary"></Button>
                    <Button  onClick={remove(row.id,row.hosname)}
                    className='ml' icon={<DeleteOutlined />} danger type="primary"></Button>
                </span>
            }
        }
        
    ]

    //创建请求医院设置列表的 方法
    let gethospital = async ()=>{

        //获取表单搜索数据 
        let {hosname,hoscode}= form.getFieldsValue();

        //设置加载中
        setLoading(true);
        //调用 请求医院设置列表的 api
        let result = await reqGetHospitalSetList({page:current,limit:pageSize,hosname,hoscode});
        
        // 取消加载中
        setLoading(false);
        // console.log(result);
        //设置医院列表数据
        setHospital(result.records);
        //设置总数
        setTotal(result.total);
    }

    //批量删除
    let removeAll = async ()=>{
        //调用批量删除 方法
        await reqBatchRemoveHospitalList(listId);
        // 提示
        message.success("批量删除成功！");
        //重新请求数据
        gethospital();
    }

    // 模拟声明周期
    useEffect(()=>{
        // 请求医院设置列表数据
        gethospital();
    },[current,pageSize]);


    return (
        <Card>
            {/* 搜索表单  start */}

            <Form
                form={form}
                layout="inline"
                onFinish={finish}
                onReset={reset}
                >
                <Form.Item
                    name="hosname"
                >
                    <Input placeholder='医院名称' />
                </Form.Item>

                <Form.Item
                    name="hoscode"
                >
                    <Input placeholder='医院编号' />
                </Form.Item>

                <Form.Item>
                    <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
                        查询
                    </Button>
                    <Button className='ml' type="default" htmlType="reset">
                        清空
                    </Button>
                </Form.Item>
            </Form>
        
            {/* 搜索表单  end */}

            {/* 两个按钮 */}
            <div className='mt'>
                <Button type="primary" onClick={()=>{
                    navigate("/syt/hospital/hospitalSet/add");
                }}>添加</Button>

                <Button onClick={removeAll} className='ml' danger type="primary" disabled={listId.length === 0}>批量删除</Button>
            </div>
            {/* 两个按钮 */}


            {/* 表格 */}
                <Table 
                    loading={loading}
                    rowKey="id"
                    className='mt'
                    dataSource={hospital} 
                    columns={columns}
                    bordered
                    scroll={{x:1200}}
                    pagination={{
                        total:total,   //数据总数
                        current:current,   //当前页码
                        pageSize:pageSize,  //每页展示条数
                        showSizeChanger:true,  //固定显示 切换条数
                        pageSizeOptions:[5,10,15,20],  // 指定每页可以显示多少条
                        showQuickJumper:true,   //是否可以快速跳转至某页
                        showTotal:(total)=>{
                            return <span>总数:{total}条</span>
                        },
                        onChange:(page: number, pageSize: number)=>{  //切换页码执行
                            // console.log(page,pageSize);
                            //设置页码
                            setCurrent(page);
                            //设置每页展示数量
                            setPageSize(pageSize);
                        }
                    }}
                    rowSelection={{
                        onChange:(selectedRowKeys: React.Key[])=>{
                            // selectedRowKeys  当前表格这一行的 rowKey []
                            // selectedRows  当前表格这一行数据
                            // console.log(selectedRowKeys);
                            //设置 状态
                            setListId(selectedRowKeys);

                        }
                    }}
                ></Table>

            {/* 表格 */}

        </Card>
        
    )
}
