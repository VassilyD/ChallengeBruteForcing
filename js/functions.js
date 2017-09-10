let dico = [];

/*
	Récupère le dictionnaire depuis le fichier data/dico.txt et le parse, ligne par ligne
*/
function getDico() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			dico = this.responseText.split("\n");
			testOneByOne();
			testDichotomie();
			testDichotomie2();
		}
	};
	xhttp.open('GET', 'data/dico.txt', true);
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
	if(wDico.reponse != 'Not found') {
		texte += 'Trouvé en ' + wDico.nbTest + ' essais!<br>';
		texte += '(' + Math.floor((Date.now() - wDico.dateStart) / 1000) + ' secondes)</p>';
	}
	console.log(wDico);
	return texte;
}

function testOneByOneStep(wDico) {
	if(wDico.nbTest < dico.length) {
		wDico.reponse = wDico.d[wDico.i];
		testPwd(wDico);
	}
	else {
		wDico.reponse = 'Not found';
		wDico.dom.html(formatResult(wDico));
	}
}
// Teste tous les mots du dictionnaire un par un
// Renvoie le mot trouvé, sinon renvoie 'not found'
function testOneByOne() {
	var wDico = {d: dico.slice(0), 
				 i: 0, dateStart: Date.now(), 
				 isGood: false, 
				 nbTest: 0, 
				 reponse: '', 
				 dom: $('#resultat1'), 
				 next: testOneByOneStep};
	testOneByOneStep(wDico);
}


function testDichotomieStep(wDico) {
	if(wDico.nbTest < dico.length) {
		if(wDico.i >= wDico.d.length) wDico.i = 0;
		var m = Math.floor(wDico.d[wDico.i].length / 2); // Recupere l'indice central du sous tableau courant
		wDico.reponse = wDico.d[wDico.i][m];
		var tmp = [wDico.d[wDico.i].slice(0, m)].concat([wDico.d[wDico.i].slice(m + 1)]); // Divise le sous tableau en deux en excluant l'élément du milieu
		tmp = tmp.concat(wDico.d.slice(wDico.i + 1)); // Ajoute les éléments restant après le sous tableau en cours
		wDico.d = wDico.d.slice(0, wDico.i).concat(tmp);// Ajoute les éléments restant avant le sous tableau en cours
		wDico.i++; // on à dédoubler un élément donc il faut augmenter iWorking pour le prendre en compte
		testPwd(wDico);
	}
	else {
		wDico.reponse = 'Not found';
		wDico.dom.html(formatResult(wDico));
	}
}
// Teste le mot central récursivement
// Renvoie le mot trouvé, sinon renvoie 'not found'
function testDichotomie() {
	var wDico = {d: [dico.slice(0)], 
				 i: 0, 
				 dateStart: Date.now(), 
				 isGood: false, 
				 nbTest: 0, 
				 reponse: '', 
				 dom: $('#resultat2'), 
				 next: testDichotomieStep};
	testDichotomieStep(wDico);
}


function testDichotomie2Step(wDico) {
	if(wDico.nbTest < dico.length) {
		if(wDico.i >= wDico.reponses.length) {
			if(wDico.d[wDico.iTable].length > 3) {
				var m = Math.floor(wDico.d[wDico.iTable].length / 2); // Recupere l'indice central du sous tableau courant
				var tmp = [wDico.d[wDico.iTable].slice(1, m)].concat([wDico.d[wDico.iTable].slice(m + 1, wDico.d[wDico.iTable].length - 1)]); // Divise le sous tableau en deux en excluant les éléments début/milieu/fin
				tmp = tmp.concat(wDico.d.slice(wDico.iTable + 1)); // Ajoute les éléments restant après le sous tableau en cours
				wDico.d = wDico.d.slice(0, wDico.iTable).concat(tmp);// Ajoute les éléments restant avant le sous tableau en cours
				wDico.iTable += 2; // Pour passer au tableau suivante il faut aussi passer le nouveau sous tableau créé
			}
			else {
				wDico.d = wDico.d.slice(0, wDico.iTable).concat(wDico.d.slice(wDico.iTable + 1));
				// Cette fois ci on supprime le sous tableau en cours donc ni besoin de passer le nouveau ni meme besoin de passer au suivant car le suivant à desormais l'id de celui sur lequel on travaillait
			}
			if(wDico.iTable >= wDico.d.length) wDico.iTable = 0;
			wDico.i = 0;
		}
		if(wDico.i == 0) {
			wDico.reponses = [];
			if(wDico.d[wDico.iTable].length >= 3) {
				wDico.reponses.push(wDico.d[wDico.iTable][0]); // Premier élément du sous tableau
				wDico.reponses.push(wDico.d[wDico.iTable][Math.floor(wDico.d[wDico.iTable].length / 2)]); // Élément central du sous tableau
				wDico.reponses.push(wDico.d[wDico.iTable][wDico.d[wDico.iTable].length - 1]); // Élément final du sous tableau
			}
			else if(wDico.d[wDico.iTable].length == 2) {
				wDico.reponses.push(wDico.d[wDico.iTable][0]);
				wDico.reponses.push(wDico.d[wDico.iTable][1]);
			}
			else if (wDico.d[wDico.iTable].length == 1) {
				wDico.reponses.push(wDico.d[wDico.iTable][0]);
			}
		}
		wDico.reponse = wDico.reponses[wDico.i];
		//wDico.i++; // on à dédoubler un élément donc il faut augmenter iWorking pour le prendre en compte
		testPwd(wDico);
	}
	else {
		wDico.reponse = 'Not found';
		wDico.dom.html(formatResult(wDico));
	}
}
// Teste le mot central récursivement
// Renvoie le mot trouvé, sinon renvoie 'not found'
function testDichotomie2() {
	var wDico = {d: [dico.slice(0)],
				 i: 0, 
				 dateStart: Date.now(),
				 isGood: false,
				 nbTest: 0,
				 reponse: '', 
				 reponses: [dico[0], dico[Math.floor(dico.length / 2)], dico[dico.length - 1]], 
				 iTable: 0, 
				 dom: $('#resultat3'), 
				 next: testDichotomie2Step};
	testDichotomie2Step(wDico);
}
/*
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
*/