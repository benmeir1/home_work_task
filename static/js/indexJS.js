

var artist_dict = {};

function get_albums() {
   return axios.get('/api/get_albums')
  .then(function (response) {
      const albums = response.data;
	localStorage.setItem("albums", JSON.stringify(albums));
      return albums;
  });
}


var artistList = [];
var game = {round: 0, 
			score: 0,
			striks: 0, 
			pointsForAnswer: 0, 
			selected_artist: '', 
			albumNumber: 0,
			firstAlbum: '',
			secenodAlbum: '',
			thirdAlbum: '',
			unvissibleClass: 'not_show'};



function get_random_index_from_list(list_size){
    var randomNumber = Math.floor(Math.random() * list_size);
    return randomNumber
}


function getAlbums(){
	var num1 = get_random_index_from_list(game.selected_artist.length);
	var num2 = num1;
	var num3 = num1;
	while (num1 == num2){
		var num2 = get_random_index_from_list(game.selected_artist.length);
	}
	while (num3 == num2 || num3 == num1){
		var num3 = get_random_index_from_list(game.selected_artist.length);
	}
	game.firstAlbum = artist_dict[game.selected_artist][num1];
	game.secenodAlbum = artist_dict[game.selected_artist][num2];	
	game.thirdAlbum = artist_dict[game.selected_artist][num3];
}



function makeArtistIndex(){
	for (var artist in artist_dict){
		artistList.push(artist);

	}
	return artistList
}



function show_album(album_name, album_number){
	var divId = 'album' + album_number;
	var h1Id = 'head_album' + album_number;
	var div = document.getElementById(divId);
	var h1 = document.getElementById(h1Id);
	h1.innerText = album_name;
	div.classList.remove(game.unvissibleClass);
	h1.classList.remove(game.unvissibleClass);
}

function hide_albums(){
	for (var i = 0; i<3; i++){
		var divId = 'album' + i;
		var h1Id = 'head_album' + i;
		var div = document.getElementById(divId);
		var h1 = document.getElementById(h1Id);
		div.classList.add(game.unvissibleClass);
		h1.classList.add(game.unvissibleClass);
	}
}



function get_hint(){
	var hintBtn = document.getElementById('hint_btn');
	hint_btn.addEventListener("click", function(){
		game.album_number += 1;
		if (game.album_number == 1){
			show_album(game.secenodAlbum, game.album_number);
		}
		else if (game.album_number > 1){
			show_album(game.thirdAlbum, game.album_number);
		}
		if (game.pointsForAnswer > 5){
			game.pointsForAnswer -= 5;
		}
		changePointsForAnswer();
	});
}


function check_answer(){
	var input = document.getElementById("user_answer");
	var submit = document.getElementById("submitBTN");
	var hintBtn = document.getElementById('hint_btn');
	var computerOutput = document.getElementById("computerOutput");
	submit.addEventListener("click", function(){
		var answer = input.value;
		console.log(answer);
		if (answer===game.selected_artist){
			game.score += game.pointsForAnswer;
			computerOutput.innerText = 'You Are Correct!'
			submit.classList.add('not_show');
			hintBtn.classList.add('not_show');
			changeScore();

		}
		else{
			game.striks +=1;
			if (game.striks < 3){
				game.album_number +=1;
				if (game.pointsForAnswer > 5){
					game.pointsForAnswer -= 5;
				}
				computerOutput.innerText = 'Wrong Answer :('
				if (game.album_number == 1){
					show_album(game.secenodAlbum, game.album_number);
				}
				else if (game.album_number > 1){
					show_album(game.thirdAlbum, game.album_number);
				}
				changePointsForAnswer();
			}
			else{
				treeStriks();
			}
		}

		changeInput();
	});

}


function treeStriks(){
	var submit = document.getElementById("submitBTN");
	var hintBtn = document.getElementById('hint_btn');
	var computerOutput = document.getElementById("computerOutput"); 
	submit.classList.add('not_show');
	hintBtn.classList.add('not_show');
	computerOutput.innerText = 'Round Over'

}


function nextRound(){
	var nextRound = document.getElementById("nextRoundBTN");
	nextRound.addEventListener("click", function(){
		game.round +=1;
		if (game.round === 6){
			gameOver();
		}
		else{
		hide_albums();
		init_round();
		}
	});
}



function changeScore(){
	var score = document.getElementById('score');
	score.innerText = 'Your Score: '+ game.score;
}

function changeRound(){
	var round = document.getElementById('round');
	if (game.round === 5){
		round.innerText = 'Round: '+ game.round + ' - Last Round';
	}
	else{
	round.innerText = 'Round: '+ game.round;
	}
}

function changeInput(){
	var input = document.getElementById("user_answer");
	input.value = '';
}

function changePointsForAnswer(){
	var points = document.getElementById('answerPoints');
	points.innerText = 'For '+ game.pointsForAnswer + ' points';
}


function init_round(){
	var randomNum = get_random_index_from_list(artistList.length);
	game.pointsForAnswer = 15;
	game.album_number = 0;
	game.selected_artist = artistList[randomNum];
	game.striks = 0;
	getAlbums();
	var computerOutput = document.getElementById("computerOutput"); 
	computerOutput.innerText = '';
	changeRound();
	changeScore();
	changePointsForAnswer();
	console.log("this is the selected artist" + game.selected_artist);
	var submit = document.getElementById("submitBTN");
	var hintBtn = document.getElementById('hint_btn'); 
	submit.classList.remove('not_show');
	hintBtn.classList.remove('not_show');
	show_album(game.firstAlbum, game.album_number);
}

function gameOver(){
	var round = document.getElementById('round');
	var points = document.getElementById('answerPoints');
	var userForm = document.getElementById("userForm");
	var albums_div = document.getElementById("albums_div");
	hide_albums();
	userForm.classList.add("not_show");
	points.classList.add("not_show");
	round.classList.add("not_show");
	albums_div.classList.add("not_show");


}

function init_the_game(){
	game.score = 0;
	game.round = 1;
	game.pointsForAnswer = 15;
	game.album_number = 0;
	var artistList = makeArtistIndex();
	nextRound();
	check_answer();
	get_hint();
	init_round();
}


get_albums();
if (confirm("are you want to start the game?")) {
	var string_albums = localStorage.getItem('albums');
	artist_dict = JSON.parse(string_albums);
	var gamebox = document.getElementById('gaemBox');
	gamebox.classList.remove('not_show');
	init_the_game();
}
