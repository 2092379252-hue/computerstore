<#
.SYNOPSIS
本地启动 SpringBoot 项目脚本（纯净修复版）
#>

param(
    [string]$CondaEnvName = "computerstore-jdk17",
    [switch]$PackageFirst,
    [switch]$BuildOnly
)

$ErrorActionPreference = "Stop"

function Invoke-Step {
    param([string]$Command)
    Write-Host "`n==> 执行: $Command" -ForegroundColor Cyan
    Invoke-Expression $Command
    if ($LASTEXITCODE -ne 0) {
        throw "命令执行失败: $Command"
    }
}

try {
    # 1. 检查 conda 是否可用
    Invoke-Step "conda --version"

    # 2. 检查环境是否存在，不存在则创建
    $envExists = conda env list | Select-String $CondaEnvName
    if (-not $envExists) {
        Write-Host "`n==> 创建 Conda 环境: $CondaEnvName" -ForegroundColor Green
        Invoke-Step "conda create -y -n $CondaEnvName openjdk=17 maven"
    }

    # 3. 激活环境
    Write-Host "`n==> 激活环境: $CondaEnvName" -ForegroundColor Green
    Invoke-Step "conda activate $CondaEnvName"

    # 4. 验证 Java 和 Maven
    Invoke-Step "java -version"
    Invoke-Step "mvn -version"

    # 5. 打包（如果需要）
    if ($PackageFirst -or $BuildOnly) {
        Write-Host "`n==> 开始打包" -ForegroundColor Green
        Invoke-Step "mvn clean package -DskipTests"
    }

    # 6. 启动项目
    if (-not $BuildOnly) {
        Write-Host "`n==> 启动 SpringBoot 项目" -ForegroundColor Green
        Invoke-Step "mvn spring-boot:run"
    }

    Write-Host "`n✅ 执行完成" -ForegroundColor Green
}
catch {
    Write-Host "`n❌ 错误: $_" -ForegroundColor Red
    exit 1
}