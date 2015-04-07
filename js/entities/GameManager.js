
game.HeroDeathManager = Object.extend({
   init:function(x,y,settings){
       this.alwaysUpdate = true;
   },
   update:function(){
       if (game.data.player.dead){
            me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10,0);
        }
   }
});
game.ExperienceManager = Object.extend({
    init:function (x,y,settings){
      this.alwaysUpdate = true;  
      this.gameover = false;
    },
    update: function(){
        if (game.data.win===true){
            this.gameOver(true);
        }else if (game.data.win===false && !this.gameover){
           this.gameOver(false);
        }
        return true;
    },
    gameOver:function(){
        if (win){
            game.data.exp +=10;
        }else{
          game.data.exp +=1;   
        }
        this.gameover = true;
        me.save.exp = game.data.exp;
        console.log("exp:" + me.save.exp);
    }
});
game.SpendGold= Object.extend({
   init:function(x,y,settings){
       this.now = new Date().getTime();
       this.lastBuy = new Date().getTime();
        this.alwaysUpdate = true;
        this.paused= false;
        this.updateWhenPaused = true;
        this.buying = false;
   },
   update: function (){
       this.now = new Date().getTime();
       if(me.input.isKeyPressed("buy") && this.now-this.lastBuy >= 1000){
           this.lastBuy = this.now;
           if(!this.buying){
               this.startBuying();
           }else{
               this.stopBuying();
           }
       }
       this.checkBuyKeys();
       return true;
   },
   startBuying: function(){
       this.buying = true;
       game.data.pausePos = me.game.viewport.localToWorld(0,0);
       game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage("gold-screen"));
       game.data.buyscreen.updateWhenPaused = true;
       game.data.buyscreen.setOpacity(0.8);
       me.game.world.addChild(game.data.buyscreen, 34);
       game.data.player.body.setVelocity(0,0);
       me.state.pause(me.state.PLAY);
       me.input.bindKey(me.input.KEY.F1, "F1", true);
       me.input.bindKey(me.input.KEY.F2, "F2", true);
       me.input.bindKey(me.input.KEY.F3, "F3", true);
       me.input.bindKey(me.input.KEY.F4, "F4", true);
       me.input.bindKey(me.input.KEY.F5, "F5", true);
       me.input.bindKey(me.input.KEY.F6, "F6", true);
       this.setBuyText();
   },
    setBuyText: function(){
    game.data.buytext =  new (me.Renderable.extend({
            init:function(){
                this._super(me.Renderable,'init', [game.data.pausePos.x, game.data.pausePos.y, 300,50]);
                this.font= new me.Font("Arial", 26, "white");  
                this.updateWhenPaused = true;
                this.alwaysUpdate = true;
                    },
        draw:function(renderer){
            this.font.draw(renderer.getContext(), "F1-F6 to buy press B to exit. Current Gold:" + game.data.gold.toString(), this.pos.x , this.pos.y);
            this.font.draw(renderer.getContext(), "Skill 1: Increase Damage. Current Level:" + game.data.skill1 + " Cost:" + ((game.data.skill1+1)*10), this.pos.x + 120 , this.pos.y + 160 );
            this.font.draw(renderer.getContext(), "Skill 2: Speed. Current Level:" + game.data.skill2 + " Cost:" + ((game.data.skill2+1)*10), this.pos.x + 120 , this.pos.y + 185);
            this.font.draw(renderer.getContext(), "Skill 3: Increase health Current Level:" + game.data.skill3 + " Cost:" + ((game.data.skill3+1)*10), this.pos.x + 120 , this.pos.y + 210);
            this.font.draw(renderer.getContext(), "Q Ability: Run Forest Run" + game.data.ability1 + " Cost:" + ((game.data.ability1+1)*10), this.pos.x + 120 , this.pos.y + 235);
            this.font.draw(renderer.getContext(), "W Ability: NOM NOM NOM" + game.data.ability2 + " Cost:" + ((game.data.ability2+1)*10), this.pos.x + 120 , this.pos.y +260);
            this.font.draw(renderer.getContext(), "E Ability: Throw your spear" + game.data.ability3 + " Cost:" + ((game.data.ability3+1)*10), this.pos.x + 120 , this.pos.y +285);
                    }
                }));
                me.game.world.addChild(game.data.buytext, 35);
   },
   
    stopBuying: function(){
       this.buying = false;
       me.state.resume(me.state.PLAY);
       game.data.player.body.setVelocity(5,20);
       me.game.world.removeChild(game.data.buytext);
        me.game.world.removeChild(game.data.buyscreen);
       me.input.unbindKey(me.input.KEY.F1, "F1", true);
       me.input.unbindKey(me.input.KEY.F2, "F2", true);
       me.input.unbindKey(me.input.KEY.F3, "F3", true);
       me.input.unbindKey(me.input.KEY.F4, "F4", true);
       me.input.unbindKey(me.input.KEY.F5, "F5", true);
       me.input.unbindKey(me.input.KEY.F6, "F6", true);
   },
   checkBuyKeys: function(){
    if (me.input.isKeyPressed("F1")){
      if (this.checkCost(1)){
        this.makePurchase(1);
      }  
    }else if (me.input.isKeyPressed("F2")){
        if (this.checkCost(2)){
            this.makePurchase(2);
      } 
    }else if (me.input.isKeyPressed("F3")){
        if (this.checkCost(3)){
            this.makePurchase(3);
      } 
    }else if (me.input.isKeyPressed("F4")){
        if (this.checkCost(4)){
            this.makePurchase(4);
      } 
    }else if (me.input.isKeyPressed("F5")){
        if (this.checkCost(5)){
            this.makePurchase(5);
      } 
    }else if (me.input.isKeyPressed("F6")){
        if (this.checkCost(6)){
            this.makePurchase(6);
      } 
    }           
   },
   checkCost: function (skill){
       if(skill===1 && (game.data.gold >= ((game.data.skill1+1)*10))){
           return true;
       }else if(skill===2 && (game.data.gold >= ((game.data.skill2+1)*10))){
           return true;
       }else if(skill===3 && (game.data.gold >= ((game.data.skill3+1)*10))){
           return true;
       }else if(skill===4 && (game.data.gold >= ((game.data.skill4+1)*10))){
           return true;
       }else if(skill===5 && (game.data.gold >= ((game.data.skill5+1)*10))){
           return true;
       }else if(skill===6 && (game.data.gold >= ((game.data.skill6+1)*10))){
           return true;
       }else{
           return false;
       }
   },
   makePurchase: function(skill){
       if (skill === 1){
       game.data.gold -= ((game.data.skill1 + 1)*10);
       game.data.skill1 += 1;
       game.data.playerAttack += 1;
       }else if (skill === 2){
       game.data.gold -= ((game.data.skill2 + 1)*10);
       game.data.skill2 += 1;
       game.data.playerAttack += 1;
       }else if (skill === 3){
       game.data.gold -= ((game.data.skill3 + 1)*10);
       game.data.skill3 += 1;
       game.data.playerAttack += 1;
       }else if (skill === 4){
       game.data.gold -= ((game.data.ability1 + 1)*10);
       game.data.ability1 += 1;
       game.data.playerAttack += 1;
       }else if (skill === 5){
       game.data.gold -= ((game.data.ability2 + 1)*10);
       game.data.ability2+= 1;
       game.data.playerAttack += 1;
       }else if (skill === 6){
       game.data.gold -= ((game.data.ability3 + 1)*10);
       game.data.ability3 += 1;
       game.data.playerAttack += 1;
       }
   
    }
});