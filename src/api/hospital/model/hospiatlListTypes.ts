import { type } from "os"

// 医院列表数据请求参数的接口
export interface ReqGetHospitalListParams{
    page:number,  //当前页码
    limit:number,  //每页条数
    hoscode ?:string,  //医院编号
    hosname?: string,  //医院名称
    hostype ?: string    //医院类型
    provinceCode ?: string  //省code
    cityCode ?:  string //市code
    districtCode ?: string //区code
    status ?: 0 | 1   //0 未上线  1：已上线
}


//  医院数据 复数 多个
export type HospitalListTypes = HospitalItemType[];

//完整的响应医院列表数据的接口
export interface ReqGetHospitalListResponse{
    content:HospitalListTypes,
      "totalPages": 19,  //总页码
      "totalElements": 19,  //总数据量
      "last": false,  //是否是最后一页
      "first": true,  //是否是第一页
}


//省份、市、区、医院类型信息的接口
export interface ProvinceItem{
      "id": number,  //省份  id
      "createTime": string,  //创建时间
      "updateTime":string //更新时间
      "isDeleted": number,  //是否删除
      "parentId": number,  //  父id  
      "name": string,  //省份名称
      "value": string,  // 邮政编码
      "dictCode": null,  //  省份编号
      "hasChildren": boolean   //是否有子节点
}

//省份信息 复数 接口
export type ProvinceList = ProvinceItem[];


//单个医院数据接口
export interface HospitalItemType extends HospitalType{
      "bookingRule": bookingRule
}

export interface HospitalType{
  "id": string,  // 医院id
  "createTime": string,  //创建时间
  "updateTime": string, //更新时间
  "isDeleted": number,  //是否删除
  "param": {   // 医院介绍
    "hostypeString": string,  //医院类型
    "fullAddress": string  //医院基本地址
  },
  "hoscode": string  //医院编号
  "hosname": string  //医院名称
  "hostype": string  // 医院类型标识
  "provinceCode": string  //省code
  "cityCode": string //市code
  "districtCode":string //区code
  "address": string,  // 详细地址
  "logoData": string //医院logo
  "intro": string  //医院介绍
  "route": string //乘车路线
  "status": 0 | 1,  //状态  上线 未上线
}

//医院 预约规则接口
export interface  bookingRule{
  "cycle": number,   //  预约周期
  "releaseTime": string   //  放号时间
  "stopTime": string,  //停止时间
  "quitDay": number,  //停挂时间
  "quitTime": string  //退号时间
  "rule":  string[] //取号地址
}

//医院详情 响应 接口
export interface HospitalShowType {
  "bookingRule": bookingRule   //预约规则
  "hospital": HospitalType
}


// 单个医院科室 接口
export interface DepartmentItem{
  "depcode": string,  //医院编号
  "depname": string,  //科室名称
  "children":  null | DepartmentList
  disabled ?: boolean
}
// 多个医院科室 接口 复数
export  type DepartmentList = DepartmentItem[];


//请求 医院排班信息 日期 的接口
export interface ReqGetScheduleRuleListParams{
  page:number,
  limit:number,
  hoscode:string
  depcode:string
}

//声明  医院排班信息 响应成功后的数据 单个 的接口
export interface ScheduleRuleItem{
  "workDate": string,   // 排班日期
  "workDateMd": null,   
  "dayOfWeek": string,  //星期
  "docCount": number,  //医生数量
  "reservedNumber": number,  //总的预约数
  "availableNumber": number,  //剩余预约数
  "status": null  //状态
}

//多个医院排班信息数据的接口
export type ScheduleRuleItems = ScheduleRuleItem[];


//完整的 医院排班信息的接口
export interface ReqGetHospitalRuleListResponse{
  total: number //排班的总数
  bookingScheduleList:ScheduleRuleItems  //排班具体的日期规则
  baseMap:{
    hosname:string   //医院名称
  }
}



//  请求某个日期 的医生的具体数据 参数
export interface ReqGetScheduleListParams{
  hoscode:string,
  depcode:string
  workDate:string
}

//声明 响应成功后的医生的结果的接口
export interface ScheduleItem{
    "id": string,  //id
      "createTime": string //创建时间
      "updateTime": string //更新时间
      "isDeleted": number,  //是否删除
      "param": {  //排班规则
        "dayOfWeek": string,  //星期
        "depname":string//科室名称
        "hosname": string  //医院名称
      },
      "hoscode": string  //医院编号
      "depcode": string //科室编号
      "title":string // 职称
      "docname": string  //医生名字
      "skill": string  //技能
      "workDate":string  //排班日期
      "workTime": number,  //工作时间
      "reservedNumber": number,  // 总预约数
      "availableNumber": number,  //剩余预约数
      "amount": number,  //挂号费
      "status": number,  //状态 
}


//声明 医生 复数 接口
export type ScheduleList = ScheduleItem[];



