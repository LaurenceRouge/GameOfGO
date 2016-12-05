/** Classe de sauvegarde et de restauration d'une partie du jeu de Go.
*/
function CSave()
{
  // Données sauvegardées
  // Les positions des pierres dans le jeu
  this.SavedGoban = null;

  // Le prochain joueur à jouer
  this.NextPlayer = 'n';
  
  //Le nom du cookie qui contient les données standard
  this.CookieName = 'partie';

  //Le nom du cookie qui contient les données supplémentaires
  this.CookieExtName = 'partie_ext'
}

/** La méthode vérifie si une partie est déjà enregistrée.

  \return
  La méthode retourne true si une partie précédente est enregistrée, sinon false.
*/
CSave.prototype.LastGameExist = function()
{
  var valret = true;

  //Vérifier s'il existe une partie enregistrée
  if(this.getCookie(this.CookieName) == null)
  {
    valret = false;
  }

  return valret;
}

/** La méthode récupère les données sauvegardées de la partie précédente.
  La méthode lit le fichier de sauvegarde "partie.txt" et met à jour les propriétés Lines et NextPlayer.

  \param [in] {CGoGame} iGo Le jeu de go à mettre à jour

  \return
  La méthode ne retourne pas de valeur.
*/
CSave.prototype.GetData = function(iGo)
{
  this.ReadCookies(iGo);
}

/** La méthode sauvegarde les données de la partie en cours.
  La méthode écrit les données de la partie en cours dans le fichier de sauvegarde "partie.txt".

  \param [in] {string} iDataGame Les données de la grille (emplacement des pierres sur le goban)
  \param [in] {int} iDataSize La taille du tableau iDataGame
  \param [in] {string} iNextPlayer Le prochain joueur à jouer
  \param [in] {int} iPlayerNb Le nombre de joueurs
  \param [in] {string} iNamePlayer1 Nom du joueur 1
  \param [in] {string} iNamePlayer2 Nom du joueur 2
  \param [in] {int} iHousePlayer1 La maison du joueur 1
  \param [in] {int} iHousePlayer2 La maison du joueur 2
  \param [in] {int} iChrono Le chono du jeu

  \return
  La méthode ne retourne pas de valeur.
  \note
  Si le fichier "partie.txt" contient déjà des données, ces dernières sont écrasées.
*/
CSave.prototype.SaveData = function(iDataGame, iDataSize, iNextPlayer, iPlayersNb, iNamePlayer1, iNamePlayer2, iHousePlayer1, iHousePlayer2, iChrono)
{
  // Sauvegarder les données
  this.WriteCookies(iDataGame, iDataSize, iNextPlayer, iPlayersNb, iNamePlayer1, iNamePlayer2, iHousePlayer1, iHousePlayer2, iChrono);
  
  // Signaler que les données ont bien été sauvegardées
  $.dialog({
    theme : 'black',
    title: false, // hides the title.
    content : 'The game was saved',
    container :'#alert',
  });
}

/** La méthode supprime les données de la partie en cours.
  La méthode supprime les données de la partie en cours dans le fichier de sauvegarde "partie.txt".

  \return
  La méthode ne retourne pas de valeur.
*/
CSave.prototype.DeleteData = function()
{
  //Supprimer les données des cookies
  this.DeleteCookies();
}

/** La méthode permet de créer les cookies de sauvegarde d'une partie 

  \param [in] {array} iDataGame Les données de la grille (emplacement des pierres sur le goban)
  \param [in] {int} iDataSize La taille du tableau iDataGame
  \param [in] {string} iNextPlayer Le prochain joueur à jouer
  \param [in] {int} iPlayerNb Le nombre de joueurs
  \param [in] {string} iNamePlayer1 Nom du joueur 1
  \param [in] {string} iNamePlayer2 Nom du joueur 2
  \param [in] {int} iHousePlayer1 La maison du joueur 1
  \param [in] {int} iHousePlayer2 La maison du joueur 2
  \param [in] {int} iChrono Le chono du jeu

  \return
  La méthode ne retourne pas de valeur.
*/
CSave.prototype.WriteCookies = function(iDataGame, iDataSize, iNextPlayer, iPlayersNb, iNamePlayer1, iNamePlayer2, iHousePlayer1, iHousePlayer2, iChrono)
{
  var Data = '';
  var ExpireDate = new Date();
  ExpireDate.setTime(ExpireDate.getTime() + 24 * 3600 * 1000);

  //1- Récupérer les données standard
  //Récupérer la ligne de données
  for( var i = 0 ; i < iDataSize ; i++)
  {
    for(var j = 0 ; j < iDataSize ; j++)
    {
      if(iDataGame[i][j] == 'n')
      {
        Data = Data + 'N';
      }
      else
      {
        Data = Data + iDataGame[i][j];
      }
    }
    Data = Data + "\n";
  }

  //Ajouter le prochain joueur 
  Data = Data + iNextPlayer;
  document.cookie = this.CookieName + ' = ' + escape(Data) + '; expires = ' + ExpireDate.toGMTString() + '; path = /';
 
  //2- Récupérer les données supplémentaires
  Data = iPlayersNb + "\n";
  Data = Data + iNamePlayer1 + "\n";
  Data = Data + iNamePlayer2 + "\n";
  Data = Data + iHousePlayer1 + "\n";
  Data = Data + iHousePlayer2 + "\n";
  Data = Data + iChrono + "\n";

  console.log(Data);
  document.cookie = this.CookieExtName + ' = ' + escape(Data) + '; expires = ' + ExpireDate.toGMTString() + '; path = /';
}

