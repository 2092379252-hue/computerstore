# ComputerStore 本地运行文档

## 1. 项目说明

这是一个基于 `Spring Boot + MyBatis + Bootstrap 3 + jQuery + MySQL` 的课程作业项目，前后端不分离。

本次整理遵循“最小改动”原则，主要做了这些事情：

- 运行环境统一到 `JDK 17`
- 升级到 `Spring Boot 2.7.18`
- 升级 `mybatis-spring-boot-starter` 到 `2.3.2`
- 将 MySQL 驱动切换到 `com.mysql:mysql-connector-j`
- 将数据库、支付宝沙箱、文件上传目录改成可配置项
- 保留原有页面、接口路径和业务流程

## 2. 前置准备

建议环境：

- Windows
- conda
- MySQL 8.x

本项目推荐使用独立 conda 环境，不依赖系统全局的 JDK。

## 3. 创建 conda 环境

在终端执行：

```powershell
conda create -y -n computerstore-jdk17 openjdk=17 maven
conda activate computerstore-jdk17
java -version
mvn -version
```

预期结果：

- `java -version` 显示 `17`
- `mvn -version` 显示 Maven 正常可用，且 Java 版本为 `17`

如果 `conda activate` 无法生效，可以先执行：

```powershell
conda init powershell
```

然后重新打开终端。

## 4. 初始化 MySQL

启动 MySQL 服务
在 Windows 里打开“服务”，找到 MySQL84（你自己的版本） 并启动；或者命令行执行：
net start mysql84  (这个mysql84需要看你自己本地的启动方式是什么)
登录 MySQL
mysql -u root -p
创建数据库

### 4.1 创建数据库

先确保本地 MySQL 正常运行，然后创建数据库：

```sql
CREATE DATABASE computer_store DEFAULT CHARACTER SET utf8mb4;
```


### 4.2 导入数据

在项目根目录执行：（这个是在cmd里面运行）

```powershell
mysql -u root -p computer_store < database.sql
```

如果你的 MySQL 用户名不是 `root`，请替换成自己的账号。

## 5. 修改运行配置  （这个我给你们加好.gitignore了，密码改了不会上传）

需要你们自己创建一个文件位于：

- [application.yml](/D:/computerstore/src/main/resources/application.yml)
复制application_example.yml然后修改一下。

### 5.1 数据库配置

默认支持通过环境变量覆盖：

```powershell
$env:MYSQL_HOST="localhost"
$env:MYSQL_PORT="3306"
$env:MYSQL_DATABASE="computer_store"
$env:MYSQL_USERNAME="root"
$env:MYSQL_PASSWORD="你的MySQL密码"
```

如果不想使用环境变量，也可以直接修改 `application.yml` 中的默认值。

### 5.2 支付宝沙箱配置

请将下列配置替换成你们自己的沙箱应用参数：

```powershell
$env:ALIPAY_APP_ID="你的沙箱APPID"
$env:ALIPAY_APP_PRIVATE_KEY="你的应用私钥"
$env:ALIPAY_PUBLIC_KEY="支付宝公钥"
$env:ALIPAY_NOTIFY_URL="你自己的异步回调地址"
$env:ALIPAY_RETURN_URL="你自己的同步回调地址"
```

说明：

- 私钥、公钥建议写成单行字符串，不要保留换行
- 支付宝沙箱网关默认已经配置好，一般不用改
- 如果你在本地测试支付回调，需要准备内网穿透工具，例如 `natapp`

### 5.3 文件上传目录

头像上传默认目录已经改为：

```text
${user.dir}/uploads/computerstore/
```

也可以通过环境变量覆盖：

```powershell
$env:FILE_UPLOAD_DIR="D:/computerstore/uploads/computerstore/"
$env:FILE_ACCESS_BASE_URL="http://127.0.0.1:8080/file/down/"
```

## 6. 启动项目(这个貌似mvn的java版本和这个项目版本冲突，可以直接用下面的脚本)

先激活环境：

```powershell
conda activate computerstore-jdk17
```

然后在项目根目录执行：

```powershell
mvn clean package
java -jar target/computerstore-0.0.1-SNAPSHOT.jar
```

如果你只想本地开发，也可以直接运行：

```powershell
mvn spring-boot:run
```

启动成功后，默认访问地址：

- [http://127.0.0.1:8080/web/index.html](http://127.0.0.1:8080/web/index.html)

### 6.1 使用仓库自带脚本启动

如果你不想每次手动处理 `JAVA_HOME`，可以直接执行：

```powershell
.\run-local.ps1
```

常见用法：

```powershell
.\run-local.ps1
.\run-local.ps1 -PackageFirst
.\run-local.ps1 -BuildOnly
```

说明：

- 默认会自动定位 `computerstore-jdk17` 这个 conda 环境
- 会自动把 `JAVA_HOME` 切到该环境内的 JDK 17
- `-PackageFirst` 会先执行 `mvn clean package -DskipTests`，再启动
- `-BuildOnly` 只打包，不启动

## 7. 支付宝沙箱测试说明

支付页面接口路径保持不变：

- `/alipay/pay`
- `/alipay/notifyNotice`
- `/alipay/returnNotice`

要想完整跑通支付流程，需要满足：

- 使用你们自己的支付宝沙箱应用参数
- 同步回调和异步回调地址可被支付宝访问
- 本地测试通常需要内网穿透

如果只是演示非支付页面，不配置支付宝也可以先完成大部分功能展示。

## 8. 常见问题

### 8.1 `mvn` 找不到

请确认你已经激活 conda 环境：

```powershell
conda activate computerstore-jdk17
```

### 8.2 Java 版本不对

执行：

```powershell
mvn -version
```

如果输出的 Java 不是 `17`，说明当前没有使用新环境，请重新激活 conda 环境。

### 8.3 数据库连接失败

重点检查：

- MySQL 服务是否启动
- `computer_store` 数据库是否已创建
- 用户名和密码是否正确
- `3306` 端口是否正确

### 8.4 支付后回调失败

重点检查：

- `ALIPAY_NOTIFY_URL` 和 `ALIPAY_RETURN_URL` 是否可公网访问
- 公钥、私钥是否填错
- 私钥、公钥是否保留了多余换行或空格

### 8.5 上传头像后访问不到

重点检查：

- `FILE_UPLOAD_DIR` 目录是否存在写权限
- `FILE_ACCESS_BASE_URL` 是否和当前服务地址一致

## 9. 推荐的本地启动顺序

```powershell
conda activate computerstore-jdk17
$env:MYSQL_PASSWORD="你的MySQL密码"
$env:ALIPAY_APP_ID="你的沙箱APPID"
$env:ALIPAY_APP_PRIVATE_KEY="你的应用私钥"
$env:ALIPAY_PUBLIC_KEY="支付宝公钥"
$env:ALIPAY_NOTIFY_URL="你的异步回调地址"
$env:ALIPAY_RETURN_URL="你的同步回调地址"
mvn clean package
java -jar target/computerstore-0.0.1-SNAPSHOT.jar
```

如果只做普通页面和下单演示，不测支付，可以先不设置支付宝相关变量。
（我个人在我本地mysql注册的是testroot,123456;记录一下，怕忘了）
