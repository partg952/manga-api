const express = require("express");
const app = express();
const cheerio = require("cheerio");
const requests = require("requests");
const main_url = "https://ww7.manganelo.tv/"

app.get("/",(req,res)=>{
	const data = [];
	requests(main_url+"home").on("data",page=>{
		const $ = cheerio.load(page);
		$("div.content-homepage-item").each(function(i){
			console.log($("div.content-item > a").eq(i).attr("title"))
			data.push({
				title:$(`div.container-main-left > div.panel-content-homepage > div.content-homepage-item > div > h3 > a`).eq(i).attr("title"),
				url:"https://ww7.manganelo.tv"+$(`div.container-main-left > div.panel-content-homepage > div.content-homepage-item > div > h3 > a`).eq(i).attr("href"),
				image:"https://ww7.manganelo.tv/mangaimage"+$(`div.container-main-left > div.panel-content-homepage > div.content-homepage-item > div > h3 > a`).eq(i).attr("href").substr(6)+".jpg"
			})
		})
		res.send(data);
		console.log(data)
	})
})

app.get('/search',(req,res)=>{
	const data = [];
	const keyword = req.query['q'];
	requests(main_url+'search/'+keyword).on('data',page=>{
		const $ = cheerio.load(page);
		$("div.panel-search-story > div.search-story-item").each(function(i){
			data.push({
				title:$("div.search-story-item > a.item-img").eq(i).attr("title"),
				image:"https://ww7.manganelo.tv/mangaimage"+$("div.search-story-item > a.item-img").eq(i).attr("href").substr(6)+".jpg",
				url:"https://ww7.manganelo.tv"+$("div.search-story-item > a.item-img").eq(i).attr("href")
			})
		})
		res.send(data);
	})
	
})

app.get("/info",(req,res)=>{
	let data = {};
	const chapters = [];
	const url = req.query['url'];
	requests(url).on("data",page=>{
		const $ = cheerio.load(page);
		$('div.panel-story-chapter-list > ul.row-content-chapter > li').each(function(i){
			chapters.push({
				title:$(this).children('a').attr('title'),
				url:"https://ww7.manganelo.tv"+$(this).children('a').attr('href')
			})
		})
		data = {
			chapters:chapters,
			title:$('div.story-info-right > h1').text(),
			summary:$('div.panel-story-info-description').text(),
			image:"https://ww7.manganelo.tv/mangaimage"+url.replace('https://ww7.manganelo.tv/manga','')+".jpg"
			
		}
	res.send(data);
	})
})

app.get('/read',(req,res)=>{
	const url = req.query['url'];
	const images = [];
	requests(url).on('data',page=>{
		const $ = cheerio.load(page);
		$('div.container-chapter-reader > img').each(function(i){
			images.push($('div.container-chapter-reader > img').eq(i).attr('data-src'))
			
		})
	res.send(images);
	})
})

app.listen(process.env.PORT || 8080,()=>console.log("listening..."))
