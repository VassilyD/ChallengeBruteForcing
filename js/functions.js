let dico = [];

/*
	Récupère le dictionnaire depuis le fichier data/dico.txt et le parse, ligne par ligne
*/
function getDico() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//dico = this.responseText.split("\n");
			dico = [];
			for(i = 0; i < 1000; i++) dico.push('mdp' + i);
			setTimeout(function(){testOneByOne(0)}, 1);
			setTimeout(function(){testDichotomie(0)}, 1);
			setTimeout(function(){testDichotomie2(0)}, 1);
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
		wDico.dom.children('p.enCours').text(wDico.reponse);
		if(!wDico.isGood) {
			wDico.isGood = (wDico.reponse === dico[wDico.p]);
			wDico.nbTest++; 
			if(!wDico.isGood) {
				wDico.i++; // Permet de selectionner le prochain élément sur lequel travailler
				setTimeout(function(){wDico.next(wDico)}, 1);
			} else {
				wDico.dom.children('p.fini').html(wDico.dom.children('p.fini').html() + formatResult(wDico));
				if(wDico.p + 1 < dico.length) setTimeout(function(){wDico.start(wDico.p + 1)});
				else wDico.dom.children('p.enCours').text('Temps total : ' + wDico.tempsTotal + 's');
			}
		}
}

function formatResult(wDico) {
	var time = (Date.now() - wDico.dateStart);
	wDico.tempsTotal += time;
	time = Math.floor(time / 1000);
	var d = new Date();
	var horodatage = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
	return (wDico.reponse + ' : ' + wDico.nbTest + ' (' + time + 's) (' + horodatage + ')<br>');
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
function testOneByOne(imdp) {
	var wDico = {d: dico.slice(0), 
				 i: 0, dateStart: Date.now(), 
				 tempsTotal: 0,
				 isGood: false, 
				 nbTest: 0, 
				 p: imdp,
				 reponse: '', 
				 dom: $('#resultat1'), 
				 next: testOneByOneStep,
				 start: testOneByOne};
	testOneByOneStep(wDico);
}


function testDichotomieStep(wDico) {
	if(wDico.nbTest < dico.length) {
		if(wDico.i >= wDico.d.length) wDico.i = 0;
		if(wDico.d[wDico.i].length > 1) {
			var m = Math.floor(wDico.d[wDico.i].length / 2); // Recupere l'indice central du sous tableau courant
			wDico.reponse = wDico.d[wDico.i][m];

			// Divise le sous tableau en deux en excluant l'élément du milieu
			var tmp = [];
			if(m > 0) tmp = [wDico.d[wDico.i].slice(0, m)]; // partie de gauche
			if(m < wDico.d[wDico.i].length - 1) tmp = tmp.concat([wDico.d[wDico.i].slice(m + 1)]); // Partie de droite
			var tmpLength = tmp.length;

			if(wDico.i < wDico.d.length - 1) tmp = tmp.concat(wDico.d.slice(wDico.i + 1)); // Ajoute les éléments restant après le sous tableau en cours
			if(wDico.i > 0) wDico.d = wDico.d.slice(0, wDico.i).concat(tmp);// Ajoute les éléments restant avant le sous tableau en cours
			else wDico.d = tmp.slice(0);

			if(tmpLength == 2) wDico.i++; // on a dédoublé un élément donc il faut augmenter iWorking pour le prendre en compte
			else if(tmpLength == 0) wDico.i--; // on a supprimé un élément donc il faut diminuer iWorking pour le prendre en compte
		}
		else {
			wDico.reponse = wDico.d[wDico.i][0];
			wDico.d = wDico.d.slice(0, wDico.i).concat(wDico.d.slice(wDico.i + 1)); // On supprime le sous tableau désormais inutile
			wDico.i--; // on a supprimer un élément donc il faut diminuer iWorking pour le prendre en compte
		}
		testPwd(wDico);
	}
	else {
		wDico.reponse = 'Not found';
		wDico.dom.html(formatResult(wDico));
	}
}
// Teste le mot central récursivement
// Renvoie le mot trouvé, sinon renvoie 'not found'
function testDichotomie(imdp) {
	var wDico = {d: [dico.slice(0)], 
				 i: 0, 
				 dateStart: Date.now(), 
				 tempsTotal: 0,
				 isGood: false, 
				 nbTest: 0, 
				 p: imdp,
				 reponse: '', 
				 dom: $('#resultat2'), 
				 next: testDichotomieStep,
				 start: testDichotomie};
	testDichotomieStep(wDico);
}


function testDichotomie2Step(wDico) {
	if(wDico.nbTest < dico.length) {
		if(wDico.i >= wDico.reponses.length) {
			if(wDico.d[wDico.iTable].length > 3) {
				var m = Math.floor(wDico.d[wDico.iTable].length / 2); // Recupere l'indice central du sous tableau courant

				// Divise le sous tableau en deux en excluant les éléments début/milieu/fin
				var tmp = [];
				if(m > 1) tmp = [wDico.d[wDico.iTable].slice(1, m)]; // Partie gauche
				if(m < wDico.d[wDico.iTable].length - 2) tmp = tmp.concat([wDico.d[wDico.iTable].slice(m + 1, wDico.d[wDico.iTable].length - 1)]); // Partie droite
				var tmpLength = tmp.length;

				if(wDico.iTable < wDico.d.length - 1) tmp = tmp.concat(wDico.d.slice(wDico.iTable + 1)); // Ajoute les éléments restant après le sous tableau en cours
				if(wDico.iTable > 0) wDico.d = wDico.d.slice(0, wDico.iTable).concat(tmp);// Ajoute les éléments restant avant le sous tableau en cours
				else wDico.d = tmp.slice(0);

				wDico.iTable += tmpLength; // Pour passer au tableau suivant il faut aussi passer le(s) nouveau(x) sous tableau créé
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
function testDichotomie2(imdp) {
	var wDico = {d: [dico.slice(0)],
				 i: 0, 
				 dateStart: Date.now(),
				 tempsTotal: 0,
				 isGood: false,
				 nbTest: 0,
				 p: imdp,
				 reponse: '', 
				 reponses: [dico[0], dico[Math.floor(dico.length / 2)], dico[dico.length - 1]], 
				 iTable: 0, 
				 dom: $('#resultat3'), 
				 next: testDichotomie2Step,
				 start: testDichotomie2};
	testDichotomie2Step(wDico);
}