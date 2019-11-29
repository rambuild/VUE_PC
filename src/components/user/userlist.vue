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
                <el-table :data="userList" border stripe style="width: 100%">
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="username" label="姓名"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column prop="mobile" label="电话"></el-table-column>
                    <el-table-column prop="role_name" label="角色"></el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <el-switch
                            v-model="scope.row.mg_state"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="switchToggle(scope.row)"
                            ></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="settingUserInfo(scope.row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del_user(scope.row)"></el-button>
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
                    <el-input v-model="addUser.username" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" prop='pwd'>
                    <el-input v-model="addUser.pwd" autocomplete="off" clearable  type="password" show-password></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth" prop='email'>
                    <el-input v-model="addUser.email" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机" :label-width="formLabelWidth" prop='phone'>
                    <el-input v-model="addUser.phone" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUserbtn">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改用户信息的对话框 -->
        <el-dialog title="修改用户信息" :visible.sync="userInfoDialogFormVisible" width="30%" :center="true" @close="settingUserInfoDialogCloseHandle">
            <el-form :model="settingUser" :rules='settingFormRules' ref="settingUserForm">
                <el-form-item label="用户名" :label-width="formLabelWidth" prop='username'>
                    <el-input v-model="settingUser.username" autocomplete="off" clearable disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth" prop='email'>
                    <el-input v-model="settingUser.email" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机" :label-width="formLabelWidth" prop='phone'>
                    <el-input v-model="settingUser.phone" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userInfoDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="settingUserBtn">确 定</el-button>
            </div>
        </el-dialog>
   </div>
</template>

