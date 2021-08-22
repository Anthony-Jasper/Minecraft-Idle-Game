const woodcuttingData = () => {

	const woodcuttingItems = document.querySelectorAll('#woodcuttingSkill .woodcuttingItem');
	const levelReq = document.querySelectorAll('#woodcuttingSkill .lvlreq');
	const expInt = document.querySelectorAll('#woodcuttingSkill .xpInterval');
	const imageSrc = document.querySelectorAll('#woodcuttingSkill .treeImage');
	const treeName = document.querySelectorAll('#woodcuttingSkill .treeName');
	const progressBars = document.querySelectorAll("#woodcuttingSkill .intervalBar");

	let itemInterval = 0;

	fetch('data/woodcutting.json')
		.then(response => {
			if (!response.ok) {
           throw new Error("HTTP error " + response.status);
       }
			return response.json();
	})
	.then(json => {
		//SET DATA FOR ITEMS
		for(let i = 0; i < Object.keys( json ).length; i++) {
			for(let j = 0; j < woodcuttingItems.length; j++){
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
		//Interval Values itemInterval = `${intervalsARR[i][1][0].interval}${0}`; USE THIS TO POSSIBLY SORTEN CODE ABOVE
		const intervalsARR = [];
		for(let props in json){
			intervalsARR.push([props, json [props]]);
		}
		//GATHER and INTERVAL
		let progressWidth = 0;
		let gathering = false;
		let delay;
		 for (let i = 0; i < woodcuttingItems.length; i++){
				woodcuttingItems[i].addEventListener("click", ( ) => {
				itemInterval = `${intervalsARR[i][1][0].interval}${0}`;
				console.log(woodcuttingItems[i]);
				console.log(gathering);
				
				gathering = false;
					if(gathering){
						gathering = false;
						progressWidth = 0;
						progressBars[i].style.width = progressWidth + "%";
						woodcuttingItems[i].style.borderColor  = null;
						clearInterval(delay);
						console.log("inside True - Resetting");
					}else{
						woodcuttingItems[i].style.borderColor  = "#d6b300";
						console.log("inside false - Running data");
						const progress = () => {
							if (progressWidth >= 100) {
								progressWidth = 0;
								progressBars[i].style.width = progressWidth + "%";
								console.log("inside false - resetting bar");
							} else {
								progressWidth++
								progressBars[i].style.width = progressWidth + "%";
								console.log("inside false - expanding bar");
							}
						}
						delay = setInterval(progress, itemInterval);
						gathering = true;
					}
						//Add exp to big bar
						//give item
						//display notification
				});
			}
		})
	.catch(err => {
		this.dataError = true; 
	});
}
