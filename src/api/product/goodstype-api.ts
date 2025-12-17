import request from "@/utils/request";

const GOODSTYPE_BASE_URL = "/GoodsType";

const GoodsTypeAPI = {
  /**
   * 获取商品类型列表
   */
  getList() {
    return request<any, GoodsTypeVO[]>({
      url: `${GOODSTYPE_BASE_URL}/List`,
      method: "get",
    });
  },

  /**
   * 获取商品类型树形结构
   */
  getTree() {
    return request<any, GoodsTypeVO[]>({
      url: `${GOODSTYPE_BASE_URL}/Tree`,
      method: "get",
    });
  },

  /**
   * 获取商品类型表单详情
   *
   * @param id 商品类型ID
   */
  getFormData(id: string) {
    return request<any, GoodsTypeForm>({
      url: `${GOODSTYPE_BASE_URL}/${id}`,
      method: "get",
    });
  },

  /**
   * 添加商品类型
   *
   * @param data 商品类型表单数据
   */
  create(data: GoodsTypeForm) {
    return request({
      url: `${GOODSTYPE_BASE_URL}`,
      method: "post",
      data,
    });
  },

  /**
   * 修改商品类型
   *
   * @param id 商品类型ID
   * @param data 商品类型表单数据
   */
  update(id: string, data: GoodsTypeForm) {
    return request({
      url: `${GOODSTYPE_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /**
   * 删除商品类型
   *
   * @param id 商品类型ID
   */
  delete(id: string) {
    return request({
      url: `${GOODSTYPE_BASE_URL}/${id}`,
      method: "delete",
    });
  },

  /**
   * 批量删除商品类型
   *
   * @param ids 商品类型ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${GOODSTYPE_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default GoodsTypeAPI;

/** 商品类型列表对象 */
export interface GoodsTypeVO {
  /** 商品类型ID */
  id?: string;
  /** 类型名称 */
  typename?: string;
  /** 父类型ID */
  parentid?: string;
  /** 父类型名称 */
  parentName?: string;
  /** 备注 */
  remark?: string;
  /** 排序 */
  sort?: number;
  /** 状态(0:可用;1:不可用) */
  status?: number;
  /** 类型编码 */
  typecode?: string;
  /** 子节点 */
  children?: GoodsTypeVO[];
}

/** 商品类型表单类型 */
export interface GoodsTypeForm {
  /** 商品类型 ID */
  id?: string;
  /** 类型名称 */
  typename?: string;
  /** 父类型 ID */
  parentid?: string | number;
  /** 备注 */
  remark?: string;
  /** 排序 */
  sort?: number;
  /** 状态(0:可用;1:不可用) */
  status?: number;
  /** 类型编码 */
  typecode?: string;
}
