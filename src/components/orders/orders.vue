<template>
    <div>
       <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片内容区域 -->
        <el-card class="box-card">
            <div>
                <el-row :gutter="20">
                    <el-col :span='8'>
                        <el-input placeholder="请输入内容" class="input-with-select" v-model="queryData.query" clearable>
                            <el-button slot="append" icon="el-icon-search" @click='getOrderList'></el-button>
                        </el-input>
                    </el-col>
                </el-row> 
            </div>
            <!-- 商品列表区域 -->
            <template>
                <el-table :data="orderList" border stripe>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="order_number" label="订单编号" width="350px"></el-table-column>
                    <el-table-column prop="order_price" label="订单价格"></el-table-column>
                    <el-table-column prop="pay_status" label="是否付款">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.pay_status == 1">已付款</el-tag>
                            <el-tag type="danger" v-else>未付款</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_send" label="是否发货"></el-table-column>
                    <el-table-column prop="create_time" label="下单时间">
                        <template slot-scope="scope">
                            {{ scope.row.create_time | dateFormat }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                         <template slot-scope="scope">
                             <el-button type="primary" icon="el-icon-edit" size="mini" @click='editOrdersBtn'></el-button>
                             <el-button type="success" icon="el-icon-location-information" size="mini" @click='queryTransInfo'></el-button>
                         </template>
                    </el-table-column>
                </el-table>
            </template>
            <!-- 分页器 -->
            <div class='paginations'>
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryData.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryData.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
        </el-card>
        <!-- 编辑商品的对话框 -->
        <el-dialog title="修改地址" :visible.sync="ordersDialogFormVisible" width="35%" :center="true" @close="ordersDialogCloseHandle">
            <el-form :model="editOrders" :rules='editOrdersFormRules' ref="editOrdersForm">
                <el-form-item label="省市区/县" :label-width="formLabelWidth" prop='area'>
                    <el-cascader
                        v-model="editOrders.area"
                        :options="cityDate"
                        :props="{expandTrigger:'hover',label:'label',value:'value',children:'children'}"
                        @change="handleCascaderChange"
                        placeholder='请选择省市区/县'
                        clearable
                        ref='casRef'>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" :label-width="formLabelWidth" prop='location'>
                    <el-input v-model="editOrders.location" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="ordersDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editOrdersConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 查询物流的对话框 -->
        <el-dialog title="物流信息" :visible.sync="transDialogFormVisible" width="35%" :center="true" @close="transDialogCloseHandle">
            <el-form :model="editOrders" :rules='editOrdersFormRules' ref="transOrdersForm">
                <!-- <ul v-for='i in transInfo' class='transInfoList'>
                    <li>
                        <div style='text-align:left;font-weight:bold;font-size:16px'>{{ i.time }}</div>
                        <div>{{ i.context }}</div>
                    </li>
                </ul> -->
                <el-timeline>
                    <el-timeline-item
                    v-for="(i, index) in transInfo"
                    :key="index"
                    icon='el-icon-location'
                    size='large'
                    placement='top'
                    :timestamp="i.time">
                        {{i.context}}
                    </el-timeline-item>
                </el-timeline>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="transDialogFormVisible = false" type='primary'>确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import cityDate from '../../assets/js/citydata'
export default {
    data(){
        return{
            queryData:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            orderList:[],
            total:0,
            cityDate,
            ordersDialogFormVisible:false,
            transDialogFormVisible:false,
            editOrders:{
                area:'',
                location:''
            },
            editOrdersFormRules:{
                area:[{
                    required:true,
                    message:"请选择省市区/县！",
                    trigger:'change'
                }],
                location:[{
                    required:true,
                    message:"请输入详细地址！",
                    trigger:'blur'
                }]
            },
            formLabelWidth:"90px",
            transInfo:[]

        }
    },
    methods:{
        async getOrderList(){
            const {data : res} = await this.$http.get('orders',{
                params:this.queryData
            })
            if(res.meta.status !== 200){
                this.$message.error({ message:res.meta.msg,center:true })
            }else{
                this.total = res.data.total
                this.orderList = res.data.goods
            }
        },
        handleSizeChange(v){
            this.queryData.pagesize = v
            this.getOrderList()
        },
        handleCurrentChange(v){
            this.queryData.pagenum = v
            this.getOrderList()
        },
        editOrdersBtn(){

        },
        ordersDialogCloseHandle(){
            this.$refs.editOrdersForm.resetFields()
        },
        editOrdersBtn(){
            this.ordersDialogFormVisible = true
        },
        editOrdersConfirm(){
            this.$refs.editOrdersForm.validate(valid=>{
                if(!valid){
                    return this.$message.warning({ message:"请输入必填项！",center:true })
                }else{

                }
            })
        },
        handleCascaderChange(){

        },
        async queryTransInfo(){
            this.transDialogFormVisible = true
            const {data :res} = await this.$http.get(`kuaidi/804909574412544580`)
            if(res.meta.status != 200){
                return this.$message.error({ message:res.meta.message,center:true })
            }else{
                this.transInfo = res.data
                this.$message.success({ message:res.meta.message,center:true })
            }
        },
        transDialogCloseHandle(){

        }
    },
    mounted(){
        this.getOrderList()
    }
}
</script>

<style lang="scss" scoped>
.el-table{
    margin-top: 20px;
}
.paginations{
    margin-top: 20px;
}
.el-cascader{
    width:100%;
}
.transInfoList{
    list-style-type: none;
    padding: 0;
    li{
        line-height: 30px;
        text-align: justify;
    }
}
.el-timeline{
    padding: 0;
    margin:0 15px;
}
</style>