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
                        <el-input placeholder="请输入内容" class="input-with-select">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary">添加用户</el-button>
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
                            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200px">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>                            
                            <el-tooltip content="Top center" placement="分配角色">
                                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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
   data() {
      return {
         quertData: {
            query: "",
            pagenum: 1,
            pagesize: 2
         },
         userList: [],
         value:true
      };
   },
   methods: {
      async getUserList() {
         const { data: res } = await this.$http.get("users", {
            params: this.quertData
         });
         this.userList = res.data.users;
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
</style>