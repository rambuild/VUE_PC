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
         <el-aside :width="isCollapse?'64px':'200px'">
            <div class="toggle_btn" @click="toggleCollapse">
               <span>|||</span>
            </div>
            <el-menu
               background-color="rgb(53, 57, 70)"
               text-color="#fff"
               active-text-color="rgb(66,157,255)"
               unique-opened
               :collapse="isCollapse"
               :collapse-transition="false"
               router
            >
               <el-submenu :index="i.id+''" v-for="i in menuList" :key="i.id">
                  <template slot="title">
                     <div class="menu_info">
                        <i :class="fontObj[i.id]"></i>
                        <span slot="title">{{ i.authName }}</span>
                     </div>
                  </template>
                  <el-menu-item :index="'/'+j.path" v-for="j in i.children" :key="j.id">
                     <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>{{ j.authName }}</span>
                     </template>
                  </el-menu-item>
               </el-submenu>
            </el-menu>
         </el-aside>

         <!-- 右侧内容区域 -->
         <el-main>
            <router-view></router-view>
         </el-main>
      </el-container>
   </el-container>
</template>

<script>
export default {
   data() {
      return {
         isCollapse: false,
         menuList: [],
         fontObj: {
            "125": "iconfont icon-user",
            "103": "iconfont icon-tijikongjian",
            "101": "iconfont icon-shangpin",
            "102": "iconfont icon-danju",
            "145": "iconfont icon-baobiao"
         }
      };
   },
   methods: {
      quit() {
         this.$confirm('确认退出？',{
            type:"warning"
         }).then(()=>{
            window.sessionStorage.clear();
            this.$router.push("/login");
            this.$message({
               type: "success",
               message: "退出成功！",
               duration: 1000,
               center: true
            });
         })
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
      },
      toggleCollapse() {
         this.isCollapse = !this.isCollapse;
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
   color: #fff;
   text-align: center;
   overflow: hidden;
   .toggle_btn {
      cursor: pointer;
      background-color: rgb(74, 82, 100);
      vertical-align: middle;
      height: 28px;
      width: 100%;
      letter-spacing: 0.1em;
   }
   .toggle_btn:hover {
      background-color: rgb(102, 176, 255);
   }
   .el-menu {
      border-right: none;
   }
   .el-menu-item {
      font-size: 13px;
      padding-left: 60px !important;
   }
   .menu_info {
      font-size: 17px !important;
      i {
         font-size: 20px;
      }
   }
}

.el-main {
   background-color: rgb(233, 236, 241);
   color: #333;
}
</style>