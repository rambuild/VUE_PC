<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片内容区域 -->
        <el-card class="box-card">
            <div>
               <h3>用户来源</h3>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            
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