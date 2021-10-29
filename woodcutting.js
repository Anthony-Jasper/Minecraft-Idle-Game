const woodcuttingData = () => {
	//grabbing all the elements to inject data into
	const woodcuttingItems = document.querySelectorAll('#woodcuttingSkill .woodcuttingItem');
	const levelReq = document.querySelectorAll('#woodcuttingSkill .lvlreq');
	const expInt = document.querySelectorAll('#woodcuttingSkill .xpInterval');
	const imageSrc = document.querySelectorAll('#woodcuttingSkill .treeImage');
	const treeName = document.querySelectorAll('#woodcuttingSkill .treeName');
	const progressBars = document.querySelectorAll("#woodcuttingSkill .intervalBar");
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
		for(let i = 0; i < Object.keys( json ).length; i++) {
			//j sets the number for each element with the class woodcuttingItem
			for(let j = 0; j < woodcuttingItems.length; j++){
				//Both loops are compared aganist each other to set data within the html. If 0 & 0 means it needs to grab the oaklog data and inject into the oaklog element.
				if(i == 0 && j == 0) {
					levelReq[j].innerHTML = "level requirement: " + json.oaklog[0].lvlrequirement;
					expInt[j].innerHTML = json.oaklog[0].experience + " xp / " + json.oaklog[0].interval + " seconds";
					treeName[j].innerHTML = json.oaklog[0].name;
					imageSrc[j].src = json.oaklog[0].imageSRC;
					break;
				} 
				if(i == 1 && j == 1) {
					 levelReq[j].innerHTML = "level requirement: " + json.birchlog[0].lvlrequirement;
					 expInt[j].innerHTML = json.birchlog[0].experience + " xp / " + json.birchlog[0].interval + " seconds";
					 treeName[j].innerHTML = json.birchlog[0].name;
					 imageSrc[j].src = json.birchlog[0].imageSRC;
					break;
				} 
				if(i == 2 && j == 2) {
					 levelReq[j].innerHTML = "level requirement: " + json.sprucelog[0].lvlrequirement;
					 expInt[j].innerHTML = json.sprucelog[0].experience + " xp / " + json.sprucelog[0].interval + " seconds";
					 treeName[j].innerHTML = json.sprucelog[0].name;
					 imageSrc[j].src = json.sprucelog[0].imageSRC;
					break;
				} 
				if(i == 3 && j == 3) {
					levelReq[j].innerHTML = "level requirement: " + json.junglelog[0].lvlrequirement;
					expInt[j].innerHTML = json.junglelog[0].experience + " xp / " + json.junglelog[0].interval + " seconds";
					treeName[j].innerHTML = json.junglelog[0].name;
					imageSrc[j].src = json.junglelog[0].imageSRC;
					break;
				} 
				if(i == 4 && j == 4) {
					levelReq[j].innerHTML = "level requirement: " + json.acacialog[0].lvlrequirement;
					expInt[j].innerHTML = json.acacialog[0].experience + " xp / " + json.acacialog[0].interval + " seconds";
					treeName[j].innerHTML = json.acacialog[0].name;
					imageSrc[j].src = json.acacialog[0].imageSRC;
					break;
				} 
				if(i == 5 && j == 5) {
					levelReq[j].innerHTML = "level requirement: " + json.darkoaklog[0].lvlrequirement;
					expInt[j].innerHTML = json.darkoaklog[0].experience + " xp / " + json.darkoaklog[0].interval + " seconds";
					treeName[j].innerHTML = json.darkoaklog[0].name;
					imageSrc[j].src = json.darkoaklog[0].imageSRC;
					break;
				} 
				if(i == 6 && j == 6) {
					levelReq[j].innerHTML = "level requirement: " + json.crimsonlog[0].lvlrequirement;
					expInt[j].innerHTML = json.crimsonlog[0].experience + " xp / " + json.crimsonlog[0].interval + " seconds";
					treeName[j].innerHTML = json.crimsonlog[0].name;
					imageSrc[j].src = json.crimsonlog[0].imageSRC;
					break;
				} 
				if(i == 7 && j == 7) {
					levelReq[j].innerHTML = "level requirement: " + json.warpedlog[0].lvlrequirement;
					expInt[j].innerHTML = json.warpedlog[0].experience + " xp / " + json.warpedlog[0].interval + " seconds";
					treeName[j].innerHTML = json.warpedlog[0].name;
					imageSrc[j].src = json.warpedlog[0].imageSRC;
					break;
				}
			}
		}
		//TODO: Interval Values itemInterval = `${intervalsARR[i][1][0].interval}${0}`; USE THIS TO POSSIBLY SORTEN CODE ABOVE
		const dataARR = [];
		//grabs all of the objects from the json files and places them into an array 
		for(let props in json){
			dataARR.push([props, json [props]]);
		}
		//GATHER and INTERVAL
		let progressWidth = 0;
		//TODO : Will need to be replaced when offline mode is implemented v
		let gathering = false;
		let delay;
		let gainedExp;
		 for (let i = 0; i < woodcuttingItems.length; i++){
				woodcuttingItems[i].addEventListener("click", ( ) => {
				//gets the interval value from the array and adds an extra 0 to resemble seconds since I am using setinterval which only uses milliseconds.
				itemInterval = `${dataARR[i][1][0].interval}${0}`;
				gainedExp = `${dataARR[i][1][0].experience}`;
					if(gathering){
						gathering = false;
						progressWidth = 0;
						//cycles through all elements and resets them. This prevents a few bugs where clicking on another item while one was active would not reset it.
						for(let j = 0; j < woodcuttingItems.length; j++){
							progressBars[j].style.width = progressWidth + "%";
							woodcuttingItems[j].style.borderColor = null;
						}
						//clears the timer back to 0
						clearInterval(delay);
					}else{
						woodcuttingItems[i].style.borderColor  = "#d6b300";
						const progress = () => {
							if (progressWidth >= 100) {
								globalWoodcuttingCurrentExp = Number(globalWoodcuttingCurrentExp) + Number(gainedExp);
								progressWidth = 0;
								progressBars[i].style.width = progressWidth + "%";
							} else {
								progressWidth++
								progressBars[i].style.width = progressWidth + "%";
							}
						}
						//delay is used to be able to use clearInterval. setInterval runs the function progress whilst using the iteminterval value at the timer
						delay = setInterval(progress, itemInterval);
						gathering = true;
					}
						//TODO: give item
						//TODO: display notification
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
		let delay;
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
		delay = setInterval(checkExp, 50);
		})
	.catch(err => {
		this.dataError = true; 
	});
}