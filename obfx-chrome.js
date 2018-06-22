console.log('OBFX Extension loaded');

let xhttp = new XMLHttpRequest();
let els = document.querySelectorAll("a[href^='https://themes.trac.wordpress.org/changeset?']");
let our_location = '';
let el = null;
let ticket_ids = [];
if (els.length > 0) {
	our_location = 'ticket_page';
} else {
	//Check theme listing page.
	let tickets = document.querySelectorAll("td[class='id'] > a[href^='/ticket/']");
	let ticket_id = '';
	for (ticket in tickets) {
		if (tickets[ticket].innerText) {
			ticket_id = tickets[ticket].innerText.replace('#', '');
			ticket_ids.push(ticket_id);
		}
	}
	if (ticket_ids.length > 0) {
		our_location = 'tickets_list';
	}
}
switch (our_location) {
	case 'ticket_page':
		processTicketPage();
		break;
	case 'tickets_list':
		processTicketListingPage();
		break;
	default:

		break;
}

function processTicketListingPage() {
	xhttp.open("POST", "https://dashboard.orbitfox.com/api/obfxhq/v1/updates/wp-org-bulk", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.setRequestHeader("Accept", "application/json");
	let payload = {
		"ticket_ids": ticket_ids
	};
	xhttp.send(JSON.stringify(payload));

	xhttp.addEventListener("readystatechange", processRequestListing, false);
}

function processTicketPage() {


	for (let i = 0, l = els.length; i < l; i++) {
		el = els[i];
		let url = el.href;
		console.log(url);

		let params = getUrlParams(url);

		let slug, old_version, new_version;

		[slug, old_version] = params['old_path'].split('/');
		[slug, new_version] = params['new_path'].split('/');

		/**
		 * DEBUG/TESTING
		 * Comment out next 3 lines for full functionality
		 *
		 slug = 'hestia';
		 old_version = '1.1.76';
		 new_version = '1.1.77';
		 * END DEBUG/TESTING
		 */

		xhttp.open("POST", "https://dashboard.orbitfox.com/api/obfxhq/v1/updates/create", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.setRequestHeader("Accept", "application/json");
		xhttp.send("theme=" + slug + "&current_version=" + old_version + "&next_version=" + new_version);

		xhttp.addEventListener("readystatechange", processRequest, false);
	}

}

function processRequest(e) {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		let result = JSON.parse(xhttp.responseText);
		console.log(result);
		if (result.data.gallery_url !== undefined) {
			let parent = el.parentElement;
			parent.innerHTML = parent.innerHTML + 'Visual diff with previous version (' + result.data.global_diff + '%) : ';
			let newLink = document.createElement('a');
			newLink.href = result.data.gallery_url;
			newLink.target = '_blank';
			newLink.innerText = result.data.gallery_url;
			parent.appendChild(newLink)
		}
	}
}

function processRequestListing(e) {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		let result = JSON.parse(xhttp.responseText);
		if (result.data.length === 0) {
			return;
		}
		let placeholders = document.querySelectorAll("td[class='owner'] > span[class='trac-author']");
		for (placeholder in placeholders) {
			if (placeholders[placeholder].innerText) {
				let ticket_id = placeholders[placeholder].parentNode.parentNode.querySelector('.id').innerText.replace("#", '');
				if (typeof  result.data[ticket_id] !== 'undefined') {
						placeholders[placeholder].innerHTML = '<b><a href="' + result.data[ticket_id].gallery_url + '" target="_blank">' + result.data[ticket_id].global_diff + '%</a></b>';
				}
			}
		}
		console.log(result);
	}
}

function getUrlParams(search) {
	let hashes = search.slice(search.indexOf('?') + 1).split('&')
	let params = {}
	hashes.map(hash => {
		let [key, val] = hash.split('=')
		params[key] = decodeURIComponent(val)
	})

	return params
}
