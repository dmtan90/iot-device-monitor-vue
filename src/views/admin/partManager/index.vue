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
              <el-button v-if="partManager_btn_add" size="small" type="primary" icon="plus" @click="handlerAddAreaNode">新增组织</el-button>
              <el-button v-if="partManager_btn_del" size="small" type="danger" icon="delete" @click="handleAreaNodeDelete">删除组织</el-button>
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
                  <el-form-item label="组织详细地址">
                    <span>{{ scope.row.address }}</span>
                  </el-form-item>
                  <el-form-item label="组织添加时间">
                    <span>{{ scope.row['createTime'] }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column type="index"  label="ID" align="center" prop="id">
            </el-table-column>
            <el-table-column align="center"  sortable prop="code" label="组织编码">
            </el-table-column>
            <el-table-column align="center" sortable prop="areaName" label="所属区域">
            </el-table-column>
            <el-table-column align="center" sortable prop="partName" label="组织名称">
            </el-table-column>
            <el-table-column align="center" sortable prop="userName" label="组织负责人">
            </el-table-column>
            <el-table-column align="center" sortable prop="phone" label="联系电话">
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="240">
              <template slot-scope="scope">
                <!--<el-button size="small" type="primary" icon="view" @click="handlerQueryClass(scope.row)">设备</el-button>-->
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
    <el-dialog :title="dialogAreaNodeTitle" :visible.sync="dialogAreaNodeVisible">
      <el-form :model="partFrom" :rules="rules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择地区">
              <el-cascader
                placeholder="试试搜索：地区名称"
                :options="addAreaTree"
                :props="addAreaTreeProps"
                v-model="partFrom['partNode']"
                expand-trigger="hover"
                filterable
                clearable
                :show-all-levels="true"
                change-on-select
                style="width: 100%"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织名称" prop="partName">
              <el-input v-model="partFrom.partName" clearable placeholder="请输入组织名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isAdmin">
          <el-col :span="12">
          <el-form-item label="负责人">
                <el-select v-model="partFrom.partManager"
                           clearable
                           filterable
                           placeholder="搜索负责人"
                           no-data-text="请到用户管理添加用户">
                  <el-option
                    v-for="item in SchoolUser"
                    :key="item.id"
                    :label="item['userName']"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织编码" prop="partName">
              <el-input v-model="partFrom.code" clearable placeholder="请输入组织编码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="partFrom.address" clearable placeholder="请输入详细地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('partFrom')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createSchool">确 定</el-button>
        <el-button v-else type="primary" @click="createSchool">确 定</el-button>
      </div>
    </el-dialog>

    <!--<el-dialog :title="dialogClassTitle" :visible.sync="dialogClassVisible">-->
      <!--<el-form :model="classFrom" :rules="rules" ref="classFrom" label-width="100px">-->
        <!--<el-form-item label="班级名称" prop="className">-->
          <!--<el-input v-model="classFrom.className" clearable placeholder="请输入班级名称"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="cancel('classFrom')">取 消</el-button>-->
        <!--<el-button type="primary" @click="createClass">确 定</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
    <!--<el-dialog :title="'班级列表'" :visible.sync="dialogQueryClassVisible" >-->
      <!--<el-button size="small" type="success" style=" margin-bottom: 10px; float: right" @click="handlerClass">添加班级</el-button>-->
      <!--<el-table :data="classArray" v-loading.body="listLoading" border fit highlight-current-row-->
                <!--style="width: 100%">-->
      <!--<el-table-column-->
        <!--type="index"-->
        <!--label="ID"-->
        <!--align="center"-->
        <!--width="80">-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="班级名称">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.className}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
        <!--<el-table-column align="center" label="操作" width="150">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button size="small" type="danger" @click="handleDeleteClass(scope.row.id)">删除-->
            <!--</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
  import {
    page,
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
    createAreaTree,
    areaSchoolList,
    getSchool
  } from 'api/admin/partManager/index';
  import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        SchoolUser:[],//园区用户列表
        total: 0,
        listLoading: true,
        listQuery: {
          //分页查询列表初始化
          page: 1,
          limit: 20,
          code: ""
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
          id: '',//主键
          code: '', //组织编码
          userId: '', //园区负责人主键
          parentId: '',// 区域节点 区级
          partNode: [],//添加园区区域节点 包括省市区
          address: '',//园区详细地址
          partName: '',//园区名字
          partManager: ''//园区负责人
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
          className: [{
            required: true,
            message: '请输入班级名称',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          }],
          partName: [{
            required: true,
            message: '请输入园区名称',
            trigger: 'blur'
          }]
        },
        partTree: [],   // 区域节点下面含有园区的区域目录树
        defaultProps: {
          children: 'children',
          label: 'name'
        },

        dialogAreaNodeTitle: '新增区域节点',  // 弹出框标题
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
        isAdmin: false
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
      this.initPartTree();
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
        if (this.isAdmin) {
          page(this.listQuery).then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          });
        } else {
          getSchool(this.schoolId).then(response => {
            this.list = [response.data];
            this.listLoading = false;
          });
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
        let school = Object.assign({}, this.listQuery);
        school.areaId = this.selectedNode.id;
        school.level = this.selectedNode.level;
        pageSchool(school).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        });
      },

      // 加载所有区域树数据
      initPartTree() {
        createAreaTree().then(response => {
          this.addAreaTree = response.data;
        });
      },
      //仅查询节点下面有添加园区的区域属节点
      initPartTreeSchool() {
        areaSchoolList().then(response => {
          this.partTree = response.data;
        });
      },
      //加载所有的院长数据
      uploadSchoolUser(){
        schoolUser().then(response => {
          this.SchoolUser = response.data;
        });
      },

      //  新增园区对话框
      handlerAddAreaNode() {
        this.partFrom = {
          id: undefined,//主键
          userId: undefined, //园区负责人主键
          parentId:undefined,// 区域节点 区级
          partNode: [],//添加园区区域节点 包括省市区
          address: undefined,//园区详细地址
          partName: undefined,//园区名字
          partManager: undefined//园区负责人
        };
        this.dialogStatus = 'create';
          this.dialogAreaNodeTitle = '新增组织';
          this.dialogAreaNodeVisible = true;
      },

      //  新增班级对话框
      handlerClass() {
        this.classFrom.className = '';
        this.dialogStatus = 'create';
        this.dialogClassTitle = '新增班级';
        this.dialogClassVisible = true;
      },

      //删除区域属节点
      handleAreaNodeDelete(){
        const selectedNode = this.selectedNode;
        if (selectedNode == null) {//未选中节点
          this.$notify({
            title: '提示',
            message: '请选择区域节点',
            type: 'danger',
            duration: 2000
          });
          return false;
        }else if(selectedNode.children){//选中非末节点
          this.$notify({
            title: '提示',
            message: '请先删除子节点',
            type: 'danger',
            duration: 2000
          });
          return false;
        }
        else {//选中末节点
          deleteAreaNode(selectedNode.id).then(res => {
            if (res.rel) {

              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              this.initPartTreeSchool();//刷新节点下面有添加园区的区域属节点
            }else {
              this.$notify({
                title: '警告',
                message: '当前节点下存在园区数据，请先删除园区再删除节点',
                type: 'warning',
                duration: 3000
              });
            }
          });
        }
      },


      //添加班级
      createClass(){
        this.$refs.classFrom.validate(valid => {
          if (valid) {
              this.classFrom.partId = this.partId;
              this.classFrom.className = this.classFrom.className
              addClass(this.classFrom).then(() => {
                this.dialogClassVisible = false;
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.refreshClassList(this.partId);//添加成功之后刷新班级列表
              })

          } else {
            return false;
          }
        });
      },


      //新增园区
      createSchool() {
        this.$refs.form.validate(valid => {
          if(this.partFrom.partNode.length < 3){
            this.$notify({
              title: '提示',
              message: '请选择完整的省市区',
              type: 'warning',
              duration: 2000
            });
          }else if(this.partFrom.partManager == '' || this.partFrom.partManager == undefined ){
            this.$notify({
              title: '提示',
              message: '请选择负责人',
              type: 'warning',
              duration: 2000
            });
          }
          else {
            if (valid) {
              let objForm = Object.assign({}, this.partFrom);
              objForm.parentId = objForm.partNode[2];
              if (this.dialogStatus === 'create') {
               delete objForm.userId;
                addPart(objForm).then(() => {
                  this.dialogAreaNodeVisible = false;
                  this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.getList();
                  this.initPartTree();
                  this.initPartTreeSchool();
                })
              } else {
                // 编辑园区
                let objForm = Object.assign({}, this.partFrom);
                objForm.partManager = this.partFrom.userId;
                objForm.parentId = objForm.partNode[2];
                delete  objForm.userId;
                objForm.cost = objForm.cost * 100;
                updatePart(objForm).then(() => {

                  this.dialogAreaNodeVisible = false;
                  this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.initPartTree();
                  this.initPartTreeSchool();
                  this.getList();
                })
              }
              this.dialogAreaNodeVisible = false;
              this.initPartTreeSchool();
            } else {
              return false;
            }
          }
        });
      },


      //-------------编辑园区 begin-----------------
      handleUpdateSchool(data) {
        this.dialogStatus = 'update';
        this.dialogAreaNodeTitle = '编辑园区';
        const from = Object.assign({}, data);
        this.partTree.forEach(one => {
          if(one.children != null){
            one.children.forEach(two => {
              if(two.children != null ){
                two.children.forEach(three => {
                  if (three.id == data.parentId) {
                    from.partNode = [one.id, two.id,data.parentId];
                    return;
                  }
                });
              }
            });
          }
        });
        from.cost /= 100;
        from.partManager = from.userName;
        this.partFrom = from;
        this.dialogAreaNodeVisible = true;
      },
      //-------------编辑园区 end--------------------

      // 当前园区班级
      // handlerQueryClass(data) {
      //     this.partId = data.id;
      //     this.dialogQueryClassVisible = true;
      //     queryClass(data.id).then(response => {
      //       this.classArray = response.data;
      //       this.listLoading = false;
      //     });
      // },
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
              this.initPartTree();
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
