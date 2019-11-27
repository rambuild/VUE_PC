<template>
    <div class="home_container">
        <h1>HOME</h1>
        <el-button @click="quit">退出登录</el-button>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        quit(){
            window.sessionStorage.clear()
            this.$router.push('/login')
            this.$message({
                type:"success",
                message:"退出成功！",
                duration:1000,
                center:true
            })
        }
    }
}
</script>

<style lang="scss" scoped>


</style>