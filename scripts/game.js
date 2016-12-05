// Déclaration des variables globales
var globPlayersHouse = 1; //Le nombre de maisons sélectionnées 
var globHouseSelected = 0;
var globGoGame = new CGoGame();

/* gestion du volume sonore */

document.getElementById("audioPlayer").volume = 0.5;
document.getElementById("player").volume = 0.25;
document.getElementById("audio2").volume = 0.25;
document.getElementById("sonUp").style.display = "none";

document.getElementById('mute').addEventListener('click', function (e)
{
  document.getElementById("mute").style.display = "none";
  document.getElementById("sonUp").style.display = "";
  document.getElementById("audioPlayer").volume = 0;
  document.getElementById("player").volume = 0;
  document.getElementById("audio2").volume = 0;
}, false);

document.getElementById('sonUp').addEventListener('click', function (e)
{
  document.getElementById("mute").style.display = "";
  document.getElementById("sonUp").style.display = "none";
  document.getElementById("audioPlayer").volume = 0.5;
  document.getElementById("player").volume = 0.25;
  document.getElementById("audio2").volume = 0.25;
}, false);

/*globGoGame.Save.DeleteCookies();*/
/** La fonction traite le passage à la "page" des joueurs ou du jeu.
 
  \return
  La fonction ne retourne pas de valeur.
*/

function GoToPlayers()
{
  // Vérifier s'il existe une partie sauvegardée
  if (globGoGame.Save.LastGameExist() == true)
  {
    // Demander si le joueur souhaite continuer cette partie
    $.confirm({
      title: 'SAVE',
      content: 'A game is already ongoing. Do you want to join it ?',
      confirmButton: 'Yes i agree',
      cancelButton: 'NO never !',
      theme :'black',
      container : '#save',
      confirm: function(){
        // Récuperer les données de la partie
        globGoGame.Save.GetData(globGoGame);

        // Afficher la partie
        globGoGame.Display();

        //Lancer le compteur
        t();

        // Masquer la "page" d'introduction et afficher le jeu
        $(".accueil").fadeOut('slow').queue(function() {
        $("#game").fadeIn('slow');
        });
      },
      cancel: function(){
        // Masquer la "page" d'introduction et afficher les joueurs
        $(".accueil").fadeOut('slow').queue(function() {
        $(".choiceGame").fadeIn('slow');
        });
      }
    });
    /*if (window.confirm('Voulez-vous reprendre la partie ?') == true)
    {
      // Récuperer les données de la partie
      globGoGame.Save.GetData(globGoGame);

      // Afficher la partie
      globGoGame.Display();

      //Lancer le compteur
      t();

      // Masquer la "page" d'introduction et afficher le jeu
      $(".accueil").fadeOut('slow').queue(function() {
      $("#game").fadeIn('slow');
      });
    }
    else
    {
      // Masquer la "page" d'introduction et afficher les joueurs
      $(".accueil").fadeOut('slow').queue(function() {
      $(".choiceGame").fadeIn('slow');
      });
    }*/
  }
  else
  {
    // Masquer la "page" d'introduction et afficher les joueurs
    $(".accueil").fadeOut('slow').queue(function() {
    $(".choiceGame").fadeIn('slow');
    });
  }
}

/** La fonction traite le passage à la "page" des maisons.

  \param [in] {int} iPlayersNumber  Nombre de joueurs.

  \return
  La fonction ne retourne pas de valeur.
*/
function GoToHouse(iPlayersNumber)
{
  // Mettre à jour le nombre de joueurs
  globGoGame.SetPlayersNumber(parseInt(iPlayersNumber));

  // Masquer la "page" des joueurs et afficher les maisons
  $(".choiceGame").fadeOut('slow').queue(function() {
  $(".choiceHouse").fadeIn('slow');
  });
  $.confirm({
    keyboardEnabled: true,
    title: false,
    content: ' Choose a name Player 1 : <br/> <input id="name1" type="text"/> <br/> Choose a name Player 2 : <br/> <input id="name2" type="text"/>', 
    theme:'black',
    cancelButton: false,
    container:'#alertHouse',
    confirm: function(){
      globGoGame.Players[0].SetName(this.$b.find('#name1').val());
      globGoGame.Players[1].SetName(this.$b.find('#name2').val());
      // there is a input element inside the content.
      if(globGoGame.Players[0].Name.length == 0 || globGoGame.Players[1].Name.length == 0){
      // if the value is empty, dont close the dialog. (and maybe show some error.)
        return false;
      }
    }
  });
}

function debutDeJeuJ1()
{
  var random = Math.floor((Math.random()*3)+1);
  switch(globGoGame.Players[0].House.HouseNb){
    case 0 :
      document.getElementById("player").setAttribute('src', 'audios/targaryen/phraseTargaryen'+random+'.wav');
    break;
    case 1 :
      var player = document.getElementById("player").setAttribute('src', 'audios/baratheon/phraseBaratheon'+random+'.wav');
    break;
    case 3 :
      var player = document.getElementById("player").setAttribute('src', 'audios/stark/phraseStark'+random+'.wav');
    break;
    case 2 :
      var player = document.getElementById("player").setAttribute('src', 'audios/lannister/phraseLannister'+random+'.wav');
    break;
  }
  document.getElementById("player").play();
  document.getElementById("player").addEventListener("ended", function(){
    debutDeJeuJ2();
  }, true);
}

