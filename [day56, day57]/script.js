async function init() {
	model = await tf.loadModel("./tfjsmodel/model.json");
	console.log("model loaded from storage");
	computer.ai_plays = true;

	if (computer.ai_plays) {
		document.getElementById("playing").innerHTML = "Playing: AI";
	} else {
		document.getElementById("playing").innerHTML = "Playing: Computer";
	}

	animate(step);
}

var animate =
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};

var canvas = document.createElement("canvas");
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext("2d");

var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);
var ai = new AI();

var keysDown = {};

var render = function() {
	context.fillStyle = "#000000";
	context.fillRect(0, 0, width, height);
	player.render();
	computer.render();
	ball.render();
};

var update = function() {
	player.update(ball);

	if (computer.ai_plays) {
		move = ai.predict_move();
		computer.ai_update(move);
	} else {
		move = ai.predict_move();
		computer.ai_update(move);
	}

	ball.update(player.paddle, computer.paddle);

	ai.save_data(player.paddle, computer.paddle, ball);
};

var step = function() {
	update();
	render();
	animate(step);
};

function Paddle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.x_speed = 0;
	this.y_speed = 0;
}

Paddle.prototype.render = function() {
	context.fillStyle = "#59a6ff";
	context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function(x, y) {
	this.x += x;
	this.y += y;
	this.x_speed = x;
	this.y_speed = y;

	if (this.x < 0) {
		this.x = 0;
		this.x_speed = 0;
	} else if (this.x + this.width > 400) {
		this.x = 400 - this.width;
		this.x_speed = 0;
	}
};

function Computer() {
	this.paddle = new Paddle(0, 10, 50, 10);
	//this.ai_plays = false;
}

Computer.prototype.render = function() {
	this.paddle.render();
};

Computer.prototype.update = function(ball) {
	var x_pos = ball.x;
	var diff = -(this.paddle.x + this.paddle.width / 2 - x_pos);
	if (diff < 0 && diff < -4) {
		diff = -5;
	} else if (diff > 0 && diff > 4) {
		diff = 5;
	}

	this.paddle.move(diff, 0);

	if (this.paddle.x < 0) {
		this.paddle.x = 0;
	} else if (this.paddle.x + this.paddle.width > 400) {
		this.paddle.x = 400 - this.paddle.width;
	}
};

Computer.prototype.ai_update = function(move = 0) {
	this.paddle.move(4 * move, 0);
};

function Player() {
	this.paddle = new Paddle(0, 580, 50, 10);
}

Player.prototype.render = function() {
	this.paddle.render();
};

//Player.prototype.update = Computer.prototype.update;

Player.prototype.update = function() {
	for (var key in keysDown) {
		var value = Number(key);
		if (value == 37) {
			this.paddle.move(-4, 0);
		} else if (value == 39) {
			this.paddle.move(4, 0);
		} else {
			this.paddle.move(0, 0);
		}
	}
};

function Ball(x, y) {
	this.x = x;
	this.y = y;
	this.x_speed = Math.random() * 4 + 1;
	this.y_speed = Math.random() * 3 + 2;
	this.player_strikes = false;
	this.ai_strikes = false;
}

Ball.prototype.render = function() {
	context.beginPath();
	context.arc(this.x, this.y, 5, 2 * Math.PI, false);
	context.fillStyle = "#ddff59";
	context.fill();
};

Ball.prototype.update = function(paddle1, paddle2, new_turn) {
	this.x += this.x_speed;
	this.y += this.y_speed;
	var top_x = this.x - 5;
	var top_y = this.y - 5;
	var bottom_x = this.x + 5;
	var bottom_y = this.y + 5;

	if (this.x - 5 < 0) {
		this.x = 5;
		this.x_speed = -this.x_speed;
	} else if (this.x + 5 > 400) {
		this.x = 395;
		this.x_speed = -this.x_speed;
	}

	if (this.y < 0 || this.y > 600) {
		this.x_speed = Math.random() * 4 + 1;
		this.y_speed = Math.random() * 3 + 2;
		this.x = 200;
		this.y = 300;
		ai.new_turn();
	}

	this.player_strikes = false;
	this.ai_strikes = false;
	if (top_y > 300) {
		if (
			top_y < paddle1.y + paddle1.height &&
			bottom_y > paddle1.y &&
			top_x < paddle1.x + paddle1.width &&
			bottom_x > paddle1.x
		) {
			this.y_speed = -3;
			this.x_speed += paddle1.x_speed / 2;
			this.y += this.y_speed;
			this.player_strikes = true;
			console.log("player strikes");
		}
	} else {
		if (
			top_y < paddle2.y + paddle2.height &&
			bottom_y > paddle2.y &&
			top_x < paddle2.x + paddle2.width &&
			bottom_x > paddle2.x
		) {
			this.y_speed = 3;
			this.x_speed += paddle2.x_speed / 2;
			this.y += this.y_speed;
			this.ai_strikes = true;
			console.log("ai strikes");
		}
	}
};

function AI() {
	this.previous_data = null;
	this.training_data = [[], [], []];
	this.training_batch_data = [[], [], []];
	this.previous_xs = null;
	this.turn = 0;
	this.grab_data = true;
	this.flip_table = true;
	this.keep_trainig_records = true;
	this.training_records_to_keep = 100000;
	this.first_strike = true;
}

AI.prototype.save_data = function(player, computer, ball) {
	if (!this.grab_data) return;

	if (this.previous_data == null) {
		this.previous_data = [player.x, computer.x, ball.x, ball.y];
		return;
	}

	if (ball.ai_strikes) {
		this.training_batch_data = [[], [], []];
		console.log("emtying batch");
	}

	data_xs = [player.x, computer.x, ball.x - 60, ball.y];
	index =
		player.x < this.previous_data[0]
			? 0
			: player.x == this.previous_data[0]
				? 1
				: 2;

	this.previous_xs = [...this.previous_data, ...data_xs];

	this.training_batch_data[index].push([
		this.previous_xs[0],
		this.previous_xs[2],
		this.previous_xs[3],
		this.previous_xs[4],
		this.previous_xs[6],
		this.previous_xs[7]
	]);

	this.previous_data = data_xs;

	if (ball.player_strikes) {
		if (this.first_strike) {
			this.first_strike = false;
			this.training_batch_data = [[], [], []];
			console.log("emtying batch");
		} else {
			for (i = 0; i < 3; i++)
				this.training_data[i].push(...this.training_batch_data[i]);
			this.training_batch_data = [[], [], []];
			console.log("adding batch");
		}
	}
};

AI.prototype.new_turn = function() {
	this.first_strike = true;
	this.training_batch_data = [[], [], []];
	this.previous_data = null;
	this.turn++;
	console.log("new turn: " + this.turn);

	//computer.ai_plays = !computer.ai_plays;
	if (computer.ai_plays) {
		document.getElementById("playing").innerHTML = "Playing: AI";
	} else {
		document.getElementById("playing").innerHTML = "Playing: Computer";
	}

	/*if(this.turn > 9){

        
        this.train();

        
        //computer.ai_plays = true;

        
        this.reset();
    }*/
};

AI.prototype.reset = function() {
	this.previous_data = null;
	if (!this.keep_trainig_records) this.training_data = [[], [], []];
	this.turn = 0;

	if (computer.ai_plays) {
		document.getElementById("playing").innerHTML = "Playing: AI";
	} else {
		document.getElementById("playing").innerHTML = "Playing: Computer";
	}

	console.log("reset");
	console.log("emtying batch");
};

AI.prototype.train = function() {
	console.log("balancing");
	document.getElementById("playing").innerHTML = "Training";

	if (this.keep_trainig_records) {
		for (i = 0; i < 3; i++) {
			if (this.training_data[i].length > this.training_records_to_keep)
				this.training_data[i] = this.training_data[i].slice(
					Math.max(
						0,
						this.training_data[i].length - this.training_records_to_keep
					),
					this.training_data[i].length
				);
		}
	}
	len = Math.min(
		this.training_data[0].length,
		this.training_data[1].length,
		this.training_data[2].length
	);
	console.log(this.training_data);
	if (!len) {
		console.log("no data to train on");
		return;
	}

	data_xs = [];
	data_ys = [];

	for (i = 0; i < 3; i++) {
		data_xs.push(
			...this.training_data[i]
				.slice(0, len)
				.sort(() => Math.random() - 0.5)
				.sort(() => Math.random() - 0.5)
		);
		data_ys.push(
			...Array(len).fill([i == 0 ? 1 : 0, i == 1 ? 1 : 0, i == 2 ? 1 : 0])
		);
	}
	//console.log(data_xs);
	//console.log(data_ys);
	document.createElement("playing").innerHTML =
		"Training: " + data_xs.length + " records";

	console.log("training-1");

	const xs = tf.tensor(data_xs);
	const ys = tf.tensor(data_ys);

	(async function() {
		console.log("training-2");

		let result = await model.fit(xs, ys, {
			batchSize: 32,
			epochs: 1,
			shuffle: true,
			validationSplit: 0.1,
			callbacks: {
				onBatchEnd: async (batch, logs) => {
					console.log(
						"Step " +
							batch +
							", loss: " +
							logs.loss.toFixed(5) +
							", acc: " +
							logs.acc.toFixed(5)
					);
				}
			}
		});

		await model.save("indexeddb://my-model-1");

		console.log(
			"Model: loss: " +
				result.history.loss[0].toFixed(5) +
				", acc: " +
				result.history.acc[0].toFixed(5)
		);
		console.log(
			"Validation: loss: " +
				result.history.val_loss[0].toFixed(5) +
				", acc: " +
				result.history.val_acc[0].toFixed(5)
		);
	})();

	console.log("trained");
};

AI.prototype.predict_move = function() {
	if (this.previous_xs != null) {
		data_xs = [
			width - this.previous_xs[1],
			width - this.previous_xs[2],
			height - this.previous_xs[3],
			width - this.previous_xs[5],
			width - this.previous_xs[6],
			height - this.previous_xs[7]
		];

		prediction = model.predict(tf.tensor([data_xs]));

		//return -(tf.argMax(prediction, 1).dataSync()-1);
		return -(tf.argMax(prediction, 1).dataSync() - 1);
	}
};

document.body.appendChild(canvas);

init();

window.addEventListener("keydown", function(event) {
	keysDown[event.keyCode] = true;
});
window.addEventListener("keyup", function(event) {
	delete keysDown[event.keyCode];
});
