/** Classe principale du jeu de Go.
    Page où coder le jeu
*/
function CGoGame()
{
  // Gestion du plateau du jeu
  this.Goban = new CGoban();

  // Gestion de la sauvegarde et de restauration d'une partie
  this.Save = new CSave();

  //Nombre de joueur
  this.PlayersNumber = 2;

  // Le prochain Joueur 'n' ou 'b' 
  this.NextPlayer = 'n';

  //Partie avec les handicaps
  this.Handicaps = false;
  this.ValidHandicap = false;

  //Nombre de pierre placée pour le handicap 
  this.NbHandicap = 0;

  // Nombre de fois où le bouton pass a été cliqué
  this.PassNumber = 0;

  // Nombre maximum d'utilisation du pouvoir
  this.MaxPower = 2;

  // Nombre de passe sur le pouvoir N°1
  this.Power1NbPass = 0;

  // Nombre de passe sur le pouvoir N°2
  this.Power2NbPass = 0;

  //Le temps qu'il reste à jouer
  this.Chrono = 1800;

  /*tableau des joueurs qui reprend les informations sur les joueurs
  Par convention le joueur 0 est celui qui commence (pierres noires)*/
  this.Players = [];
  this.Players[0] = new CPlayer (this.MaxPower);
  this.Players[1] = new CPlayer (this.MaxPower);

  //tableau de maisons
  this.Houses = [];
  this.Houses[0] = new CHouse(0, "targaryen", 4); // Pouvoir 4 : le feu        -> Supprimer un pion adverse.
  this.Houses[1] = new CHouse(1, "baratheon", 1); // Pouvoir 1 : la foudre     -> Déplacer un pion adverse.
  this.Houses[2] = new CHouse(2, "lannister", 3); // Pouvoir 3 : (disparition) -> Le pion adverse change de camp.
  this.Houses[3] = new CHouse(3, "stark", 2);     // Pouvoir 2 : la neige      -> Le joueur adverse passe son tour.
}

/** La méthode met à jour le nombre de joueur

  \param [in] {int} iPlayersNumber Le nombre de joueurs Maximum 2

  \return
  La méthode ne retourne pas de valeur.
*/
CGoGame.prototype.SetPlayersNumber = function(iPlayersNumber)
{
  //Mise à jour du nb de joueurs 
  this.PlayersNumber = iPlayersNumber;

  //Si on a 1 joueur, le 2eme joueur est une IA
  if(this.PlayersNumber == 1)
  {
    this.Players[1].IA = true;
  }
}

/** La méthode met à jour la maison du joueur

  \param [in] {int} iPlayersNumber Le numéro du joueur 1 ou 2
  \param [in] {int} iHouseNumber Le numéro de la maison choisie entre 1 et 4

  \return
  La méthode ne retourne pas de valeur.
*/
CGoGame.prototype.SetPlayerHouse = function(iPlayersNumber, iHouseNumber)
{
  // Mettre à jour la maison du joueur
  this.Players[iPlayersNumber-1].SetHouse(this.Houses[iHouseNumber-1]);

  // Mettre à jour les pions du goban
  // Règle : le joueur 1 a toujours les pions noirs
  if(iPlayersNumber == 1)
  {
    this.Goban.BlackPawnImg = this.Houses[iHouseNumber-1].PawnPath;
  }
  else
  {
    this.Goban.WhitePawnImg = this.Houses[iHouseNumber-1].PawnPath;
  }
}

/** La méthode change de joueur

  \return
  La méthode ne retourne pas de valeur.
*/
CGoGame.prototype.ChangePlayer = function()
{
  if(this.NextPlayer == 'n')
  {
    this.NextPlayer = 'b';
    duree2 = 30;

    // Traiter l'IA
    // Règle : le joueur 2 (this.Players[1]) est le joueur IA.
    //         Voir SetPlayersNumber().
    if(this.Players[1].IA == true)
    {
      // Lancer la fonction de jeu en automatique
      // et "simuler" un OnStonePosition
      // Fonction de la classe CGoban
      if(this.Players[1].PlayAuto(this.Goban) == true)
      {
        // Remettre le compteur de pass à zéro
        globGoGame.PassNumber = 0;

        // Repositionner le prochain joueur
        this.NextPlayer = 'n';
        duree2 = 30;
      }
      else
      {
        // Signaler que le joueur ne peut pas jouer
        $.dialog({
          title : 'Artificial Intelligence',
          content : 'Impossible to play.<br/>I pass.',
          theme : 'black',
          container :'#alert',
        });

        // Incrémenter le compteur de Pass
        this.PassNumber++;

        if((this.PassNumber%2) == 0)
        {
          //Traiter la fin de partie
          this.End();
        }
        else
        {
          // Repositionner le prochain joueur
          this.NextPlayer = 'n';
          duree2 = 30;
        }
      }
    }
  }
  else
  {
    this.NextPlayer = 'n';
    duree2 = 30;
  }
}

