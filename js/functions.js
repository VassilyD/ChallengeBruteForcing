let dico = [];
let workingDico = [];
let nbTest = 0;
let reponse = '';
let isGood = false;
let dateStart = 0;

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
function testPwd(password = '', nextFonction = null, returnFonction = null) {
	if(password != '') {
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
	
		if(!isGood) {
			nbTest++;
			isGood = (password === 'ca');
			if(!isGood) {
				if(nextFonction != null) setTimeout(nextFonction, 1);
			} else {
				if(returnFonction != null) {
					reponse = password;
					setTimeout(returnFonction, 1);
				}
			}
		}
}

function formatResult() {
	var texte = '<h2>Un Par un : </h2>';
	texte += '<p>Mot de passe : ' + reponse + '<br>';
	texte += 'Trouvé en ' + nbTest + ' essais!<br>';
	texte += '(' + Math.floor((Date.now() - dateStart) / 1000) + ' secondes)</p>';
	dateStart = 0;
	nbTest = 0;
	isGood = false;
	reponse = '';
	return texte;
}

function testOneByOneFin() {
	$('#resultat1').html(formatResult());
	testDichotomie();
}
function testOneByOneStep() {
	var password = workingDico[0];
	workingDico = workingDico.slice(1);
	testPwd(password, testOneByOneStep, testOneByOneFin);
}
// Teste tous les mots du dictionnaire un par un
// Renvoie le mot trouvé, sinon renvoie 'not found'
function testOneByOne() {
	dateStart = Date.now();
	workingDico = dico.slice(0);
	testOneByOneStep();
/*	var length = dico.length;
	var i = 0;
	while(i < length && !testPwd(dico[i])) {
		i++;
	}
*/
}

function testDichotomieFin() {
	$('#resultat2').html(formatResult());
	//testDichotomie();
}
function testDichotomieStep() {
	for(var i = 0; i < workingDico.length; i++) {
		var m = Math.floor(workingDico[i].length / 2);
		var password = workingDico[i][m];
		var tmp = workingDico[i].slice(0, m).concat(workingDico[i].slice(m + 1));
		tmp.concat(workingDico.slice(i + 1));
		workingDico = workingDico.slice(0, i).concat(tmp);
		console.log(workingDico);
		testPwd(password, null, testDichotomieFin);
	}
	if(!isGood) setTimeout(testDichotomieStep, 1);
}
// Teste le mot central récursivement
// Renvoie le mot trouvé, sinon renvoie 'not found'
function testDichotomie() {
	dateStart = Date.now();
	workingDico = [dico.slice(0)];
	testDichotomieStep();
/*
	var length = dico.length;
	var tmp = [];
	var reponseTmp = '';
	tmp.push(dico);
	while(!isGood && nbTest < length) {
		var tmp2 = [];
		for(var i = 0; i < tmp.length; i++) {
			if(!isGood) {
				var iTest = Math.floor(tmp[i].length / 2);
				if(!testPwd(tmp[i][iTest])) {
					// Scinde le sous-tableau en 2 au niveau du milieu, milieu exclue
					tmp2.push(tmp[i].slice(0, iTest), tmp[i].slice(iTest + 1))
				}
				else reponseTmp = tmp[i][iTest];
			}
		}
		// Mise à jour du tableau de tableau de test
		tmp = [];
		for(var i = 0; i < tmp2.length; i++) tmp.push(tmp2[i]);
	}
	return (isGood)?reponseTmp:'not found';
*/
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