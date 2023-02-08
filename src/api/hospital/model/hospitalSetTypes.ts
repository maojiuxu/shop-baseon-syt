
//  请求 医院设置 列表的请求参数的接口
export interface ReqHospitalSetListParams{
    page:number,  //  页码
    limit:number,  //每页条数
    hosname ?:string,  //医院名称
    hoscode ?:string  // 医院编号
}

//设置接口  医院设置 单个数据的接口
export interface HospitalSetItem{
    "id": number,   //医院id
    "createTime": string,  //医院创建时间
    "updateTime": string,  // 医院修改时间
    "isDeleted": number,  // 医院 是否删除
    "hosname": string,  // 医院名称
    "hoscode": string,  //医院编号
    "apiUrl": string,  // api基础路径
    "signKey": string,  //key
    "contactsName": string,  //联系人姓名
    "contactsPhone": string,  //联系人手机号
    "status": number  //  是否上线  0 ：未上线   1：已上线
}

// 接口   医院设置  多个数据的接口
export type HospitalSetList = HospitalSetItem[];


// 医院设置 完整的响应结果的接口
export interface ReqHospitalSetListResponse{
    records:HospitalSetList,
    "total": number,   //总数
    "current": number,  // 当前页码
}



//添加医院 请求参数 的接口
export interface ReqAddHospitalParams{
    "apiUrl": string,  //api基础路径
    "contactsName": string,  //联系人姓名
    "contactsPhone": string, //联系人手机
    "hoscode": string, //医院编号
    "hosname": string  //医院名称
}


//更新医院  请求参数 接口
export interface ReqUpdateHospitalParams extends ReqAddHospitalParams{
    id:number
}


