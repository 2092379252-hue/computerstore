package top.year21.computerstore.controller;

import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.year21.computerstore.entity.Product;
import top.year21.computerstore.service.IProductService;
import top.year21.computerstore.utils.JsonResult;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController extends BaseController {
    @Autowired
    private IProductService productService;

    @GetMapping("/hotProduct")
    public JsonResult<List<Product>> queryBestProduct() {
        return new JsonResult<>(OK, productService.queryPriorityProduct());
    }

    @GetMapping("/newProduct")
    public JsonResult<List<Product>> queryNewProduct() {
        return new JsonResult<>(OK, productService.queryTheNewProduct());
    }

    @GetMapping("/{id}")
    public JsonResult<Product> queryProductById(@PathVariable Integer id) {
        return new JsonResult<>(OK, productService.queryProductById(id));
    }

    // 支持价格区间筛选的搜索接口
    @GetMapping("/{pageNum}/{pageSize}/{title}")
    public JsonResult<PageInfo<Product>> queryByTitle(@PathVariable Integer pageNum,
                                                      @PathVariable Integer pageSize,
                                                      @PathVariable String title,
                                                      @RequestParam(required = false) Integer minPrice,
                                                      @RequestParam(required = false) Integer maxPrice) {
        PageInfo<Product> pageInfo = productService.queryProductByTitle(pageNum, pageSize, title, minPrice, maxPrice);
        return new JsonResult<>(OK, pageInfo);
    }
}