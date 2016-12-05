- Instructions d'installation, de déploiement et de configuration de l'application :

Game of Go est à utiliser sous Mozilla Firefox afin d'avoir accès à toutes les fonctionnalités du jeu (notamment à la sauvegarde).


- Etat d'avancement du jeu (10 lignes maximum) :

Game of Go est une application permettant de jouer au jeu de go et proposant quelques fonctionnalités supplémentaires.
Les règles de base du jeu de go ont été codés : la capture, le suicide (ainsi que son cas particulier --> le joueur peut poser son pion sur une position de suicide s'il capture une chaîne adverse), la répétition, les handicaps (possibilité de jouer avec des handicaps si les joueurs ont un niveau différent), les règles provoquant la fin de partie (un des joueurs abandonne, les deux joueurs passent successivement, le goban est rempli et le temps de jeu est écoulé)et le calcul du score (en fonction du nombre de pions encore sur le goban et des territoires (définis)).
Le joueur peut également sauvegarder sa partie (à l'aide de cookies) et la reprendre plus tard. 
Il peut jouer contre un adversaire ou contre une IA (qui cherchera dans un premier temps à établir un territoire avant de passer à l'attaque ou de consolider ses territoires suivant la situation) dans l'univers de Game of Thrones. Le joueur a le choix entre quatre familles qui ont chacune un "pouvoir spécial" utilisable deux fois pendant la partie. Il peut également changer la taille du goban suivant son envie (petit, moyen, grand) une fois arrivé en jeu. 
    

- Sources :

http://jeudego.org/_php/regleGo_intro.php - règles du jeu de go
https://fr.wikipedia.org/wiki/Jeu_de_go - généralités sur le jeu de go
http://jeudego.org/_php/_mori/mori.php - exercices sur le jeu de go
http://francois.mizessyn.pagesperso-orange.fr/JeuDeGo/yogo/de.htm - notions avancées sur le jeu de go
https://en.wikipedia.org/wiki/Monte_Carlo_method - étude de la méthode de Monte-Carlo
Recherche sélective et génération automatique de programmes de Tristan CAZENAVE - étude sur l'IA
https://en.wikipedia.org/wiki/Computer_Go - l'IA dans le jeu de go
https://fr.wikipedia.org/wiki/Strat%C3%A9gie_et_tactique_du_go - tactiques du jeu / reprise des prises de décision pour l'IA


- Mise en avant des fonctionnalités supplémentaires :

Game of Go propose de rendre le jeu un peu plus dynamique en ajoutant des "pouvoirs" selon la famille choisie. Chaque joueur peut utiliser deux fois son pouvoir dans une partie. Cela donne une nouvelle dimension stratégique au jeu.
De même, l'ajout d'un temps de jeu personnel après le temps de jeu réglementaire oblige les joueurs à poser leurs pions plus rapidement ce qui rend le jeu plus dynamique et la moindre erreur pourra être immédiatement sanctionnée. (Ces temps sont utilisés pendant les compétitions de jeu de go)
Game of Go essaye de proposer des règles approfondies du jeu de go en retranscrivant des cas particuliers (cf : le cas particulier du suicide).
Enfin, l'IA est un plus non négligeable. Créée suivant des prises de décision propres au jeu de go, l'IA formera dans un premier temps des territoires en faisant des motifs de suicide dans les coins (zones stratégiques). Elle aura ensuite deux possibilités en fonction de ses points : si ces derniers sont inférieurs à ceux du joueur, elle l'attaquera ; sinon, elle créera de nouveaux territoires et consolidera ses points. De plus, elle se défendra si une de ses chaînes est en danger (s'il ne lui reste plus qu'une liberté) en posant un pion sur la liberté restante et elle attaquera le joueur si elle aperçoit une chaîne adverse en danger. 


