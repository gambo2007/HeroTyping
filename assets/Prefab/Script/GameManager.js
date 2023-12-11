// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const randomWords
    = require('better-random-words');
cc.Class({
    extends: cc.Component,

    properties: {
        backGround: [cc.Node],
        checkPoint: cc.Node,
        wordPrefab: cc.Prefab,
        wordPrefab2:cc.Prefab,
        spineBoy: sp.Skeleton,
        boxImage:cc.SpriteFrame,
        spineShark:sp.Skeleton,
        hp:cc.ProgressBar,
        bg:cc.Node,
        finalPage:cc.Node,
        namePlayer:cc.Label,
        speedMove:{
            default: 1
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        var jsonString = cc.sys.localStorage.getItem("PlayerData");
        var loadData = JSON.parse(jsonString);
        this.namePlayer.string = loadData.namePlayer;
        cc.log(this.speedMove)
        this.isTyping = false;
        let action = cc.sequence(
            cc.moveBy(this.speedMove, -96, 0),
            cc.callFunc((e) => {
                this.checkStop(e, this.checkPoint)
            }),).repeatForever()
        this.backGround[0].runAction(action);
        this.backGround[1].runAction(action.clone());
        this.backGround[2].runAction(action.clone());
        this.backGround[3].runAction(action.clone());
        this.enemyDie = 0;
        this.missEnemy = 0;
    },

    checkStop(e, checkPoint) {
        if (e.x < checkPoint.x && !this.isTyping) {
            cc.log(e.name);
            this.backGround.forEach((backGround) => backGround.pauseAllActions())
            this.spineBoy.setAnimation(0, "idle", true);
            this.showWord(e)
            this.isTyping = true;
        }
        if (e.x < -955) {
            e.getChildren()[0].opacity = 255;
            e.getChildren()[0].removeAllChildren();
            e.getChildren()[0].active = true;
            this.spineShark.setAnimation(0,"Idle",false);
            e.x = 2880;
            
            this.isTyping = false;
        }
    },

    showWord(parentNode) {
        cc.log(parentNode.getChildren()[0].name);
        if(parentNode.getChildren()[0].name === "Shark"){
            let randomWord = randomWords(5);
            let word = cc.instantiate(this.wordPrefab2);
            let wordLabel = word.getChildByName("BG").getChildByName("Word").getComponent(cc.Label);
           cc.log(randomWord);
           let stringLabel="";
            for(let i = 0;i<randomWord.length;i++){
                stringLabel = stringLabel + randomWord[i]+ " ";
            }
            cc.log(stringLabel)
            stringLabel = stringLabel.slice(0,stringLabel.length-1)
            // wordLabel.string = randomWord.forEach((word)=>{
            //     word += " ";
            // });
            wordLabel.string = stringLabel;
            word.setParent(parentNode.getChildren()[0]);
            let editBox = word.getChildByName("EditBox").getComponent(cc.EditBox);
            this.typing(wordLabel, editBox);
            this.bossAction();
        }
        else{
            let randomWord = randomWords(1);
            let word = cc.instantiate(this.wordPrefab);
            let wordLabel = word.getChildByName("BG").getChildByName("Word").getComponent(cc.Label);
            wordLabel.string = randomWord;
            word.setParent(parentNode.getChildren()[0]);
            let editBox = word.getChildByName("EditBox").getComponent(cc.EditBox);
            this.typing(wordLabel, editBox);
        }
        

    },

    typing(wordLabel, editBox) {
        
        cc.log(editBox)
        editBox.focus();
        editBox.node.on('editing-did-ended',()=>{
            cc.log("focus")
            cc.log(editBox.string);
            if(editBox.string === "")
                editBox.focus();
            else{
                editBox.blur();
            }
       })
        editBox.node.on('editing-return', () => {
            if(editBox.string === ""){
                return;
            }
            if (wordLabel.string === editBox.string) {
                wordLabel.node.color = cc.Color.GREEN;
                editBox.node.getChildren()[1].color = cc.Color.GREEN;
                cc.log(editBox.node.parent)
                this.enemyDie++;
            } else {
                wordLabel.node.color = cc.Color.RED;
                editBox.node.getChildren()[1].color = cc.Color.RED;
                this.hp.progress -=0.1;
                this.missEnemy++;
                this.checkDie();
                
            }
            cc.tween(editBox.node.parent.parent).to(2,{opacity:0}).start();
            if(editBox.node.parent.parent.name === "Shark"){
                this.spineShark.node.stopAllActions();
                this.spineShark.node.active =false;
            }
            //editBox.node.parent.parent.getComponent(cc.Animation).getAnimationState("box").play();
            this.spineBoy.setAnimation(0, "run", true);
            this.backGround.forEach((backGround) => backGround.resumeAllActions())
            
            //this.editBox.blur();
            // this.editBox.focus();
        }, this);
    },
    bossAction(){
        let action = cc.sequence(cc.delayTime(2),cc.callFunc(()=>{
            this.spineShark.setAnimation(0,"Attack_2",false);
        }),
        cc.delayTime(0.7),
        cc.callFunc(()=>{
            this.hp.progress -=0.2;
            this.checkDie();
           // this.spineShark.setAnimation(1,"Idle",false)
        })
        ).repeatForever();
        this.spineShark.node.runAction(action);
    },
    checkDie(){
        if(this.hp.progress <= 0.01){
            this.spineBoy.setAnimation(0, "death", false);
            this.scores ={
                namePlayer:this.namePlayer.string,
                enemyDie:this.enemyDie,
                missEnemy:this.missEnemy
            }
            var jsonString = JSON.stringify(this.scores);
            cc.sys.localStorage.setItem("scoresData", jsonString);
            this.bg.destroy();
            this.finalPage.active = true;
        }
    },
    update(dt) {
        this.timer += dt;
        if (this.timer > 5) {
            cc.log(this.backGround[0].x);
            this.timer = 0;
        }
    },


});
