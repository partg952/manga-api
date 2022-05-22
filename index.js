const express = require("express");
const app = express();
const cheerio = require("cheerio");
const requests = require("requests");


app.get("/",(req,res)=>{
  const data = [];
requests("https://ww5.manganelo.tv/home").on("data",page=>{
  const $ = cheerio.load(page);
  $("div.content-homepage-item").each(function(i){
    console.log($("div.content-item > a").eq(i).attr("title"))
    data.push({
      title:$(`body > div.body-site > div.container.container-main > div.container-main-left > div.panel-content-homepage > div.content-homepage-item > div > h3 > a`).eq(i).attr("title"),
      url:"https://ww5.manganelo.tv"+$(`body > div.body-site > div.container.container-main > div.container-main-left > div.panel-content-homepage > div.content-homepage-item > div > h3 > a`).eq(i).attr("href"),
      image:"https://ww5.manganelo.tv/mangaimage"+$(`body > div.body-site > div.container.container-main > div.container-main-left > div.panel-content-homepage > div.content-homepage-item > div > h3 > a`).eq(i).attr("href").substr(6)+".jpg"
    })
  })
  res.send(data);

})
})

app.listen(process.env.PORT || 8080,()=>console.log("listening..."))