/** La méthode permet de lire les cookies de sauvegarde d'une partie 
  \param [in] {CGoGame} iGo Le jeu de go à mettre à jour 
  \return
  La méthode ne retourne pas de valeur.
*/
CSave.prototype.ReadCookies = function(iGo)
{
  var data;
  var dataExt;
  var Lines;
  var regSepCookie;
  var LinesNb;

  //Récupérer les données standard
  data = this.getCookie(this.CookieName);
  if(data == null)
  {
    return;
  }

  //Récupérer les lignes
  data = data.toLowerCase();
  regSepCookie = new RegExp('\n', 'g');
  Lines = data.split(regSepCookie);

  //Vérifier que le nb de lignes soit correct
  LinesNb = Lines.length-1;
  if((LinesNb != CGOBAN_SMALL) && (LinesNb != CGOBAN_MEDIUM) && (LinesNb != CGOBAN_LARGE))
  {
    return;
  }

  //Mettre à jour la taille du goban
  iGo.Goban.SetSize(LinesNb);

  //Mettre à jour le prochain joueur
  iGo.NextPlayer = Lines[Lines.length-1];

  //Mettre à jour le goban
  iGo.Goban.Grid = [];
  for( var i = 0 ; i < LinesNb ; i++)
  {
    iGo.Goban.Grid[i] = [];
    for(var j = 0 ; j < LinesNb ; j++)
    {
      iGo.Goban.Grid[i][j] = Lines[i].charAt(j);
    }
  }

  //Récupérer les données supplémentaires
  dataExt = this.getCookie(this.CookieExtName);
  if(dataExt == null)
  {
    return;
  }

  //Récupérer les lignes
  dataExt = dataExt.toLowerCase();
  regSepCookie = new RegExp('\n', 'g');
  Lines = dataExt.split(regSepCookie);

  //Mettre à jour le nb de joueurs
  iGo.SetPlayersNumber(parseInt(Lines[0]));

  //Mettre à jour le nom du joueur 1
  iGo.Players[0].SetName(Lines[1]);

  //Mettre à jour le nom du joueur 1
  iGo.Players[1].SetName(Lines[2]);

  //Mettre à jour la maison du joueur 1
  iGo.SetPlayerHouse(1, parseInt(Lines[3])+1);

  //Mettre à jour la maison du joueur 2
  iGo.SetPlayerHouse(2, parseInt(Lines[4])+1);

  //Mettre à jour le chrono
  duree = parseInt(Lines[5]);
}

/** La méthode permet de supprimer les cookies de sauvegarde d'une partie 
  \return
  La méthode ne retourne pas de valeur.
*/
CSave.prototype.DeleteCookies = function()
{
  var Data = ' ';
  var ExpireDate = new Date();

  // Initialiser la date d'expiration
  ExpireDate.setTime(ExpireDate.getTime() - 1);

   // Reprend les cookies et leurs donne une date invalide
   // Note : En le redéclarant avec une date d’expiration dépassée,
   // le cookie n’est plus disponible et l’appel à la fonction getCookie retourne null. 
  document.cookie = this.CookieName + ' = ' + escape(Data) + '; expires = ' + ExpireDate.toGMTString() + '; path = /';
  document.cookie = this.CookieExtName + ' = ' + escape(Data) + '; expires = ' + ExpireDate.toGMTString() + '; path = /';
}

CSave.prototype.getCookie = function(name)
{

  var regSepCookie;
  var cookies;
  var i = 0;
  var regInfo;
  var infos;

  if(document.cookie.length == 0)
    return null;

  regSepCookie = new RegExp('(; )', 'g');
  cookies = document.cookie.split(regSepCookie);

  for(i = 0; i < cookies.length; i++)
  {
    regInfo = new RegExp('=', 'g');
    infos = cookies[i].split(regInfo);
    if(infos[0] == name)
    {
      return unescape(infos[1]);
    }
  }
  return null;
}
