<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-button type="primary" class='addCatg' @click='addCatgBtn'>添加分类</el-button>
            <template>
                <tree-table 
                    :data='catgList' 
                    :columns='tree_columns'
                    :selection-type="false"
                    :border='true'
                    :expand-type="false"
                    show-index
                    index-text="#"
                    :show-row-hover="false"
                    >
                    <template slot="isValid" slot-scope="scope">                        
                        <i class="el-icon-success" style='color:rgb(66,157,255);font-size:20px' v-if='scope.row.cat_deleted == false'></i>
                        <i class="el-icon-error" style='color:red;font-size:20px' v-else></i>                       
                    </template>
                    <template slot="sort" slot-scope="scope">
                        <el-tag type="" v-if="scope.row.cat_level == '0'">一级</el-tag>
                        <el-tag type="success" v-if="scope.row.cat_level == '1'">二级</el-tag>
                        <el-tag type="warning" v-if="scope.row.cat_level == '2'">三级</el-tag>
                    </template>
                    <template slot="operation" slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click='edit_catgMethods(scope.row)'>编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click='del_catg(scope.row)'>删除</el-button>
                    </template>
                </tree-table>
            </template>
            <div class='paginations'>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryData.pagenum"
                    :page-sizes="[1, 2 , 6, 10]"
                    :page-size="queryData.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </el-card>   
    <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCatgFormVisible" width="30%" :center="true" @close="addCatgDialogCloseHandle">
            <el-form :model="addCatg" :rules='addCatgFormRules' ref="addCatgForm">
                <el-form-item label="分类名称" :label-width="formLabelWidth" prop='cat_name'>
                    <el-input v-model="addCatg.cat_name" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="父级分类" :label-width="formLabelWidth" prop='cat_level'>
                    <!-- 级联选择器 -->
                   <el-cascader
                        v-model="selected_options"
                        :options="catgList2"
                        :props="{expandTrigger:'hover',label:'cat_name',value:'cat_id',children:'children',checkStrictly:true}"
                        @change="handleChange"
                        placeholder='请选择分类'
                        clearable
                        ref='casRef'>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addCatgFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCatgConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="editCatgFormVisible" width="30%" :center="true" @close="editCatgDialogCloseHandle">
            <el-form :model="editCatg" :rules='addCatgFormRules' ref="editCatgForm">
                <el-form-item label="分类名称" :label-width="formLabelWidth" prop='cat_name'>
                    <el-input v-model="editCatg.cat_name" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editCatgFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCatgConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            addCatgFormVisible:false,
            editCatgFormVisible:false,
            editCatg:{
                cat_name:'',
                cat_id:''
            },
            addCatgFormRules:{
                cat_name:[{
                    required:true,trigger:'blur',message:'请输入分类名称'
                }]
            },
            selected_options:[],
            formLabelWidth:'80px',
            addCatg:{
                cat_name:'',
                cat_level:0,
                cat_pid:0
            },
            catgList:[],
            catgList2:[],
            queryData:{
                type:3,
                pagenum:1,
                pagesize:6
            },
            total:0,
            tree_columns:[{
                label: '分类名称',
                prop: 'cat_name',
                headerAlign: 'center'
            },{
                label: '是否有效',
                type: 'template',
                template : 'isValid',
                align: 'center',
                headerAlign: 'center'
            },{
                label: '排序',
                type: 'template',
                template : 'sort',
                align: 'center',
                headerAlign: 'center'
            },{
                label: '操作',
                type: 'template',
                template : 'operation',
                align: 'center',
                headerAlign: 'center'
            }
        ]}
    },
    methods:{
        async getCatgList(){
            const {data : res} = await this.$http.get('categories',{
                params:this.queryData
            })
            if(res.meta.status !== 200){
                this.$message.error({ message: res.meta.msg, center: true });
            }else{                
                this.catgList = res.data.result
                this.total = res.data.total
            }
        },
        addCatgBtn(){
            // 获取分类
            this.getTwoLevel()
            // 展示分类对话框
            this.addCatgFormVisible = true
        },
        // 编辑分类
        edit_catgMethods(scope){
            this.editCatgFormVisible = true
            this.editCatg.cat_name=scope.cat_name
            this.editCatg.cat_id = scope.cat_id
        },
        // 删除分类
        del_catg(scope){
            this.$confirm('确定删除该分类？操作将不可撤销！','提示',{
                type:'warning'
            }).then(async ()=>{
                const { data : res } = await this.$http.delete(`categories/${scope.cat_id}`)
                if(res.meta.status !== 200){
                    this.$message.error({message:res.meta.msg,center:true})  
                }else{
                    this.$message.success({message:res.meta.msg,center:true})
                    this.getCatgList()
                }
            }).catch(()=>{
                this.$message.info({message:"取消删除",center:true})
            })
        },
        async editCatgConfirm(){
            const{data:res} = await this.$http.put(`categories/${this.editCatg.cat_id}`,{
                cat_name:this.editCatg.cat_name
            })
            if(res.meta.status !=200){
                return this.$message.error({ message: res.meta.msg, center: true });
            }else{
                this.$message.success({ message: res.meta.msg, center: true });
                this.editCatgFormVisible = false
                this.getCatgList()
            }
        },
        editCatgDialogCloseHandle(){
            this.refs.editCatgForm.resetFields()
        },
        handleChange(v){
             // 级联选择的值发生改变就收起级联框
            if(this.$refs.casRef){
                this.$refs.casRef.dropDownVisible = false
            }
            this.addCatg.cat_pid = v[v.length-1]
            if(v.length == 1){
                this.addCatg.cat_level = 1
            }
            if(v.length ==2){
                this.addCatg.cat_level = 2
            }
        },
        handleSizeChange(newVal){
            this.queryData.pagesize = newVal
            this.getCatgList()
        },
        handleCurrentChange(newVal){
            this.queryData.pagenum = newVal
            this.getCatgList()
        },
        // 添加分类对话框的关闭事件
        addCatgDialogCloseHandle(){
            this.$refs.addCatgForm.resetFields()
            this.selected_options=[]
            this.addCatg.cat_level = 0;
            this.addCatg.cat_pid = 0
        },
        // 添加分类确定按钮
        addCatgConfirm(){
            this.$refs.addCatgForm.validate(async (valid) =>{
                if(!valid){
                    return
                }else{
                    const {data:res} = await this.$http.post('categories',this.addCatg)
                    if(res.meta.status != 201){
                        return this.$message.error({ message: res.meta.msg, center: true });
                    }else{
                        this.$message.success({ message: res.meta.msg, center: true });
                        this.addCatgFormVisible = false
                        this.getCatgList()
                    }
                }
            })
        },
        // 获取前两级分类
        async getTwoLevel(){
            const {data : res} = await this.$http.get('categories',{
                params:{
                    type:2
                }
            })
            if(res.meta.status !==200){
                this.$message.error({
                    message:res.meta.msg,center:true
                })
            }else{
                this.catgList2 = res.data
            }
        }
    },
    mounted(){
        this.getCatgList()
        // setInterval(function() {
        //     document.querySelectorAll(".el-cascader-node__label").forEach(el => {
        //         el.onclick = function() {
        //            if (this.previousElementSibling) this.previousElementSibling.click();
        //         };
        //     });
        // }, 1000)
    }
}
</script>

<style lang="scss" scoped>
.el-card {
   margin-top: 18px;
   box-shadow: 0 0 5px #666;
   .text {
      margin: 0 0 20px 0;
   }
   .el-table{
       border-radius: 5px;
   }
}
.addCatg{
    margin-bottom: 20px;
}
.paginations{
    margin-top: 20px;
}
.el-cascader{
   width:100%;
}
</style>