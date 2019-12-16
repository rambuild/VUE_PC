<<template>
    <div>
       <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片内容区域 -->
        <el-card class="box-card">
            <div>
                <el-row :gutter="20">
                    <el-col :span='8'>
                        <el-input placeholder="请输入内容" class="input-with-select" v-model="queryData.query" clearable>
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                </el-row> 
            </div>
            <!-- 商品列表区域 -->
            <template>
                <el-table :data="orderList" border stripe style="width: 100%" class="goodsTable">
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="goods_name" label="订单编号" class="goodsNameTable"></el-table-column>
                    <el-table-column prop="goods_price" label="订单价格"></el-table-column>
                    <el-table-column prop="goods_weight" label="是否付款">
                        <template slot-scope="scope">
                            <el-tag type="success">已付款</el-tag>
                            <el-tag type="danger">未付款</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="goods_weight" label="是否发货"></el-table-column>
                    <el-table-column prop="goods_weight" label="下单时间"></el-table-column>
                    <el-table-column label="操作" width="200px">
                         <template slot-scope="scope">
                             <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                             <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                         </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            queryData:{},
            orderList:{
                
            }
        }
    },
    methods:{

    },
    mounted(){
        
    }
}
</script>

<style lang="scss" scoped>
.el-table{
    margin-top: 20px;
}
</style>