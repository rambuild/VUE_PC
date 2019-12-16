<template>
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
                show-icon
                :closable="false">
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
                ref="addFormRef">
                <el-tabs tab-position="left" v-model="activeIndex" @tab-click='tabClick' :before-leave='beforeLeaveTabs'>
                    <el-tab-pane label="基本信息" name='0'>
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model='addGoodsForm.goods_name'></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model='addGoodsForm.goods_price'></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model='addGoodsForm.goods_number'></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model='addGoodsForm.goods_weight'></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_classify">
                            <el-cascader
                                v-model="addGoodsForm.goods_cat"
                                :options="catgList"
                                :props="{expandTrigger:'hover',label:'cat_name',value:'cat_id',children:'children'}"
                                @change="handleCascaderChange"
                                placeholder='请选择分类'
                                clearable
                                ref='casRef'>
                            </el-cascader>
                        </el-form-item>
                        <el-button @click='resetAddGoodsFields' type='warning'>重置表单</el-button>
                        <el-button @click='nextStep' type='primary'>下一步</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name='1'>
                        <el-form-item v-for="i in goodsCatg" :key='i.attr_id'>
                            <p>{{ i.attr_name }}</p>
                            <el-checkbox-group v-model="i.attr_vals">
                                <el-checkbox v-for='(j,index) in i.attr_vals' :key="index" :label="j" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-button @click='nextStep' type='primary'>下一步</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name='2'>
                        <el-form-item v-for="i in goodsAttr" :label='i.attr_name' :key='i.attr_id'>
                            <el-input v-model="i.attr_vals"></el-input>
                        </el-form-item>
                         <el-button @click='nextStep' type='primary'>下一步</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name='3'>
                        <el-upload
                            class="upload-demo"
                            action="http://127.0.0.1:8888/api/private/v1/upload"
                            :on-preview="handlePreviewImg"
                            :headers='headersObj'
                            :on-remove="handleRemoveImg"
                            :file-list="fileList"
                            :on-success='successUpImg'
                            list-type="picture">
                            <el-button size="medium" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <el-button @click='nextStep' type='primary' style='margin-top:80px;'>下一步</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name='4'>
                        <!-- 富文本编辑组件 -->
                        <quill-editor 
                            v-model="addGoodsForm.goods_introduce"
                            ref="myQuillEditor">
                        </quill-editor>
                        <el-button type='primary' @click='addGoodsBtn' style='margin-top:20px;'>添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 预览图片对话框 -->
        <el-dialog
            title="图片预览"
            :visible.sync="picDialogVisible"
            width="35%"
            :before-close="previewCloseHandle">
            <img :src='previewImgSrc'
            class='previewImg'></img>
        </el-dialog>
    </div>
</template>

