const miningData = () => {
	const blocksButton = document.getElementById("blockButton");
	const oresButton = document.getElementById("oreButton");
	//grabbing all the elements to inject data into
	const miningBlockItems = document.querySelectorAll('#miningBlocks .miningItem');
	const miningItems = document.querySelectorAll('.miningItem');
	const levelReq = document.querySelectorAll('.lvlreq');
	const expInt = document.querySelectorAll('.xpInterval');
	const imageSrc = document.querySelectorAll('.itemImage');
	const displayName = document.querySelectorAll('.displayName');
	const progressBars = document.querySelectorAll(".intervalBar");
	const itemNotification = document.querySelectorAll(".itemNotif");
	const notifSrc = document.querySelectorAll(".notifImage");
	const lockedLevel = document.querySelectorAll(".lockedLvl");
	const notifText = document.querySelectorAll(".notifText");
	//sets all skill intervals to 0
	let itemInterval = 0;
	/* 
		LEVELING
	*/
	let globalminingLevel = 1;
	let globalminingCurrentExp = 0;

	const miningExpEle = document.querySelector('#innerXP');
	const miningLevelEle = document.querySelector('#innerLVL');
	const miningProgressEle = document.querySelector('#innerBar');

	//grabs data from json
	fetch('data/mining.json')
		.then(response => {
			if (!response.ok) {
           throw new Error("HTTP error " + response.status);
       }
			return response.json();
	})
	.then(json => {
		//SET DATA FOR ITEMS
		//i set the number for each object within the json i.e oaklog object = 0
		const dataARR = [];
		//grabs all of the objects from the json files and places them into an array 
		for(let props in json){
			dataARR.push([props, json [props]]);
		}
		let blockCounterSet = 0;
		let oreCounterSet = miningBlockItems.length;
		for(let i = 0; i < miningItems.length; i++) {	
			if(`${dataARR[i][1][0].type}` == "block"){
				levelReq[blockCounterSet].innerHTML = "level requirement: " + Number(`${dataARR[i][1][0].lvlrequirement}`);
				expInt[blockCounterSet].innerHTML = Number(`${dataARR[i][1][0].experience}`) + " xp / " + Number(`${dataARR[i][1][0].interval}`) + " seconds";
				displayName[blockCounterSet].innerHTML = `${dataARR[i][1][0].name}`;
				imageSrc[blockCounterSet].src = `${dataARR[i][1][0].imageSRC}`;
				notifSrc[blockCounterSet].src = `${dataARR[i][1][0].notifSRC}`;
				blockCounterSet++;
			}else{
				levelReq[oreCounterSet].innerHTML = "level requirement: " + Number(`${dataARR[i][1][0].lvlrequirement}`);
				expInt[oreCounterSet].innerHTML = Number(`${dataARR[i][1][0].experience}`) + " xp / " + Number(`${dataARR[i][1][0].interval}`) + " seconds";
				displayName[oreCounterSet].innerHTML = `${dataARR[i][1][0].name}`;
				imageSrc[oreCounterSet].src = `${dataARR[i][1][0].imageSRC}`;
				notifSrc[oreCounterSet].src = `${dataARR[i][1][0].notifSRC}`;
				oreCounterSet++;
			}
		}
		
		//GATHER and INTERVAL
		let progressWidth = 0;
		//TODO : Will need to be replaced when offline mode is implemented v
		let gathering = false;
		let progressUpdate;
		let gainedExp;
		let blockCounterLock = 0;
		let oreCounterLock = miningBlockItems.length;
		for (let i = 0; i < miningItems.length; i++){

			/* LOCKED SKILLS *///TODO: Not happy with this section
			if(`${dataARR[i][1][0].type}` == "block"){
				const lockedBlockSkillCheck = () => {
					let skillLevelBlock = `${dataARR[i][1][0].lvlrequirement}`;
					blockCounterLock++
					if(globalminingLevel < skillLevelBlock){
						miningItems[blockCounterLock-1].classList.add("locked");
						lockedLevel[blockCounterLock-3].innerHTML = "level requirement : " + skillLevelBlock;
					}
					
					if(blockCounterLock == 9){
						blockCounterLock = 0;
					}
				}
				setInterval(lockedBlockSkillCheck, 50);
			}else{
				const lockedOreSkillCheck = () => {
					let skillLevelOre = `${dataARR[i][1][0].lvlrequirement}`;
					oreCounterLock++
					if(globalminingLevel < skillLevelOre){
						miningItems[oreCounterLock-1].classList.add("locked");
						lockedLevel[oreCounterLock-3].innerHTML = "level requirement : " + skillLevelOre;
					}
					if(oreCounterLock == 19){
						oreCounterLock = miningBlockItems.length;
					}
				}
					setInterval(lockedOreSkillCheck, 50);
			}

			//START GATHERING ON CLICK
			miningItems[i].addEventListener("click", ( ) => {
					itemInterval = `${dataARR[i][1][0].interval}${0}`;
					gainedExp = `${dataARR[i][1][0].experience}`;
					itemName = `${dataARR[i][1][0].notiftext}`;
					console.log(itemName);


					if(gathering){
						gathering = false;
						progressWidth = 0;
						//cycles through all elements and resets them. This prevents a few bugs where clicking on another item while one was active would not reset it.
						for(let j = 0; j < miningItems.length; j++){
							progressBars[j].style.width = progressWidth + "%";
							miningItems[j].style.borderColor = null;
						}
						//clears the timer back to 0
						clearInterval(progressUpdate);
						itemNotification[i].classList.remove("itemCollected");
					}else{
						miningItems[i].style.borderColor  = "#d6b300";
						const progress = () => {
							if (progressWidth >= 100) {
								globalminingCurrentExp = Number(globalminingCurrentExp) + Number(gainedExp);
								progressWidth = 0;
								progressBars[i].style.width = progressWidth + "%";
								itemNotification[i].classList.add("itemCollected");
								notifText[i].innerHTML = "+1 " + itemName;
							} else {
								progressWidth++
								progressBars[i].style.width = progressWidth + "%";
							}
							if(progressWidth >= 75){
								itemNotification[i].classList.remove("itemCollected");
							}
						}
						//progressUpdate is used to be able to use clearInterval. setInterval runs the function progress whilst using the iteminterval value at the timer
						progressUpdate = setInterval(progress, itemInterval);
						gathering = true;
						}
				});
			}
		})
	.catch(err => {
		this.dataError = true; 
	});

	fetch('data/exp_table.json')
	.then(response => {
		if (!response.ok) {
			throw new Error("HTTP error " + response.status);
		}
		return response.json();
	})
	.then(json => {
		const levelsARR = [];
		//grabs all of the objects from the json files and places them into an array 
		for(let props in json){
			levelsARR.push([props, json [props]]);
		}
		let leftover;
		//grabs the experience amount requried for the level. We use the level and -1 since we start at level 1 but the Array starts at index 0.
		let totalExp = Number(`${levelsARR[globalminingLevel-1][1][0].experience}`);
		miningLevelEle.innerHTML = "level " + globalminingLevel;
		//allows us to constantly update and check the exp gained and whether to level up or not
		const checkExp = () => {
			miningLevelEle.innerHTML = "level " + globalminingLevel;
			if (globalminingCurrentExp >= totalExp) {
				globalminingLevel++;
				miningProgressEle.value = 0;
				//grabs the value for the "overflow" amount when you level up. I then convert it from a negative to a positive value using *-1
				leftover = (totalExp - globalminingCurrentExp) * -1;
				globalminingCurrentExp = leftover;
				totalExp = Number(`${levelsARR[globalminingLevel-1][1][0].experience}`);
			}		
			miningExpEle.innerHTML = globalminingCurrentExp + " / " + totalExp;
			//converts the current exp into a % 
			miningProgressEle.value = Number(globalminingCurrentExp) / Number(`${levelsARR[globalminingLevel-1][1][0].experience}`) * 100;
		}
		delay = setInterval(checkExp, 500);
		})
	.catch(err => {
		this.dataError = true; 
	});

	//Tabs styling
	blocksButton.addEventListener("click", ( ) => {
		oresButton.classList.remove('activeTab');
		blocksButton.classList.add('activeTab');
	});
	oresButton.addEventListener("click", ( ) => {
		blocksButton.classList.remove('activeTab');
		oresButton.classList.add('activeTab');
	});
}

