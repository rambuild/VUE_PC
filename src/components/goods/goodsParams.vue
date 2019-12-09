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
            <p style='color:rgb(234,162,58);padding:0 0 10px 20px;'><i class="el-icon-warning"></i> 注意：只允许为第三级分类设置相关参数！</p>
            <p>
                <span style="font-size:20px;">选择商品分类：</span> 
                <!-- 级联选择器 -->
                <el-cascader
                     v-model="selected_options"
                     :options="catgList"
                     :props="{expandTrigger:'hover',label:'cat_name',value:'cat_id',children:'children'}"
                     @change="handleChange"
                     placeholder='请选择分类'
                     clearable
                     ref='casRef'>
                </el-cascader>
            </p>
            <el-tabs :tab-position="tabPosition" style="height: 200px;">
                <el-tab-pane label="用户管理">
                    <el-button type="primary" class='addCatg' @click='addCatgBtn' style='margin:5px 0 20px 0'>添加参数</el-button>
                    <template>
                        <el-table :data="paramsList" border stripe style="width: 100%">
                            <el-table-column type="expand" label=""></el-table-column>
                            <el-table-column type="index" label="#"></el-table-column>
                            <el-table-column prop="paramsName" label="参数名称"></el-table-column>
                            <el-table-column prop="path" label="操作">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" size="mini" @click='edit_roleMethods(scope.row)'>编辑</el-button>
                                    <el-button type="danger" icon="el-icon-delete" size="mini" @click='del_role(scope.row)'>删除</el-button>
                                    <el-tooltip content="分配角色" placement="top" :enterable="false">
                                        <el-button type="warning" icon="el-icon-setting" size="mini" @click='setRights(scope.row)'>分配权限</el-button>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-tab-pane>
                <el-tab-pane label="配置管理">配置管理</el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            tabPosition: 'top',
            catgList:[],
            selected_options:[],
            paramsList:[]
        }
    },
    methods:{
        async getCatgList(){
            const {data : res} = await this.$http.get('categories',{
                params:{
                    type:3
                }
            })
            if(res.meta.status !== 200){
                this.$message.error({ message: res.meta.msg, center: true });
            }else{                
                this.catgList = res.data
                this.total = res.data.total
            }
        },
        handleChange(){

        }
    },
    mounted(){
        this.getCatgList()
    }
}
</script>

<style lang="scss" scoped>
.el-cascader{
    width: 23%;
}
.el-card{
    padding-bottom: 30px;
}
</style>