<script>
export default {
   data() {
      var checkNum = (rule, value, callback) => {
         var numReg = new RegExp("^[0-9]*$");
         if (!value) {
            return callback(new Error("请输入此项！"));
         } else {
            if (!numReg.test(value)) {
               return callback(new Error("只允许输入纯数字！"));
            }
         }
         return callback();
      };
      var checkGoodsClassify = (rule, value, callback) => {
         if (this.addGoodsForm.goods_cat.length == 0) {
            return callback(new Error("请选择商品分类！"));
         } else {
            return callback();
         }
      };
      return {
         activeIndex: "0",
         addGoodsForm: {
            goods_name: "",
            goods_price: "",
            goods_number: "",
            goods_weight: "",
            goods_introduce: "",
            goods_cat: [],
            pics: [],
            attrs:[]
         },
         addGoodsFormRules: {
            goods_name: [
               {
                  required: true,
                  message: "请输入商品名称！",
                  trigger: "blur"
               }
            ],
            goods_price: [
               {
                  required: true,
                  validator: checkNum,
                  trigger: "change"
               }
            ],
            goods_number: [
               {
                  required: true,
                  validator: checkNum,
                  trigger: "change"
               }
            ],
            goods_weight: [
               {
                  required: true,
                  validator: checkNum,
                  trigger: "change"
               }
            ],
            goods_classify: [
               {
                  required: true,
                  trigger: "change",
                  validator: checkGoodsClassify
               }
            ]
         },
         catgList: [],
         goodsCatg: [],
         goodsAttr: [],
         fileList: [],
         headersObj: {
            Authorization: window.sessionStorage.getItem("token")
         },
         picDialogVisible: false,
         previewImgSrc: "",
         quillContent:[]
      };
   },
   methods: {
      resetAddGoodsFields() {
         this.$confirm("确认重置？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
         }).then(() => {
            this.$refs.addFormRef.resetFields();
            this.addGoodsForm.goods_cat = [];
            this.$message.success({ message: "重置表单成功！", center: true });
         });
      },
      nextStep() {
         this.$refs.addFormRef.validate(valid => {
            if (valid) {
               this.activeIndex++;
               this.activeIndex += "";
               this.getGoodsAttr()
               this.getGoodsCatg()
            }
         });
      },
      handleCascaderChange(v) {
         if (v.length != 3) {
            this.addGoodsForm.goods_cat = [];
            this.$message.warning({
               message: "必须选择三级分类！",
               center: true
            });
         }
      },
      async getCatgList() {
         const { data: res } = await this.$http.get("categories");
         if (res.meta.status !== 200) {
            this.$message.error({ message: res.meta.msg, center: true });
         } else {
            this.catgList = res.data;
         }
      },
      beforeLeaveTabs(activeName, oldActiveName) {
         if (oldActiveName == "0") {
            if (this.addGoodsForm.goods_cat.length != 3) {
               this.$message.error({
                  message: "请先选择商品分类！",
                  center: true
               });
               return false;
            }
         }
      },
      async getGoodsCatg() {
         //选择商品分类之后才进行参数请求
         if (this.addGoodsForm.goods_cat.length != 0) {
            const { data: res } = await this.$http.get(
               `categories/${this.addGoodsForm.goods_cat[2]}/attributes`,
               {
                  params: {
                     sel: "many"
                  }
               }
            );
            if (res.meta.status !== 200) {
               this.$message.error({ message: res.meta.msg, center: true });
            } else {
               this.goodsCatg = res.data;
               this.goodsCatg.forEach(i => {
                  i.attr_vals =
                     i.attr_vals.length == 0 ? [] : i.attr_vals.split(",");
               });
            }
         }
      },
      async getGoodsAttr() {
         //   选择商品分类之后才进行属性请求
         if (this.addGoodsForm.goods_cat.length != 0) {
            const { data: res } = await this.$http.get(
               `categories/${this.addGoodsForm.goods_cat[2]}/attributes`,
               {
                  params: {
                     sel: "only"
                  }
               }
            );
            if (res.meta.status !== 200) {
               this.$message.error({ message: res.meta.msg, center: true });
            } else {
               console.log(res);
               this.goodsAttr = res.data;
            }
         }
      },
      tabClick(v) {
         if (v.name == "1") {
            this.getGoodsCatg();
         } else if (v.name == "2") {
            this.getGoodsAttr();
         }
      },
      handleRemoveImg(file, fileList) {
         const path = file.response.data.tmp_path;
         const index = this.addGoodsForm.pics.findIndex(i => i.pic == path);
         this.addGoodsForm.pics.splice(index, 1);
      },
      handlePreviewImg(file) {
         this.picDialogVisible = true;
         this.previewImgSrc = file.response.data.url;
      },
      successUpImg(res, file, fileList) {
         console.log(res);
         if (res.meta.status == 200) {
            const picInfo = {
               pic: res.data.tmp_path
            };
            this.addGoodsForm.pics.push(picInfo);
         }
      },
      previewCloseHandle(done) {
         done();
      },
      addGoodsBtn(){
          this.$refs.addFormRef.validate(async valid => {
              if(!valid){
                  return this.$message.warning({ message:"请填写必要的表单项！",center:true })
              }else{
                const goodsCatStr = this.addGoodsForm.goods_cat.join(',')
                // 处理动态参数
                this.goodsCatg.forEach(i=>{
                    const newInfo = {
                        attr_id:i.attr_id,
                        attr_value:i.attr_vals.join(',')
                    }
                    this.addGoodsForm.attrs.push(newInfo)
                })
                // 处理静态属性
                this.goodsAttr.forEach(i=>{
                    const newInfo = {
                        attr_id:i.attr_id,
                        attr_value:i.attr_vals
                    }
                    this.addGoodsForm.attrs.push(newInfo)
                })
                  const { data : res } = await this.$http.post(`goods`,{
                      goods_name:this.addGoodsForm.goods_name,
                      goods_price:this.addGoodsForm.goods_price,
                      goods_number:this.addGoodsForm.goods_number,
                      goods_weight:this.addGoodsForm.goods_weight,
                      goods_introduce:this.addGoodsForm.goods_introduce,
                      pics:this.addGoodsForm.pics,
                      goods_cat:goodsCatStr,
                      attrs:this.addGoodsForm.attrs
                  })
                  if(res.meta.status != 201){
                      this.$message.error({ message:res.meta.message,center:true })
                  }else{
                      this.$message.success({ message:res.meta.msg,center:true })
                      console.log(res)
                      this.$router.push('/goods')
                  }
              }
          })
      }
   },
   mounted() {
      this.getCatgList();
   }
};
</script>

<style lang="scss" scoped>
.el-steps {
   margin-top: 20px;
}
.el-tabs {
   margin-top: 20px;
}
.el-tabs /deep/.el-tabs__content {
   padding-left: 10px !important;
}
.el-tabs /deep/.el-tabs__item {
   font-size: 16px;
}
.el-textarea /deep/textarea {
   height: 100px;
}
.el-cascader /deep/.el-input {
   width: 260px;
}
.el-checkbox {
   margin: 0 20px 15px 0 !important;
}
.previewImg {
   width: 100%;
}
.quill-editor /deep/.ql-editor{
    min-height: 300px !important;
}
</style>