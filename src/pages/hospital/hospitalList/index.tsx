import { Button, Card, Form, Input, message, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import {SearchOutlined} from "@ant-design/icons"
import Table, { ColumnsType } from 'antd/lib/table';
import { reqGetCityOrDistrictList, reqGetHospitalList, reqGetProvinceList, reqUpdateHospitalStatus } from '@/api/hospital/hospitalList';
import { HospitalListTypes, ProvinceList } from '@/api/hospital/model/hospiatlListTypes';
import { useForm } from 'antd/lib/form/Form';
import { useNavigate } from 'react-router-dom';
let {Option} = Select;
export default function HospitalList() {

  //设置 每页展示数量
  let [pageSize,setPageSize]= useState<number>(5);
  //设置 总数量
  let [total,setTotal]= useState<number>(0);
  //设置 当前页码
  let [current,setCurrent]= useState<number>(1);

  //设置医院列表数据状态
  let [hospital,setHospital] = useState<HospitalListTypes>([]);

  //设置loading 加载状态
  let [loading,setLoading] = useState<boolean>(false);

  //设置 省份 状态
  let [province,setProvince] = useState<ProvinceList>([]);

  //设置 市 状态
  let [city,setCity] = useState<ProvinceList>([]);

  //设置区状态
  let [district,setDistrict] = useState<ProvinceList>([]);

  //设置医院类型状态
  let [hostype,setHostype] = useState<ProvinceList>([]);

  //搜索状态
  let [isSearch,setIsSearch] = useState<boolean>(false);

  // 获取 form hook
  let [form] = useForm();

  //获取 navigate 跳转方法
  let navigate = useNavigate();

  //封装请求分页数据方法
  let getHospitalList = async (bol:boolean = false)=>{
    
    let search;
    if(isSearch || bol){
      //  获取 表单搜索数据
       search = form.getFieldsValue();
    }else{
       search = {}
    }
    
    //设置loading 加载中
    setLoading(true);
    //调用请求分页数据api
    let result = await reqGetHospitalList({page:current,limit:pageSize,...search});
    // console.log(result)
    //设置数据
    setHospital(result.content);
    //设置总数
    setTotal(result.totalElements);
    //设置取消加载中
    setLoading(false);
  }


//模拟生命周期
  useEffect(()=>{
    getHospitalList();
  },[pageSize,current])


  //请求 省份信息数据
  useEffect(()=>{
    async function main(){
        //获取省份数据
        let result = await reqGetProvinceList();
        // console.log(result)
        //设置省份状态
        setProvince(result);

        //获取医院类型的数据
        let result1 = await reqGetCityOrDistrictList(10000);
        // console.log(result1);
        //设置医院状态数据
        setHostype(result1);
    }

    main();
  },[]);


  //获取市数据
  let getcity = async (value: any)=>{
    // console.log(value);
    //  清空 市和区 表单数据
    form.setFieldsValue({cityCode:null,districtCode:null});
    //清空区状态
    setDistrict([]);
    //请求市 数据
    let result = await reqGetCityOrDistrictList(value);
    //设置市数据
    setCity(result);
  }
  

  //获取区数据
  let getDistrict = async (value:any)=>{
    //  清空 区 表单数据
    form.setFieldsValue({districtCode:null});
     //请求区 数据
     let result = await reqGetCityOrDistrictList(value);
     //设置区数据
     setDistrict(result);
  }

  // 提交表单获取表单数据
  let finish = ()=>{
    // 设置 isSearch
    setIsSearch(true);
    //设置 页码
    setCurrent(1);
    //设置每页展示数量
    setPageSize(5);
    // //调用获取分页数据方法
    getHospitalList(true); 
  }

  //监听搜索 方法
  useEffect(()=>{
      //调用获取分页数据方法
      getHospitalList(); 
  },[isSearch])

 

  //清空表单
  let reset = ()=>{
    // 设置 isSearch
    setIsSearch(false);
    //清空表单数据
    form.setFieldsValue({cityCode:null,districtCode:null});
    //清空市状态
    setCity([]);
    //清空区状态
    setDistrict([]);

    //调用获取分页数据方法
    getHospitalList();

    //设置 页码
    setCurrent(1);
    //设置每页展示数量
    setPageSize(5);
  }

  //更新医院状态
  let updateStatus = (id:string,status:number)=>{
    return async ()=>{
      //调用更新医院状态的方法
      await reqUpdateHospitalStatus(id,status ? 0 : 1);
      //提示
      message.success("更新成功！");
      //重新调用 分页列表方法
      getHospitalList();
    }
  }
    

  //表头信息
  let columns: ColumnsType<any>= [
    {
      title:"序号",
      // dataIndex:""
      align:"center",
      width:80,
      render:(key,row,index)=>{
        return index+1;
      }
    },
    {
      title:"医院logo",
      dataIndex:"logoData",
      align:"center",
      render:(key)=>{
        // console.log(key);
        return <img width="80px" src={`data:image/jpeg;base64,${key}`} alt="" />
      }
    },
    {
      title:"医院名称",
      dataIndex:"hosname",
      align:"center",
    },
    {
      title:"等级",
      dataIndex:"param",
      render:(param)=>{
        return param.hostypeString
      },
      align:"center",
    },
    {
      title:"详细地址",
      dataIndex:"param",
      render:(param)=>{
        return param.fullAddress
      },
      align:"center",
    },
    {
      title:"状态",
      dataIndex:"status",
      render:(key)=>{
        return key === 0 ? <span style={{color:"red"}}>未上线</span> : <span style={{color:"blue"}}>已上线</span>;
      },
      align:"center",
    },
    {
      title:"创建时间",
      dataIndex:"createTime",
      align:"center",
    },
    {
      title:"操作",
      align:"center",
      fixed:"right",
      width:260,
      render:(row)=>{
        
        return <span>
          <Button type="primary" onClick={()=>{
            navigate(`/syt/hospital/hospitalList/show/${row.id}`)
          }}>查看</Button>
          <Button className='ml' type="primary" onClick={()=>{
            navigate(`/syt/hospital/hospitalList/schedule/${row.hoscode}`)
          }}>排班</Button>
          <Button className='ml' type="primary" onClick={updateStatus(row.id,row.status)}>{row.status ? "下线" : '上线'}</Button>

        </span>
      }
    }
  ]

    return (
      <Card>
          {/* 搜索部分 */}
          <Form
            form={form}
            layout='inline'
            onFinish={finish}
            onReset={reset}
          >

          <Form.Item
              name="provinceCode"
            >
              <Select onChange={getcity} style={{width:180}} placeholder="请选择省">
                {
                  province.map(item =>{
                    return  <Option key={item.id} value={item.id}>{item.name}</Option>

                  }) 
                }
              </Select>
          </Form.Item>

          <Form.Item
              name="cityCode"
            >
              <Select onChange={getDistrict} style={{width:180}} placeholder="请选择市">
                {
                  city.map(item =>{
                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                  })
                }
                
               
              </Select>
          </Form.Item>


          <Form.Item
              name="districtCode"
            >
              <Select style={{width:180}} placeholder="请选择区">
              {
                  district.map(item =>{
                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                  })
                }
              </Select>
          </Form.Item>


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

            <Form.Item
              name="hostype"
              className='mt'
            >
              <Select style={{width:180}} placeholder="医院类型">
                {
                  hostype.map(item =>{
                    return <Option key={item.id} value={item.value}>{item.name}</Option>
                  })
                }
              </Select>
          </Form.Item>

          <Form.Item
              name="status"
              className='mt'
            >
              <Select style={{width:180}} placeholder="医院状态">
                <Option value={1}>已上线</Option>
                <Option value={0}>未上线</Option>
              </Select>
          </Form.Item>

          
            <Form.Item className='mt'>
              <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
                查询
              </Button>
              <Button className='ml' type="default" htmlType="reset">
                清空
              </Button>
            </Form.Item>
          </Form>
          {/* 搜索部分 */}


          {/* 表格 */}
          <Table 
            bordered
            loading={loading}
            rowKey="id"
            className='mt' 
            columns={columns}
            dataSource={hospital}
            scroll={{x:1200}}
            pagination={{
              total,
              pageSize,
              current,
              showQuickJumper:true,
              pageSizeOptions:[5,10,15,20],
              showSizeChanger:true,
              showTotal:(total: number)=>{
                return <span>总数：{total} 条</span>
              },
              onChange:(page: number, pageSize: number)=>{
                  // console.log(page)
                  // console.log(pageSize);
                  //设置每页展示数量
                  setPageSize(pageSize);
                  //设置 页码
                  setCurrent(page);
              }
             
            }}
            
           
           ></Table>


      </Card>
    )
}
