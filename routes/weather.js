const express = require('express');
const request = require('superagent');
const utils = require('../utils/utils');
const router = express.Router();
const base = 'http://jisutqybmf.market.alicloudapi.com/weather/query';
const APPCODE = '5db8c4dbb31b424ab673cec87fb6770e';

router.get('/*', function(req, res, next) {
    getWeather(req, res, next);
});
router.post('/*', function(req, res, next) {
    getWeather(req, res, next);
});

let getWeather = (req, res, next) => {
    let params = utils.convert(req,res,next,base);
    let config = params[0];
    let protocol = params[1];
    let host = params[2];
    let cb = params[3];
    let _params = params[4];
    let output = {
        data: {},
        status: {
            code: -1,
            message: '请确定你的请求方式像这样：/weather?city=番禺'
        }
    };
    if(_params['city']){
        config['headers'] =  {
            "Host":"jisutqybmf.market.alicloudapi.com",
            "X-Ca-Timestamp":Date.now(),
            "gateway_channel":"http",
            "X-Ca-Request-Mode":"debug",
            "X-Ca-Key":"24605515",
            "X-Ca-Stage":"RELEASE",
            "Content-Type":"application/json; charset=utf-8",
            "Authorization":`APPCODE ${APPCODE}`
        }
        //config['gzip'] = '';
        utils.createServer(config).then(ret => {
            cb && res.jsonp(ret) || res.send(ret);
        }).catch(ex => {
            output = {
                status: {
                    code: -2,
                    message: Object.keys(ex).length>0 ? ex : 'unknow error, please checked your city name' 
                }
            }
            console.log(`cb:${cb}`)
            cb && res.jsonp(output) || res.json(output);
        });
    }else{
        cb && res.jsonp(output) || res.json(output);
    }
}

module.exports = router;