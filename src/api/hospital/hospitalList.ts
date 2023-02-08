import { request } from "@/utils/http"
import { DepartmentList, HospitalShowType, HospitalType, ProvinceList, ReqGetHospitalListParams, ReqGetHospitalListResponse, ReqGetHospitalRuleListResponse, ReqGetScheduleListParams, ReqGetScheduleRuleListParams, ScheduleList } from "./model/hospiatlListTypes";


/**
 *  请求医院列表分页数据的方法
 * @param param0   ReqGetHospitalListParams
 * @returns   ReqGetHospitalListResponse
 */
export let reqGetHospitalList = ({page,limit,...args}:ReqGetHospitalListParams)=>{
    return request.get<any,ReqGetHospitalListResponse>(`/admin/hosp/hospital/${page}/${limit}`,
       {
        params:args
       }
    );
}


/**
 * 请求省份信息的方法
 * @returns   ProvinceList
 */
export let reqGetProvinceList = ()=>{
    return request.get<any,ProvinceList>("/admin/cmn/dict/findByDictCode/province");
}


/**
 * 请求市和区信息的方法
 * 请求 医院类型的方法  参数为固定值  10000
 * @param parentId   number
 * @returns ProvinceList
 */
export let reqGetCityOrDistrictList = (parentId:number)=>{
    return request.get<any,ProvinceList>(`/admin/cmn/dict/findByParentId/${parentId}`);
}

/**
 * 更新医院上下线状态
 * @param id string   医院id
 * @param status number  医院状态
 * @returns Promise<null>
 */
export let reqUpdateHospitalStatus = (id:string,status:number)=>{
    return request.get<any,null>(`/admin/hosp/hospital/updateStatus/${id}/${status}`);
}

/**
 * 获取医院详情数据
 * @param id  string 医院id
 * @returns   Promiose<HospitalType>
 */
export let reqGetHospitalShow = (id:string)=>{
    return request.get<any,HospitalShowType>(`/admin/hosp/hospital/show/${id}`);
}

/**
 * 获取医院科室 请求方法
 * @param hoscode   string  医院编号
 * @returns   Promise<DepartmentList>
 */
export let reqGetDepartmentList = (hoscode:string)=>{
    return request.get<any,DepartmentList>(`/admin/hosp/department/${hoscode}`);
}

/**
 * 请求医院排班信息的方法
 * @param param0 {page,limit,hoscode,depcode}:ReqGetScheduleRuleListParams
 * @returns ReqGetHospitalRuleListResponse
 */
export let reqGetScheduleRuleList = ({page,limit,hoscode,depcode}:ReqGetScheduleRuleListParams)=>{
    return request.get<any,ReqGetHospitalRuleListResponse>(`/admin/hosp/schedule/getScheduleRule/${page}/${limit}/${hoscode}/${depcode}`)
}

/**
 * 请求医生具体信息 方法
 * @param param0  {hoscode,depcode,workDate}:ReqGetScheduleListParams
 * @returns Promise<ScheduleList>
 */
export let reqGetScheduleList = ({hoscode,depcode,workDate}:ReqGetScheduleListParams)=>{
    return request.get<any,ScheduleList>(`/admin/hosp/schedule/findScheduleList/${hoscode}/${depcode}/${workDate}`)
}