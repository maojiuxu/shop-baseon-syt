import { reqGetHospitalShow } from "@/api/hospital/hospitalList";
import { HospitalShowType, HospitalType } from "@/api/hospital/model/hospiatlListTypes";
import { Button, Card, Descriptions, Skeleton, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function HospitalShow() {
    //声明 医院详情状态
    let [hospital,setHospital] = useState<HospitalShowType>();
    //获取id
    let {id} = useParams();

    //loading 状态
    let [loading,setLoading] = useState<boolean>(true);

    //获取 navigate 方法
    let navigate = useNavigate();

    //模拟生命周期  单独模拟 ComponentDidMount
    useEffect(()=>{
        //获取医院详情数据
        async function main(){
            //调用 请求医院详情方法
            let result = await reqGetHospitalShow(id as string);
            // console.log(result);
            //设置医院详情状态
            setHospital(result);
            // 设置loading 状态
            setLoading(false);
        }

        main();
    },[])

  return (
    <Card>
        {
            loading 
            ?  
            <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </> :
            <>
            <Descriptions title="基本信息" bordered column={2} labelStyle={{width:"150px"}}>
            <Descriptions.Item label="医院名称">{hospital?.hospital.hosname}</Descriptions.Item>
            <Descriptions.Item label="医院logo">
                <img width="80px" src={hospital?.hospital.logoData && `data:image/jpeg;base64,${hospital?.hospital.logoData}`}/>
            </Descriptions.Item>
            <Descriptions.Item label="医院编码">{hospital?.hospital.hoscode}</Descriptions.Item>
            <Descriptions.Item label="医院地址">{hospital?.hospital.param.fullAddress}</Descriptions.Item>
            <Descriptions.Item label="坐车路线" span={2}>
            {hospital?.hospital.route}
            </Descriptions.Item>

            <Descriptions.Item label="医院简介" span={2}>
            {hospital?.hospital.intro}
            </Descriptions.Item>
            </Descriptions>

            <Descriptions title="预约规则信息" bordered className="mt" column={2}>
            <Descriptions.Item label="预约周期" >{hospital?.bookingRule.cycle}</Descriptions.Item>
            <Descriptions.Item label="放号时间" >{hospital?.bookingRule.releaseTime}</Descriptions.Item>
            <Descriptions.Item label="停挂时间" >{hospital?.bookingRule.quitDay}</Descriptions.Item>
            <Descriptions.Item label="退号时间" >{hospital?.bookingRule.quitTime}</Descriptions.Item>
            <Descriptions.Item label="预约规则" span={2}>
                {hospital?.bookingRule.rule.map((item,index)=>{
                    return <div key={index}>
                        <div>{item}</div>
                    </div>
                })}
            </Descriptions.Item>
            </Descriptions>


            <Button className="mt" onClick={()=>{
                navigate(-1);
            }}>返回</Button>
            </>
        }
       
        
    </Card>
  )
}
