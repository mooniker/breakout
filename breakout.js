var breakout = {

    // config
    canvasId: 'breakout',

    // set on init
    canvas: undefined,
    ctx: undefined,

    ball: {
        x: undefined, // set on init
        y: undefined, // set on init
        dx: 2,
        dy: -2,
        radius: 10,
        color: 'black'
    },

    paddle: {
        height: 10,
        width: 75,
        x: undefined, // set on init
        color: '#0095dd',
    },

    keysPressed: {},

    // key shortcuts
    isKeyPressed: function(key) {
        switch (key) {
            case 'right':
                return this.keysPressed[39];
            case 'left':
                return this.keysPressed[37];
        }

    },

    brick: {
        rowCount: 3,
        columnCount: 5,
        width: 75,
        height: 20,
        padding: 10,
        offset: {
            top: 30,
            left: 30
        },
        color: 'red', // '#0095dd'
    },

    bricks: [],

    score: 0,
    lives: 3,
    text: {
        color: 'gray',
        font: '16px Arial',
    },

    init: function() {
        this.canvas = document.getElementById(this.canvasId);
        if (!this.canvas) console.log('Error: canvas not found.');
        this.ctx = this.canvas.getContext('2d');
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - 30;
        this.paddle.x = (this.canvas.width / 2 - this.paddle.width) / 2;

        for (var c = 0; c < this.brick.columnCount; c++) {
            this.bricks[c] = [];
            for (var r = 0; r < this.brick.rowCount; r++) {
                this.bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        var game = this;
        document.addEventListener('keydown', this.keyDownHandler.bind(game), false);
        document.addEventListener('keyup', this.keyUpHandler.bind(game), false);
        document.addEventListener('mousemove', this.mouseMoveHandler.bind(game), false);

        // document.addEventListener('gamepadconnected', function(e) {
        //     console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
        //     e.gamepad.index, e.gamepad.id,
        //     e.gamepad.buttons.length, e.gamepad.axes.length);
        // });

        // setInterval(draw, 10);
        this.draw();

    },

    keyDownHandler: function(e) {
        // if (e.keyCode === 39) {
        //     this.rightPressed = true;
        //     // console.log('right pressed');
        // } else if (e.keyCode === 37) {
        //     this.leftPressed = true;
        //     // console.log('left pressed');
        // }
        this.keysPressed[e.keyCode] = true;
    },

    keyUpHandler: function(e) {
        // if (e.keyCode === 39) {
        //     this.rightPressed = false;
        //     // console.log('right unpressed');
        // } else if (e.keyCode === 37) {
        //     this.leftPressed = false;
        //     // console.log('lefft unpressed');
        // }
        this.keysPressed[e.keyCode] = false;
    },


    mouseMoveHandler: function(e) {
        var relativeX = e.clientX - this.canvas.offsetLeft;
        if (relativeX > 0 && relativeX < this.canvas.width) {
            this.paddle.x = relativeX - this.paddle.width / 2;
        }
    },

    collisionDetection: function() {
        for (var c = 0; c < this.brick.columnCount; c++) {
            for (var r = 0; r < this.brick.rowCount; r++) {
                var b = this.bricks[c][r];
                if (b.status === 1) {
                    if (this.ball.x > b.x && this.ball.x < b.x + this.brick.width && this.ball.y > b.y && this.ball.y < b.y + this.brick.height) {
                        this.ball.dy = -this.ball.dy;
                        b.status = 0;
                        this.score++;
                        if (this.score === this.brick.rowCount * this.brick.columnCount) {
                            alert('you win, congrats');
                            document.location.reload();
                        }
                    }
                }
            }
        }
    },

    drawScore: function() {
        this.ctx.font = this.text.font || '16px Arial';
        this.ctx.fillStyle = this.text.color || '#0095dd';
        this.ctx.fillText('Score: ' + this.score, 8, 20);
    },

    drawLives: function() {
        this.ctx.font = this.text.font || '16px Arial';
        this.ctx.fillStyle = this.text.color || '#0095dd';
        this.ctx.fillText('Lives: ' + this.lives, this.canvas.width - 65, 20);
    },

    drawBall: function() {
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.ball.color || 'black';
        this.ctx.fill();
        this.ctx.closePath();
    },

    drawPaddle: function() {
        this.ctx.beginPath();
        this.ctx.rect(this.paddle.x, this.canvas.height - this.paddle.height, this.paddle.width, this.paddle.height);
        this.ctx.fillStyle = this.paddle.color || '#0095dd';
        this.ctx.fill();
        this.ctx.closePath();
    },

    drawBricks: function() {
        for (var c = 0; c < this.brick.columnCount; c++) {
            for (var r = 0; r < this.brick.rowCount; r++) {
                if (this.bricks[c][r].status === 1) {
                    var brickX = (c * (this.brick.width + this.brick.padding)) + this.brick.offset.left;
                    var brickY = (r * (this.brick.height + this.brick.padding)) + this.brick.offset.top;
                    this.bricks[c][r].x = brickX;
                    this.bricks[c][r].y = brickY;
                    this.ctx.beginPath();
                    this.ctx.rect(brickX, brickY, this.brick.width, this.brick.height);
                    this.ctx.fillStyle = this.brick.color || '#0095dd';
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    },

    draw: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBricks();
        this.drawBall();
        this.drawPaddle();
        this.drawScore();
        this.drawLives();
        this.collisionDetection();

        if (this.ball.x + this.ball.dx > this.canvas.width - this.ball.radius || this.ball.x + this.ball.dx < this.ball.radius) {
            this.ball.dx = -this.ball.dx;
        }
        if (this.ball.y + this.ball.dy < this.ball.radius) {
            this.ball.dy = -this.ball.dy;
        } else if (this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius - this.paddle.height) {
            if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
                this.ball.dy = -this.ball.dy;
            } else {
                // alert('game over');
                this.lives--;
                if (this.lives <= 0) {
                    // alert('game over');
                    document.location.reload();
                } else {
                    this.ball.x = this.canvas.width / 2;
                    this.ball.y = this.canvas.height - 30;
                    this.ball.dx = 2;
                    this.ball.dy = -2;
                    this.paddle.x = (this.canvas.width - this.paddle.width) / 2;
                }
            }
        }

        if (this.isKeyPressed('right') && this.paddle.x < this.canvas.width - this.paddle.width) {
            this.paddle.x += 7;
        } else if (this.isKeyPressed('left') && this.paddle.x > 0) {
            this.paddle.x -= 7;
        }

        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        var game = this;
        requestAnimationFrame(this.draw.bind(game));
    }

};

document.addEventListener('DOMContentLoaded', breakout.init.bind(breakout));