let dico = [];

/*
	Récupère le dictionnaire depuis le fichier data/dico.txt et le parse, ligne par ligne
*/
function getDico() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			dico = this.responseText.split("\n");
		}
	};
	xhttp.open('GET', 'data/dico.txt', false);
	xhttp.send();
}

// envoie la requete ajax pour tester un mot de passe et en vérifie le résultat
// configure et renvoie isGood à true si le mdp correspond, à false sinon;
function testPwd(wDico) {
	if(wDico.reponse != '') {
		// Actuellement commenté car sur mon pc je n'ai pas encore installé de server...
		/*var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				//console.log(this.responseText);
				//idGood = (this.responseText !== 'Undefined password' && this.responseText !== "<div style='color:red; font-size:18px'>Erroneous password</div>");
				nbTest++;
			}
		};
		xhttp.open('GET', 'bruteforce/index.php?password=' + password, false);
		xhttp.send();*/
	}
		wDico.dom.text(wDico.reponse);
		if(!wDico.isGood) {
			wDico.nbTest++;
			wDico.isGood = (wDico.reponse === 'resolu');
			if(!wDico.isGood) {
				wDico.i++; // Permet de selectionner le prochain élément sur lequel travailler
				setTimeout(function(){wDico.next(wDico)}, 1);
			} else {
				wDico.dom.html(formatResult(wDico));
				//if(returnFonction != null) {
				//	setTimeout(function(){returnFonction(wDico)}, 1);
				//}
			}
		}
}

function formatResult(wDico) {
	var texte = '<p>Mot de passe : ' + wDico.reponse + '<br>';
	texte += 'Trouvé en ' + wDico.nbTest + ' essais!<br>';
	texte += '(' + Math.floor((Date.now() - wDico.dateStart) / 1000) + ' secondes)</p>';
	//dateStart = 0;
	//nbTest = 0;
	//isGood = false;
	//reponse = '';
	return texte;
}

function testOneByOneFin(wDico) {
	wDico.dom.html(formatResult(wDico));
}
function testOneByOneStep(wDico) {
	wDico.reponse = wDico.d[wDico.i];
	testPwd(wDico);
}
// Teste tous les mots du dictionnaire un par un
// Renvoie le mot trouvé, sinon renvoie 'not found'
function testOneByOne() {
	var wDico = {d: dico.slice(0), i: 0, dateStart: Date.now(), isGood: false, nbTest: 0, reponse: '', dom: $('#resultat1'), next: testOneByOneStep};
	testOneByOneStep(wDico);
}



function testDichotomieFin(wDico) {
	$('#resultat2').html(formatResult(wDico));
}
function testDichotomieStep(wDico) {
	if(wDico.i >= wDico.d.length) wDico.i = 0;
	var m = Math.floor(wDico.d[wDico.i].length / 2); // Recupere l'indice central du sous tableau courant
	wDico.reponse = wDico.d[wDico.i][m];
	var tmp = [wDico.d[wDico.i].slice(0, m)].concat([wDico.d[wDico.i].slice(m + 1)]); // Divise le sous tableau en deux
	tmp = tmp.concat(wDico.d.slice(wDico.i + 1)); // Ajoute les éléments restant après le sous tableau en cours
	wDico.d = wDico.d.slice(0, wDico.i).concat(tmp);// Ajoute les éléments restant avant le sous tableau en cours
	wDico.i++; // on à dédoubler un élément donc il faut augmenter iWorking pour le prendre en compte
	testPwd(wDico);
}
// Teste le mot central récursivement
// Renvoie le mot trouvé, sinon renvoie 'not found'
function testDichotomie() {
	var wDico = {d: [dico.slice(0)], i: 0, dateStart: Date.now(), isGood: false, nbTest: 0, reponse: '', dom: $('#resultat2'), next: testDichotomieStep};
	testDichotomieStep(wDico);
}

// Teste les mots du début, central et de la fin récursivement
// Renvoie le mot trouvé, sinon renvoie 'not found'
function testDichotomie2() {
	var length = dico.length;
	var tmp = [];
	var reponseTmp = '';
	tmp.push(dico);
	while(!isGood && nbTest < length) {
		var tmp2 = [];
		for(var i = 0; i < tmp.length; i++) {
			if(!isGood) {
				var iTest = Math.floor(tmp[i].length / 2);
				if(testPwd(tmp[i][iTest])) reponseTmp = tmp[i][iTest]; // test du milieu du sous-tableau
				else if(testPwd(tmp[i][tmp[i].length - 1])) reponseTmp = tmp[i][tmp[i].length - 1]; // test de la fin du sous-tableau
				else if(testPwd(tmp[i][0])) reponseTmp = tmp[i][0]; // test du début du sous-tableau
				else {
					// Scinde le sous-tableau en 2 au niveau du milieu, début/milieu/fin exclue
					tmp2.push(tmp[i].slice(1, iTest), tmp[i].slice(iTest + 1, tmp[i].length - 1))
				}
			}
		}
		// Mise à jour du tableau de tableau de test
		tmp = [];
		for(var i = 0; i < tmp2.length; i++) tmp.push(tmp2[i]);
	}
	return (isGood)?reponseTmp:'not found';
}