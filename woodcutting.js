let delay;
const woodcuttingData = () => {
	//grabbing all the elements to inject data into
	const woodcuttingItems = document.querySelectorAll('.woodcuttingItem');
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
	let globalWoodcuttingLevel = 1;
	let globalWoodcuttingCurrentExp = 0;

	const woodcuttingExpEle = document.querySelector('#innerXP');
	const woodcuttingLevelEle = document.querySelector('#innerLVL');
	const woodcuttingProgressEle = document.querySelector('#innerBar');

	
	//grabs data from json
	fetch('data/woodcutting.json')
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
			//j sets the number for each element with the class woodcuttingItem
			for(let j = 0; j < woodcuttingItems.length; j++){
				//Both loops are compared against each other to set data within the html. If 0 & 0 it needs to grab the oaklog data and inject into the oaklog element.
				if(i == j) {
					levelReq[j].innerHTML = "level requirement: " + Number(`${dataARR[j][1][0].lvlrequirement}`);
					expInt[j].innerHTML = Number(`${dataARR[j][1][0].experience}`) + " xp / " + Number(`${dataARR[j][1][0].interval}`) + " seconds";
					displayName[j].innerHTML = `${dataARR[j][1][0].name}`;
					imageSrc[j].src = `${dataARR[j][1][0].imageSRC}`;
					notifSrc[j].src = `${dataARR[j][1][0].notifSRC}`;
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
		let itemName;
		let skillLevel;
		for (let i = 0; i < woodcuttingItems.length; i++){

			/* LOCKED SKILLS */
			const lockedSkillCheck = () => {
				skillLevel = `${dataARR[i][1][0].lvlrequirement}`;
				if(globalWoodcuttingLevel < skillLevel){
					woodcuttingItems[i].classList.add("locked");
					lockedLevel[i-1].innerHTML = "level requirement : " + skillLevel;
				}else{
					woodcuttingItems[i].classList.remove("locked");
				}
			}
			setInterval(lockedSkillCheck, 50);

			woodcuttingItems[i].addEventListener("click", ( ) => {
				//gets the interval value from the array and adds an extra 0 to resemble seconds since I am using setinterval which only uses milliseconds.
				itemInterval = `${dataARR[i][1][0].interval}${0}`;
				gainedExp = `${dataARR[i][1][0].experience}`;
				itemName = `${dataARR[i][1][0].notiftext}`;


					if(gathering){
						gathering = false;
						progressWidth = 0;
						//cycles through all elements and resets them. This prevents a few bugs where clicking on another item while one was active would not reset it.
						for(let j = 0; j < woodcuttingItems.length; j++){
							progressBars[j].style.width = progressWidth + "%";
							woodcuttingItems[j].style.borderColor = null;
						}
						//clears the timer back to 0
						clearInterval(progressUpdate);
						itemNotification[i].classList.remove("itemCollected");
					}else{
						woodcuttingItems[i].style.borderColor  = "#d6b300";
						const progress = () => {
							if (progressWidth >= 100) {
								globalWoodcuttingCurrentExp = Number(globalWoodcuttingCurrentExp) + Number(gainedExp);
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
		let totalExp = Number(`${levelsARR[globalWoodcuttingLevel-1][1][0].experience}`);
		woodcuttingLevelEle.innerHTML = "level " + globalWoodcuttingLevel;
		//allows us to constantly update and check the exp gained and whether to level up or not
		const checkExp = () => {
			woodcuttingLevelEle.innerHTML = "level " + globalWoodcuttingLevel;
			if (globalWoodcuttingCurrentExp >= totalExp) {
				globalWoodcuttingLevel++;
				woodcuttingProgressEle.value = 0;
				//grabs the value for the "overflow" amount when you level up. I then convert it from a negative to a positive value using *-1
				leftover = (totalExp - globalWoodcuttingCurrentExp) * -1;
				globalWoodcuttingCurrentExp = leftover;
				totalExp = Number(`${levelsARR[globalWoodcuttingLevel-1][1][0].experience}`);
			}		
			woodcuttingExpEle.innerHTML = globalWoodcuttingCurrentExp + " / " + totalExp;
			//converts the current exp into a % 
			woodcuttingProgressEle.value = Number(globalWoodcuttingCurrentExp) / Number(`${levelsARR[globalWoodcuttingLevel-1][1][0].experience}`) * 100;
		}
		delay = setInterval(checkExp, 500);
		})
	.catch(err => {
		this.dataError = true; 
	});
}
