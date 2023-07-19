const excavationData = () => {
	//grabbing all the elements to inject data into
	const excavationItems = document.querySelectorAll('.excavationItem');
	const levelReq = document.querySelectorAll('.lvlreq');
	const expInt = document.querySelectorAll('.xpInterval');
	const imageSrc = document.querySelectorAll('.itemImage');
	const displayName = document.querySelectorAll('.displayName');
	const progressBars = document.querySelectorAll(".intervalBar");
	const itemNotification = document.querySelectorAll(".itemNotif");
	const notifSrc = document.querySelectorAll(".notifImage");
	const notifSrc2 = document.querySelector(".notifImage2");
	const lockedLevel = document.querySelectorAll(".lockedLvl");
	const notifText = document.querySelectorAll(".notifText");
	const notifText2 = document.querySelector(".notifText2");
	//sets all skill intervals to 0
	let itemInterval = 0;
	/* 
		LEVELING
	*/
	let globalexcavationLevel = 1;
	let globalexcavationCurrentExp = 0;

	const excavationExpEle = document.querySelector('#innerXP');
	const excavationLevelEle = document.querySelector('#innerLVL');
	const excavationProgressEle = document.querySelector('#innerBar');

	
	//grabs data from json
	fetch('data/excavation.json')
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
			//j sets the number for each element with the class excavationItem
			for(let j = 0; j < excavationItems.length; j++){
				//Both loops are compared against each other to set data within the html. If 0 & 0 it needs to grab the oaklog data and inject into the oaklog element.
				if(i == j) {
					levelReq[j].innerHTML = "level requirement: " + Number(`${dataARR[j][1][0].lvlrequirement}`);
					expInt[j].innerHTML = Number(`${dataARR[j][1][0].experience}`) + " xp / " + Number(`${dataARR[j][1][0].interval}`) + " seconds";
					displayName[j].innerHTML = `${dataARR[j][1][0].name}`;
					imageSrc[j].src = `${dataARR[j][1][0].imageSRC}`;
					notifSrc[j].src = `${dataARR[j][1][0].notifSRC}`;
					break;
				} 
				notifSrc2.src = `${dataARR[2][1][0].notifSRC2}`;
			}
		}
		
		//GATHER and INTERVAL
		let progressWidth = 0;
		//TODO : Will need to be replaced when offline mode is implemented v
		let gathering = false;
		let progressUpdate;
		let gainedExp;
		let itemName;
		let itemName2;
		let skillLevel;
		for (let i = 0; i < excavationItems.length; i++){

			/* LOCKED SKILLS */
			const lockedSkillCheck = () => {
				skillLevel = `${dataARR[i][1][0].lvlrequirement}`;
				if(globalexcavationLevel < skillLevel){
					excavationItems[i].classList.add("locked");
					lockedLevel[i-1].innerHTML = "level requirement : " + skillLevel;
				}else{
					excavationItems[i].classList.remove("locked");
				}
			}
			setInterval(lockedSkillCheck, 50);

			excavationItems[i].addEventListener("click", ( ) => {
				//gets the interval value from the array and adds an extra 0 to resemble seconds since I am using setinterval which only uses milliseconds.
				itemInterval = `${dataARR[i][1][0].interval}${0}`;
				gainedExp = `${dataARR[i][1][0].experience}`;
				itemName = `${dataARR[i][1][0].notiftext}`;
				itemName2 = `${dataARR[i][1][0].notiftext2}`;

					if(gathering){
						gathering = false;
						progressWidth = 0;
						//cycles through all elements and resets them. This prevents a few bugs where clicking on another item while one was active would not reset it.
						for(let j = 0; j < excavationItems.length; j++){
							progressBars[j].style.width = progressWidth + "%";
							excavationItems[j].style.borderColor = null;
						}
						//clears the timer back to 0
						clearInterval(progressUpdate);
						itemNotification[i].classList.remove("itemCollected");
					}else{
						excavationItems[i].style.borderColor  = "#d6b300";
						const progress = () => {
							if (progressWidth >= 100) {
								globalexcavationCurrentExp = Number(globalexcavationCurrentExp) + Number(gainedExp);
								progressWidth = 0;
								progressBars[i].style.width = progressWidth + "%";
								itemNotification[i].classList.add("itemCollected");
								notifText[i].innerHTML = "+1 " + itemName;
								notifText2.innerHTML = "+1 " + itemName2;
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
		let totalExp = Number(`${levelsARR[globalexcavationLevel-1][1][0].experience}`);
		excavationLevelEle.innerHTML = "level " + globalexcavationLevel;
		//allows us to constantly update and check the exp gained and whether to level up or not
		const checkExp = () => {
			excavationLevelEle.innerHTML = "level " + globalexcavationLevel;
			if (globalexcavationCurrentExp >= totalExp) {
				globalexcavationLevel++;
				excavationProgressEle.value = 0;
				//grabs the value for the "overflow" amount when you level up. I then convert it from a negative to a positive value using *-1
				leftover = (totalExp - globalexcavationCurrentExp) * -1;
				globalexcavationCurrentExp = leftover;
				totalExp = Number(`${levelsARR[globalexcavationLevel-1][1][0].experience}`);
			}		
			excavationExpEle.innerHTML = globalexcavationCurrentExp + " / " + totalExp;
			//converts the current exp into a % 
			excavationProgressEle.value = Number(globalexcavationCurrentExp) / Number(`${levelsARR[globalexcavationLevel-1][1][0].experience}`) * 100;
		}
		delay = setInterval(checkExp, 500);
		})
	.catch(err => {
		this.dataError = true; 
	});
}
