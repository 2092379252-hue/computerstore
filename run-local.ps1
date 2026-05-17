param(
    [string]$CondaEnvName = "computerstore-jdk17",
    [switch]$PackageFirst,
    [switch]$BuildOnly
)

$ErrorActionPreference = "Stop"

function Get-CondaEnvPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$EnvName
    )

    $condaInfo = conda env list --json | ConvertFrom-Json
    foreach ($envPath in $condaInfo.envs) {
        if ((Split-Path $envPath -Leaf) -eq $EnvName) {
            return $envPath
        }
    }

    throw "找不到 conda 环境 '$EnvName'。请先执行: conda create -y -n $EnvName openjdk=17 maven"
}

function Invoke-Step {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Command
    )

    Write-Host ">>> $Command" -ForegroundColor Cyan
    Invoke-Expression $Command
    if ($LASTEXITCODE -ne 0) {
        throw "命令执行失败: $Command"
    }
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

$condaEnvPath = Get-CondaEnvPath -EnvName $CondaEnvName
$javaHome = Join-Path $condaEnvPath "Library"
$javaBin = Join-Path $javaHome "bin"

$env:JAVA_HOME = $javaHome
if (-not ($env:Path -split ';' | Where-Object { $_ -eq $javaBin })) {
    $env:Path = "$javaBin;$env:Path"
}

Write-Host "项目目录: $projectRoot" -ForegroundColor Green
Write-Host "Conda 环境: $CondaEnvName" -ForegroundColor Green
Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Green

Invoke-Step "java -version"
Invoke-Step "mvn -version"

if ($PackageFirst -or $BuildOnly) {
    Invoke-Step "mvn clean package -DskipTests"
}

if (-not $BuildOnly) {
    Invoke-Step "mvn spring-boot:run"
}
