import { reqGetDepartmentList, reqGetScheduleList, reqGetScheduleRuleList } from '@/api/hospital/hospitalList';
import { DepartmentList, ScheduleList, ScheduleRuleItems } from '@/api/hospital/model/hospiatlListTypes';
import { Button, Card, Col, message, Pagination, Row, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table';
import Tree from 'antd/lib/tree';
import { Key, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export default function HospitalSchedule() {

    //获取医院编号
    let {hoscode}= useParams();

    //声明 医院科室 状态
    let [department,setDepartment]= useState<DepartmentList>();

    //所有一级科室的depcode
    let [expandedKeys,setExpandedKeys] = useState<string[]>();

    //声明 第一个一级科室里的第一个二级科室 depcode
    let [selectedKeys,setSelectedKeys] = useState<string>();

    // 声明 页码 
    let [current,setCurrent] = useState<number>(1);

    // 声明 每页展示数量 
    let [pageSize,setPageSize] = useState<number>(5);

    // 声明 总数
    let [total,setTotal] = useState<number>(0);

    //声明 医院排班信息的状态
    let [bookingScheduleList,setBookingScheduleList] = useState<ScheduleRuleItems>();

    // 声明 排班日期的状态
    let [workDate,setWorkDate] = useState<string>();

    // 声明 医生状态
    let [schedule,setSchedule] = useState<ScheduleList>();

    //  声明医院名称 状态
    let [hosname,setHosname] = useState<string>();

    //声明科室名称 状态
    let [depname,setDepname] = useState<string>();

    //获取树状结构高度
    let height = document.documentElement.clientHeight - 64 - 34 - 24 * 2 - 70;

    //获取navigate 方法
    let navigate = useNavigate();

    //表格 表头数据
    let columns:ColumnsType<any> = [
        {
            title:"序号",
            width:70,
            align:"center",
            render:(key,row,index)=>{
                return index+1;
            }
        },
        {
            title:"职称",
            dataIndex:"title",
            align:"center",
        },
        {
            title:"号源时间",
            dataIndex:"workDate",
            align:"center",
        },
        {
            title:"总预约数",
            dataIndex:"reservedNumber",
            align:"center",
        },
        {
            title:"剩余预约数",
            dataIndex:"availableNumber",
            align:"center",
        },
        {
            title:"挂号费（元）",
            dataIndex:"amount",
            align:"center",
        },
        {
            title:"擅长技能",
            dataIndex:"skill",
            align:"center",
            width:180
        },

    ]

    // 获取医院科室数据
    let getDepartmentList = async ()=>{
        //请求 医院所有科室
        let result = await reqGetDepartmentList(hoscode as string);
        // console.log(result);

        // 获取所有的一级科室 depcode
        let OneDepcode= result.map((item)=>{
            return item.depcode;
        })
        //设置一级科室depcode
        setExpandedKeys(OneDepcode);

        // 为所有的一级科室添加 禁用 disabled 属性
        let newDepartment = result.map((item)=>{
            item.disabled = true;
            return item;
        })

        //获取第一个一级科室的第一个二级科室
        let twoDepcode = (newDepartment[0].children as DepartmentList)[0].depcode;
        // 设置选中科室的状态
        setSelectedKeys(twoDepcode);
        //设置科室状态
        setDepartment(newDepartment);

       
    }

    //请求 医院科室 排班信息 及  医生的信息
    let ScheduleRuleList = async ()=>{

        try{
         //请求对应的科室的所有的排班数据信息
         let res =  await reqGetScheduleRuleList({page:current,limit:pageSize,hoscode:hoscode as string,depcode:selectedKeys as string});
        //  console.log(res);
         //设置分页总数
         setTotal(res.total);
         //设置医院名称
         setHosname(res.baseMap.hosname);
         //设置 排班信息的具体数据
         setBookingScheduleList(res.bookingScheduleList);
 
         //获取第一个排班日期
         let OneworkDate = res.bookingScheduleList[0].workDate;
 
         //设置排班日期的状态
         setWorkDate(OneworkDate);


        }catch{
            message.error("失败");
        }
    }

    //获取某个排班日期的医生的数据 方法
    let getDocList =async ()=>{
         // 请求 某个排班日期的医生数据
         let ScheduleList = await reqGetScheduleList({ hoscode:hoscode as string, depcode:selectedKeys as string, workDate:workDate as string });
         // console.log(ScheduleList);
         //设置医生状态
         setSchedule(ScheduleList);
         //设置科室名称
         setDepname(ScheduleList[0].param.depname);
    }

    //点击 树结构触发 获取新的科室编号
    let TreeSelect = async (selectedKeys: Key[])=>{
        // console.log(selectedKeys);
        // 设置 科室的编号 状态
        setSelectedKeys(selectedKeys[0] as string);
       
    }

    //点击排班日期 切换对应的 医生数据
    let changeWorkDate = (workDate:string)=>{
        return ()=>{
            // console.log(workDate);
            //更新 排班日期 状态
            setWorkDate(workDate);
        }
    }

    //模拟生命周期
    useEffect(()=>{
        getDepartmentList();
    },[])

    //当 科室编号发生变化时， 立即调用 请求 医院科室 排班信息 及  医生的信息
    useEffect(()=>{
        if(!selectedKeys) return;
        //调用 医院科室 排班信息 及  医生的信息
        ScheduleRuleList();
    },[selectedKeys,current,pageSize])

    //当 workDate 变化是，立即调用获取医生数据  方法
    useEffect(()=>{
        if(!workDate) return;
        getDocList();
    },[workDate])
      
    return (
        <Card>
            {/* 顶部导航 */}
            <p>选择: {hosname} / {depname} / {workDate}</p>
            {/* 内容部分 */}
            <Row gutter={30}>
                {/* 左侧科室部分 */}
                <Col span={6}>
                <Tree
                    style={{border:"1px solid grey",height:height,overflow:"auto"}}
                    //展开指定的树节点
                    expandedKeys={expandedKeys}
                    //选中的树节点
                    selectedKeys={[selectedKeys as string]}
                    //树形结构 数据
                    treeData={department as []}
                    // 数据映射、指定
                    fieldNames={{
                        title:"depname",
                        key:"depcode"
                    }}
                    // 点击树节点触发
                    onSelect={TreeSelect}
                    />
                </Col>
                {/* 右侧部分 */}
                <Col span={18}>
                    {/* 日期部分 */}
                    <div>
                        {
                            bookingScheduleList?.map(item =>{
                                return <Tag style={{cursor:"pointer"}} onClick={changeWorkDate(item.workDate)} color={item.workDate === workDate ? "green" : ""} key={item.workDate}>
                                            <div>{item.workDate} {item.dayOfWeek}</div>
                                            <div>{item.availableNumber}/{item.reservedNumber}</div>
                                        </Tag>
                            })
                        }
                        
                       
                    </div>
                    {/* 分页部分 */}
                    <Pagination 
                        className='mt'
                        pageSize={pageSize}
                        current={current}
                        total={total} 
                        showSizeChanger={true}
                        pageSizeOptions={[5,8,10,12]}
                        onChange={(page: number, pageSize: number)=>{
                            //设置当前页码
                            setCurrent(page);
                            //设置每页展示数量
                            setPageSize(pageSize);
                        }}
                    />

                    {/* 表格部分 */}
                    <Table
                        className='mt'
                        dataSource={schedule}
                        columns={columns}
                        bordered
                        pagination={false}
                        rowKey="id"
                    ></Table>


                    <Button className='mt' onClick={()=>{
                        navigate(-1);
                    }}>返回</Button>


                </Col>

            </Row>

        </Card>
    )
}
