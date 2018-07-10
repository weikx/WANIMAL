const superagent = require('superagent');
const http = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
let allPage = 199; // 博客页数
let baseUrl = 'http://wanimal1983.org/page/'
let allData = [];
getImg(1)
let number = 1;
function getImg(i) {
	if (i >= allPage) {
        fs.writeFile('./allData.json',allData, function(){ // 保存所有图片地址
            console.log("完成!")
        })
		return 'over'
	}
	i++;
	superagent
		.get(baseUrl+i)
		.end((err, res) => {
			if (err) {
				return err;
			}
			let $ = cheerio.load(res.text);
			$('img').each((index, domele) => {
				let src = domele.attribs.src
				if (src != 'http://static.tumblr.com/8jq17g7/Re3lqefyw/install.png') { // Tumblr logo
					console.log('正在爬取第---'+number+'---张');
                    downloadImg(src, number);
                    allData.push(src);
                    number++;
                }
			})
			getImg(i)
		})
}

function downloadImg(url,index) {
    var req = http.get(url, function (res) {
        var imgData = "";
        res.setEncoding("binary");
        res.on("data", function (chunk) {
            imgData += chunk;
        });
        res.on("end", function () {
            fs.writeFile("./img/weikexin"+index+".jpg", imgData, "binary", function (err) {
                if (err) {
                    console.log("保存失败"+err);
                }
                console.log("weikexin"+index+".jpg保存成功");
            });
        });
        res.on("error", function (err) {
            console.log("请求失败");
        });
    });
    req.on('error', function (err) {
        console.log("请求失败" + err.message);
    });
}