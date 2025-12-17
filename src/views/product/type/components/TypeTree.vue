<!-- 商品类型树 -->
<template>
  <el-card shadow="never">
    <el-input v-model="typeSearchName" placeholder="类型名称" clearable>
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <el-tree
      ref="typeTreeRef"
      class="mt-2"
      :data="typeList"
      :props="{ children: 'children', label: 'typename' }"
      :expand-on-click-node="false"
      :filter-node-method="handleFilter"
      default-expand-all
      node-key="id"
      @node-click="handleNodeClick"
    />
  </el-card>
</template>

<script setup lang="ts">
import GoodsTypeAPI from "@/api/product/goodstype-api";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: undefined,
  },
});

const typeList = ref<any[]>([]); // 类型列表
const typeTreeRef = ref(); // 类型树
const typeSearchName = ref(); // 类型名称

const emits = defineEmits(["node-click"]);

const typeId = useVModel(props, "modelValue", emits);

watchEffect(
  () => {
    typeTreeRef.value?.filter(typeSearchName.value);
  },
  {
    flush: "post",
  }
);

/**
 * 类型筛选
 */
function handleFilter(value: string, data: any) {
  if (!value) {
    return true;
  }
  return data.typename.indexOf(value) !== -1;
}

/** 类型树节点 Click */
function handleNodeClick(data: { [key: string]: any }) {
  typeId.value = data.id;
  emits("node-click");
}

onBeforeMount(() => {
  GoodsTypeAPI.getTree().then((data) => {
    typeList.value = data;
  });
});
</script>