/**La méthode affiche les informations sur le joueur.

  \param [in] {int} iPlayersNumber Le numéro du joueur (1 ou 2)

  \return
  La méthode ne retourne pas de valeur.
*/
CGoGame.prototype.DisplayPlayer = function(iPlayersNumber)
{
  var IdContent = document.getElementById("content");
  var IdPlayer = document.getElementById("player" + iPlayersNumber);
  var GobanMaxWidthPx = this.Goban.GetWidth(CGOBAN_LARGE);
  var Margin = 10; // Marge en pixels
  var SizeMaxPlayer = 0;
  var ImgHouse = null;
  var Scale = 0.0;
  var HouseWidthPx = 0;
  var HouseHeightPx = 0;
  var nameP = null;

  // Récupérer la largeur maximale pour afficher les infos du joueur
  SizeMaxPlayer = parseInt((IdContent.clientWidth - GobanMaxWidthPx) / 2) - Margin;

  // 1 - Mettre  à jour le style sur la div du joueur
  if(iPlayersNumber == 1)
  {
    IdPlayer.style.cssFloat="left";
  }
  else
  {
    IdPlayer.style.cssFloat="right";
  }

  IdPlayer.style.width = SizeMaxPlayer + "px";
  IdPlayer.style.height = this.Goban.HeightPx + "px";

  // 2 - Supprimer l'image de la maison dans la div du joueur
  ImgHouse = document.getElementById("house_player" + iPlayersNumber);
  if (ImgHouse != null)
  {
    IdPlayer.removeChild(ImgHouse);
  }

  // 3 - Supprimer le nom du joueur dans la div du joueur
  nameP = document.getElementById("nameP" + iPlayersNumber);
  if (nameP != null)
  {
    IdPlayer.removeChild(nameP);
  }

  // 4 Créer l'image de la maison du joueur
  Scale = parseFloat(SizeMaxPlayer / this.Players[iPlayersNumber - 1].House.WidthPx);
  HouseWidthPx = parseInt(Scale * this.Players[iPlayersNumber - 1].House.WidthPx);
  HouseHeightPx = parseInt(Scale * this.Players[iPlayersNumber - 1].House.HeightPx);

  ImgHouse = document.createElement("img");
  ImgHouse.setAttribute("id", "house_player" + iPlayersNumber);
  ImgHouse.setAttribute("src", this.Players[iPlayersNumber - 1].House.ActivedHousePath);
  ImgHouse.setAttribute("alt", "HousePlayer" + iPlayersNumber);
  ImgHouse.setAttribute("width", HouseWidthPx);
  ImgHouse.setAttribute("height", HouseHeightPx);

  nameP = document.createElement("div");
  nameP.setAttribute("id", "nameP" + iPlayersNumber);
  nameP.setAttribute("width", HouseWidthPx);
  nameP.setAttribute("height", HouseHeightPx);

  nameP.innerHTML = this.Players[iPlayersNumber-1].Name;

  IdPlayer.appendChild(ImgHouse);
  IdPlayer.appendChild(nameP);

}

/**La méthode affiche le nombre de pouvoir restant.

  \param [in] {int} iPlayersNumber Le numéro du joueur (1 ou 2)

  \return
  La méthode ne retourne pas de valeur.
*/
CGoGame.prototype.DisplayPower = function(iPlayersNumber)
{
  var BtnPower = document.getElementById("power" + iPlayersNumber);

  // Vérifier si le joueur peut encore utiliser son pouvoir
  if(this.Players[iPlayersNumber - 1].Power > 0)
  {
    // Changer la couleur du text du bouton
    BtnPower.style.color = "#ffffff";

    // Mettre à jour le texte du pouvoir
    BtnPower.innerHTML = "Cry (" + this.Players[iPlayersNumber - 1].Power + "/" + this.MaxPower + ")";
  }
  else
  {
    // Changer la couleur du text du bouton
    BtnPower.style.color = "#888888";

    // Mettre à jour le texte du pouvoir
    BtnPower.innerHTML = "Power";
  }
}

