class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
    }

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
	}
	
    create (){	
		let arraycards = ['co','co','cb','cb','sb','sb','so','so','tb','tb','to','to'];
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
		var options_data = JSON.parse(json);
		var num_cartes = options_data.cards*2;
		var dificulty = options_data.dificulty;
		let cartes_partida = arraycards.slice(0,num_cartes)
		this.cameras.main.setBackgroundColor(0xBFFCFF);

		var resta = null;
		var temps = null;
		
		if(dificulty == "hard"){
			temps = 1000;
			resta = 30;
		}
		else if(dificulty == "normal"){
			temps = 2000;
			resta = 20;
		}
		else{
			temps = 3000;
			resta = 10;
		}
		
		this.cards = this.physics.add.staticGroup();

		cartes_partida.sort((a,b) => 0.5 - Math.random())

		for(var j = 0; j < num_cartes; j++){
			this.add.image(100*j+75,300,cartes_partida[j]);
			this.cards.create(100*j+75,300,'back');
			console.log("secso")
		}
		
		/*this.add.image(250, 300, arraycards[0]);
		this.add.image(350, 300, arraycards[1]);
		this.add.image(450, 300, arraycards[2]);
		this.add.image(550, 300, arraycards[3]);*/

		
		/*this.cards.create(250, 300, 'back');
		this.cards.create(350, 300, 'back');
		this.cards.create(450, 300, 'back');
		this.cards.create(550, 300, 'back');*/
		
		let i = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = cartes_partida[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);
				if (this.firstClick){
					if (this.firstClick.card_id !== card.card_id){
						this.score -= resta;
						this.firstClick.enableBody(false, 0, 0, true, true);
						card.enableBody(false, 0, 0, true, true);

						var fail = [];
                        var m = 0;

                        for(let j = 0; j < num_cartes*2; j++){
                            let errors = this.add.image(100*j+75,300,cartes_partida[m]);
                            fail.push(errors);
                            m++;
                        }

                        setTimeout(() =>{
                            for (let i = 0; i < num_cartes*2; i++){
                                fail[i].destroy();
                            }
                        },temps);

						if (this.score <= 0){
							alert("Game Over");
							loadpage("../");
						}
					}
					else{
						this.correct++;
						if (this.correct >= 2){
							alert("You Win with " + this.score + " points.");
							loadpage("../");
						}
					}
					this.firstClick = null;
				}
				else{
					this.firstClick = card;
				}
			}, card);
		});
	}
	
	update (){	}
}

