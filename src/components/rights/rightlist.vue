<template>
    <div>        
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
           <template>
                <el-table :data="rightsList" border stripe style="width: 100%">
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="authName" label="权限名称"></el-table-column>
                    <el-table-column prop="path" label="路径"></el-table-column>
                    <el-table-column prop="level" label="权限等级">
                        <template slot-scope="scope">
                            <el-tag type="" v-if="scope.row.level == '0'">一级</el-tag>
                            <el-tag type="success" v-if="scope.row.level == '1'">二级</el-tag>
                            <el-tag type="warning" v-if="scope.row.level == '2'">三级</el-tag>
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
          rightsList:[]
      };
   },
   methods:{
       async getRightsList(){
           const {data : res} = await this.$http.get('rights/list')
           if(res.meta.status !== 200){
               return this.$message.error({
                   message:"获取权限列表失败！",
                   center:true
               })
           }else{               
                this.rightsList = res.data
           }
       }
   },
   mounted(){
       this.getRightsList()
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
   .el-table{
       border-radius: 5px;
   }
}
</style>