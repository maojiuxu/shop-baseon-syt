import { reqAddHospital, reqGetHospital, reqUpdateHospital } from '@/api/hospital/hospitalSet';

import { Button, Card, Form, Input, message } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export default function AddOrUpdateHospital() {
    //获取表单数据hook
    let [form]= useForm();

    //  获取 params 参数
    let {id} = useParams();

    //  编程式路由
    let navigate = useNavigate();

    //提交表单方法
    let finish = async ()=>{
        let addHospitalValue = form.getFieldsValue();
        // console.log(addHospitalValue);

        if(id){
            //更新医院
            await reqUpdateHospital({
                ...addHospitalValue,
                id
            });

             // 成功提示
             message.success("更新成功");
        }else{
            //发送请求  添加医院
            await reqAddHospital(addHospitalValue);
            // 成功提示
            message.success("添加成功");
        }

        //返回到 医院设置 列表页面
        navigate("/syt/hospital/hospitalSet");

    }

    // 模拟声明周期
    useEffect(()=>{
        async function main(){
            let hospital =  await reqGetHospital(id as string);
            // console.log(result);
            // console.log(hospital);
            //在表单中展示数据
            form.setFieldsValue(hospital);
        }

        main();
    },[])

    return (
        <Card>
            <Form
            form={form}
            onFinish={finish}
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            >
            <Form.Item
                label="医院名称"
                name="hosname"
                rules={[{ required: true, message: '请输入医院名称！' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="医院编号"
                name="hoscode"
                rules={[{ required: true, message: '请输入医院编号！' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="api基础路径"
                name="apiUrl"
                rules={[{ required: true, message: '请输入api基础路径！' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="联系人姓名"
                name="contactsName"
                rules={[
                    { required: true, message: '请输入联系人姓名！' },
                    {pattern:/^[\u4e00-\u9fa5]{0,}$/,message:"请输入正确的姓名（只能是汉字）!"}
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="联系人手机"
                name="contactsPhone"
                rules={[
                    { required: true, message: '请输入联系人手机号码！' },
                    {pattern:/^1([358][0-9]|4[456789]|6[67]|7[0135678]|9[1589])\d{8}$/,message:"请输入正确的手机号码！"}
                ]}
            >
                <Input />
            </Form.Item>

        
            <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    保存
                </Button>

                <Button onClick={()=>{
                     navigate("/syt/hospital/hospitalSet");
                }} className='ml' type="default">
                    返回
                </Button>
            </Form.Item>
            </Form>
        </Card>
    )
}