<script>
export default {
   data() {
      //    邮箱的自定义验证规则
      var checkEmail = (rule, value, callback) => {
         if (!value) {
            return callback(new Error("请输入邮箱！"));
         }
         const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

         if (emailReg.test(value)) {
            //   邮箱合法
            return callback();
         }
         callback(new Error("请输入正确的邮箱！"));
      };
      //   手机号码的自定义规则
      var checkMobile = (rule, value, callback) => {
         if (!value) {
            return callback(new Error("请输入手机号码!"));
         }
         const mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
         if (mobileReg.test(value)) {
            //   手机号合法
            return callback();
         }
         callback(new Error("请输入正确的手机号码！"));
      };
      //检验服务器上是否已经存在相同用户名
      var checkUserName =async (rule, value, callback) => {
         if (!value) {
            return callback(new Error("请输入用户名！"));
         }else{
            const { data : res } = await this.$http.get("users", {
                  params:{
                      query: this.addUser.username,
                      pagenum:1,
                      pagesize:2
                  }
            })
            res.data.users.forEach(i=>{
                if(i.username == this.addUser.username){
                    return callback(new Error("该用户名已存在，请重新输入!"))
                }
            })
            return callback()
         }
      };
      return {
         queryData: {
            query: "",
            pagenum: 1,
            pagesize: 2
         },
         userList: [],
         value: true,
         total: 0,
         dialogFormVisible: false,
         userInfoDialogFormVisible:false,
         formLabelWidth: "120px",
         addUser: {
            username: "",
            pwd: "",
            email: "",
            phone: ""
         },
         addFormRules: {
            username: [
               {
                  required: true,
                  validator: checkUserName,
                  trigger: "blur"
               },
               {
                  min: 3,
                  max: 10,
                  message: "用户名长度在3到10之间！",
                  trigger: "blur"
               }
            ],
            pwd: [
               {
                  required: true,
                  message: "请输入密码！",
                  trigger: "blur"
               }
            ],
            email: [
               {
                  required: true,
                  validator: checkEmail,
                  trigger: "blur"
               }
            ],
            phone: [
               {
                  required: true,
                  validator: checkMobile,
                  trigger: "blur"
               }
            ]
         },
         settingUser:{
             username:'',
             email:'',
             phone:''
         },
         settingFormRules:{
             email:[{
                 required:true,
                 message:"请输入要更改的邮箱！",
                 validator:checkEmail,
                 trigger:'blur'
             }],
             phone:[{
                 required:true,
                 message:"请输入要更改的手机号码！",
                 validator:checkMobile,
                 trigger:'blur'
             }]
         }
      };
   },
   methods: {
      async getUserList() {
         const { data: res } = await this.$http.get("users", {
            params: this.queryData
         });
         if(res.meta.status != 200){
             this.$message.error({message:"获取用户列表失败！",center:true})
         }else{
             this.total = res.data.total;
             this.userList = res.data.users;
         }
      },
      handleSizeChange(newPageSize) {
         this.queryData.pagesize = newPageSize;
         this.getUserList();
      },
      handleCurrentChange(newPageNum) {
         this.queryData.pagenum = newPageNum;
         this.getUserList();
      },
      switchToggle(val) {
         this.$http.put(`users/${val.id}/state/${val.mg_state}`).then(res => {
            var state = res.data.data.mg_state == 1 ? "开启" : "关闭";
            if (res.data.meta.status == 200) {
               this.$message.success({
                  message: `${res.data.meta.msg} 当前状态是：${state}`,
                  duration: 1000,
                  center: true
               });
            } else {
               this.$message.error({
                  message: "更新状态失败！",
                  center: true
               });
               setTimeout(i => {
                  val.mg_state = !val.mg_state;
               }, 300);
            }
         });
      },
      addUserbtn() {
         this.$refs.addUserForm.validate(async valid => {
            if (!valid) {
               return this.$message.warning({
                  message: "请输入完整的项目",
                  center: true
               });
            } else {
               const { data: res } = await this.$http.post("users", {
                  username: this.addUser.username,
                  password: this.addUser.pwd,
                  email: this.addUser.email,
                  mobile: this.addUser.phone
               });
               console.log(res);
               if (res.meta.status == 201) {
                  this.$message.success({
                     message: res.meta.msg,
                     center: true
                  });
                  this.dialogFormVisible = false;
               } else {
                  this.$message.error({ message: res.meta.msg, center: true });
               }
            }
            this.getUserList()
         });
      },
      dialogCloseHandle() {
         this.$refs.addUserForm.resetFields();
      },
      settingUserInfoDialogCloseHandle(){
         this.$refs.settingUserForm.resetFields()
      },
      del_user(v){          
          this.$confirm("确定删除？该操作无法撤销！","提示",{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(async () =>{
                console.log(v)
                const { data : res } = await this.$http.delete(`users/${v.id}`)
                console.log(res)
                if(res.meta.status == 200 ){
                    this.$message.success({message:`删除用户：${v.username} 成功!`,center:true})
                    this.getUserList()
                }else{
                    this.$message.error({message:res.meta.msg,center:true})
                }
            })
            .catch(()=>{
                this.$message.info({message:"取消删除",center:true})
            })
      },
      settingUserInfo(v){
          console.log(v)
          this.settingUser = {
              username:v.username,
              email:v.email,
              phone:v.mobile,
              id:v.id
          }
          this.userInfoDialogFormVisible = true
      },
      settingUserBtn(){
        this.$refs.settingUserForm.validate(async valid => {
           if(!valid){
               return this.$message.warning({
                   message:"请输入所有必须的项！",
                   center:true
               })
           }else{
               const { data : res } = await this.$http.put(`users/${this.settingUser.id}`,{
                       email:this.settingUser.email,
                       mobile:this.settingUser.phone                   
                    })
                if(res.meta.status == 200){
                    this.$message.success({message:res.meta.msg,center:true})
                    this.getUserList()
                }else{
                    this.$message.error({message:res.meta.msg,center:true})
                }
                this.userInfoDialogFormVisible = false
           }
        })
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
.el-form-item {
   padding-right: 70px;
}
</style>