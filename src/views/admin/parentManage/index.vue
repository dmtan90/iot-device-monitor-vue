<template>
  <div class="app-container calendar-list-container">
    <el-card class="box-card"
             shadow="hover">
      <div class="filter-container">

        <el-row type="flex"
                class="row-bg"
                justify="end"
                align="middle">
          <el-button  size="small" type="primary" icon="plus" @click="handlerAddAreaNode">人员录入</el-button>
          <el-input @keyup.enter.native="handleFilter"
                    clearable
                    style="width: 200px; margin-right: 10px"
                    placeholder="称谓/手机号"
                    v-model="listQuery.name"></el-input>
          <el-button type="primary"
                     v-waves
                     icon="search"
                     @click="handleFilter">搜索</el-button>
        </el-row>
      </div>
      <el-table :key='tableKey'
                :data="list"
                max-height="650"
                stripe
                v-loading.body="listLoading"
                element-loading-text="拼命加载中..."
                element-loading-spinner="el-icon-loading"
                highlight-current-row
                :default-sort="{prop: 'createTime', order: 'descending'}"
                style="width: 100%">
        <el-table-column type="index"
                         fixed
                         label="ID"
                         align="center"
                         width="150">
        </el-table-column>
        <!--<el-table-column align="center"-->
                         <!--sortable-->
                         <!--prop="studentName"-->
                         <!--label="学生姓名">-->
          <!--<template slot-scope="scope">-->
            <!--<el-popover placement="top-start"-->
                        <!--trigger="hover">-->
              <!--<img width="170"-->
                   <!--v-lazy="scope.row.studentAvatar"-->
                   <!--class="image">-->
              <!--<el-tag slot="reference">{{scope.row.studentName}}</el-tag>-->
            <!--</el-popover>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center"
                         sortable
                         prop="userName"
                         label="称谓">
        </el-table-column>
        <el-table-column align="center"
                         sortable
                         prop="phone"
                         label="联系方式">
        </el-table-column>

        <el-table-column align="center"
                         sortable
                         prop="sex"
                         label="性别">
        </el-table-column>
        <el-table-column align="center"
                         sortable
                         prop="status"
                         label="状态">
        </el-table-column>
        <el-table-column align="center"
                         sortable
                         prop="createTime"
                         label="添加时间">
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="view" @click="handlerQueryClass(scope.row)">关联设备</el-button>
            <el-button  size="small" type="primary"  @click="handleUpdateSchool(scope.row)">编辑
            </el-button>
            <el-button  size="small" type="danger"  @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!listLoading"
           class="pagination-container">
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <el-form :model="partFrom" :rules="rules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="称谓" prop="name">
              <el-input v-model="partFrom.name" clearable placeholder="请输入人员称谓"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select class="filter-item" v-model="partFrom.sex">
                <el-option v-for="item in typeArray" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="phone" prop="address">
              <el-input v-model="partFrom.phone" clearable placeholder="请输入联系方式"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('partFrom')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createPerson">确 定</el-button>
        <el-button v-else type="primary" @click="createPerson">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page,addPerson } from "api/admin/parentManage/index";
// import { schoolList, queryClass } from "api/admin/partManager/index";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      partFrom: {
        name: '', //称谓
        phone: '', //联系方式
        sex: '',// 性别
      },
      listQuery: {
        //分页查询列表初始化
        page: 1,
        limit: 20,
      },
      tableKey: 0,
      typeArray: [{value: 1, label: '男'}, {value: 2, label: '女'}],
      rules: {
        name: [{
          required: true,
          message: '请输入人员称谓',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '请输入联系方式',
          trigger: 'blur'
        }]
      },
    dialogStatus : 'create',
    dialogTitle : '新增人员',
    dialogVisible : false
    };
  },
  created() {
    // 页面加载自动调用
    this.getList();
  },
  computed: {
    ...mapGetters(["schoolId"])
  },
  methods: {
    // 分页查询人员信息
    getList() {
      this.listLoading = true;
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    //过滤搜索
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    //  新增人员对话框
    handlerAddAreaNode() {
      this.partFrom = {
        name: '', //称谓
        sex:'',// 性别
        phone: '',//联系方式

      };
      this.dialogStatus = 'create';
      this.dialogTitle = '人员录入';
      this.dialogVisible = true;
    },
    //人员录入
    createPerson() {
      this.$refs.partFrom.validate(valid => {
        if(this.partFrom.sex == '' ||this.partFrom.sex == undefined  ||this.partFrom.sex == null){
          this.$notify({
            title: '提示',
            message: '请选择人员性别',
            type: 'warning',
            duration: 2000
          });
        }
        else {
          if (valid) {
            let objForm = Object.assign({}, this.partFrom);
            objForm.status = 0;//新添加人员默认状态
            if (this.dialogStatus === 'create') {
              addPerson(objForm).then(() => {
                this.dialogVisible = false;
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
    }
  }
};
</script>

<style scoped>
</style>
