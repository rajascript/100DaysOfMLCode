$(document).ready(function() {
	$(".support__carousal").slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
		infinite: true
	});
});
var currDay = 0;

let mainTweet = document.getElementById("tweetsComponent__text");
let tweetDate = document.getElementById("tweetsComponent__date");
let logDate = document.getElementById("logs__counter--text");
let instaStory = document.getElementById("logs__social__insta--story");
let logsCode = document.getElementById("logs__code");

//pathway
let pyImage = document.getElementById("pyImage");
let pyImageFull = document.getElementById("pyImageFull");

let mathsImage = document.getElementById("mathsImage");
let mathsImageFull = document.getElementById("mathsImageFull");

let dataImage = document.getElementById("dataImage");
let dataImageFull = document.getElementById("dataImageFull");

let mlImage = document.getElementById("mlImage");
let mlImageFull = document.getElementById("mlImageFull");

let dlImage = document.getElementById("dlImage");
let dlImageFull = document.getElementById("dlImageFull");

let kaggleImage = document.getElementById("kaggleImage");
let kaggleImageFull = document.getElementById("kaggleImageFull");
//pathway

var changeDay = function() {
	mainTweet.innerText = myTweets[99 - currDay].tweet;
	tweetDate.innerText = myTweets[99 - currDay].createdDate;
	logDate.innerText = `Day ${currDay}`;
	instaStory.src = `images/insta/d${currDay}.jpg`;
	logsCode.innerHTML = myCode[currDay].data;
};
var nextDay = function() {
	if (currDay < 101) {
		currDay++;
		changeDay();
	}
};

var prevDay = function() {
	if (currDay > 0) {
		currDay--;
		changeDay();
	}
};
let clearOthers = function(step) {
	let arr = ["py", "maths", "data", "ml", "dl", "kaggle"];
	arr.filter(el => el !== step).forEach(element => {
		let elU = document.getElementById(element + "U");
		let elL = document.getElementById(element + "L");
		if (!elU.classList.contains("util__hidden")) {
			elU.classList.add("util__hidden");
			elL.classList.add("util__hidden");
		}
	});
};
let clickEvent = function(elem, parent, step) {
	console.log("clicked");
	if (elem !== "al") {
		let linedElem = document.getElementById(elem);
		let fullElem = document.getElementById(elem + "Full");
		parent.classList.remove("pathway__mainNode");
		parent.classList.add("pathway__mainNode__done");
		linedElem.classList.add("util__hidden");
		fullElem.classList.remove("util__hidden");
	}
	let upperElem = document.getElementById(step + "U");
	let lowerElem = document.getElementById(step + "L");
	clearOthers(step);
	upperElem.classList.remove("util__hidden");
	lowerElem.classList.remove("util__hidden");
	console.log(parent.childNodes);
};
