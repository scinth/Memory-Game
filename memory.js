var selected1 = '',
	selected2 = '';
var pairs, square, total_pictures, image_size;
var images = [
	'leopard',
	'bird',
	'lion',
	'mantisshrimp',
	'octopus',
	'owl',
	'wolf',
	'seal',
	'shark',
	'swan',
	'turtle',
	'urangutan',
	'raindeer',
	'zebra',
	'2leopards',
	'flamingoes',
	'monkey',
	'peacock',
	'polarbear',
	'polarwolf',
];
var shuffle = [];
var screenWidth, screenHeight;
var boardWidth, boardHeight;
var timer,
	timeSec,
	timeset = new Date();
var PAIR_TIME = 3;

document.addEventListener(
	'DOMContentLoaded',
	function () {
		let level = document.user_settings.pairs;
		level.addEventListener(
			'input',
			function () {
				getTimeSeconds();
			},
			false
		);

		let cont = document.getElementById('main-container');
		cont.addEventListener(
			'click',
			function (e) {
				if (e.target === this) return;
				let picture = e.target;
				if (picture === selected1 || picture === selected2) return;
				if (selected1 !== '' && selected2 !== '') {
					flip_close(selected1);
					flip_close(selected2);
					selected1 = '';
					selected2 = '';
				}
				if (selected1 === '') selected1 = picture;
				else if (selected2 === '') selected2 = picture;

				if (picture.classList.contains('open')) {
					flip_close(picture);
				} else if (picture.classList.contains('close')) {
					flip_open(picture);
				}

				if (selected2 !== '') {
					if (selected1.dataset.filename === selected2.dataset.filename) {
						selected1.style.pointerEvents = 'none';
						selected1.style.opacity = '0.5';
						selected2.style.pointerEvents = 'none';
						selected2.style.opacity = '0.5';
						selected1 = '';
						selected2 = '';
						pairs--;
					}
				}

				if (pairs === 0) {
					gameOver('win');
				}
			},
			false
		);

		getScreenSize();

		getTimeSeconds();
	},
	false
);

window.onresize = function () {
	getScreenSize();
	setDimension();
	saveSettings();
};

function flip_open(picture) {
	picture.classList.remove('close');
	picture.classList.add('open');
	picture.style.backgroundImage = 'url(' + picture.dataset.filename + ')';
}

function flip_close(picture) {
	picture.classList.remove('open');
	picture.classList.add('close');
	picture.style.backgroundImage = 'url("Images/hidden_image.jpg")';
}

function getRandomNum(max) {
	return Math.floor(Math.random() * max);
}

function shuffleImages() {
	// get images twice for pairing
	for (var i = 0; i < pairs; i++) {
		shuffle.push(images[i]);
		shuffle.push(images[i]);
	}

	// shuffle images
	let number_of_shuffle = getRandomNum(20) + 31;
	let image1, image2, temp;
	for (var i = 0; i < number_of_shuffle; i++) {
		image1 = getRandomNum(shuffle.length);
		do {
			image2 = getRandomNum(shuffle.length);
		} while (image2 === image1);

		temp = shuffle[image1];
		shuffle[image1] = shuffle[image2];
		shuffle[image2] = temp;
	}
}

function renderImages() {
	let c,
		len = shuffle.length,
		html = '';
	for (c = 0; c < len; c++) {
		html += `<div class="picture_container close" data-filename="Images/${shuffle[c]}.jpg"></div>`;
	}

	document.getElementById('main-container').innerHTML = html;
}

function setDimension() {
	pairs = Number(document.user_settings.pairs.value);
	total_pictures = pairs * 2;
	getBoardSize(total_pictures);
	square = getMinSquare();
	getImageSize();
}

function getScreenSize() {
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;
}

function saveSettings() {
	document.documentElement.style.setProperty('--image-size', image_size + 'px');
	document.documentElement.style.setProperty('--square-length', square);
}

function startGame() {
	setDimension();
	saveSettings();
	shuffleImages();
	renderImages();
	document.getElementById('menu').style.display = 'none';
	//setTimer();
	timer = setInterval(updateTime, 1000);
}

function playAgain() {
	document.querySelector('#menu .playagain').classList.remove('pop');
	document.querySelector('#menu form').style.display = 'block';
	document.querySelector('#menu .startgame').style.display = 'block';
	getTimeSeconds();
	document.querySelector('#menu h1').textContent = 'Memory Game';
	document.querySelector('#menu h1').style.color = '#2be71a';
}

function getBoardSize(size) {
	let min_square = Math.floor(Math.sqrt(size));

	boardWidth = min_square;
	boardHeight = size / min_square;
}

function getMinSquare() {
	return screenHeight < screenWidth ? boardHeight : boardWidth;
}

function getImageSize() {
	let screenSize = screenWidth < screenHeight ? screenWidth : screenHeight;
	let clientSize = Math.floor(screenSize * 0.5);
	let max_size = Math.floor(clientSize / boardWidth);
	if (
		max_size * boardWidth >= screenWidth ||
		max_size * boardHeight >= screenHeight
	) {
		image_size = Math.floor(screenSize / boardHeight);
		return;
	}
	image_size = Math.floor(max_size);
}

function gameOver(result) {
	clearInterval(timer);
	if (result === 'win') {
		document.querySelector('#menu h1').innerHTML = 'You did it!<br>Good job!';
		document.querySelector('#menu h1').style.color = '#2be71a';
	} else {
		document.querySelector('#menu h1').innerHTML = 'Oops..Time is up..';
		document.querySelector('#menu h1').style.color = '#ee0000';
	}
	document.querySelector('#menu .playagain').classList.add('pop');
	document.querySelector('#menu form').style.display = 'none';
	document.querySelector('#menu .startgame').style.display = 'none';
	document.getElementById('menu').style.display = 'flex';
	shuffle = [];
}

function updateTime() {
	timeset.setSeconds(timeset.getSeconds() - 1);
	let timestring = timeset.toLocaleTimeString();
	timestring = timestring.slice(3, timestring.indexOf(' '));
	document.querySelector('.time').innerHTML = timestring;
	if (timeset.getSeconds() === timeset.getMilliseconds()) {
		gameOver('lose');
	}
}

function getTimeSeconds() {
	timeSec = Number(document.user_settings.pairs.value) * PAIR_TIME;
	timeset.setHours(0, 0, timeSec, 0);
	let timestring = timeset.toLocaleTimeString();
	timestring = timestring.slice(3, timestring.indexOf(' '));
	document.querySelector('.time').innerHTML = timestring;
}