/** La méthode Affiche le jeu.

  \return
  La méthode ne retourne pas de valeur.
*/
CGoGame.prototype.Display = function()
{
  // Afficher la partie (plateau, scores, joueurs, maisons)
  this.Goban.Display();

  this.DisplayPlayer(1);
  this.DisplayPlayer(2);

  this.DisplayPower(1);
  this.DisplayPower(2);
}

/** La méthode gère le passage au joueur suivant sans avoir joué.

  \return
  La méthode ne retourne pas de valeur.
*/

CGoGame.prototype.Pass = function()
{
  // Incrémenter le compteur de Pass
  this.PassNumber++;

  // Vérifier partie à handicap
  if(this.Handicaps == true)
  {
    this.ValidHandicap = true;
    if(this.NbHandicap <= 1)
    {
      $.dialog({
        title : 'HANDICAP',
        content : 'You have to put between 2 and 9 pieces !',
        theme : 'black',
        container :'#alert',
      });
    }
    else
    {
      //Réinitialiser les handicaps
      this.Handicaps = false;

      //Changer de joueur
      this.ChangePlayer();
    }
  }
  else
  { 
    if((this.PassNumber%2) == 0)
    {
      //Traiter la fin de partie
      this.End();
    }
    else
    {
      //Changer de joueur
      this.ChangePlayer();
    }
  }
}

/** La méthode gère la fin de la partie

  \return
  La méthode ne retourne pas de valeur.
*/
CGoGame.prototype.End = function()
{
  var PointsP1 = 0.0;
  var PointsP2 = 0.0;
  var Winner = 0; //PlayersNumber (0 et 1 ; ou 1 et 2) ou iPlayer ('n' ou 'b')

  $.dialog({
    title : false,
    content : 'This game is over',
    theme : 'black',
    container :'#alert',
  });
  //Calculer le points du joueur 1 
  //règle : par défaut le joueur 1 est toujours le joueur noir 'n'
  PointsP1 = this.Goban.CalcPoints('n', this.Players[0].House.AreaPath, true);

  //Calculer les points du joueur 2
  if(this.ValidHandicap == false)
  {
    PointsP2 = parseFloat(this.Goban.CalcPoints('b', this.Players[1].House.AreaPath, true)+7.5);
  }
  else 
  {
    PointsP2 = parseFloat(this.Goban.CalcPoints('b', this.Players[1].House.AreaPath, true))+parseFloat((this.NbHandicap*0.5));
  }

  if(PointsP2%2 == 0)
  {
    PointsP2 = parseFloat(PointsP2 + 0.5);
  }

  if(PointsP1>PointsP2)
  {
    Winner = this.Players[0].Name;
  }
  else if (PointsP2>PointsP1)
  {
    Winner = this.Players[1].Name;
  }

  $.dialog({
    title : 'GAME OVER',
    content : this.Players[0].Name + ' score : ' + PointsP1 + '<br/>' + this.Players[1].Name + ' score : ' + PointsP2 + '<br/>And the true King is ...... '+ Winner,
    theme : 'black',
    container :'#alert',
  });

  //Afficher les points et le vainqueur 

  //Arrêter la partie
  
  //Supprimer les données sauvegardées
  this.Save.DeleteData();

  //Demander à l’utilisateur s’il souhaite rejouer
}

