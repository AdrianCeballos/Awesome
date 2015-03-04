game.FriendCreep = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "lecreep",
                width: 100,
                height: 85,
                spritewidth: "100",
                spriteheight: "85",
                getShape: function() {
                    return(new me.Rect(0, 0, 100, 85)).toPolygon();
                }

            }]);
        this.health = game.data.friendcreepHealth;
        this.now = new Date().getTime;
        this.alwaysUpdate = true;
        this.lastAttacking=false;
        this.lastAttacking = new Date().getTime();
        this.lastHit = new Date().getTime();
        this.body.setVelocity(2, 23);
        this.type = "lecreep";
        this.renderable.addAnimation("walk", [0, 1, 2,3,4], 80);
        this.renderable.setCurrentAnimation("walk");
    },
    loseHealth: function (damage){
        this.health = this.health - damage;
    },
    update: function(delta) {
        console.log(this.health);
        if (this.health<= 0){
            me.game.world.removeChild(this);
        }
        this.now = new Date().getTime;
        this.body.vel.x += this.body.accel.x * me.timer.tick;
        this.flipX(true);
        me.collision.check(this,true,this.collideHandler.bind(this),true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response){
        if(response.b.type === 'EnemyBaseEntity'){
            this.attacking=true;
            this.lastAttacking=this.now;
            this.body.vel.x=0;
            this.pos.x = this.pos.x +1;
            if((this.now-this.lastHit >= game.data.creepAttackTimer)){
                this.lastHit = this.now;
                response.b.loseHealth(game.data.enemyCreepAttack);
            }
        }else if(response.b.type==='EnemyCreep'){
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
                response.b.loseHealth(game.data.enemyCreepAttack);
            }
        }
    }
});
