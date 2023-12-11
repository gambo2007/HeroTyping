
cc.Class({
    extends: cc.Component,

    properties: {
        loginButton:cc.Button,
        namePlayerBox:cc.EditBox,
        gamePage:cc.Node,
        missingLabel:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    onSubmit(){
        if(this.namePlayerBox.string === ""){
            return this.missingLabel.node.active = true;
        }
        this.Player ={
            namePlayer:this.namePlayerBox.string,
            
        }
        var jsonString = JSON.stringify(this.Player);
        cc.sys.localStorage.setItem("PlayerData", jsonString);
        this.node.active = false;
        this.gamePage.active = true;
    }

    // update (dt) {},
});
