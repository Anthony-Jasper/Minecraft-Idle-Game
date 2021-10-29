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
	grabSkill(event, "woodcutting");
});


const grabSkill = (event, page) => {
	const skillItem = event.target;
	let fileName;

	if(page == 'woodcutting'){
		fileName = "woodcutting";
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
				if(fileName == "woodcutting"){
					woodcuttingData();
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