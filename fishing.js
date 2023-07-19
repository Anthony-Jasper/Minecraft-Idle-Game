const fishingData = () => {
	//grabbing all the elements to inject data into
	const fishingItems = document.querySelectorAll('.fishingItem');
	const levelReq = document.querySelectorAll('.lvlreq');
	const junkchance = document.querySelectorAll('.junkchance');
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
	let globalfishingLevel = 1;
	let globalfishingCurrentExp = 0;

	const fishingExpEle = document.querySelector('#innerXP');
	const fishingLevelEle = document.querySelector('#innerLVL');
	const fishingProgressEle = document.querySelector('#innerBar');
	
	//grabs data from json
	fetch('data/fishing.json')
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
		for(let i = 0; i < Object.keys( json ).length; i++) {
			//j sets the number for each element with the class fishingItem
			for(let j = 0; j < fishingItems.length; j++){
				//Both loops are compared against each other to set data within the html. If 0 & 0 it needs to grab the oaklog data and inject into the oaklog element.
				if(i == j) {
					levelReq[j].innerHTML = "level requirement: " + Number(`${dataARR[j][1][0].lvlrequirement}`);
					junkchance[j].innerHTML = "junk chance: " + Number(`${dataARR[j][1][0].junk}`) + "%";
					expInt[j].innerHTML = Number(`${dataARR[j][1][0].experience}`) + " xp / " + Number(`${dataARR[j][1][0].interval}`) + " seconds";
					displayName[j].innerHTML = `${dataARR[j][1][0].name}`;
					imageSrc[j].src = `${dataARR[j][1][0].imageSRC}`;
					break;
				} 
			}
		}
		
		//GATHER and INTERVAL
		let progressWidth = 0;
		//TODO : Will need to be replaced when offline mode is implemented v
		let gathering = false;
		let progressUpdate;
		let gainedExp;
		let lootExp;
		let itemName;
		let skillLevel;
		let randomNumber;
		for (let i = 0; i < fishingItems.length; i++){

			/* LOCKED SKILLS */
			const lockedSkillCheck = () => {
				skillLevel = `${dataARR[i][1][0].lvlrequirement}`;
				if(globalfishingLevel < skillLevel){
					fishingItems[i].classList.add("locked");
					lockedLevel[i-1].innerHTML = "level requirement : " + skillLevel;
				}else{
					fishingItems[i].classList.remove("locked");
				}
			}
			setInterval(lockedSkillCheck, 50);

			fishingItems[i].addEventListener("click", ( ) => {

				fetch('data/fishing_droptable.json')
					.then(response => {
						if (!response.ok) {
							throw new Error("HTTP error " + response.status);
						}
						return response.json();
					})
					.then(json => {
						const lootARR = [];
						//grabs all of the objects from the json files and places them into an array 
						for(let props in json){
							lootARR.push([props, json [props]]);
						}
						console.log(lootARR);
						//gets the interval value from the array and adds an extra 0 to resemble seconds since I am using setinterval which only uses milliseconds.
						itemInterval = `${dataARR[i][1][0].interval}${0}`;
						gainedExp = `${dataARR[i][1][0].experience}`;
						itemName = `${lootARR[i][1][0].notiftext}`;

						
							if(gathering){ 
								gathering = false;
								progressWidth = 0;
								//cycles through all elements and resets them. This prevents a few bugs where clicking on another item while one was active would not reset it.
								for(let j = 0; j < fishingItems.length; j++){
									progressBars[j].style.width = progressWidth + "%";
									fishingItems[j].style.borderColor = null;
								}
								//clears the timer back to 0
								clearInterval(progressUpdate);
								itemNotification[i].classList.remove("itemCollected");
							}else{
								randomNumber = Math.floor(Math.random() * 100) + 1;
								console.log(randomNumber);
								fishingItems[i].style.borderColor  = "#d6b300";
								const progress = () => {
									if (progressWidth >= 100) {
										globalfishingCurrentExp = Number(globalfishingCurrentExp) + Number(gainedExp);
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
						})
					.catch(err => {
						this.dataError = true; 
					});
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
		let totalExp = Number(`${levelsARR[globalfishingLevel-1][1][0].experience}`);
		fishingLevelEle.innerHTML = "level " + globalfishingLevel;
		//allows us to constantly update and check the exp gained and whether to level up or not
		const checkExp = () => {
			fishingLevelEle.innerHTML = "level " + globalfishingLevel;
			if (globalfishingCurrentExp >= totalExp) {
				globalfishingLevel++;
				fishingProgressEle.value = 0;
				//grabs the value for the "overflow" amount when you level up. I then convert it from a negative to a positive value using *-1
				leftover = (totalExp - globalfishingCurrentExp) * -1;
				globalfishingCurrentExp = leftover;
				totalExp = Number(`${levelsARR[globalfishingLevel-1][1][0].experience}`);
			}		
			fishingExpEle.innerHTML = globalfishingCurrentExp + " / " + totalExp;
			//converts the current exp into a % 
			fishingProgressEle.value = Number(globalfishingCurrentExp) / Number(`${levelsARR[globalfishingLevel-1][1][0].experience}`) * 100;
		}
		delay = setInterval(checkExp, 500);
		})
	.catch(err => {
		this.dataError = true; 
	});
}