function debutDeJeuJ2()
{
  var random2 = Math.floor((Math.random()*3)+1);
  switch(globGoGame.Players[1].House.HouseNb){
    case 0 :
      document.getElementById("audio2").setAttribute('src', 'audios/targaryen/phraseTargaryen'+random2+'.wav');
    break;
    case 1 :
      document.getElementById("audio2").setAttribute('src', 'audios/baratheon/phraseBaratheon'+random2+'.wav');
    break;
    case 3 :
      document.getElementById("audio2").setAttribute('src', 'audios/stark/phraseStark'+random2+'.wav');
    break;
    case 2 :
      document.getElementById("audio2").setAttribute('src', 'audios/lannister/phraseLannister'+random2+'.wav');
    break;
  }
  document.getElementById("audio2").play();
}

/** Fonction de gestion des maisons et passage au jeu
  La fonction lance le jeu.

  \param [in] {int} iHouseNumber  Numéro de la maison.

  \return
  La fonction ne retourne pas de valeur.
*/
function OnSelectHouse(iHouseNumber, cssHouse)
{
  var HouseNumber = parseInt(iHouseNumber);

  // Vérifier si la maison a déjà été sélectionnée
  if(HouseNumber == globHouseSelected)
  {
    $.dialog({
      title : false,
      content : 'This house is already taken',
      theme : 'black',
      container :'#alertHouse',
    });
    return;
  }
  else
  {
    globHouseSelected = HouseNumber;    
    cssHouse.style.background = "transparent url(" + globGoGame.Houses[iHouseNumber - 1].ActivedHousePath + ") no-repeat scroll 0px 180px";
  }

  //Vérifier le nombre de passage dans la fonction pour associer la maison au joueur 
  if(globPlayersHouse == 1)
  {
    //Mise à jour de la maison du joueur
    globGoGame.SetPlayerHouse(globPlayersHouse, HouseNumber);
    
    //On incrémente le compteur de passage pour passer au joueur 2
    globPlayersHouse = globPlayersHouse+1;
  }
  else if(globPlayersHouse == 2)
  {
    //Mise à jour de la maison du joueur 
    globGoGame.SetPlayerHouse(globPlayersHouse, HouseNumber);
    //On repasse le compteur à 1
    globPlayersHouse = 1;
    
    //On demande au joueur s'il souhaite jouer avec des handicaps
    $.confirm({
      theme :'black',
      title: 'HANDICAP',
      content: 'Do you want to use handicaps ?',
      confirmButton: 'Yes !',
      cancelButton: 'NO never !',
      container : '#alertHouse',
      confirm: function(){
        //Mettre a jour la partie avec les handicaps
        globGoGame.Handicaps = true;
        // Afficher la nouvelle partie
        globGoGame.Display();
        // Masquer la "page" des maisons et afficher le jeu
        $(".choiceHouse").fadeOut('slow').queue(function() {
          $("#game").fadeIn('slow');
          //Lancer le compteur
          t();
          debutDeJeuJ1();
        });
      },
      cancel: function(){
      // Afficher la nouvelle partie
      globGoGame.Display();

      // Masquer la "page" des maisons et afficher le jeu
      $(".choiceHouse").fadeOut('slow').queue(function() {
        $("#game").fadeIn('slow');
        
        //Lancer le compteur
        t();
        debutDeJeuJ1();
      });
      }
    });
  }
}




/** La fonction traite le passage à la "page" d'aide.

  \return
  La fonction ne retourne pas de valeur.
*/
function GoToHelp()
{
  // Masquer la "page" du jeu et afficher l'aide
  document.getElementById("game").style.display = "none";
  document.getElementById("help").style.display = "";
}

/** La fonction traite le retour à la "page" du jeu.

  \return
  La fonction ne retourne pas de valeur.
*/
function ReturnGame()
{
  // Masquer la "page" d'aide et réafficher le jeu
  document.getElementById("help").style.display = "none";
  document.getElementById("game").style.display = "";
}

