function randomXToY(minVal,maxVal) {
  let randVal = minVal+(Math.random()*(maxVal-minVal));
  return Math.round(randVal);
}

let peupler = () => {
	const tableau = require('./tableau');
	let liste = [];
	for (let i=0; i<5; i++) {
		let personne = {};
		personne.nom = tableau.nom[Math.floor(Math.random() * tableau.nom.length)];
		personne.prenom = tableau.prenom[Math.floor(Math.random() * tableau.prenom.length)];
		personne.telephone = tableau.telephone[Math.floor(Math.random() * tableau.telephone.length)] + "-" + randomXToY(101, 999).toString() + "-" + randomXToY(1001, 9999).toString();
		personne.courriel = personne.nom + "." + personne.prenom + tableau.courriel[Math.floor(Math.random() * tableau.courriel.length)];
		liste.push(personne);
	}
	return liste;
}

module.exports = peupler;