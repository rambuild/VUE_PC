<<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片内容区域 -->
        <el-card class="box-card">
            <el-alert
                title="添加商品信息"
                center
                type="info"
                show-icon>
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- 标签页 -->
            <el-form 
                label-position="top" 
                label-width="100px" 
                :model="addGoodsForm"
                :rules="addGoodsFormRules"
                :ref="addFormRef">
                <el-tabs tab-position="left" v-model="activeIndex">
                    <el-tab-pane label="基本信息" name='0'>
                        <el-form-item label="名称">
                            <el-input></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name='1'>配置管理</el-tab-pane>
                    <el-tab-pane label="商品属性" name='2'>角色管理</el-tab-pane>
                    <el-tab-pane label="商品图片" name='3'>定时任务补偿</el-tab-pane>
                    <el-tab-pane label="商品内容" name='4'>角色管理</el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
   data() {
      return {
         activeIndex: "0",
         addGoodsForm: {}
      };
   },
   methods: {
      // tabsClick(v){
      //     switch(v.name){
      //         case 'info':this.activeIndex = 0;break;
      //         case 'goodsParams':this.activeIndex = 1;break;
      //         case 'goodsCatg':this.activeIndex = 2;break;
      //         case 'goodsPic':this.activeIndex = 3;break;
      //         case 'goodsContent':this.activeIndex = 4;break;
      //     }
      // }
   },
   mounted() {}
};
</script>

<style lang="scss" scoped>
.el-steps {
   margin-top: 20px;
}
.el-tabs {
   margin-top: 20px;
}
</style>