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
        this.health = 12;
        this.facing = "right";
        this.body.setVelocity(5, 20);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.setCurrentAnimation("idle");
        this.renderable.addAnimation("attack", [65, 65, 67, 68, 69, 70, 71, 72], 80);
    },
    update: function(delta) {
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
            this.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }

        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                console.log(!this.renderable.setCurrentAnimation("attack"));
                this.renderable.setCurrentAnimation("attack", "idle");
                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        }
        else {
            this.renderable.setCurrentAnimation("idle");
        }
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    loseHealth: function(damage){
        this.health = this.health - damage;
        console.log(this.health);
    },
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            console.log("xdif" + xdif + "ydif" + ydif);
            if (xdif > -35 && this.facing === 'right' && (xdif < 0)) {
                this.body.vel.x = 0;
                this.pos.x = this.pos.x - 1;
            } else if (xdif < 70 && this.facing === 'left') {
                this.body.vel.x = 0;
                this.pos.x = this.pos.x + 1;
            }
            else if (ydif && this.facing === 'right') {
                this.body.vel.y = 0;
                this.pos.y = this.pos.y + 1;
            }
            if (this.renderable.isCurrentAnimation("attack")&& this.now-this.lastHit >= 1000){ 
                console.log("tower hit");
                this.lastHit = this.now;
                response.b.loseHealth(1);
            }
            }else if (response.b.type==='EnemyCreep'){
                var xdif = this.pos.x - response.b.pos.x;
                var ydif = this.pos.y - response.b.pos.y;
                if (xdiv>0){
                   this.pos.x = this.pos.x + 1; 
                   if(this.facing === 'left'){
                       this.vel.x =0;
                   }
                }else{
                    this.pos.x=this.pos.x - 1;
                    if(this.facing === 'right'){
                       this.vel.x =0;
                   }
                }
                if(this.renderable.isCurrentAnimation("attack")&& this.now-this.lastHit >= 1000){
                    this.lastHit = this.now;
                    response.b.loseHealth(1);
                }
            }
    }

});



game.PlayerBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 100)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);

        this.type = "PlayerBase";

        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    loseHealth:function (damage){
      this.health = this.health - damage;  
    },
    onCollision: function() {

    }
});



game.EnemyBaseEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spriteheight: "100",
                getShape: function() {
                    return (new me.Rect(0, 0, 100, 100)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);

        this.type = "EnemyBaseEntity";

        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");

    },
    update: function(delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.SetCurrentAnimation("broken");
        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function() {

    }
});
game.EnemyCreep = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "creep1",
                width: 32,
                height: 64,
                spritewidth: "32",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 32, 64)).toPolygon();
                }

            }]);
        this.health = 10;
        this.now = new Date().getTime;
        this.alwaysUpdate = true;
        this.lastAttacking=false;
        this.lastAttacking = new Date().getTime();
        this.lastHit = new Date().getTime();
        this.body.setVelocity(3, 23);
        this.type = "EnemyCreep";
        this.renderable.addAnimation("walk", [3, 4, 5], 80);
        this.renderable.setCurrentAnimation("walk");
    },
    loseHealth: function (damage){
        this.health = this.health - damage;
    },
    update: function(delta) {
        if (this.health<= 0){
            me.game.world.removeChild(this);
        }
        this.now = new Date().getTime;
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        me.collision.check(this,true,this.collideHandler.bind(this),true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response){
        if(response.b.type === 'PlayerBase'){
            this.attacking=true;
            this.lastAttacking=this.now;
            this.body.vel.x=0;
            this.pos.x = this.pos.x +1;
            if((this.now-this.lastHit >= 1000)){
                this.lastHit = this.now;
                response.b.loseHealth(1);
            }
        }else if(response.b.type==='PlayerEntity'){
            var xdif = this.pos.x - response.b.pos.x;
            this.attacking=true;
            this.lastAttacking=this.now;
            this.body.vel.x=0;
            this.pos.x = this.pos.x +1;
            if (xdif>0){
                this.pos.x = this.pos.x + 1;
            }
            if((this.now-this.lastHit >= 1000) && xdif>0 ){
                this.lastHit = this.now;
                response.b.loseHealth(1);
            }
        }
    }
});
game.GameManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.alwaysUpdate = true;
    },
    update: function() {
        this.now = new Date().getTime();
        if (Math.round(this.now / 1000) % 10 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creepe, 5);
        }
    }
});
