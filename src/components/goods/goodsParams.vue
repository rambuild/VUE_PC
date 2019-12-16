<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                show-icon
                :closable="false">
            </el-alert>
            <p>
                <span style="font-size:18px;">选择商品分类：</span> 
                <!-- 级联选择器 -->
                <el-cascader
                     v-model="selected_options"
                     :options="catgList"
                     :props="{expandTrigger:'hover',label:'cat_name',value:'cat_id',children:'children'}"
                     @change="handleChange"
                     placeholder='请选择分类'
                     clearable
                     ref='casRef'>
                </el-cascader>
            </p>
            <el-tabs :tab-position="tabPosition" style="height: 200px;" v-model="activeTabsName" @tab-click='handleTabCliclk()'>
                <!-- 动态参数 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" class='addCatg' @click='addParamsBtn' style='margin:5px 0 20px 0' :disabled="isDisabled">添加参数</el-button>
                    <el-table :data="manyParamsList" border stripe style="width: 100%">
                        <el-table-column type="expand" label="">
                            <template slot-scope='scope'>
                                <el-tag closable v-for="(i,index) in scope.row.attr_vals" :key='i.attr_id'  @close='delTag(scope.row,index)' :disable-transitions="true">{{ i }}</el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column prop="path" label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click='editParamsMethods(scope.row)'>修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click='del_params(scope.row)'>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 静态属性 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" class='addCatg' @click='addParamsBtn' style='margin:5px 0 20px 0' :disabled="isDisabled">添加属性</el-button>
                    <el-table :data="onlyParamsList" border stripe style="width: 100%">
                        <el-table-column type="expand" label="">
                            <template slot-scope='scope'>
                                <el-tag v-for="i in scope.row.attr_vals" :key='i.attr_id' :disable-transitions="false" @close='delTag(scope.row)' closable>{{ i }}</el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column prop="path" label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click='editParamsMethods(scope.row)'>修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click='del_params(scope.row)'>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数和属性的对话框 -->
        <el-dialog :title="this.activeTabsName == 'many'?'添加动态参数':'添加静态属性'" :visible.sync="addParamsFormVisible" width="30%" :center="true" @close="addParamsDialogCloseHandle">
            <el-form :model="addParams" :rules='addParamsFormRules' ref="addParamsForm">
                <el-form-item :label="this.activeTabsName == 'many'?'参数名称':'静态属性'" prop='attr_name' :label-width="formLabelWidth">
                    <el-input v-model="addParams.attr_name" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addParamsFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParamsConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改参数和属性的对话框 -->
        <el-dialog :title="this.activeTabsName == 'many'?'修改动态参数':'修改静态属性'" :visible.sync="editParamsFormVisible" width="30%" :center="true" @close="editParamsDialogCloseHandle">
            <el-form :model="editParams" :rules='addParamsFormRules' ref="editParamsForm">
                <el-form-item :label="this.activeTabsName == 'many'?'参数名称':'静态属性'" prop='attr_name' :label-width="formLabelWidth">
                    <el-input v-model="editParams.attr_name" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editParamsFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParamsConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            tabPosition: 'top',
            catgList:[],
            selected_options:[],
            manyParamsList:[],
            formLabelWidth:'80px',
            onlyParamsList:[],
            isDisabled:true,
            activeTabsName:'many',
            addParams:{
                attr_name:''
            },
            editParams:{
                attr_name:''
            },
            addParamsFormVisible:false,
            editParamsFormVisible:false,
            addParamsFormRules:{
                attr_name:[{
                    required:true,trigger:'blur',message:'请输入参数名称！'
                }]
            }
        }
    },
    methods:{
        async getCatgList(){
            const {data : res} = await this.$http.get('categories',{
                params:{
                    type:3
                }
            })
            if(res.meta.status !== 200){
                this.$message.error({ message: res.meta.msg, center: true });
            }else{                
                this.catgList = res.data
            }
        },
        handleChange(v){
            if(v.length != 3){
                this.isDisabled = true
                this.selected_options = []
                this.manyParamsList = []
                this.onlyParamsList = []
                return
            }else{
                this.isDisabled = false
                this.getCatgAttr()
            }
        },
        addParamsBtn(){
            this.addParamsFormVisible = true
        },
        handleTabCliclk(){
            this.getCatgAttr()
        },
        async getCatgAttr(){
            const {data : res} =await this.$http.get(`categories/${this.selected_options[2]}/attributes`,{
                params:{
                    sel:this.activeTabsName
                }
            })
            if(res.meta.status != 200){
                this.$message.error({
                    message:res.meta.msg,
                    center:true
                })
            }else{
                res.data.forEach(i=>{
                    if(i.attr_vals){
                        i.attr_vals = i.attr_vals.split(',')
                    }else{
                        i.attr_vals = []
                    }
                    i.inputValue = ''
                    i.inputVisible = false
                })
                if(this.activeTabsName === 'many'){
                    this.manyParamsList = res.data                    
                }else{
                    this.onlyParamsList = res.data  
                }
            }
        },
        addParamsDialogCloseHandle(){
            this.$refs.addParamsForm.resetFields()
        },
        async addParamsConfirm(){
            const{data : res} = await this.$http.post(`categories/${this.selected_options[2]}/attributes`,{
                attr_name:this.addParams.attr_name,
                attr_sel:this.activeTabsName
            })
            if(res.meta.status != 201){
                this.$message.error({ message: res.meta.msg, center: true });
            }else{
                console.log(res)
                 this.$message.success({ message: res.meta.msg, center: true });
                 this.getCatgAttr()
                 this.addParamsFormVisible = false
            }            
        },
        editParamsMethods(scope){
            this.editParamsFormVisible = true
            this.editParams.attr_name = scope.attr_name
            this.editParams.attr_id = scope.attr_id
        },
        async editParamsConfirm(){
            const { data : res } = await this.$http.put(`categories/${this.selected_options[2]}/attributes/${ this.editParams.attr_id }`,{
                attr_name:this.editParams.attr_name,
                attr_sel:this.activeTabsName
            })
            if(res.meta.status !== 200){
                this.$message.error({message:res.meta.msg,center:true})  
            }else{
                this.$message.success({message:res.meta.msg,center:true})
                this.getCatgAttr()
                this.editParamsFormVisible = false
            }
        },
        editParamsDialogCloseHandle(){
            this.$refs.editParamsForm.resetFields()
        },
        // 删除分类
        del_params(scope){
            this.$confirm('确定删除该分类？操作将不可撤销！','提示',{
                type:'warning'
            }).then(async ()=>{
                const { data : res } = await this.$http.delete(`categories/${this.selected_options[2]}/attributes/${scope.attr_id}`)
                if(res.meta.status !== 200){
                    this.$message.error({message:res.meta.msg,center:true})  
                }else{
                    this.$message.success({message:res.meta.msg,center:true})
                    this.getCatgAttr()
                }
            }).catch(()=>{
                this.$message.info({message:"取消删除",center:true})
            })
        },
        showInput(scope) {
            scope.inputVisible = true;
            this.$nextTick(()=> {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        async handleInputConfirm(scope) {
            let inputValue = scope.inputValue;
            if (inputValue.trim()) {
                const {data : res} = await this.$http.put(`categories/${this.selected_options[2]}/attributes/${scope.attr_id}`,{
                    attr_name:scope.attr_name,
                    attr_vals:scope.attr_vals.join(',').concat(',' + inputValue),
                    attr_sel:this.activeTabsName
                })
                if(res.meta.status != 200){
                    this.$message.error({message:res.meta.msg,center:true})  
                }else{
                    scope.attr_vals.push(inputValue)
                    this.$message.success({message:res.meta.msg,center:true})
                }
            }
            scope.inputVisible = false;
            scope.inputValue = '';
        },
        delTag(scope,index){
            this.$confirm('确定删除该标签？操作将不可撤销！','提示',{
                type:'warning'
            }).then(async ()=>{
                var spliceItems = scope.attr_vals.splice(index,1)
                const { data : res } = await this.$http.put(`categories/${this.selected_options[2]}/attributes/${scope.attr_id}`,{
                    attr_name:scope.attr_name,
                    attr_vals:scope.attr_vals.join(','),
                    attr_sel:this.activeTabsName
                })
                if(res.meta.status !== 200){
                    scope.attr_vals.splice(index,0,spliceItems.join(''))
                    return this.$message.error({message:res.meta.msg,center:true})
                }else{
                    this.$message.success({message:res.meta.msg,center:true})
                }
                console.log(res)
            }).catch(()=>{
                this.$message.info({message:"取消删除",center:true})
            })            
        }
    },
    mounted(){
        this.getCatgList()
    }
}
</script>

<style lang="scss" scoped>
.el-cascader{
    width: 23%;
}
.el-card{
    padding-bottom: 30px;
}
.el-tabs{
    height: auto !important;
}
.el-tag{
    margin:6px;
    cursor: pointer;
}
.input-new-tag {
    width: 90px;
    margin-left: -1px;
    vertical-align: middle;
  }
</style>