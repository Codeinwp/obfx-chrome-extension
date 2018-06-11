console.log( 'OBFX Extension loaded' );

let els = document.querySelectorAll("a[href^='https://themes.trac.wordpress.org/changeset?']");

for ( let i = 0, l = els.length; i < l; i++ ) {
	let el = els[i];
	let url = el.href;
	console.log( url );

	let params = getUrlParams( url );

	let slug, old_version, new_version;

	[ slug, old_version ] = params['old_path'].split( '/' );
	[ slug, new_version ] = params['new_path'].split( '/' );

	/**
	 * DEBUG/TESTING
	 * Comment out next 3 lines for full functionality
	 */
	slug = 'hestia';
	old_version = '1.1.76';
	new_version = '1.1.77';
	/**
	 * END DEBUG/TESTING
	 */

	let xhttp = new XMLHttpRequest();
	xhttp.open( "POST", "https://dashboard.orbitfox.com/api/obfxhq/v1/updates/create", false );
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send("theme=" + slug + "&current_version=" + old_version + "&next_version=" + new_version );

	let result = JSON.parse( xhttp.responseText );
	console.log( result );
	if( result.data.gallery_url !== undefined ) {
		let parent = el.parentElement;
		parent.appendChild( document.createElement( 'br' ) );
		parent.innerText = parent.innerText + 'Diff Gallery: ';
		let newLink = document.createElement( 'a' );
		newLink.href = result.data.gallery_url;
		newLink.target = '_blank';
		newLink.innerText = result.data.gallery_url;
		parent.appendChild( newLink )
	}
}



function getUrlParams(search) {
	let hashes = search.slice( search.indexOf( '?' ) + 1 ).split( '&' )
	let params = {}
	hashes.map(hash => {
		let [key, val] = hash.split( '=' )
		params[key] = decodeURIComponent( val )
	})

	return params
}
