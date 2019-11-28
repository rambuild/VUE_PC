<<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片内容区域 -->
        <el-card class="box-card">
            <div class="text item">
                <el-row :gutter="20">
                    <el-col :span='8'>
                        <el-input placeholder="请输入内容" class="input-with-select" v-model="queryData.query" clearable>
                            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
                    </el-col>
                </el-row> 
            </div>
            <!-- 用户列表区域 -->
            <template>
                <el-table :data="userList" border stripe style="width: 100">
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="username" label="姓名"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column prop="mobile" label="电话"></el-table-column>
                    <el-table-column prop="role_name" label="角色"></el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="switchToggle(scope.row)"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200px">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                            <el-tooltip content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                            </el-tooltip>
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
        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="30%" :center="true" @close="dialogCloseHandle">
            <el-form :model="addUser" :rules='addFormRules' ref="addUserForm">
                <el-form-item label="用户名" :label-width="formLabelWidth" prop='username'>
                    <el-input v-model="addUser.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" prop='pwd'>
                    <el-input v-model="addUser.pwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth" prop='email'>
                    <el-input v-model="addUser.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机" :label-width="formLabelWidth" prop='phone'>
                    <el-input v-model="addUser.phone" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUserbtn">确 定</el-button>
            </div>
        </el-dialog>
   </div>
</template>

<script>
export default {
   data() {
      return {
         queryData: {
            query: "",
            pagenum: 1,
            pagesize: 2,
            query:''
         },
         userList: [],
         value:true,
         total:0,
         dialogFormVisible:false,
         addUser:{
            username: '',
            pwd:'',
            email:'',
            phone:'',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
         },
         formLabelWidth:"120px",
         addFormRules:{
             username:[{
                 required:true,message:"请输入用户名！",trigger:"blur"
             },{
                 min:3,max:10,message:"用户名长度在3到10之间！",trigger:"blur"
             }],
             pwd:[{
                 required:true,message:"请输入密码！",trigger:"blur"
             }],
             email:[{
                 required:true,message:"请输入邮箱！",trigger:"blur"
             }],
             phone:[{
                 required:true,message:"请输入手机号码！",trigger:"blur"
             }]
         }
      };
   },
   methods: {
      async getUserList() {
         const { data : res } = await this.$http.get("users", {
            params: this.queryData
         });
         this.total = res.data.total
         this.userList = res.data.users;
      },
      handleSizeChange(newPageSize){
          this.queryData.pagesize = newPageSize
          this.getUserList()
      },
      handleCurrentChange(newPageNum){
          this.queryData.pagenum = newPageNum
          this.getUserList()
      },
      switchToggle(val){
          this.$http.put(`users/${val.id}/state/${val.mg_state}`).then(res=>{
                var state = res.data.data.mg_state == 1 ? "开启":"关闭"
                if(res.data.meta.status == 200){
                    this.$message.success({
                        message:`${res.data.meta.msg} 当前状态是：${state}`,
                        duration:1000,
                        center:true
                    })
                }else{
                    this.$message.error({
                        message:"更新状态失败！",
                        center:true
                    })
                    setTimeout(i=>{
                        val.mg_state = !val.mg_state
                    },300)
                }
          })          
      },
      addUserbtn(){
          this.$refs.addUserForm.validate(valid=>{
              if(!valid){
                this.$message.warning({message:"请输入完整的项目",center:true})
              }else{
                  this.$http.post('users',{
                      username:this.addUser.username,
                      password:this.addUser.pwd,
                      email:this.addUser.email,
                      mobile:this.addUser.phone
                  }).then(res=>{
                      console.log(res)
                  })
                  this.$message.success({message:"添加用户成功！",center:true})
                  this.dialogFormVisible = false
              }
          })
          
      },
      dialogCloseHandle(){
          this.$refs.addUserForm.resetFields()
      }
   },
   mounted() {
      this.getUserList();
   }
};
</script>

<style lang="scss" scoped>
.el-card {
   margin-top: 18px;
   box-shadow: 0 0 5px #666;
   .text {
      margin: 0 0 20px 0;
   }
}
.paginations {
   margin-top: 20px;
}
.el-form-item{
    padding-right: 20px;
}
</style>