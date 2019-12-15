<<template>
    <div>
       <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-button type="primary" class='addRoleBtn' @click='add_roles'>添加角色</el-button>
           <template>
                <el-table :data="rolesList" border stripe style="width: 100%">
                    <el-table-column type="expand" label="">
                        <template slot-scope="scope">
                            <el-row v-for="i in scope.row.children" :key="i.id" :class="['col_border','vcenter']">
                                <!-- 渲染一级权限 -->
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="delTag(scope.row,i.id)">{{ i.authName }}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 渲染二级和三级权限 -->
                                <el-col :span="18">
                                    <el-row v-for="j in i.children" :key='j.id' class="vcenter">
                                        <el-col :span="8">
                                            <el-tag closable @close="delTag(scope.row,j.id)">{{ j.authName }}</el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <el-col :span="16">
                                            <el-tag type="warning"  v-for="k in j.children" :key="k.id" closable  @close="delTag(scope.row,k.id)">{{ k.authName }}</el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="roleName" label="角色名称"></el-table-column>
                    <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                    <el-table-column prop="path" label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click='edit_roleMethods(scope.row)'>编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click='del_role(scope.row)'>删除</el-button>
                            <el-tooltip content="分配角色" placement="top" :enterable="false">
                                <el-button type="warning" icon="el-icon-setting" size="mini" @click='setRights(scope.row)'>分配权限</el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-card>
                <!-- 添加角色的对话框 -->
        <el-dialog title="添加角色" :visible.sync="roleDialogFormVisible" width="30%" :center="true" @close="roleInfoDialogCloseHandle">
            <el-form :model="add_role" :rules='addRoleFormRules' ref="addRoleForm">
                <el-form-item label="角色名称" :label-width="formLabelWidth" prop='roleName'>
                    <el-input v-model="add_role.roleName" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth" prop='roleDesc'>
                    <el-input v-model="add_role.roleDesc" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoleUserBtn">确 定</el-button>
            </div>
        </el-dialog>
                <!-- 编辑角色的对话框 -->
        <el-dialog title="编辑角色" :visible.sync="editRoleDialogFormVisible" :center="true" @close="editRoleInfoDialogCloseHandle">
            <el-form :model="edit_role" :rules='addRoleFormRules' ref="editRoleForm">
                <el-form-item label="角色名称" :label-width="formLabelWidth" prop='roleName'>
                    <el-input v-model="edit_role.roleName" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth" prop='roleDesc'>
                    <el-input v-model="edit_role.roleDesc" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoleUserBtn">确 定</el-button>
            </div>
        </el-dialog>
                 <!-- 分配权限的对话框 -->
        <el-dialog title="分配权限" :visible.sync="showSetRightsDialog" width="30%" :center="true" @close="editRoleInfoDialogCloseHandle">
                <el-tree
                :data="rightsList"
                :props='setProps'
                :default-expand-all='true'
                :default-checked-keys='defCheckRights'
                :check-on-click-node='true'
                show-checkbox
                node-key="id" class='rightsTree'                
                ref="treeRef">
                </el-tree>
                <div style="text-align:right;padding-right:10px;">
                    <el-button @click="showSetRightsDialog = false">取 消</el-button>
                    <el-button type="primary" @click="setRightsBtn">确 定</el-button>
                </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            rolesList:[],
            roleDialogFormVisible:false,
            editRoleDialogFormVisible:false,
            showSetRightsDialog:false,
            rightsList:[],
            defCheckRights:[],
            queryRights:[],
            roleID:0,
            add_role:{},
            edit_role:{},
            formLabelWidth: "120px",
            addRoleFormRules:{
                roleName:[{
                    required:true,message:"请输入角色名称！",trigger:"blur"
                }]
            },
            setProps:{
                children:'children',
                label:'authName'
            }
        }
    },
    methods:{
        async getRolesList(){
            const {data : res} = await this.$http.get('roles')
            if(res.meta.status !== 200){
                this.$message.error({message:"获取角色列表失败！",center:true})
            }else{
                this.rolesList = res.data
            }
        },
        delTag(scope,rightsId){
            console.dir(scope)
            this.$confirm('确认删除该权限？该操作将不可撤销！','提示',{
                type:'warning'
            })
            .then(async () => {
                const {data : res} = await this.$http.delete(`roles/${scope.id}/rights/${rightsId}`)
                if(res.meta.status == 200){
                    this.$message.success({message:res.meta.msg,center:true})
                }
                scope.children = res.data                
            })
            .catch( () => {
                this.$message.info({message:"取消删除",center:true})
            })
        },
        add_roles(){
            this.roleDialogFormVisible = true
        },
        roleInfoDialogCloseHandle(){
            this.$refs.addRoleForm.resetFields()
        },
        editRoleInfoDialogCloseHandle(){
            this.$refs.editRoleForm.resetFields()
        },
        addRoleUserBtn(){
            this.$refs.addRoleForm.validate(async (valid)=>{
                if(!valid){
                    return this.$message.info({message:"请输入必填项!",center:true})
                }else{
                    const {data : res } = await this.$http.post('roles',this.add_role)
                    if(res.meta.status == 201){
                        this.$message.success({message:"添加角色成功!",center:true})
                        this.getRolesList()
                        this.roleDialogFormVisible = false
                    }
                }                
            })            
        },
        del_role(row){
            this.$confirm('确定删除该角色？操作将不可撤销！','提示',{
                type:'warning'
            }).then(async ()=>{
                const { data : res } = await this.$http.delete(`roles/${row.id}`)
                if(res.meta.status == 200){
                    this.$message.success({message:res.meta.msg,center:true})
                    this.getRolesList()
                }
            }).catch(()=>{
                this.$message.info({message:"取消删除",center:true})
            })
        },
        edit_roleMethods(row){
            console.log(row)
            this.editRoleDialogFormVisible = true
            this.edit_role={
                roleName:row.roleName,
                roleDesc:row.roleDesc,
                id:row.id
            }
        },
        editRoleUserBtn(){
            this.$refs.editRoleForm.validate(async (valid)=>{
                if(!valid){
                    return this.$message.info({message:"请输入必填项!",center:true})
                }else{
                    const {data : res} = await this.$http.put(`roles/${this.edit_role.id}`,{
                        roleName:this.edit_role.roleName,
                        roleDesc:this.edit_role.roleDesc
                    })
                    console.log(res)
                    if(res.meta.status == 200){
                        this.$message.success({message:"编辑成功！",center:true})
                        this.editRoleDialogFormVisible = false
                        this.getRolesList()
                    }
                }
            })
        },
        async setRightsBtn(){
            const checkedNodes = [
                ...this.$refs.treeRef.getCheckedNodes(),
                ...this.$refs.treeRef.getHalfCheckedNodes()
            ]
            checkedNodes.forEach(i=>{
                this.queryRights.push(i.id)
            })
            const {data : res} =await this.$http.post(`roles/${this.roleID}/rights`,{
                rids:this.queryRights.join(',')
            })            
            if(res.meta.status !== 200){
                this.$message.error({message:res.meta.msg,center:true})
            }else{
                this.queryRights=[]
                this.getRolesList()
                this.$message.success({message:res.meta.msg,center:true})
                this.showSetRightsDialog = false
            }

        },
        async setRights(scope){
            this.showSetRightsDialog = true
            // 点击编辑权限将当前ID暂存到roleID里
            this.roleID = scope.id
            const {data : res} = await this.$http.get('rights/tree')
            if(res.meta.status != 200 ){
                return this.$message.error({message:"获取权限列表失败！",center:true})
            }else{
                this.rightsList = res.data
                scope.children.forEach(i=>{
                    i.children.forEach(j=>{
                        j.children.forEach(k=>{
                            this.defCheckRights.push(k.id)
                        })
                    })
                })
            }
        },
        editRoleInfoDialogCloseHandle(){
            // 关闭编辑权限对话框时将defCheckRights的值置空
            this.defCheckRights = []
        }
    },
    mounted(){
        this.getRolesList()
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
   .addRoleBtn{
        margin-bottom: 20px;
    }
    .col_border{
        border-bottom:solid 1px #eee;
    }
    .col_border:nth-child(1){
        border-top:solid 1px #eee;
    }
    .el-tag{
        margin:6px;
        cursor: pointer;
    }
}
.vcenter{
    display: flex;
    align-items: center;
}
.rightsTree{
    margin-bottom: 40px;
}
</style>