@echo off
set PROJECT_ID=%1

:: inject sentry設定
powershell sentry-cli sourcemaps inject --org jumbo-s1 --project igaming-100004 ./build/%PROJECT_ID%/assets/main
powershell sentry-cli sourcemaps inject --org jumbo-s1 --project igaming-100004 ./build/%PROJECT_ID%/cocos-js

:: 上傳source-map
powershell sentry-cli sourcemaps upload --org jumbo-s1 --project igaming-100004 ./build/%PROJECT_ID%/assets/main
powershell sentry-cli sourcemaps upload --org jumbo-s1 --project igaming-100004 ./build/%PROJECT_ID%/cocos-js

:: 移除source-map
set folderPath=./build/%PROJECT_ID%
if exist "%folderPath%" (
    echo Deleting .map files in %folderPath% and its subfolders...
    for /r "%folderPath%" %%i in (*.map) do (
        del "%%i"
        echo Deleted: %%i
    )
    echo Deletion complete.
) else (
    echo Folder not found: %folderPath%
)