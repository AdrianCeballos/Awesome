

game.GameTimerManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.alwaysUpdate = true;
        this.paused= false;
    },
    update: function() {
        this.now = new Date().getTime();
        this.goldTimerCheck();
        this.creepTimerCheck();
        
        
    }
});
game.HeroDeathManager = Object.extend({
   init:function(x,y,settings){
       this.alwaysUpdate = true;
   },
   update:function(){
       if (game.data.player.dead){
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10,0);
        }
   },
   goldTimerCheck:function(){
       if (Math.round(this.now / 1000) % 20 === 0 && (this.now - this.lastCreep >= 1000)) {
            game.data.gold+=1;
            console.log("Current gold:" + game.data.gold );
        }
   },
   creepTimerCheck:function(){
       if (Math.round(this.now / 1000) % 10 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creepe, 5);
            var lecreepe = me.pool.pull("FriendCreep",100,0,{});
            me.game.world.addChild(lecreepe,5);
        }
   }
});
game.ExperienceManager = Object.extend({
    init:function (x,y,settings){
      this.alwaysUpdate = true;  
      this.gameOver = false;
    },
    update: function(){
        if (game.data.win===true){
            game.data.exp += 10;
            this.gameOver = true;
        }else if (game.data.win===false){
            game.data.exp +=1;
            this.gameOver = true;
        }
        return true;
    }
});