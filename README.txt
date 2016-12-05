- Instructions d'installation, de d�ploiement et de configuration de l'application :

Game of Go est � utiliser sous Mozilla Firefox afin d'avoir acc�s � toutes les fonctionnalit�s du jeu (notamment � la sauvegarde).


- Etat d'avancement du jeu (10 lignes maximum) :

Game of Go est une application permettant de jouer au jeu de go et proposant quelques fonctionnalit�s suppl�mentaires.
Les r�gles de base du jeu de go ont �t� cod�s : la capture, le suicide (ainsi que son cas particulier --> le joueur peut poser son pion sur une position de suicide s'il capture une cha�ne adverse), la r�p�tition, les handicaps (possibilit� de jouer avec des handicaps si les joueurs ont un niveau diff�rent), les r�gles provoquant la fin de partie (un des joueurs abandonne, les deux joueurs passent successivement, le goban est rempli et le temps de jeu est �coul�)et le calcul du score (en fonction du nombre de pions encore sur le goban et des territoires (d�finis)).
Le joueur peut �galement sauvegarder sa partie (� l'aide de cookies) et la reprendre plus tard. 
Il peut jouer contre un adversaire ou contre une IA (qui cherchera dans un premier temps � �tablir un territoire avant de passer � l'attaque ou de consolider ses territoires suivant la situation) dans l'univers de Game of Thrones. Le joueur a le choix entre quatre familles qui ont chacune un "pouvoir sp�cial" utilisable deux fois pendant la partie. Il peut �galement changer la taille du goban suivant son envie (petit, moyen, grand) une fois arriv� en jeu. 
    

- Sources :

http://jeudego.org/_php/regleGo_intro.php - r�gles du jeu de go
https://fr.wikipedia.org/wiki/Jeu_de_go - g�n�ralit�s sur le jeu de go
http://jeudego.org/_php/_mori/mori.php - exercices sur le jeu de go
http://francois.mizessyn.pagesperso-orange.fr/JeuDeGo/yogo/de.htm - notions avanc�es sur le jeu de go
https://en.wikipedia.org/wiki/Monte_Carlo_method - �tude de la m�thode de Monte-Carlo
Recherche s�lective et g�n�ration automatique de programmes de Tristan CAZENAVE - �tude sur l'IA
https://en.wikipedia.org/wiki/Computer_Go - l'IA dans le jeu de go
https://fr.wikipedia.org/wiki/Strat%C3%A9gie_et_tactique_du_go - tactiques du jeu / reprise des prises de d�cision pour l'IA


- Mise en avant des fonctionnalit�s suppl�mentaires :

Game of Go propose de rendre le jeu un peu plus dynamique en ajoutant des "pouvoirs" selon la famille choisie. Chaque joueur peut utiliser deux fois son pouvoir dans une partie. Cela donne une nouvelle dimension strat�gique au jeu.
De m�me, l'ajout d'un temps de jeu personnel apr�s le temps de jeu r�glementaire oblige les joueurs � poser leurs pions plus rapidement ce qui rend le jeu plus dynamique et la moindre erreur pourra �tre imm�diatement sanctionn�e. (Ces temps sont utilis�s pendant les comp�titions de jeu de go)
Game of Go essaye de proposer des r�gles approfondies du jeu de go en retranscrivant des cas particuliers (cf : le cas particulier du suicide).
Enfin, l'IA est un plus non n�gligeable. Cr��e suivant des prises de d�cision propres au jeu de go, l'IA formera dans un premier temps des territoires en faisant des motifs de suicide dans les coins (zones strat�giques). Elle aura ensuite deux possibilit�s en fonction de ses points : si ces derniers sont inf�rieurs � ceux du joueur, elle l'attaquera ; sinon, elle cr�era de nouveaux territoires et consolidera ses points. De plus, elle se d�fendra si une de ses cha�nes est en danger (s'il ne lui reste plus qu'une libert�) en posant un pion sur la libert� restante et elle attaquera le joueur si elle aper�oit une cha�ne adverse en danger. 


