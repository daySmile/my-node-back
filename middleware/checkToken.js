// 监测 token 是否过期
const jwt = require('jsonwebtoken')
module.exports = function (req, res, next) {
    console.log('token验证：', req.headers.token)

    if(req.headers.token !== null) {
        let token = req.headers.token
        // 解构 token，生成一个对象 { name: xx, iat: xx, exp: xx }
        let decoded = jwt.decode(token, 'secret')
        // console.log(decoded.exp)
        // console.log(Date.now() / 1000)
        // 监测 token 是否过期
        if (token && decoded.exp <= Date.now() / 10000) {
            return res.json({
                code: 2,
                message: 'token过期，请重新登录'
            })
        }
        next();
    } else {
        return res.json({
            code: 504,
            message: '请先登录'
        })
    }
}
