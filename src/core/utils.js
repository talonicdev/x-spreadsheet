function getCoordinatesFromShorthand(sShorthand,bToArray) {
	let coords = { ri: null, ci: null };
	if (typeof sShorthand == "string" || typeof sShorthand == "number") {
		for (let cChar of sShorthand.toString().toUpperCase().split("")) {
			let iCharCode = cChar.charCodeAt(0);
			if (iCharCode >= 65 && iCharCode <= 90) {
				coords.ci = ((coords.ci||0) * 26 + (iCharCode - 65) + 1);
				continue;
			}
			if (iCharCode >= 48 && iCharCode <= 57) {
				coords.ri = ((coords.ri||0) * 10 + (iCharCode - 48));
				continue;
			}
			return null;
		}
        if (coords.ri !== null) coords.ri--;
        if (coords.ci !== null) coords.ci--;
		if (bToArray) return [coords.ri,coords.ci];
		return coords;
	}
	if (Object.prototype.toString.call(sShorthand) == "[object Object]") {
		if (typeof sShorthand.ci == "number" && sShorthand.ri == "number") {
			if (bToArray) return [sShorthand.ri,sShorthand.ci];
			return sShorthand;
		}
	}
	return null;
}

function getShorthandFromCoordinates(oCoords) {
	let sShorthand = "";
	if (Object.prototype.toString.call(oCoords) == "[object Object]") {
		if (typeof oCoords.ci == "number") {
			oCoords.ci = parseInt(oCoords.ci) + 1;
			while (oCoords.ci > 0) {
				oCoords.ci--;
				sShorthand = String.fromCharCode(65 + (oCoords.ci % 26)) + sShorthand;
				oCoords.ci = Math.floor(oCoords.ci / 26);
			}
		}
		if (typeof oCoords.ri == "number") {
			oCoords.ri = parseInt(oCoords.ri) + 1;
			sShorthand += oCoords.ri.toString();
		}
	}
	if (sShorthand === "") return null;
	return sShorthand;
}

export default {};
export {
    getCoordinatesFromShorthand as getCoords,
    getShorthandFromCoordinates as getShorthand
};
