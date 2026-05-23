package top.year21.computerstore.controller;

import com.google.code.kaptcha.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.year21.computerstore.controller.exception.ValidCodeNotMatchException;
import top.year21.computerstore.entity.User;
import top.year21.computerstore.service.IUserService;
import top.year21.computerstore.utils.JsonResult;
import javax.servlet.http.HttpSession;


/**
 * @author hcxs1986
 * @version 1.0
 * @description: 处理用户请求的控制器
 * @date 2022/7/10 23:44
 */
@Slf4j
@RestController
@RequestMapping("/user")
public class UserController extends BaseController{

    @Autowired
    private IUserService userService;

    //用户注册
    @PostMapping
    public JsonResult<Void> userRegister(User user,HttpSession session,String code) {
        //从session取出验证码
        String validCode = (String) session.getAttribute(Constants.KAPTCHA_SESSION_KEY);
        //判断验证码是否一致
        if (!validCode.equals(code)){
            throw new ValidCodeNotMatchException("验证码错误,请重试！");
        }
        //执行插入操作
        userService.userRegister(user);
        return new JsonResult<>(OK);
    }

   //用户登录
@GetMapping
public JsonResult<User> userLogin(User user, HttpSession session, String kaptchaCode) {
    // 1. 从session取出验证码
    String validCode = (String) session.getAttribute(Constants.KAPTCHA_SESSION_KEY);

    // 2. 验证码校验（空值 + 忽略大小写比对）
    if (validCode == null || !validCode.equalsIgnoreCase(kaptchaCode)) {
        throw new ValidCodeNotMatchException("验证码错误,请重试！");
    }

    // 3. 验证完立刻删除session里的验证码（防止重复使用）
    session.removeAttribute(Constants.KAPTCHA_SESSION_KEY);

    // 4. 执行登录
    User loginUser = userService.userLogin(user);
    if (loginUser == null) {
        // 直接抛出你项目里已有的异常（如果没有，就用下面的注释方式）
        throw new RuntimeException("用户名或密码错误");
    }

    // 5. 存入session
    session.setAttribute("uid", loginUser.getUid());
    session.setAttribute("username", loginUser.getUsername());

    // 6. 安全返回用户信息
    User newUser = new User();
    newUser.setUsername(loginUser.getUsername());
    newUser.setUid(loginUser.getUid());
    newUser.setGender(loginUser.getGender());
    newUser.setPhone(loginUser.getPhone());
    newUser.setEmail(loginUser.getEmail());
    newUser.setAvatar(loginUser.getAvatar());

    return new JsonResult<>(OK, newUser);
}

    //用户重置密码
    @PostMapping("/resetPassword")
    public JsonResult<Void> userResetPwd(@RequestParam("oldPassword") String oldPwd,
                                         @RequestParam("newPassword") String newPwd,
                                         HttpSession session){
        userService.userResetPwd(oldPwd, newPwd, session);

        //在用户修改密码之后清除session中保存的密码
        session.setAttribute("uid",null);
        return new JsonResult<>(OK);
    }

    @GetMapping("/queryUser")
    public JsonResult<User> queryUserByUid(HttpSession session){
        Integer uid = getUserIdFromSession(session);

        User user = userService.queryUserByUid(uid);

        //将用户名、id、电话、邮箱、性别进行回传
        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setUid(user.getUid());
        newUser.setGender(user.getGender());
        newUser.setPhone(user.getPhone());
        newUser.setEmail(user.getEmail());
        newUser.setAvatar(user.getAvatar());

        return new JsonResult<>(OK,newUser);
    }


    //用户个人信息更新
    @PostMapping("/updateInfo")
    public JsonResult<User> userInfoUpdate(String phone,String email,Integer gender,HttpSession session){
        //从session中取出用户名和uid
        String username = getUsernameFromSession(session);
        Integer uid = getUserIdFromSession(session);

        //更新数据
        userService.userUpdateInfo(phone, email, gender, username, uid);

        User user = userService.queryUserByUid(uid);

        //将用户名、id、电话、邮箱、性别进行回传
        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setUid(user.getUid());
        newUser.setGender(user.getGender());
        newUser.setPhone(user.getPhone());
        newUser.setEmail(user.getEmail());
        newUser.setAvatar(user.getAvatar());

        return new JsonResult<>(OK,newUser);
    }

    //处理用户退出登录的请求
    @GetMapping("/exit")
    public JsonResult<Void> exitUserLoginStatus(HttpSession session){
        session.removeAttribute("username");
        session.removeAttribute("uid");
        return new JsonResult<>(OK);
    }
}
