/* Storage Animation */
let storageAnim = document.getElementById("storageAnim");

storageAnim.addEventListener("mouseenter", ( event ) => {
	storageAnim.src = "/images/storage.gif";
}, false);

storageAnim.addEventListener("mouseleave", ( event ) => {
	storageAnim.src = "/images/storage.png";
}, false);

/* FETCH - Grab skill and inject into innerscreen */
 // Loads woodcutting page on load - default
window.addEventListener('load', (event) => {
	grabSkill(event, "fishing");
});

const grabSkill = (event, page) => {
	const skillItem = event.target;
	let fileName;
	//default
	if(page == 'fishing'){
		fileName = "fishing";
	}
	else{
		fileName = skillItem.querySelector('.skillName').innerText;
	}

	fetch('/skills/' + fileName + '.html')
    .then((response) => {
        // When the page is loaded convert it to text
        return response.text();
    })
  	.then((html) => {
			// Initialize the DOM parser
			const parser = new DOMParser();

			// Parse the text
			const doc = parser.parseFromString(html, "text/html");

			// Select skill container to inject the html into 
			const skillPage = document.querySelector('#skillPage');
			skillPage.innerHTML = html;
			/* TODO: This needs to be expanded to allow other data to be pulled when other files are in play */
			/* TODO: Uses Global delay variable to cancel function from working. Not a fan off Global Variables but does it effect gameplay if discovered and abused? */
			//get main element to add class. allows for dynamic colours to be used
			const mainWrapper = document.querySelector('#wrapper');
			switch (fileName) {
				case 'woodcutting':
						stopDelay();
						woodcuttingData();
						mainWrapper.className = "woodcuttingPage";
					break;
				case 'mining':
						stopDelay();
						miningData();
						mainWrapper.className = "miningPage";
					break;
				case 'excavation':
						stopDelay();
						excavationData();
						mainWrapper.className = "excavationPage";
					break;
				case 'fishing':
					stopDelay();
					fishingData();
					mainWrapper.className = "fishingPage";
					break;
				default:
			}
  	})
  	.catch(function(err) {  
      console.log('Failed to fetch page: ', err);  
  	});

		// Change the banner name to the active skill
		const innerName = document.querySelector('#innerName');
		innerName.innerText = fileName;

		// Change the banner icon to the active skill
		const innerLogo = document.querySelector('#innerLogo');
		innerLogo.src = "images/icons/" + fileName + ".png";
}

/* Tab Navigation - Skills*/
function openContent(tabType) {
  let tabContent = document.getElementsByClassName("miningTabs");
  for (let i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }
  document.getElementById(tabType).style.display = "block";
}
/* If switchin skill, will stop the previous skill from being active */
function stopDelay() {
  clearInterval(delay);
}