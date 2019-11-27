<template>
   <el-container class="home_container">
      <!-- 头部区域 -->
      <el-header>
         <div>
            <img src="@/assets/img/home_logo.png" />
            <h2>电商后台管理系统</h2>
         </div>
         <el-button @click="quit" type="primary">退出</el-button>
      </el-header>

      <!-- 内容区域 -->
      <el-container>
         <!-- 侧边栏 -->
         <el-aside width="220px">
            <el-menu
               background-color="rgb(53, 57, 70)"
               text-color="#fff"
               active-text-color="rgb(66,157,255)"
            >
               <el-submenu :index="i.id+''" v-for="i in menuList" :key="i.id">
                  <template slot="title">
                     <i :class="fontObj[i.id]"></i>
                     <span slot="title">{{ i.authName }}</span>
                  </template>
                  <el-menu-item :index="j.id+''" v-for="j in i.children" :key="j.id">
                     <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>{{ j.authName }}</span>
                     </template>
                  </el-menu-item>
               </el-submenu>
            </el-menu>
         </el-aside>

         <!-- 右侧内容区域 -->
         <el-main>Main</el-main>
      </el-container>
   </el-container>
</template>

<script>
export default {
   data() {
      return {
         isCollapse: true,
         menuList: [],
         fontObj:{
             "125":"icon-font icon-user",
             "103":"icon-font icon-tijikongjian",
             "101":"icon-font icon-shangpin",
             "102":"icon-font icon-danju",
             "145":"icon-font icon-baobiao",
         }
      };
   },
   methods: {
      quit() {
         window.sessionStorage.clear();
         this.$router.push("/login");
         this.$message({
            type: "success",
            message: "退出成功！",
            duration: 1000,
            center: true
         });
      },
      handleOpen(key, keyPath) {
         console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
         console.log(key, keyPath);
      },
      async getMenuList() {
         const { data: res } = await this.$http.get("menus");
         if (res.meta.status !== 200)
            return this.$message.error({
               message: res.meta.msg,
               center: true
            });
         this.menuList = res.data;
      }
   },
   created() {
      this.getMenuList();
   }
};
</script>

<style lang="scss" scoped>
.home_container {
   height: 100%;
}
.el-header {
   background-color: rgb(58, 63, 67);
   color: #fff;
   text-align: center;
   line-height: 60px;
   display: flex;
   justify-content: space-between;
   align-items: center;
   h2 {
      margin: 0;
      padding: 0;
      display: inline-block;
   }
   btn {
      height: 10px;
   }
   div {
      display: flex;
      align-items: center;
      img {
         border-radius: 8px;
         margin-right: 6px;
      }
   }
}

.el-aside {
   background-color: rgb(53, 57, 70);
   color: #333;
   text-align: center;
   line-height: 200px;
   .el-menu-item{
       font-size: 13px;
       padding-left: 60px !important;
   }
}

.el-main {
   background-color: rgb(233, 236, 241);
   color: #333;
   text-align: center;
   line-height: 160px;
}
</style>