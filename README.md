# 本地调试
`npm run serve` 
或者 
`npm run dev`

# 打包命令
`npm run build`

npm run build 时会自动进行图片压缩
如果本地测试觉得时间长，可以在根目录下复制一份 .env 并重命名为.env.local，文件最后添加一句 noUglify=1，便会关闭图片压缩