<template>
  <div class="app-container calendar-list-container">
    <el-card class="box-card">
      <el-row>

        <el-col v-if="isAdmin" :span="5" style="padding-right: 10px">
          <el-card  shadow="hover" class="box-card">
          <el-tree :data="partTree" v-model="partTree" :highlight-current="true" node-key="id" :props="defaultProps"
                   @node-click="handleNodeClick" default-expand-all></el-tree>
          <div class="filter-container p-default-button">
            <el-button-group>
              <el-button v-if="partManager_btn_add" size="small" type="primary" icon="plus" @click="handlerAddAreaNode">新增设备</el-button>
            </el-button-group>
          </div>
          </el-card>
        </el-col>

        <el-col :span="isAdmin ? 19 : 24">
          <el-card  shadow="hover" class="box-card">
          <el-table :data="list" max-height="650"
                    stripe
                    v-loading.body="listLoading"
                    element-loading-text="拼命加载中..."
                    element-loading-spinner="el-icon-loading"
                    highlight-current-row
                    style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="table-expand">
                  <el-form-item label="备注">
                    <span>{{ scope.row.note }}</span>
                  </el-form-item>
                  <el-form-item label="添加时间">
                    <span>{{ scope.row['createTime'] }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column type="index"  label="ID" align="center" prop="id">
            </el-table-column>
            <el-table-column align="center"  sortable prop="name" label="设备名称">
            </el-table-column>
            <el-table-column align="center" sortable prop="code" label="设备编码">
            </el-table-column>
            <el-table-column align="center" sortable prop="areaName" label="所属区域">
            </el-table-column>
            <el-table-column align="center" sortable prop="organizationName" label="所属组织">
            </el-table-column>
            <el-table-column align="center" sortable prop="status" label="设备状态">
            </el-table-column>
            <el-table-column align="center" sortable prop="type" label=" 设备类型">
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="240">
              <template slot-scope="scope">
                <el-button size="small" type="primary" icon="view" @click="handlerQueryClass(scope.row)">关联用户</el-button>
                <el-button v-if="partManager_btn_edit" size="small" type="primary"  @click="handleUpdateSchool(scope.row)">编辑
                </el-button>
                <el-button v-if="partManager_btn_del" size="small" type="danger"  @click="handleDelete(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="isAdmin" v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page"
                           :page-sizes="[10,20,30, 50]"
                           :page-size="listQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total"
                           background>
            </el-pagination>
          </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加弹出框 -->
    <!--</el-card>-->
    <el-dialog :title="dialogAreaNodeTitle" :visible.sync="dialogAreaNodeVisible">
      <el-form :model="partFrom" :rules="rules" ref="partFrom" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="partFrom.name" clearable placeholder="请输入设备名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编码" prop="code">
              <el-input v-model="partFrom.code" clearable placeholder="请输入设备编码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="设备类型">
          <el-select class="filter-item" v-model="partFrom.type">
            <el-option v-for="item in typeArray" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" clearable placeholder="请输入备注" v-model="partFrom.note"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('partFrom')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createSchool">确 定</el-button>
        <el-button v-else type="primary" @click="createSchool">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    updateAreaNode,//添加区域节点
    deleteAreaNode,//删除区域节点
    schoolUser,//查询所有的未分配负责人数据
    pageSchool, //点击树节点分页查询学校数据
    queryClass,
    addPart,
    deletePart,
    updatePart,
    addClass,
    updateClass,
    deleteClass,
    getSchool
  } from 'api/admin/partManager/index';

  import {
    areaOrganizationList,//省市区  组织  四级树
    addDevice, // 添加设备
    page, //根据条件分页查询设备信息
    updateDevice//更新设备信息
  } from 'api/admin/deviceManager/index';
  import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        SchoolUser:[],//园区用户列表
        total: 0,
        listLoading: true,
        listQuery: {
          //分页查询列表初始化
          nodeId: '',//节点ID
          level: '',//节点等级
          page: 1,
          limit: 20,
        },
        list: null,
        currentNodeId:'',//点击树节点ID
        addAreaTree: [], //区域属
        oneArea: [],//单个省市区
        addAreaTreeProps: {//区域属节点属性
          label: "name",//节点名称
          value: "id",//树节点唯一标识 主键
          children: "children"
        },
        partFrom: {
          code: '', //设备编码
          parentId: '', //所属组织ID
          name: '', //设备名称
          type: '',// 设备类型
          status: '',//设备状态
          note: '',//备注
        },
        partId: '',//园区ID
        classFrom: {//班级添加表单
          partId: '',//园区ID
          className: ''//班级名字
        },
        areaNodeForm: {//区域节点表单提交数据
          nodeId: [],//添加园区区域节点 包括省市区
        },
        rules: {
          name: [{
            required: true,
            message: '请输入设备名称',
            trigger: 'blur'
          }],
          code: [{
            required: true,
            message: '请输入设备编码',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '请请选择设备类型',
            trigger: 'blur'
          }]
        },
        partTree: [],   // 区域节点下面含有园区的区域目录树
        defaultProps: {
          children: 'children',
          label: 'name'
        },

        dialogAreaNodeTitle: '新增设备',  // 弹出框标题
        dialogAreaNodeVisible: false,   // 新增园区弹出框状态


        dialogPartTitle: '新增园区',  // 弹出框标题
        dialogPartVisible: false,   // 新增园区弹出框状态

        dialogClassTitle: '新增班级',
        dialogClassVisible: false,  // 新增班级弹出框状态
        dialogStatus: 'create',   // 按键状态
        selectedNode: null,  // 选中节点数据
        classArray: null,   // 班级列表
        dialogQueryClassVisible: false,
        listLoading: true,
        isAdmin: false,
        typeArray: [{value: 1, label: '晨检设备'}, {value: 2, label: '考勤设备'}]
      };
    },
    // 权限判断
    created() {
      this.isAdmin = typeof this.schoolId === "undefined";
      if (this.isAdmin) {
        this.uploadSchoolUser();    
      }
      this.getList(); //分页列表
      this.initPartTreeSchool();
      this.partManager_btn_edit = this.elements['partManager:btn_edit'];
      this.partManager_btn_del = this.elements['partManager:btn_del'];
      this.partManager_btn_add = this.elements['partManager:btn_add'];
    },
    computed: {
      ...mapGetters([
        'elements', 'schoolId'
      ])
    },
    methods: {
      // 分页查询学校
      getList() {
        this.listLoading = true;
        let params = Object.assign({}, this.listQuery);
        if(!this.selectedNode){//没有选中节点
          params.nodeId == null;
          params.level == null;
        }else {
          params.nodeId = this.selectedNode.id;
          if(!this.selectedNode.children){
            params.level = 4;
          }else {
            params.level = this.selectedNode.level;
          }
        }
        if (this.isAdmin) {
          page(params).then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          });
        } else {
          // getSchool(this.schoolId).then(response => {
          //   this.list = [response.data];
          //   this.listLoading = false;
          // });
        }
      },
      //分页查询一页查询数据条数
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      //分页查询第几页数据
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },

      // 树节点点击事件,分页查询组织
      handleNodeClick(data) {
        this.selectedNode = data;//当前点击节点ID
        this.listLoading = true;
        let params = Object.assign({}, this.listQuery);
        params.nodeId = this.selectedNode.id;
        if(!this.selectedNode.children){
          params.level = 4;
        }else {
          params.level = this.selectedNode.level;
        }
        console.log(!this.selectedNode.children)
        page(params).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        });
      },

      //仅查询节点下面有添加园区的区域属节点
      initPartTreeSchool() {
        areaOrganizationList().then(response => {
          this.partTree = response.data;
        });
      },
      //加载所有的院长数据
      uploadSchoolUser(){
        schoolUser().then(response => {
          this.SchoolUser = response.data;
        });
      },

      //  新增设备对话框
      handlerAddAreaNode() {
        const selectedNode = this.selectedNode;
        if (selectedNode == null || selectedNode.children) {//未选中节点
          this.$notify({
            title: '提示',
            message: '请选择末组织',
            type: 'danger',
            duration: 2000
          });
          return false;
        }else{
          this.partFrom = {
            code: '', //设备编码
            parentId: this.selectedNode.id, //组织ID
            name: '', //设备名称
            type: '',// 设备类型
            status: '',//设备状态
            note: '',//备注
          };
          this.dialogStatus = 'create';
          this.dialogAreaNodeTitle = '新增设备';
          this.dialogAreaNodeVisible = true;
        }
      },

      //  新增班级对话框
      handlerClass() {
        this.classFrom.className = '';
        this.dialogStatus = 'create';
        this.dialogClassTitle = '新增班级';
        this.dialogClassVisible = true;
      },

      //删除区域属节点
      // handleAreaNodeDelete(){
      //   const selectedNode = this.selectedNode;
      //   if (selectedNode == null) {//未选中节点
      //     this.$notify({
      //       title: '提示',
      //       message: '请选择区域节点',
      //       type: 'danger',
      //       duration: 2000
      //     });
      //     return false;
      //   }else if(selectedNode.children){//选中非末节点
      //     this.$notify({
      //       title: '提示',
      //       message: '请先删除子节点',
      //       type: 'danger',
      //       duration: 2000
      //     });
      //     return false;
      //   }
      //   else {//选中末节点
      //     deleteAreaNode(selectedNode.id).then(res => {
      //       if (res.rel) {
      //
      //         this.$notify({
      //           title: '成功',
      //           message: '删除成功',
      //           type: 'success',
      //           duration: 2000
      //         });
      //         this.initPartTreeSchool();//刷新节点下面有添加园区的区域属节点
      //       }else {
      //         this.$notify({
      //           title: '警告',
      //           message: '当前节点下存在园区数据，请先删除园区再删除节点',
      //           type: 'warning',
      //           duration: 3000
      //         });
      //       }
      //     });
      //   }
      // },


      //添加班级
      // createClass(){
      //   this.$refs.classFrom.validate(valid => {
      //     if (valid) {
      //         this.classFrom.partId = this.partId;
      //         this.classFrom.className = this.classFrom.className
      //         addClass(this.classFrom).then(() => {
      //           this.dialogClassVisible = false;
      //           this.$notify({
      //             title: '成功',
      //             message: '创建成功',
      //             type: 'success',
      //             duration: 2000
      //           });
      //           this.refreshClassList(this.partId);//添加成功之后刷新班级列表
      //         })
      //
      //     } else {
      //       return false;
      //     }
      //   });
      // },


      //新增设备
      createSchool() {
        this.$refs.partFrom.validate(valid => {
          if(this.partFrom.type == '' ||this.partFrom.type == undefined  ||this.partFrom.type == null){
            this.$notify({
              title: '提示',
              message: '请选择设备类型',
              type: 'warning',
              duration: 2000
            });
          }
          else {
            if (valid) {
              let objForm = Object.assign({}, this.partFrom);
              objForm.status = 0;//新添加设备默认状态
              if (this.dialogStatus === 'create') {
                addDevice(objForm).then(() => {
                  this.dialogAreaNodeVisible = false;
                  this.$notify({
                    title: '成功',
                    message: '设备添加成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.getList();
                  this.initPartTreeSchool();
                })
              } else {
                // 编辑设备
                let objForm = Object.assign({}, this.partFrom);

                // updateDevice(objForm).then(() => {
                //
                //   this.dialogAreaNodeVisible = false;
                //   this.$notify({
                //     title: '成功',
                //     message: '更新成功',
                //     type: 'success',
                //     duration: 2000
                //   });
                //   this.initPartTreeSchool();
                //   this.getList();
                // })
                console.log(objForm)
              }
              // this.dialogAreaNodeVisible = false;
              // this.initPartTreeSchool();
            } else {
              return false;
            }
          }
        });
      },


      //-------------编辑设备 begin-----------------
      handleUpdateSchool(data) {
        this.dialogStatus = 'update';
        this.dialogAreaNodeTitle = '编辑设备';
        const from = Object.assign({}, data);
        this.partFrom.code = from.code, //设备编码
        this.partFrom.name = from.name, //设备名称
        this.partFrom.type = from.type,// 设备类型
        this.partFrom.note = from.note,//备注
        this.dialogAreaNodeVisible = true;
      },
      //-------------编辑设备 end--------------------

      // 当前园区班级
      handlerQueryClass(data) {
          this.partId = data.id;
          this.dialogQueryClassVisible = true;
          queryClass(data.id).then(response => {
            this.classArray = response.data;
            this.listLoading = false;
          });
      },
      //添加班级成功之后刷新班级列表
      refreshClassList(id) {
        this.dialogQueryClassVisible = true;
        queryClass(id).then(response => {
          this.classArray = response.data;
          this.listLoading = false;
        });
      },
      // 删除当前园区包括园区下的所有班级
      handleDelete(data) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
          deletePart(data.id).then(res => {
            if (res.rel) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              this.getList();
            }
          });
        });
      },

      // 删除班级
      handleDeleteClass(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteClass(id).then(res => {
            if (res.rel) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              this.refreshClassList(this.partId);
            }
          });
        });
      },
      // 取消
      cancel(formName) {
        if (formName === 'partFrom') {
          this.dialogAreaNodeVisible = false;
        } else {
          this.dialogClassVisible = false;
        }
      },
    }
  }
</script>

<style scoped>
  .p-default-button {
    margin-top: 20px;
  }
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
