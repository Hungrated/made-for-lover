import config from '../../config/global'
import util from '../../config/util.js'

import FireworkParticle from './fireworkParticle'
import FireworkWords from './fireworkWords'

const GRAVITY = 0.002;

class Firework {
	constructor({x, y = config.height, xEnd, yEnd, size = 2, radius = 1.2, velocity = 3, opacity = 0.8, count=200, wait, color, dots, prtOption = {}} = {}){
		//自身属性
		this.x = x ? x : util.random(config.width / 8, config.width * 7 / 8);
		this.y = y;
		this.xEnd = xEnd ? xEnd : this.x;
		this.yEnd = yEnd ? yEnd : util.random(config.height/8, 3*config.height/8);

		this.size = size;
		this.opacity = opacity;
		this.velocity = -Math.abs(velocity);		
		this.wait = wait ? wait : util.random(30, 60);

		this.radius = radius;	
		this.GRAVITY = GRAVITY;	

		this.hue = 360 * Math.random() | 0;
		this.color = color ? color : `hsla(${this.hue},80%,60%,1)`;
		this.status = 1;
		if(!dots){
			this.count = count;
			this.particles = [];
			this.createParticles();
			this.type = 'normal';
		}else{
			this.type = 'words';
			const option = {xStart: this.xEnd, yStart: this.yEnd};
			this.particles = dots.map(dot => new FireworkWords(util.extend({}, dot, option, prtOption)));
		}
		
	}
	createParticles(){
		for(let i = 0;i < this.count;++i){
			this.particles.push(new FireworkParticle({x:this.xEnd, y:this.yEnd, radius:this.radius}));
		}
	}
	getSkyColor(){
		const skyColor = {
			lightness: this.status == 3 ? this.opacity : 0 ,
			hue: this.hue
		};
		return skyColor;
	}
	render(ctx){
		switch (this.status){
			case 1:
				ctx.save();
				ctx.beginPath();
				ctx.globalCompositeOperation = 'lighter';
				ctx.globalAlpha = this.opacity;
				ctx.translate(this.x, this.y);
				ctx.scale(0.8, 2.3);
				ctx.translate(-this.x, -this.y);
				ctx.fillStyle = this.color;
				ctx.arc(this.x + Math.sin(Math.PI * 2 * Math.random()) / 1.2, this.y, this.size, 0, Math.PI * 2, false);
				ctx.fill();
				ctx.restore();

				this.rise();
				return true;
			break;

			case 2:

				if(--this.wait <= 0){

					this.opacity = 1;
					this.status = 3;
				}
				return true;
			break;

			case 3:
				ctx.save();
				ctx.globalCompositeOperation = 'lighter';
				ctx.globalAlpha = this.opacity;
				ctx.fillStyle = this.color;
				for(let i = 0;i < this.particles.length;++i){
					this.particles[i].render(ctx);
				}
				ctx.restore();

				this.opacity -= 0.01;
				return this.opacity > 0;
			break;
		}
	}
	rise(){
		this.y += this.velocity * 1;
		this.velocity += this.GRAVITY;
		if(this.y - this.yEnd <= 50){
			this.opacity = (this.y - this.yEnd) / 50;
		}
		if(this.y <= this.yEnd){
			this.status = 2;
		}
	}
}

export default Firework