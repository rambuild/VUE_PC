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
            <el-button type="primary" class='addRoleBtn'>添加角色</el-button>
           <template>
                <el-table :data="rolesList" border stripe style="width: 100%">
                    <el-table-column type="expand" label="">
                        <template slot-scope="scope">
                            <el-row v-for="i in scope.row.children" :key="i.id" :class="['col_border','vcenter']">
                                <!-- 渲染一级权限 -->
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="delTag(scope.row)">{{ i.authName }}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 渲染二级和三级权限 -->
                                <el-col :span="18">
                                    <el-row v-for="j in i.children" :key='j.id'>
                                        <el-col :span="8">
                                            <el-tag closable @close="delTag(scope.row)">{{ j.authName }}</el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <el-col :span="16">
                                            <el-tag type="warning"  v-for="k in j.children" :key="k.id" closable  @close="delTag(scope.row)">{{ k.authName }}</el-tag>
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
                            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            <el-tooltip content="分配角色" placement="top" :enterable="false">
                                <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            rolesList:[]
        }
    },
    methods:{
        async getRolesList(){
            const {data : res} = await this.$http.get('roles')
            this.rolesList = res.data
        },
        delTag(scope){
            this.$confirm('确认删除该标签？该操作将不可撤销！','提示',{
                type:'warning'
            })
            .then( () => {
            //    const res = await this.$http.delete(`roles/${scope.id}/rights/${rightID}`)
               console.log(scope)
               this.$message.success({message:"成功删除",center:true})
            })
            .catch( () => {
                this.$message.info({message:"取消删除",center:true})
            })
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
</style>