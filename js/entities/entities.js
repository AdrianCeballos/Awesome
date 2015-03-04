// TODO
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        //sets the players height width and uses the spritesheet set up to player
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
        this.type= "PlayerEntity";
        this.health = game.data.playerHealth;
        this.facing = "right";
        this.dead = false;
        this.attack = game.data.playerAttack;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.setCurrentAnimation("idle");
        this.renderable.addAnimation("attack", [65, 65, 67, 68, 69, 70, 71, 72], 80);
    },
    update: function(delta) {
        if (this.health <= 0){
            this.dead=0;
            this.pos.x = 10;
            this.pos.y = 0;
            this.health = game.data.playerHealth;
        }
        
        if (me.input.isKeyPressed("right")) {
            //sets the position of my x by adding the velocity defined in
            //setVelocity() and multiplying it by me.timer.tick
            //me.timer.tick makes the movement look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;

            this.facing = "right";
            this.flipX(true);
        }
        else if (me.input.isKeyPressed("left")) {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;

            this.facing = "left";
            this.flipX(false);
        }
        else {
            this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed("jump") && !this.jumping && !this.falling) {
            this.body.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }

        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {
               
                this.renderable.setCurrentAnimation("attack", "idle");
                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        }
        else if (!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    loseHealth: function(damage){
        this.health = this.health - damage;
       
    },
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            console.log("xdif" + xdif + "ydif" + ydif);
            if (xdif > -35 && this.facing === 'right') {
                this.body.vel.x = 0;
                //this.pos.x = this.pos.x - 1;
            }
            else if (ydif && this.facing === 'right') {
                this.body.vel.y = 0;
                //this.pos.y = this.pos.y + 1;
            }
            if (this.renderable.isCurrentAnimation("attack")&& this.now-this.lastHit >= game.data.playerAttackTimer){ 
                console.log("tower hit");
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
            }
            }else if (response.b.type==='EnemyCreep'){
                var xdif = this.pos.x - response.b.pos.x;
                var ydif = this.pos.y - response.b.pos.y;
                if (xdif>0){
                    //this.pos.x = this.pos.x + 1; 
                   if(this.facing === 'left'){
                       this.body.vel.x =0;
                   }
                }else{
                   // this.pos.x=this.pos.x - 1;
                    if(this.facing === 'right'){
                       this.body.vel.x =0;
                   }
                }
                if(this.renderable.isCurrentAnimation("attack")&& this.now-this.lastHit >= game.data.playerAttackTimer
                    && (Math.abs(ydif)<=40) && 
                    ((xdif>0) && this.facing==="left")  || ((xdif<0) && this.facing==="right") 
                    ){
                    this.lastHit = this.now;
                    if (response.b.health <= game.data.playerAttack){
                      game.data.gold +=1;
                      console.log("Current gold:" + game.data.gold);
                    }
                    response.b.loseHealth(game.data.playerAttack);
                }
            }
    }

});


