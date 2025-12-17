<!-- 商品类型管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 类型列表 -->
      <el-col :lg="24" :xs="24">
        <!-- 搜索区域 -->
        <div class="search-container">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="auto">
            <el-form-item label="类型名称" prop="typename">
              <el-input
                v-model="queryParams.typename"
                placeholder="请输入类型名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="类型编码" prop="typecode">
              <el-input
                v-model="queryParams.typecode"
                placeholder="请输入类型编码"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                style="width: 100px"
              >
                <el-option label="可用" :value="0" />
                <el-option label="不可用" :value="1" />
              </el-select>
            </el-form-item>

            <el-form-item class="search-buttons">
              <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
              <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="hover" class="data-table">
          <div class="data-table__toolbar">
            <div class="data-table__toolbar--actions">
              <el-button type="success" icon="plus" @click="handleOpenDialog()">新增</el-button>
            </div>
          </div>

          <el-table
            v-loading="loading"
            :data="pageData"
            border
            stripe
            highlight-current-row
            class="data-table__content"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="类型名称" prop="typename" min-width="150" />
            <el-table-column label="类型编码" prop="typecode" width="120" align="center" />
            <el-table-column label="排序" prop="sort" width="80" align="center" />
            <el-table-column label="状态" align="center" prop="status" width="80">
              <template #default="scope">
                <el-tag :type="scope.row.status == 0 ? 'success' : 'info'">
                  {{ scope.row.status == 0 ? "可用" : "不可用" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" min-width="150" show-overflow-tooltip />
            <el-table-column label="操作" fixed="right" width="200">
              <template #default="scope">
                <el-button
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row.id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="delete"
                  link
                  size="small"
                  @click="handleDelete(scope.row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 商品类型表单 -->
    <el-drawer
      v-model="dialog.visible"
      :title="dialog.title"
      append-to-body
      :size="drawerSize"
      @close="handleCloseDialog"
    >
      <el-form ref="typeFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="类型名称" prop="typename">
          <el-input v-model="formData.typename" placeholder="请输入类型名称" />
        </el-form-item>

        <el-form-item label="类型编码" prop="typecode">
          <el-input v-model="formData.typecode" placeholder="请输入类型编码" />
        </el-form-item>

        <el-form-item label="父类型" prop="parentid">
          <el-select v-model="formData.parentid" placeholder="请选择父类型" filterable clearable>
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.typename"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            :min="0"
            placeholder="请输入排序"
            controls-position="right"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            inline-prompt
            active-text="可用"
            inactive-text="不可用"
            :active-value="0"
            :inactive-value="1"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" rows="4" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app-store";
import { DeviceEnum } from "@/enums/settings/device-enum";
import GoodsTypeAPI, { GoodsTypeVO, GoodsTypeForm } from "@/api/product/goodstype-api";

defineOptions({
  name: "GoodsType",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const typeFormRef = ref();

const queryParams = reactive<{
  typename?: string;
  typecode?: string;
  status?: number;
}>({});

const pageData = ref<GoodsTypeVO[]>([]);
const loading = ref(false);
const selectedTypeId = ref<string | number>();

const dialog = reactive({
  visible: false,
  title: "新增类型",
});
const drawerSize = computed(() => (appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"));

const formData = reactive<GoodsTypeForm>({
  status: 0,
  sort: 0,
});

const rules = reactive({
  typename: [{ required: true, message: "类型名称不能为空", trigger: "blur" }],
  typecode: [{ required: true, message: "类型编码不能为空", trigger: "blur" }],
  remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
});

// 选中的类型ID
const selectIds = ref<string[]>([]);
// 类型下拉数据源
const typeOptions = ref<OptionType[]>([]);

// 获取数据
async function fetchData() {
  loading.value = true;
  try {
    const data = await GoodsTypeAPI.getList();
    // 根据查询条件过滤数据
    pageData.value = data;
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

// 查询（重置页码后获取数据）
function handleQuery() {
  fetchData();
}

// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  selectedTypeId.value = undefined;
  fetchData();
}

// 选中项发生变化
function handleSelectionChange(selection: any[]) {
  selectIds.value = selection.map((item) => item.id);
}

/**
 * 打开弹窗
 *
 * @param id 类型ID
 */
async function handleOpenDialog(id?: string) {
  dialog.visible = true;
  // 加载类型下拉数据源
  const listData = await GoodsTypeAPI.getList();
  typeOptions.value = listData;

  if (!Number.isNaN(Number(parseInt(id)))) {
    dialog.title = "修改类型";
    GoodsTypeAPI.getFormData(id).then((data) => {
      Object.assign(formData, { ...data });
      // 确保 parentid 为字符串类型以正确绑定选择框
      if (data.parentid) {
        formData.parentid = String(data.parentid);
      }
    });
  } else {
    dialog.title = "新增类型";
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  typeFormRef.value.resetFields();
  typeFormRef.value.clearValidate();

  formData.id = undefined;
  formData.status = 0;
  formData.sort = 0;
  formData.parentid = undefined;
}

// 提交表单（防抖）
const handleSubmit = useDebounceFn(() => {
  typeFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const typeId = formData.id;
      loading.value = true;
      if (typeId) {
        GoodsTypeAPI.update(typeId, formData)
          .then(() => {
            ElMessage.success("修改类型成功");
            handleCloseDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        GoodsTypeAPI.create(formData)
          .then(() => {
            ElMessage.success("新增类型成功");
            handleCloseDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}, 1000);

/**
 * 删除类型
 *
 * @param id 类型ID
 */
function handleDelete(id?: string) {
  const typeIds = [id || selectIds.value].flat();
  if (!typeIds.length) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除该类型?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      const deletePromises = typeIds.map((typeId) => GoodsTypeAPI.delete(typeId));
      Promise.all(deletePromises)
        .then(() => {
          ElMessage.success("删除成功");
          handleQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

onMounted(() => {
  handleQuery();
});
</script>
