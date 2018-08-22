class Vec {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    get len() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    set len(value) {
        const fact = value / this.len;
        this.x *= fact;
        this.y *= fact;
    }
}

class Rect {
    constructor(w, h) {
        this.pos = new Vec;        // Background position
        this.size = new Vec(w, h); // Background size
    }

    get left() {
        return this.pos.x - this.size.x / 2;
    }

    get right() {
        return this.pos.x + this.size.x / 2;
    }

    get top() {
        return this.pos.y - this.size.y / 2;
    }

    get bottom() {
        return this.pos.y + this.size.y / 2;
    }
}

class Ball extends Rect {
    constructor() {
        super(10, 10);       // ball size
        this.vel = new Vec;  // ball speed
    }
}

class Player extends Rect {
    constructor() {
        super(15, 100);
        this.score = 0;
    }
}

class Pong {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.ball = new Ball;


        this.players = [
            new Player,
            new Player,
        ];

        // Set players X-axis position
        this.players[0].pos.x = 40;
        this.players[1].pos.x = this._canvas.width - 40;

        // Set players y-axis movement;
        this.players.forEach(player => {
            player.pos.y = this._canvas.height / 2;
        });

// Make the function shows on the windows
        let lastTime;
        const callback = (millis) => {
            if (lastTime) {
                this.update((millis - lastTime) / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(callback);
        };
        callback();


        // Set the data for background
        this.CHAR_PIXEL = 10;
        this.CHARS = [
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001111',
        ].map(str => {
            const canvas = document.createElement('canvas');
            canvas.height = this.CHAR_PIXEL * 5;
            canvas.width = this.CHAR_PIXEL * 3;
            const context = canvas.getContext('2d');
            context.fillStyle = 'white';
            str.split('').forEach((fill, i) => {
                if (fill === '1') {
                    context.fillRect(
                        (i % 3) * this.CHAR_PIXEL,
                        (i / 3 | 0) * this.CHAR_PIXEL,
                        this.CHAR_PIXEL,
                        this.CHAR_PIXEL);
                }
            });
            return canvas;
        });

        this.reSet();
    }

    // Make boundary between balls and players
    collide(player, ball) {
        if (player.left < ball.right && player.right > ball.left
            && player.top < ball.bottom && player.bottom > ball.top) {
            const len = ball.vel.len;   // Get the value from set len and get len for ball
            ball.vel.x = -ball.vel.x;
            ball.vel.y += 300 * (Math.random() - .5); // Speed up the ball y-axis
            ball.vel.len = len * 1.08;
        }
    }

    draw() {
        this._context.fillStyle = 'black';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);// Background color and height with width
        this.drawRect(this.ball);

        //Draw players
        this.drawScore();
        this.players.forEach(player => this.drawRect(player));


    }

    drawRect(rect) {
        this._context.fillStyle = 'white';
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);// Ball size and ball position

    }

    drawScore() {
        const align = this._canvas.width / 3;
        const CHAR_W = this.CHAR_PIXEL * 4;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split('');
            //offset for the score
            const offset = align *
                (index + 1) -
                (CHAR_W * chars.length / 2) *
                this.CHAR_PIXEL / 2;
            chars.forEach((char, pos) => {
                this._context.drawImage(this.CHARS[char|0],
                    offset + pos * CHAR_W, 20);
            });
        });
    }

    reSet() {
        this.ball.pos.x = this._canvas.width / 2;// Initialize the position of the ball
        this.ball.pos.y = this._canvas.height / 2;

        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    }

    start() {
        if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
            this.ball.vel.x = 300 * (Math.random() > 0.5 ? 1 : -1);
            this.ball.vel.y = 400 * (Math.random() > 5 ? 1 : -1);
            this.ball.vel.len = 200;
        }
    }


    update(dt) {
        this.ball.pos.x += this.ball.vel.x * dt;  // Movement of the ball is relative to the time difference
        this.ball.pos.y += this.ball.vel.y * dt;

        if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
            const playerId = this.ball.vel.x < 0 | 0;
            this.players[playerId].score++;
            this.reSet();
        }
        if (this.ball.bottom < 0 || this.ball.top > this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y;
        }

        this.players.forEach(player => this.collide(player, this.ball));

        this.players[1].pos.y = this.ball.pos.y;
        this.draw();

    }


}


const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

// Set keyboard to make player one play with mousemove
canvas.addEventListener('mousemove', event => {
    const scale =event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].pos.y = canvas.height * scale;
});


// Set start of the game to make it run

canvas.addEventListener('click', event => {
    pong.start();
});


// Pause the game







