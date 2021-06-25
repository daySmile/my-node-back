var express = require('express');
var router = express.Router();
const conn = require('../db/db')

const createToken = require('../middleware/createToken.js')
const checkToken = require('../middleware/checkToken.js')


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
    next()
});


// 登录
router.post('/login', function (req, res) {
    let name = req.body.body.username;
    let pwd = req.body.body.password;
    console.log(name)
    console.log(pwd)
    let sqlStr = 'SELECT * from users WHERE username = ? and password = ?';
    conn.query(sqlStr, [name, pwd], (err, result, field) => {
        if (err) {
            res.json({error_code: 1, message: '查询用户失败'});
        } else {
            result = JSON.parse(JSON.stringify(result));
            if (result[0]) {
                if (result[0].password === pwd) {
                    res.json({
                        code: 200,
                        success: true,
                        username: result.username,
                        // token 信息验证
                        token: createToken(name),
                        message: '登录成功  '
                    })
                    // 将 token 返回给客户端
                    // res.send({status: 200, msg: '登陆成功', token: token});

                } else {
                    res.send({code: 404,success: false, msg: '账号密码错误'});
                }
            } else {
                res.send({code: 404,success: false, msg: '用户不存在'});
            }
        }
    })
})


//除了登录操作外，其他的都需要验证token
router.use('*', checkToken)


router.get('/getUsers', function (req, res) {
    let sqlStr = 'select * from users;';
    conn.query(sqlStr, (err, result, field) => {
        result = JSON.parse(JSON.stringify(result));
        res.json({code: 200, data: result})
    })
})


router.get('/delUserById', function (req, res) {
    let id = req.query.id
    console.log(req.query)
    let sqlStr = 'delete from users where id = ?;';
    conn.query(sqlStr, [id], (err, result, field) => {
        res.json({code: 200, message: "删除成功"})
    })
})


router.post('/addUser', function (req, res) {
    let {name, age} = req.body
    console.log(req.body)
    let sqlStr = 'insert into users(name, age) values (?,?);';
    conn.query(sqlStr, [name, age], (err, result, field) => {
        res.json({code: 200, message: "添加成功"})
    })
})



module.exports = router;
