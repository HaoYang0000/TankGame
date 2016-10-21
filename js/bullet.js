
var Bullet = function(context,owner,dir){
	this.ctx = context;
	this.x = 0;
	this.y = 0;
	this.owner = owner; //子弹的所属者
	//this.type = type;//1、玩家  2、敌方
	this.dir = dir;
	this.speed = 3;
	this.size = 6;
	this.hit = false;
	this.isDestroyed = false;
	this.bulletLife = 8000;//子弹存活时间
	
	this.draw = function(){
		this.ctx.drawImage(RESOURCE_IMAGE,POS["bullet"][0]+this.dir*this.size,POS["bullet"][1],this.size,this.size,this.x,this.y,this.size,this.size);
		this.move();
	};
	
	this.move = function(){
		//检测子弹是否消逝
		if( this.bulletLife <=0 ){
			this.distroy();
		}

		if(this.dir == UP){
			this.y -= this.speed;
		}else if(this.dir == DOWN){
			this.y += this.speed;
		}else if(this.dir == RIGHT){
			this.x += this.speed;
		}else if(this.dir == LEFT){
			this.x -= this.speed;
		}

		//子弹存活时间减少
		this.bulletLife = this.bulletLife - 20;

		

		//检测子弹是否击中
		this.isHit();
	};
	
	/**
	 * 碰撞检测
	 */
	this.isHit = function(){
		if(this.isDestroyed){
			return;
		}
		
		//子弹是否碰撞了其他子弹
		if(!this.hit){
			if(bulletArray != null && bulletArray.length > 0){
				for(var i=0;i<bulletArray.length;i++){
					if(bulletArray[i] != this && bulletArray[i].hit == false && CheckIntersect(bulletArray[i],this,0)){
						this.hit = true;
						bulletArray[i].hit = true;
						break;
					}
				}
			}
		}
		
		if(!this.hit){
			//地图检测
			if(bulletMapCollision(this,map)){
				this.hit = true;
			}
			//是否击中坦克
			if(player1.lives > 0 && CheckIntersect(this,player1,0)){
				if(!player1.isProtected && !player1.isDestroyed){
					player1.distroy();
				}
				this.hit = true;
			}else if(player2.lives > 0 && CheckIntersect(this,player2,0)){
				if(!player2.isProtected && !player2.isDestroyed){
					player2.distroy();
				}
				this.hit = true;
			}			
		}

		//临界检测
		if(this.x <= map.offsetX){
			this.speed = -this.speed;
			this.hit = false;
			
		}else if(this.x >= map.offsetX + map.mapWidth - this.size){
			this.hit = false;
			this.speed = -this.speed;
		}

		if(this.y <= map.offsetY){
			this.hit = false;
			this.speed = -this.speed;
		}else if(this.y >= map.offsetY + map.mapHeight - this.size){
			this.hit = false;
			this.speed = -this.speed;
		}
		
		if(this.hit){
			this.distroy();
		}
	};
	
	/**
	 * 销毁
	 */
	this.distroy = function(){
		this.isDestroyed = true;
		crackArray.push(new CrackAnimation(CRACK_TYPE_BULLET,this.ctx,this));
		if(!this.owner.isAI){
			BULLET_DESTROY_AUDIO.play();
		}
	};
	
	
};