package top.year21.computerstore.service;

import com.github.pagehelper.PageInfo;
import top.year21.computerstore.entity.Product;

import java.util.List;

public interface IProductService {

    // 查询热销商品前五
    List<Product> queryPriorityProduct();

    // 查询最新商品前五
    List<Product> queryTheNewProduct();

    // 根据id查询商品详情
    Product queryProductById(Integer id);

    // 根据标题模糊查询（不带价格区间）
    PageInfo<Product> queryProductByTitle(Integer pageNum, Integer pageSize, String title);

    // 根据标题和价格区间模糊查询（新增重载方法）
    PageInfo<Product> queryProductByTitle(Integer pageNum, Integer pageSize, String title, Integer minPrice, Integer maxPrice);
}