import { request } from "@/utils/http";
import  React  from "react";
import { HospitalSetItem, ReqAddHospitalParams, ReqHospitalSetListParams, ReqHospitalSetListResponse, ReqUpdateHospitalParams } from "./model/hospitalSetTypes";
//  封装 请求 医院设置 请求api
export function reqGetHospitalSetList({page,limit,hosname,hoscode}:ReqHospitalSetListParams){
    return request.get<any,ReqHospitalSetListResponse>(`/admin/hosp/hospitalSet/${page}/${limit}`,{
        params:{
            hosname,
            hoscode
        }
    });
}

/**
 * 请求 添加医院的请求 方法
 * @param hospital   ReqAddHospitalParams
 * @returns   null
 * @author 220907全体成员
 */
export  let reqAddHospital = (hospital:ReqAddHospitalParams) =>{
    return request.post<any,null>("/admin/hosp/hospitalSet/save", hospital);
}


/**
 *  单个医院展示 数据 请求 方法
 * @param id   number
 * @returns   HospitalSetItem
 */
export let reqGetHospital = (id:string)=>{
    return request.get<any,HospitalSetItem>(`/admin/hosp/hospitalSet/get/${id}`);
}

/**
 * 更新医院
 * @param hospital   ReqUpdateHospitalParams
 * @returns   null
 */
export let reqUpdateHospital = (hospital:ReqUpdateHospitalParams)=>{
    return request.put<any,null>("/admin/hosp/hospitalSet/update",hospital);
}

/**
 * 删除单个医院
 * @param id   number
 * @returns   null
 */
export let reqRemoveHospital = (id:number)=>{
    return request.delete<any,null>(`/admin/hosp/hospitalSet/remove/${id}`);
}


/**
 * 批量删除医院
 * @param hospitalListId   React.Key[]
 * @returns  null
 */
export let reqBatchRemoveHospitalList = (hospitalListId:React.Key[])=>{
    return request.delete<any,null>("/admin/hosp/hospitalSet/batchRemove",{
        data:hospitalListId
    })
}