/** La méthode active le pouvoir du joueur.

  \param [in] {int} iPlayersNumber Le numéro du joueur 1 ou 2

  \return
  La méthode ne retourne pas de valeur.
*/
CGoGame.prototype.ActivatePower = function(iPlayersNumber)
{
  var BtnPower = document.getElementById("power" + iPlayersNumber);
  var Opponent = '';
  var OpponentNumber = 0;
  var PowerNumber = 0;
  var PowerImg = '';

  // Récupérer l'adversaire
  if(iPlayersNumber == 1)
  {
    // Règle : le joueur 1 est toujours le noir
    // Joueur noir -> adversaire blanc
    Opponent = 'b';
    OpponentNumber = 1;
  }
  else if(iPlayersNumber == 2)
  {
    Opponent = 'n';
    OpponentNumber = 0;
  }
  else
  {
    return;
  }

  // Vérifier si le joueur peut encore utiliser son pouvoir
  if(this.Players[iPlayersNumber - 1].Power <= 0)
  {
    return;
  }

  // Vérifier si nous sommes en mode handicap
  if(this.Handicaps == true)
  {
    return;
  }

  // Vérifier si s'est bien a son tour de jouer
  if(this.NextPlayer == Opponent)
  {
    $.dialog({
      title : 'STROKE',
      content : 'It is not your turn !',
      theme : 'black',
      container :'#alert',
    });
    return;
  }

  // Signaler que le pouvoir du joueur est activé
  this.Players[iPlayersNumber - 1].PowerActived = true;

  // Changer la couleur du text du bouton
  BtnPower.style.color = "#ffd700";

  // Récupérer le numéro du pouvoir
  PowerNumber = this.Players[iPlayersNumber - 1].House.PowerNumber;
  switch(PowerNumber)
  {
    case 1:
      document.getElementById("audio2").setAttribute('src', 'audios/baratheon/pouvoirBaratheon.wav');
      break;

    case 2:
      document.getElementById("audio2").setAttribute('src', 'audios/stark/pouvoirStark.wav');
      break;

    case 3:
      document.getElementById("audio2").setAttribute('src', 'audios/lannister/pouvoirLannister.wav');
      break;

    case 4:
      document.getElementById("audio2").setAttribute('src', 'audios/targaryen/pouvoirTargaryen.wav');
      break;
  }
  document.getElementById("audio2").play();
  // Récupérer l'image du pion associé au pouvoir
  PowerImg = this.Players[OpponentNumber].House.PowerImg(PowerNumber);

  // Afficher le pouvoir sur le goban
  this.Goban.DisplayPower(Opponent, PowerImg);
}

/** La méthode désactive le pouvoir du joueur.

  \param [in] {int} iPlayersNumber Le numéro du joueur 1 ou 2

  \return
  La méthode ne retourne pas de valeur.
*/
CGoGame.prototype.DeactivatePower = function(iPlayersNumber)
{
  // Signaler que le pouvoir du joueur est désactivé
  this.Players[iPlayersNumber - 1].PowerActived = false;

  // Réafficher le goban
  this.Goban.Display();
}

/** La méthode vérifie si le pouvoir du joueur est activé.

  \return
  La méthode retourne true si le pouvoir est activé, sinon false.
*/
CGoGame.prototype.PowerActivated = function()
{
  var PlayersNumber = 0;

  // Récupérer le numéro du joueur
  if(this.NextPlayer == 'b')
  {
    PlayersNumber = 1;
  }

  return this.Players[PlayersNumber].PowerActived;
}

/** La méthode utilise le pouvoir du joueur.

  \param [in] {int} iLine  Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn  Numéro de la colonne (débute à 0).

  \return
  La méthode ne retourne pas de valeur.
*/
CGoGame.prototype.UsePower = function(iLine, iColumn)
{
  var PlayersNumber = 1;
  var PowerNumber = 0;
  var PowerUsed = false;

  // Vérifier si le pouvoir du joueur est activé
  if(this.PowerActivated() == false)
  {
    return;
  }

  // Récupérer le numéro du joueur
  if(this.NextPlayer == 'b')
  {
    PlayersNumber = 2;
  }

  // Récupérer le numéro du pouvoir
  PowerNumber = this.Players[PlayersNumber - 1].House.PowerNumber;

  // Utiliser le pouvoir
  switch(PowerNumber)
  {
    case 1:
      PowerUsed = this.UsePower1(PlayersNumber, iLine, iColumn);
      break;

    case 2:
      PowerUsed = this.UsePower2(PlayersNumber, iLine, iColumn);
      break;

    case 3:
      PowerUsed = this.UsePower3(PlayersNumber, iLine, iColumn);
      break;

    case 4:
      PowerUsed = this.UsePower4(PlayersNumber, iLine, iColumn);
      break;

    default :
      PowerUsed = true;
      break;
  }

  if(PowerUsed == false)
  {
    return;
  }

  // Décrémenter le nombre d'utilisation du pouvoir
  this.Players[PlayersNumber - 1].Power --;

  // Désactiver le pouvoir
  this.DeactivatePower(PlayersNumber);

  // Réafficher le bouton
  this.DisplayPower(PlayersNumber);
}

