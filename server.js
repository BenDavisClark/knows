const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3999;

// 用于提供静态文件
app.use(express.static('public'));

// 递归读取文件夹结构
function readDirRecursive(dir) {
  const items = fs.readdirSync(dir);
  return items.map(item => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);
    return {
      name: item,
      path: fullPath,
      isDirectory: stats.isDirectory(),
      children: stats.isDirectory() ? readDirRecursive(fullPath) : []
    };
  });
}

// API 接口：获取文件结构
app.get('/files', (req, res) => {
  const directoryPath = path.join(__dirname, 'public', 'files'); // 指向项目内的 files 文件夹
  const fileStructure = readDirRecursive(directoryPath);
  res.json(fileStructure);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
