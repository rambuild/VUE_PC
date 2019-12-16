<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片内容区域 -->
        <el-card class="box-card">
            <div>
                <el-row :gutter="20">
                    <el-col :span='8'>
                        <el-input placeholder="请输入内容" class="input-with-select" v-model="queryData.query" clearable>
                            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="addGoodsMethods">添加商品</el-button>
                    </el-col>
                </el-row> 
            </div>
            <!-- 商品列表区域 -->
            <template>
                <el-table :data="goodsList" border stripe style="width: 100%" class="goodsTable">
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="goods_name" label="商品名称" class="goodsNameTable"></el-table-column>
                    <el-table-column prop="goods_price" label="商品价格（元）" width="90px"></el-table-column>
                    <el-table-column prop="goods_weight" label="商品重量" width="90px"></el-table-column>
                    <el-table-column label="创建时间" width="200px">
                        <template slot-scope="scope">
                            {{scope.row.add_time | dateFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200px">
                         <template slot-scope="scope">
                             <el-button type="primary" icon="el-icon-edit" size="mini" @click='editGoodsMethods(scope.row)'></el-button>
                             <el-button type="danger" icon="el-icon-delete" size="mini" @click='delGoods(scope.row)'></el-button>
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
                :page-sizes="[1, 2, 5, 10, 15]"
                :page-size="queryData.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
        </el-card>
        <!-- 编辑商品的对话框 -->
        <el-dialog title="编辑商品" :visible.sync="editGoodsDialogFormVisible" width="30%" :center="true" @close="editGoodsDialogCloseHandle">
            <el-form :model="editGoods" :rules='editGoodsFormRules' ref="editGoodsForm">
                <el-form-item label="商品名称" :label-width="formLabelWidth" prop='goods_name'>
                    <el-input v-model="editGoods.goods_name" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品价格" :label-width="formLabelWidth" prop='goods_price'>
                    <el-input v-model="editGoods.goods_price" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品数量" :label-width="formLabelWidth" prop='goods_number'>
                    <el-input v-model="editGoods.goods_number" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品重量" :label-width="formLabelWidth" prop='goods_weight'>
                    <el-input v-model="editGoods.goods_weight" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品介绍" :label-width="formLabelWidth" prop='goods_introduce'>
                    <el-input v-model="editGoods.goods_introduce" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editGoodsDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editGoodsBtn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        var checkNum = (rule,value,callback) => {
            var numReg = new RegExp("^[0-9]*$");
            if(!value){
                return callback(new Error('请输入此项！'))
            }else{
                if( !numReg.test(value) ){
                    return callback(new Error("只允许输入纯数字！"))
                }
            }
            return callback()
        };
        return{
            queryData:{},
            goodsList:[],
            queryData:{
                pagenum:1,
                pagesize:15,
                query:''
            },
            total:0,
            addGoodsDialogFormVisible:false,
            editGoodsDialogFormVisible:false,
            addGoods:{
                goods_name:'',
                goods_price:''
            },
            editGoods:{
                goods_name:'',
                goods_price:'',
                goods_number:'',
                goods_weight:'',
                goods_introduce:''
            },
            addGoodsFormRules:{

            },
            editGoodsFormRules:{
                goods_name:[{
                    required:true,message:"请输入商品名称！",trigger:'blur'
                }],
                goods_price:[{
                    required:true,message:"请输入商品价格！",trigger:'blur'
                }],
                goods_number:[{
                    required:true,validator:checkNum,trigger:'change'
                }],
                goods_weight:[{
                    required:true,validator:checkNum,trigger:'change'
                }]
            },
            formLabelWidth:'80px'
        }
    },
    methods:{
        async getGoodsList(){
            const {data : res} = await this.$http.get('goods',{
                params:this.queryData
            })
            if(res.meta.status != 200){
                this.$message.error({ message:res.meta.msg,center:true })
            }else{
                this.goodsList = res.data.goods
                this.total = res.data.total
            }
        },
        handleSizeChange(size){
           this.queryData.pagesize = size
           this.getGoodsList()
        },
        handleCurrentChange(num){
            this.queryData.pagenum = num
            this.getGoodsList()
        },
        async editGoodsMethods(scope){
            this.editGoodsDialogFormVisible = true;
            this.editGoods = {
                id:scope.goods_id,
                goods_name:scope.goods_name,
                goods_price:scope.goods_price,
                goods_number:scope.goods_number,
                goods_weight:scope.goods_weight,
                goods_introduce:scope.goods_introduce
            }
        },
        addGoodsMethods(){
            this.$router.push('/goods/addgoods')
        },
        delGoods(scope){
            console.log(scope.goods_id)
            this.$confirm("确定删除？该操作无法撤销！","提示",{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(async () =>{
                const { data : res } = await this.$http.delete(`goods/${scope.goods_id}`)
                if(res.meta.status == 200 ){
                    this.$message.success({message:res.meta.msg,center:true})
                    this.getGoodsList()
                }else{
                    this.$message.error({message:res.meta.msg,center:true})
                }
            })
            .catch(()=>{
                this.$message.info({message:"取消删除",center:true})
            })
        },
        addGoodsDialogCloseHandle(){
            this.$refs.addGoodsForm.resetFields()
        },
        editGoodsDialogCloseHandle(){
            this.$refs.editGoodsForm.resetFields()
        },
        addGoodsBtn(){

        },
        async editGoodsBtn(){
            const {data :res} = await this.$http.put(`goods/${this.editGoods.id}`,this.editGoods)
            console.log(res)
        }
    },
    mounted(){
        this.getGoodsList()
    }
}
</script>

<style lang="scss" scoped>
.goodsTable{
    margin-top:20px;
}
/deep/.el-table .el-table_1_column_2  {
    text-align: left !important;
}
.paginations{
    margin-top:20px;
}
</style>