$(document).ready(function(){
	getDico();
	reponse = testOneByOne();
	//if(reponse !== 'not found') {
		var texte = '<h2>Un Par un : </h2>';
		texte += '<p>Mot de passe : ' + reponse + '<br>';
		texte += 'Trouvé en ' + nbTest + ' essais!</p>';
		$('#resultat1').html(texte);
	//}
	nbTest = 0;
	isGood = false;

	reponse = testDichotomie();
	//if(reponse !== 'not found') {
		var texte = '<h2>Dichotomie : </h2>';
		texte += '<p>Mot de passe : ' + reponse + '<br>';
		texte += 'Trouvé en ' + nbTest + ' essais!</p>';
		$('#resultat2').html(texte);
	//}
	nbTest = 0;
	isGood = false;

	reponse = testDichotomie2();
	//if(reponse !== 'not found') {
		var texte = '<h2>Dichotomie borne comprise : </h2>';
		texte += '<p>Mot de passe : ' + reponse + '<br>';
		texte += 'Trouvé en ' + nbTest + ' essais!</p>';
		$('#resultat3').html(texte);
	//}
});