/** Fonction autorise la position d’une pierre ainsi que l’état de vie et de mort des pierres du plateau 

  \param [in] {int} iLine  Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn  Numéro de la colonne (débute à 0).

  \return
  La fonction ne retourne pas de valeur.
*/
function OnStonePosition(iLine, iColumn)
{
  var Line = parseInt(iLine);
  var Column = parseInt(iColumn);
  var NextPlayer = globGoGame.NextPlayer;
  var PlayerNb = 0; 

  //Récupérer le numéro du joueur 
  //Règle : le joueur noir est le joueur 0 par défaut
  if(NextPlayer == 'n')
  {
    PlayerNb = 1;
  }
  else
  {
    PlayerNb = 2;
  }

  // Remettre le compteur de Pass à zéro
  globGoGame.PassNumber = 0;

  // Vérifier si le pouvoir du joueur est activé
  if(globGoGame.PowerActivated() == true)
  {
    // Utiliser le pouvoir
    globGoGame.UsePower(Line, Column);

    return;
  }

  //Vérifier si l’intersection est vide
  if(globGoGame.Goban.CrossingIsEmpty(Line, Column) == true)
  {
    //Vérifier si le joueur a joué cette position à son dernier tour 
    if((globGoGame.Players[PlayerNb - 1].OldPosition.Line == Line) && (globGoGame.Players[PlayerNb - 1].OldPosition.Column == Column))
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
      //Vérifier si l’emplacement est autorisé 
      if(globGoGame.Goban.StonePosition(NextPlayer, Line, Column) == true)
      {
        // Remettre le compteur de pass à zéro
        globGoGame.PassNumber = 0;

        //Mettre à jour la dernière position du joueur 
        globGoGame.Players[PlayerNb - 1].OldPosition.Line = Line;
        globGoGame.Players[PlayerNb - 1].OldPosition.Column = Column;

        //Réafficher la grille
        globGoGame.Goban.Display();

        //Vérifier si on est en mode handicap
        if(globGoGame.Handicaps == true)
        {
          //Incrémenter le nb de handicaps
          globGoGame.NbHandicap++;

          //Tester le nb de handicaps max
          if(globGoGame.NbHandicap > 8)
          {
            //La mise en place des handicaps est terminée
            //Réinitialiser les handicaps
            //Démarrer la partie
            globGoGame.Handicaps = false;
            globGoGame.NbHandicap = 0;
            $.dialog({
              title : 'HANDICAP',
              content : "You reached the limit ! Your oppenent must play now !",
              theme : 'black',
              container :'#alert',
            });
            globGoGame.Pass();

          }
        }
        else
        {
          //Changer de joueur
          globGoGame.ChangePlayer();
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

    //Vérifier si le goban est rempli 
    if(globGoGame.Goban.GobanRempli() == true)
    {
      globGoGame.End();
    }
  }
}

/** Fonction passe le tour du joueur en cour.

  \return
  La fonction ne retourne pas de valeur.
*/
function Pass()
{
  globGoGame.Pass();
}

/** Fonction gère l'abandon du joueur.

  \return
  La fonction ne retourne pas de valeur.
*/
function Abort()
{
  globGoGame.End();
}

/** Fonction de sauvegarde de la partie en cours.

  \return
  La fonction ne retourne pas de valeur.
*/
function SaveGame()
{
  var DataGame = [];
  var DataSize = 0;
  var NextPlayer = '';
  var PlayersNb = 0;
  var NamePlayer1 = '';
  var NamePlayer2 = '';
  var HousePlayer1 = 0;
  var HousePlayer2 = 0;
  var Chrono = 0;

  //Récupérer le prochain joueur
  NextPlayer = globGoGame.NextPlayer;

  //Récupérer la taille du goban
  DataSize = globGoGame.Goban.Size;

  //Récupérer les données du jeu (DataGame)
  DataGame = globGoGame.Goban.Grid;

  //Récupérer le nb de joueurs
  PlayersNb = globGoGame.PlayersNumber;

  //Récupérer le nom du joueur 1
  NamePlayer1 = globGoGame.Players[0].Name;

  // Récupérer le nom du joueur 2
  NamePlayer2 = globGoGame.Players[1].Name;

  //Récupérer la maison du joueur 1
  HousePlayer1 = globGoGame.Players[0].House.HouseNb;

  // Récupérer la maison du joueur 2
  HousePlayer2 = globGoGame.Players[1].House.HouseNb;

  //Récupérer la valeur du chrono
  Chrono = globGoGame.Chrono;

  // Sauvegarder la partie en cours
  globGoGame.Save.SaveData(DataGame, DataSize, NextPlayer, PlayersNb, NamePlayer1, NamePlayer2, HousePlayer1, HousePlayer2, Chrono);
}

/** Fonction de restauration d'une partie.

  \return
  La fonction ne retourne pas de valeur.
*/
function RestoreGame()
{
  // Récupérer les données de la partie
  globGoGame.Save.GetData(globGoGame);

  // Afficher la nouvelle partie
  globGoGame.Display();
}

/** Fonction de modification de la taille du Goban.

  \param [in] {int} iGobanSize  Nouvelle Taille du Goban.

  \return
  La fonction ne retourne pas de valeur.
*/
function ChangeGobanSize(iGobanSize)
{
  // Récupérer le paramètre
  var GobanSize = parseInt(iGobanSize);

  // Réinitialiser la taille du goban
  globGoGame.Goban.SetSize(GobanSize);

  // Afficher la nouvelle partie
  globGoGame.Display();
}

/** Fonction d'activation du pouvoir d'un joueur.

  \param [in] {int} iPlayersNumber Le numéro du joueur 1 ou 2

  \return
  La fonction ne retourne pas de valeur.
*/
function OnActivatePower(iPlayersNumber)
{
  // Récupérer le paramètre
  var PlayersNumber = parseInt(iPlayersNumber);

  // Activer le pouvoir du joueur
  globGoGame.ActivatePower(PlayersNumber);
}
