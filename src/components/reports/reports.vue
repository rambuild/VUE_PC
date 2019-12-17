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
            <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div id="echartsArea" style="width: 750px;height:500px;"></div>
         </div>
      </el-card>
   </div>
</template>

<script>
import echarts from "echarts";
import _ from 'lodash'
export default {
   data() {
      return {
        // 需要合并的数据
        echartsOptions:{
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        },
        option:{
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
      };
   },
   methods: {
        getReports(){
           
       }
   },
   async mounted() {
       var myChart = echarts.init(document.getElementById('echartsArea'));
       const {data : res} = await this.$http.get('reports/type/1')
       if(res.meta.status !== 200){
          return this.$message.error({ message:res.meta.msg,center:true })
       }
       const result = _.merge(res.data,this.echartsOptions)
       myChart.setOption(result);    
   }
};
</script>

<style lang="scss" scoped>
</style>