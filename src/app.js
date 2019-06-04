// 第 1 步：创建一个 Vue 实例
const Vue = require('vue');
const server = require('express')();
const vueServerRender = require('vue-server-renderer');
const fs = require('fs');
const path = require('path');
const template = fs.readFileSync(path.join(__dirname,'layout','index.template.html'),'utf-8');

// 设置默认模板
const renderer = vueServerRender.createRenderer({
    template
});

// renderer.renderToString(app).then(html => {
//   console.log(html)
// }).catch(err => {
//   console.error(err)
// })
const createVueApp = (context,template)=>{
    return new Vue({
        data: context,
        template
    });
}

server.get('*', async (req, res) => {
    try {
    // vue实例
    const tpl = `<div>访问的 URL 是： {{ url }}</div>`;
    const data = {
        url: req.url
    };
    const app = createVueApp(data,tpl);

    // 页面参数
    const context = {
        title: '哈哈',
        meta: `
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
        `
    };
    //创建html
    const html = await renderer.renderToString(app,context);
    
    // response
    res.end(html);
    } catch (error) {
        console.log(error);
        res.status(500).end('Internal Server Error');
        return;
    }
});  

server.listen(8080,()=>{
    console.log('listening 8080');
});