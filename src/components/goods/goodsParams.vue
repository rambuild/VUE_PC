<<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <p style='color:rgb(234,162,58);padding:5px 20px;'><i class="el-icon-warning"></i> 注意：只允许为第三级分类设置相关参数！</p>
            <p><span style="font-size:20px;">选择商品分类：</span> </p>
        </el-card>  
    </div>
</template>

<script>
export default {
    data(){
        return{
            username:''
        }
    },
    methods:{

    },
    mounted(){
        
    }
}
</script>

<style lang="scss" scoped>
    
</style>