/** La méthode gère le pouvoir n°1 : Déplacement d'un pion adverse.

  \param [in] {int} iPlayersNumber Le numéro du joueur 1 ou 2.
  \param [in] {int} iLine          Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn        Numéro de la colonne (débute à 0).

  \note
  La methode est une sous-méthode de la méthode UsePower().

  \return
  La méthode retourne true si le pouvoir a été utilisé, sinon false.
*/
CGoGame.prototype.UsePower1 = function(iPlayersNumber, iLine, iColumn)
{
  var valret = false;
  var NextPlayer = '';
  var Opponent = '';
  var OpponentNumber = 0;
  var PowerImg = '';

  if(iPlayersNumber == 1)
  {
    // Règle : le joueur 1 est toujours le noir
    NextPlayer = 'n';
    Opponent = 'b';
    OpponentNumber = 1;
  }
  else
  {
    NextPlayer = 'b';
    Opponent = 'n';
    OpponentNumber = 0;
  }

  if(this.Power1NbPass == 0)
  {
    // Vérifier si le pion sélectionné est bien un pion adverse
    if(this.Goban.Grid[iLine][iColumn] == Opponent)
    {
      // Effacer le pion de l'adversaire
      this.Goban.Grid[iLine][iColumn] = ' ';

      // Réafficher la grille
      this.Goban.Display();

      // Récupérer l'image du pion associé au pouvoir
      PowerImg = this.Players[OpponentNumber].House.PowerImg(1);

      // Réafficher le pouvoir
      this.Goban.DisplayPower(Opponent, PowerImg);

      // Incrémenter le nombre de passe
      this.Power1NbPass ++;
    }
    else
    {
      $.dialog({
        title : 'BATTLE CRY',
        content : 'You have to choose an enemy piece',
        theme : 'black',
        container :'#alert',
      });
    }
  }
  else
  {
    // Vérifier si l’intersection est vide
    if(this.Goban.CrossingIsEmpty(iLine, iColumn) == true)
    {
      // Mettre à jour la position du pion adverse
      this.Goban.Grid[iLine][iColumn] = Opponent;

      // Réafficher la grille
      this.Goban.Display();

      // Réinitialiser le nombre de passe
      this.Power1NbPass = 0;

      // Changer de joueur
      this.ChangePlayer();

      // Mettre à jour la valeur de retour
      valret = true;
    }
    else
    {
      $.dialog({
        title : 'STROKE',
        content : 'The intersection is already taken',
        theme : 'black',
        container :'#alert',
      });
    }
  }

  return valret;
}

/** La méthode gère le pouvoir n°2 : Le joueur adverse passe son tour.

  \param [in] {int} iPlayersNumber Le numéro du joueur 1 ou 2.
  \param [in] {int} iLine          Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn        Numéro de la colonne (débute à 0).

  \note
  La methode est une sous-méthode de la méthode UsePower().

  \return
  La méthode retourne true si le pouvoir a été utilisé, sinon false.
*/
CGoGame.prototype.UsePower2 = function(iPlayersNumber, iLine, iColumn)
{
  var valret = false;
  var NextPlayer = '';
  var Opponent = '';
  var OpponentNumber = 0;
  var PowerImg = '';

  if(iPlayersNumber == 1)
  {
    // Règle : le joueur 1 est toujours le noir
    NextPlayer = 'n';
    Opponent = 'b';
    OpponentNumber = 1;
  }
  else
  {
    NextPlayer = 'b';
    Opponent = 'n';
    OpponentNumber = 0;
  }

  // Vérifier si l’intersection est vide
  if(this.Goban.CrossingIsEmpty(iLine, iColumn) == true)
  {
    // Vérifier si le joueur a joué cette position à son dernier tour 
    if((this.Players[iPlayersNumber - 1].OldPosition.Line == iLine) && (this.Players[iPlayersNumber - 1].OldPosition.Column == iColumn))
    {
      $.dialog({
        title : 'STROKE',
        content : "You can't play twice the same position",
        theme : 'black',
        container :'#alert',
      });
    }
    else
    {
      //Mettre à jour la dernière position du joueur 
      this.Players[iPlayersNumber - 1].OldPosition.Line = iLine;
      this.Players[iPlayersNumber - 1].OldPosition.Column = iColumn;

      //Vérifier si l’emplacement est autorisé 
      if(this.Goban.StonePosition(NextPlayer, iLine, iColumn) == true)
      {
        // Réafficher la grille
        this.Goban.Display();

        if(this.Power2NbPass == 0)
        {
          // Récupérer l'image du pion associé au pouvoir
          PowerImg = this.Players[OpponentNumber].House.PowerImg(2);

          // Réafficher le pouvoir
          this.Goban.DisplayPower(Opponent, PowerImg);

          // Incrémenter le nombre de passe
          this.Power2NbPass ++;
        }
        else
        {
          // Réinitialiser le nombre de passe
          this.Power2NbPass = 0;

          // Changer de joueur
          this.ChangePlayer();

          // Mettre à jour la valeur de retour
          valret = true;
        }
      }
      else
      {
        $.dialog({
          title : 'STROKE',
          content : 'Impossible move (YOU COMMIT SUICIDE !!)',
          theme : 'black',
          container :'#alert',
        });
      }
    }
  }
  else
  {
    $.dialog({
      title : 'STROKE',
      content : 'The intersection is already taken',
      theme : 'black',
      container :'#alert',
    });
  }

  return valret;
}

