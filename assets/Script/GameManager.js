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
        spineBoy: sp.Skeleton,
        boxImage:cc.SpriteFrame,
        speedMove:{
            default: 1
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
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
            e.getChildren()[0].getComponent(cc.Sprite).spriteFrame = this.boxImage;
            e.getChildren()[0].removeAllChildren();
            e.x = 1920;
            this.isTyping = false;
        }
    },

    showWord(parentNode) {
        cc.game.canvas.focus();
        let randomWord = randomWords(1);
        let word = cc.instantiate(this.wordPrefab);
        let wordLabel = word.getChildByName("BG").getChildByName("Word").getComponent(cc.Label);
        wordLabel.string = randomWord;
        word.setParent(parentNode.getChildren()[0]);
        let editBox = word.getChildByName("EditBox").getComponent(cc.EditBox);
        this.typing(wordLabel, editBox);

    },

    typing(wordLabel, editBox) {
        cc.log(editBox)
        editBox.focus();
        editBox.node.on('editing-return', () => {
            if (wordLabel.string === editBox.string) {
                wordLabel.node.color = cc.Color.GREEN;
                editBox.node.getChildren()[1].color = cc.Color.GREEN;
                cc.log(editBox.node.parent)
            } else {
                wordLabel.node.color = cc.Color.RED;
                editBox.node.getChildren()[1].color = cc.Color.RED;
            }
            editBox.node.parent.parent.getComponent(cc.Animation).getAnimationState("box").play();
            this.spineBoy.setAnimation(0, "run", true);
            this.backGround.forEach((backGround) => backGround.resumeAllActions())
        }, this);
    },
    onKeyDown() {
        cc.log("hello")
        // Ghi nhận khi một phím được nhấn
        var keyCode = event.keyCode;
        if ((keyCode)) {
            cc.log("Phím " + String.fromCharCode(keyCode) + " được nhấn.");
            return "hesssllo";
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
