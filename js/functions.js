let dico = [];
let nbTest = 0;
let reponse = '';
let isGood = false;

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

function testPwd(password = '') {
	if(password != '') {
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
	
	nbTest++;
	isGood = (password === 'resolu');
	return isGood;
}

function testOneByOne() {
	var length = dico.length;
	var i = 0;
	while(i < length && !testPwd(dico[i])) {
		i++;
	}

	return (isGood)?dico[i]:'not found';
}

function testDichotomie() {
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
					tmp2.push(tmp[i].slice(0, iTest), tmp[i].slice(iTest + 1))
				}
				else reponseTmp = tmp[i][iTest];
			}
		}
		tmp = [];
		for(var i = 0; i < tmp2.length; i++) tmp.push(tmp2[i]);
	}
	return (isGood)?reponseTmp:'not found';
}

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
				if(testPwd(tmp[i][iTest])) reponseTmp = tmp[i][iTest];
				else if(testPwd(tmp[i][tmp[i].length - 1])) reponseTmp = tmp[i][tmp[i].length - 1];
				else if(testPwd(tmp[i][0])) reponseTmp = tmp[i][0];
				else {
					tmp2.push(tmp[i].slice(1, iTest), tmp[i].slice(iTest + 1, tmp[i].length - 1))
				}
			}
		}
		tmp = [];
		for(var i = 0; i < tmp2.length; i++) tmp.push(tmp2[i]);
	}
	return (isGood)?reponseTmp:'not found';
}