/** La méthode gère le pouvoir n°3 : Le pion adverse change de camp.

  \param [in] {int} iPlayersNumber Le numéro du joueur 1 ou 2.
  \param [in] {int} iLine          Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn        Numéro de la colonne (débute à 0).

  \note
  La methode est une sous-méthode de la méthode UsePower().

  \return
  La méthode retourne true si le pouvoir a été utilisé, sinon false.
*/
CGoGame.prototype.UsePower3 = function(iPlayersNumber, iLine, iColumn)
{
  var valret = false;
  var NextPlayer = '';
  var Opponent = '';

  // Vérifier si le pion sélectionné est bien un pion adverse
  if(iPlayersNumber == 1)
  {
    // Règle : le joueur 1 est toujours le noir
    NextPlayer = 'n';
    Opponent = 'b';
  }
  else
  {
    NextPlayer = 'b';
    Opponent = 'n';
  }

  if(this.Goban.Grid[iLine][iColumn] == Opponent)
  {
    // Changer le pion de l'adversaire
    this.Goban.Grid[iLine][iColumn] = ' ';

    //Vérifier si l’emplacement est autorisé 
    if(this.Goban.StonePosition(NextPlayer, iLine, iColumn) == true)
    {
      // Réafficher la grille
      this.Goban.Display();

      // Changer de joueur
      this.ChangePlayer();

      // Mettre à jour la valeur de retour
      valret = true;
    }
    else
    {
      this.Goban.Grid[iLine][iColumn] = Opponent;
      $.dialog({
        title : 'STROKE',
        content : 'Impossible move (YOU COMMIT SUICIDE !!)',
        theme : 'black',
        container :'#alert',
      });
    }
  }
  else
  {
    $.dialog({
      title : 'BATTLE CRY',
      content : 'You have to choose an enemy piece',
      theme : 'black',
      container :'#alert',
    });
  }

  return valret;
}

/** La méthode gère le pouvoir n°4 : Supprimer un pion adverse.

  \param [in] {int} iPlayersNumber Le numéro du joueur 1 ou 2.
  \param [in] {int} iLine          Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn        Numéro de la colonne (débute à 0).

  \note
  La methode est une sous-méthode de la méthode UsePower().

  \return
  La méthode retourne true si le pouvoir a été utilisé, sinon false.
*/
CGoGame.prototype.UsePower4 = function(iPlayersNumber, iLine, iColumn)
{
  var valret = false;
  var Opponent = '';

  // Vérifier si le pion sélectionné est bien un pion adverse
  if(iPlayersNumber == 1)
  {
    // Règle : le joueur 1 est toujours le noir
    Opponent = 'b';
  }
  else
  {
    Opponent = 'n';
  }

  if(this.Goban.Grid[iLine][iColumn] == Opponent)
  {
    // Changer le pion de l'adversaire
    this.Goban.Grid[iLine][iColumn] = ' ';

    // Réafficher la grille
    this.Goban.Display();

    // Changer de joueur
    this.ChangePlayer();

    // Mettre à jour la valeur de retour
    valret = true;
  }
  else
  {
    $.dialog({
      title : 'BATTLE CRY',
      content : 'You have to choose an enemy piece',
      theme : 'black',
      container :'#alert',
    });
  }

  return valret;
}
