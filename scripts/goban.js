//Taille du goban (3 constantes)
const CGOBAN_SMALL = 9;
const CGOBAN_MEDIUM = 13;
const CGOBAN_LARGE = 19;

/** Classe de gestion d'une chaine Atari.
*/
function CAtari()
{
  this.Cellule = []; // Coordonnées des cellules (classe CCoordinate)
  this.Valid = true; // Signal si la chaine est une chaine atari valide (chaine sans liberté)
}

/** Classe de gestion du plateau du jeu de Go (Goban).
*/
function CGoban()
{
  // Taille du goban
  this.Size = CGOBAN_SMALL;

  // Largeur du goban en pixels
  this.WidthPx = 0;

  // Hauteur du goban en pixels
  this.HeightPx = 0;

  this.Empty = true;
  this.Grid = [];

  // Chemin d'accès à l'image du pion noir
  this.BlackPawnImg = "./images/black.png";

  // Chemin d'accès à l'image du pion blanc
  this.WhitePawnImg = "./images/white.png";

  // Initialiser la grille et les tailles en pixels
  this.SetSize(this.Size);
}

/** La méthode retourne la largeur en pixels du goban demandé
  
  \param [in] {int} iSize Taille du goban (3 valeurs CGOBAN_SMALL ; CGOBAN_MEDIUM ; CGOBAN_LARGE)
  
  \return
  La méthode retourne la largeur en pixels du goban demandé.
*/
CGoban.prototype.GetWidth = function(iSize) 
{
  var valret = 0;

  // Récupérer la largeur demandée
  switch(iSize)
  {
    case CGOBAN_SMALL : 
      valret = 332;
      break;

    case CGOBAN_MEDIUM : 
      valret = 464;
      break;

    case CGOBAN_LARGE : 
      valret = 662;
      break;
  }

  return valret;
}

/** La méthode retourne la hauteur en pixels du goban demandé
  
  \param [in] {int} iSize Taille du goban (3 valeurs CGOBAN_SMALL ; CGOBAN_MEDIUM ; CGOBAN_LARGE)
  
  \return
  La méthode retourne la hauteur en pixels du goban demandé.
*/
CGoban.prototype.GetHeigh = function(iSize) 
{
  var valret = 0;

  // Récupérer la hauteur demandée
  switch(iSize)
  {
    case CGOBAN_SMALL : 
      valret = 316;
      break;

    case CGOBAN_MEDIUM : 
      valret = 440;
      break;

    case CGOBAN_LARGE : 
      valret = 626;
      break;
  }

  return valret;
}

/** La méthode définit la taille du goban et réinitialise la grille avec la taille voulue
  
  \param [in] {string} iSize Taille du goban (3 valeurs CGOBAN_SMALL ; CGOBAN_MEDIUM ; CGOBAN_LARGE)
  
  \return
  La méthode ne retourne pas de valeur.
*/
CGoban.prototype.SetSize = function(iSize) 
{
  this.Size = iSize;
  this.Empty = true;
  this.Grid = [];
  
  // Définir les tailles en pixels
  this.WidthPx  = this.GetWidth(this.Size);
  this.HeightPx = this.GetHeigh(this.Size);

  // Initialisation de la grille vide
  for( var i = 0 ; i < this.Size ; i++)
  {
    this.Grid[i] = [];
    for(var j = 0 ; j < this.Size ; j++)
    {
      this.Grid[i][j] = ' ';
    }
  }
}

/** La méthode initialise le jeu après chargement de la sauvegarde.
  La méthode récupère la position des pierres noires et blanches sur le jeu.

  \param [in] {string} iStonesPosition  Positions des pierres sur le jeu.

  \return
  La méthode ne retourne pas de valeur.

  \note
  Avec la positions des pierres nous connaissons la taille du plateau (9x9, 13x13 ou 19x19).
*/
CGoban.prototype.InitGame = function(iStonesPosition)
{
  this.Empty = false;
}

/** La méthode affiche le goban
  \return
  La méthode ne retourne pas de valeur.

*/
CGoban.prototype.Display = function()
{
  var parent;
  var htmlGrille;
  var htmlLigne;
  var htmlCellule;
  var ObjSize;

  // 1- remove la table dans la div
  parent = document.getElementById("goban");
  htmlGrille = document.getElementById("tab");
  if (htmlGrille != null)
  {
    parent.removeChild(htmlGrille);
  }
  
  // 2- réécrire complètement la table

  parent = document.getElementById("goban");
  parent.style.background = "url(./images/gobans/goban-"+this.Size+".jpg)"
  parent.style.height = this.HeightPx+"px";
  parent.style.width = this.WidthPx+"px";
  htmlGrille = document.createElement("table");
  htmlGrille.style.paddingTop = "17px";
  htmlGrille.style.marginLeft = "18px";
  htmlGrille.setAttribute("id","tab");

  parent.appendChild(htmlGrille);

  for (var i = 0; i < this.Size; i++) 
  {
    htmlLigne = document.createElement("tr");
    
    for (var j = 0; j < this.Size; j++) 
    {
      htmlCellule = document.createElement("td");
      htmlCellule.setAttribute('id', 'L' + i + '_C' + j);

      htmlCellule.style.margin  = "0px";
      htmlCellule.style.padding = "0px";
      htmlCellule.style.border  = "0px";

      if (this.Grid[i][j] == 'n')
      {
        htmlCellule.style.background = "url("+this.BlackPawnImg+")";

      }
      else if (this.Grid[i][j] == 'b')
      {
        htmlCellule.style.background = "url("+this.WhitePawnImg+")";
      }

      htmlCellule.style.backgroundPosition = "center";
      htmlCellule.style.backgroundRepeat = "no-repeat";

      htmlCellule.setAttribute("onclick","OnStonePosition("+i+", "+j+")");
      ObjSize = 33;
      htmlCellule.style.width = ObjSize+"px";
      ObjSize = 31;
      htmlCellule.style.height = ObjSize+"px";
      htmlCellule.style.padding = "0 px";
      htmlLigne.appendChild(htmlCellule);
    }
    htmlGrille.appendChild(htmlLigne);
  }
}

/** La méthode vérifie si l'intersection est vide.

  \param [in] {int} iLine  Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn  Numéro de la colonne (débute à 0).

  \return
  La méthode retourne true si l'intersection et vide sinon false.
*/
CGoban.prototype.CrossingIsEmpty = function(iLine, iColumn)
{
  var valret = true;
  if(this.Grid[iLine][iColumn] == ' ')
  {
    valret = true;
  }
  else
  {
    valret = false;
  }
  return valret;
}

/** La méthode vérifie le joueur est autorisé à poser sa pierre à cette position.

  \param [in] {string} iPlayer  Le joueur en cours ('n' ou 'b').
  \param [in] {int} iLine  Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn  Numéro de la colonne (débute à 0).

  \return
  La fonction retourne true si la position est autorisée sinon false.
*/
CGoban.prototype.PositionAuthorized = function(iPlayer, iLine, iColumn)
{
  var valret = true;
  var opponent;

  //Initialiser l'adversaire
  if(iPlayer=='n')
  {
    opponent = 'b';
  }
  else if(iPlayer=='b')
  {
    opponent = 'n';
  }
  else
  {
    return false;
  }

  //Vérifier si la position est autorisée.

  //Première ligne
  if(iLine == 0)
  {
    if(iColumn == 0)
    {
      if ((this.Grid[iLine + 1][iColumn] == opponent) 
        && (this.Grid[iLine][iColumn + 1] == opponent))
      {
        valret = false;
      }
    }
    else if(iColumn == (this.Size-1))
    {
      if ((this.Grid[iLine + 1][iColumn] == opponent) 
        && (this.Grid[iLine][iColumn - 1] == opponent))
      {
        valret = false;
      }
    }
    else
    {
      if ((this.Grid[iLine + 1][iColumn] == opponent) 
        && (this.Grid[iLine][iColumn - 1] == opponent)
        && (this.Grid[iLine][iColumn + 1] == opponent))
      {
        valret = false;
      }
    }
  }

  //Dernière ligne
  else if(iLine == (this.Size-1))
  {
    if(iColumn == 0)
    {
      if ((this.Grid[iLine - 1][iColumn] == opponent) 
        && (this.Grid[iLine][iColumn + 1] == opponent))
      {
        valret = false;
      }
    }
    else if(iColumn == (this.Size-1))
    {
      if ((this.Grid[iLine - 1][iColumn] == opponent) 
        && (this.Grid[iLine][iColumn - 1] == opponent))
      {
        valret = false;
      }
    }
    else
    {
      if ((this.Grid[iLine - 1][iColumn] == opponent) 
        && (this.Grid[iLine][iColumn - 1] == opponent)
        && (this.Grid[iLine][iColumn + 1] == opponent))
      {
        valret = false;
      }
    }
  }

  //Première colonne
  else if(iColumn == 0)
  {
    if ((this.Grid[iLine - 1][iColumn] == opponent)
      &&(this.Grid[iLine + 1][iColumn] == opponent) 
      && (this.Grid[iLine][iColumn + 1] == opponent))
    {
      valret = false;
    }
  }  

  //Dernière colonne
  else if(iColumn == (this.Size-1))
  {
    if ((this.Grid[iLine - 1][iColumn] == opponent)
      &&(this.Grid[iLine + 1][iColumn] == opponent) 
      && (this.Grid[iLine][iColumn - 1] == opponent))
    {
      valret = false;
    }
  }
   
  //Cas général
  else
  {
    if ((this.Grid[iLine -1][iColumn] == opponent) 
      && (this.Grid[iLine + 1][iColumn] == opponent) 
      && (this.Grid[iLine][iColumn - 1] == opponent)
      && (this.Grid[iLine][iColumn + 1] == opponent))
    {
      valret = false;
    }
  }

  return valret;
}

/** La méthode vérifie si le fait de mettre le pion sur cette position génère des ataris.

  \param [in] {string} iPlayer  Le joueur en cours ('n' ou 'b').
  \param [in] {int} iLine  Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn  Numéro de la colonne (débute à 0).

  \pre
  Il a été vérifié que la cellule est bien vide à l'aide la méthode CrossingIsEmpty().

  \return
  La fonction retourne true si le fait de mettre le pion sur cette position génère des ataris, sinon false.
*/
CGoban.prototype.SimulFindAtari = function(iPlayer, iLine, iColumn)
{
  var Atari = [];
  var Mark = [];

  var i = 0;
  var j = 0;

  var opponent;

  var AtariNumber = 0;

  // Initialiser les Atari.
  // Note : Nous aurons un maximum de 4 Atari car nous avons 4 directions
  Atari[0] = new CAtari();
  Atari[1] = new CAtari();
  Atari[2] = new CAtari();
  Atari[3] = new CAtari();

  //Initialiser l'adversaire
  if(iPlayer == 'n')
  {
    opponent = 'b';
  }
  else if(iPlayer == 'b')
  {
    opponent = 'n';
  }
  else
  {
    return;
  }

  // Créer le tableau des marques
  for(i = 0 ; i < this.Size ; i++)
  {
    Mark[i] = [];
    for(j = 0 ; j < this.Size ; j++)
    {
      Mark[i][j] = '';
    }
  }

  // Mettre à jour la grille
  this.Grid[iLine][iColumn] = iPlayer;
    
  // Rechercher les Atari (chaînes d'une même couleur sans liberté)
  // Recherche à gauche
  if(iColumn > 0)
  {
    if(this.Grid[iLine][iColumn - 1] == opponent)
    {
      // Signaler que la cellule a été traitée
      Mark[iLine][iColumn] = 'X';

      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.FindAtari(iPlayer, iLine, iColumn - 1, Atari[0], Mark);
    }
    else
    {
      Atari[0].Valid = false;
    }
  }
  else
  {
    Atari[0].Valid = false;
  }

  // Recherche à droite
  if(iColumn < (this.Size - 1))
  {
    if(this.Grid[iLine][iColumn + 1] == opponent)
    {
      // Réinitialiser le tableaud des marques
      this.InitMarkArray(Mark);

      // Signaler que la cellule a été traitée
      Mark[iLine][iColumn] = 'X';

      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.FindAtari(iPlayer, iLine, iColumn + 1, Atari[1], Mark);
    }
    else
    {
      Atari[1].Valid = false;
    }
  }
  else
  {
    Atari[1].Valid = false;
  }

  // Recherche en haut 
  if(iLine > 0)
  {
    if(this.Grid[iLine - 1][iColumn] == opponent)
    {
      // Réinitialiser le tableaud des marques
      this.InitMarkArray(Mark);

      // Signaler que la cellule a été traitée
      Mark[iLine][iColumn] = 'X';

      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.FindAtari(iPlayer, iLine - 1, iColumn, Atari[2], Mark);
    }
    else
    {
      Atari[2].Valid = false;
    }
  }
  else
  {
    Atari[2].Valid = false;
  }

  // Recherche en bas 
  if(iLine < (this.Size - 1))
  {
    if(this.Grid[iLine + 1][iColumn] == opponent)
    {
      // Réinitialiser le tableaud des marques
      this.InitMarkArray(Mark);

      // Signaler que la cellule a été traitée
      Mark[iLine][iColumn] = 'X';

      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.FindAtari(iPlayer, iLine + 1, iColumn, Atari[3], Mark); 
    }
    else
    {
      Atari[3].Valid = false;
    }
  }
  else
  {
    Atari[3].Valid = false;
  }

  // Compter le nombre de chaines Atari valides
  for(i = 0 ; i < 4 ; i++)
  {
    if(Atari[i].Valid == true)
    {
      AtariNumber++;
    }
  }

  // Réinitialiser le contenu de la cellule
  this.Grid[iLine][iColumn] = ' ';

  // Vérifier si la position est autorisée
  if(AtariNumber == 0)
  {
    // Mettre à jour la valeur de retour
    return false;
  }

  if(this.PositionAuthorized(opponent, iLine, iColumn) == true)
  {
    // Mettre à jour la valeur de retour
    return true;
  }

  return false;
}

/** La méthode autorise la position d’une pierre ainsi que l’état de vie et de mort des pierres du plateau.

  \param [in] {string} iPlayer  Le joueur en cours ('n' ou 'b').
  \param [in] {int} iLine  Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn  Numéro de la colonne (débute à 0).

  \pre
  Il a été vérifié que la cellule est bien vide à l'aide la méthode CrossingIsEmpty().

  \return
  La fonction retourne true si la pierre a pu être positionnée sinon false (position non autorisée).
*/
CGoban.prototype.StonePosition = function(iPlayer, iLine, iColumn)
{
  var ValRet = true;

  var Atari = [];
  var Mark = [];

  var i = 0;
  var j = 0;

  var opponent;

  var AtariNumber = 0;

  // Initialiser les Atari.
  // Note : Nous aurons un maximum de 4 Atari car nous avons 4 directions
  Atari[0] = new CAtari();
  Atari[1] = new CAtari();
  Atari[2] = new CAtari();
  Atari[3] = new CAtari();

  //Initialiser l'adversaire
  if(iPlayer == 'n')
  {
    opponent = 'b';
  }
  else if(iPlayer == 'b')
  {
    opponent = 'n';
  }
  else
  {
    return;
  }

  // Créer le tableau des marques
  for(i = 0 ; i < this.Size ; i++)
  {
    Mark[i] = [];
    for(j = 0 ; j < this.Size ; j++)
    {
      Mark[i][j] = '';
    }
  }

  // Mettre à jour la grille
  this.Grid[iLine][iColumn] = iPlayer;
    
  // Rechercher les Atari (chaînes d'une même couleur sans liberté)
  // Recherche à gauche
  if(iColumn > 0)
  {
    if(this.Grid[iLine][iColumn - 1] == opponent)
    {
      // Signaler que la cellule a été traitée
      Mark[iLine][iColumn] = 'X';

      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.FindAtari(iPlayer, iLine, iColumn - 1, Atari[0], Mark);
    }
    else
    {
      Atari[0].Valid = false;
    }
  }
  else
  {
    Atari[0].Valid = false;
  }

  // Recherche à droite
  if(iColumn < (this.Size - 1))
  {
    if(this.Grid[iLine][iColumn + 1] == opponent)
    {
      // Réinitialiser le tableaud des marques
      this.InitMarkArray(Mark);

      // Signaler que la cellule a été traitée
      Mark[iLine][iColumn] = 'X';

      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.FindAtari(iPlayer, iLine, iColumn + 1, Atari[1], Mark);
    }
    else
    {
      Atari[1].Valid = false;
    }
  }
  else
  {
    Atari[1].Valid = false;
  }

  // Recherche en haut 
  if(iLine > 0)
  {
    if(this.Grid[iLine - 1][iColumn] == opponent)
    {
      // Réinitialiser le tableaud des marques
      this.InitMarkArray(Mark);

      // Signaler que la cellule a été traitée
      Mark[iLine][iColumn] = 'X';

      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.FindAtari(iPlayer, iLine - 1, iColumn, Atari[2], Mark);
    }
    else
    {
      Atari[2].Valid = false;
    }
  }
  else
  {
    Atari[2].Valid = false;
  }

  // Recherche en bas 
  if(iLine < (this.Size - 1))
  {
    if(this.Grid[iLine + 1][iColumn] == opponent)
    {
      // Réinitialiser le tableaud des marques
      this.InitMarkArray(Mark);

      // Signaler que la cellule a été traitée
      Mark[iLine][iColumn] = 'X';

      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.FindAtari(iPlayer, iLine + 1, iColumn, Atari[3], Mark); 
    }
    else
    {
      Atari[3].Valid = false;
    }
  }
  else
  {
    Atari[3].Valid = false;
  }

  // Compter le nombre de chaines Atari valides
  for(i = 0 ; i < 4 ; i++)
  {
    if(Atari[i].Valid == true)
    {
      AtariNumber++;
    }
  }

  // Vérifier si la position est autorisée
  if(AtariNumber == 0)
  {
    if(this.PositionAuthorized(iPlayer, iLine, iColumn) == false)
    {
      // Réinitialiser le contenu de la cellule
      this.Grid[iLine][iColumn] = ' ';

      // Mettre à jour la valeur de retour
      ValRet = false;
    }

    return ValRet;
  }

  // Supprimer les pierres de l'Atari.
  for(i = 0 ; i < 4 ; i++)
  {
    if(Atari[i].Valid == true)
    {
      for(j = 0 ; j < Atari[i].Cellule.length ; j++)
      {
        this.Grid[Atari[i].Cellule[j].Line][Atari[i].Cellule[j].Column] = ' ';
      }
    }
  }

  return ValRet;
}

/** La méthode initialise le tableau des marques utilisé dans la méthode StonePosition() .

  \param [in] {Array} ioMark  Tableaux des marques a initialiser.

  \return
 La méthode ne retourne pas de valeur.
**/
CGoban.prototype.InitMarkArray = function(ioMark)
{
  var i = 0;
  var j = 0;

  // Initialiser le tableau des marques
  for(i = 0 ; i < this.Size ; i++)
  {
    for(j = 0 ; j < this.Size ; j++)
    {
      ioMark[i][j] = '';
    }
  }
}

/** La méthode recherche les Atari dans le Goban.

  \param [in] {string} iPlayer Le joueur en cours ('n' ou 'b').
  \param [in] {int} iLine      Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn    Numéro de la colonne (débute à 0).
  \param [in] {CAtari} ioAtari Atari associé.
  \param [in] {Array} ioMark   Tableaux des marques pour savoir si la case a déjà été traitée.

  \return
  La méthode ne retourne pas de valeur.
*/
CGoban.prototype.FindAtari = function(iPlayer, iLine, iColumn, ioAtari, ioMark)
{
  var opponent;

  // Vérifier les paramètres
  if(iLine < 0)
  {
    return;
  }
  if(iLine >= this.Size)
  {
    return;
  }
  if(iColumn < 0)
  {
    return;
  }
  if(iColumn >= this.Size)
  {
    return;
  }

  if(ioAtari.Valid == false)
  {
    return;
  }

  if(ioMark[iLine][iColumn] == 'X')
  {
    return;
  }

  //Initialiser l'adversaire
  if(iPlayer == 'n')
  {
    opponent = 'b';
  }
  else if(iPlayer == 'b')
  {
    opponent = 'n';
  }
  else
  {
    return;
  }

  if(this.Grid[iLine][iColumn] == opponent)
  {
    // Ajouter les coordonnées de la pierre à l'Atari
    var c = new CCoordinate(iLine, iColumn);
    ioAtari.Cellule[ioAtari.Cellule.length] = c;

    // Signaler que la cellule a été traitée
    ioMark[iLine][iColumn] = 'X';

    // Rechercher les Atari (chaînes d'une même couleur sans liberté)
    // Recherche à gauche
    if(iColumn > 0)
    {
      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.FindAtari(iPlayer, iLine, iColumn - 1, ioAtari, ioMark);
    }

    // Recherche à droite
    if(ioAtari.Valid == true)
    {
      if(iColumn < (this.Size - 1))
      {
        // Rechercher un Atari (chaîne d'une même couleur sans liberté)
        this.FindAtari(iPlayer, iLine, iColumn + 1, ioAtari, ioMark);
      }
    }

    // Recherche en haut 
    if(ioAtari.Valid == true)
    {
      if(iLine > 0)
      {
        // Rechercher un Atari (chaîne d'une même couleur sans liberté)
        this.FindAtari(iPlayer, iLine - 1, iColumn, ioAtari, ioMark);
      }
    }

    // Recherche en bas 
    if(ioAtari.Valid == true)
    {
      if(iLine < (this.Size - 1))
      {
        // Rechercher un Atari (chaîne d'une même couleur sans liberté)
        this.FindAtari(iPlayer, iLine + 1, iColumn, ioAtari, ioMark); 
      }
    }
  }
  else if(this.Grid[iLine][iColumn] == ' ')
  {
    // La chaine contient encore de libertés : Signalé que l'Atari n'est plus valide
    ioAtari.Valid = false;

    // Signaler que la cellule a été traitée
    ioMark[iLine][iColumn] = 'X';
  }
}

/** La méthode calcule les points du jeu pour chaque joueur 
  
  \param [in] {string} iPlayer Le joueur en cours ('n' ou 'b').
  \param [in] {string} iAreaImg Chemin d'accès a l'image du territoire du joueur en cours.
  \param [in] {bool} iDisplayArea Signale si l'on affiche les territoires.

  \return
  La méthode retourne le nombre de points du joueur en question
*/
CGoban.prototype.CalcPoints = function(iPlayer, iAreaImg, iDisplayArea)
{
  var Points = 0;
  var i = 0;
  var j = 0;
  var PlayerArea = [];

  //Compter les pierres sur le goban
  for(i = 0; i < this.Size ; i++)
  {
    for(j = 0 ; j < this.Size ; j++)
    {
      if(this.Grid[i][j] == iPlayer)
      {
        Points++;
      }
    }
  }

  //Initialisation de la grille des territoires
  for(i = 0 ; i < this.Size ; i++)
  {
    PlayerArea[i] = [];
    for(j = 0 ; j < this.Size ; j++)
    {
      PlayerArea[i][j] = ' ';
    }
  }

  // Rechercher les territoires 
  for(i = 0 ; i < this.Size ; i++)
  {
    for(j = 0 ; j < this.Size ; j++)
    {
      if(this.Grid[i][j] == iPlayer)
      {
        this.CalcArea(PlayerArea, iPlayer, i, j);
      }
    }
  }

  // Compter les pierres dans les territoires 
  for(i = 0 ; i < this.Size ; i++)
  {
    for(j = 0 ; j < this.Size ; j++)
    {
      if(PlayerArea[i][j] == iPlayer)
      {
        Points++;
      }
    }
  }

  //Afficher les territoires sur la grille
  if(iDisplayArea == true)
  {
    this.DisplayArea(PlayerArea, iPlayer, iAreaImg);
  }

  return Points;
}

/** La méthode autorise la position d’une pierre ainsi que l’état de vie et de mort des pierres du plateau.

  \param [in] {array} iPlayerArea  La grille des territoires du joueur en cours.
  \param [in] {string} iPlayer  Le joueur en cours ('n' ou 'b').
  \param [in] {int} iLine  Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn  Numéro de la colonne (débute à 0).

  \pre
  Il a été vérifié que la cellule est bien vide à l'aide la méthode CrossingIsEmpty().

  \return
  La fonction retourne le nombre de pierre dans les territoires du joueur.
*/
CGoban.prototype.CalcArea = function(iPlayerArea, iPlayer, iLine, iColumn)
{
  var ValRet = 0;

  var Atari = [];
  var Mark = [];

  var i = 0;
  var j = 0;

  var AtariNumber = 0;

  // Initialiser les Atari.
  // Note : Nous aurons un maximum de 4 Atari car nous avons 4 directions
  Atari[0] = new CAtari();
  Atari[1] = new CAtari();
  Atari[2] = new CAtari();
  Atari[3] = new CAtari();

  // Créer le tableau des marques
  for(i = 0 ; i < this.Size ; i++)
  {
    Mark[i] = [];
    for(j = 0 ; j < this.Size ; j++)
    {
      Mark[i][j] = '';
    }
  }
    
  // Rechercher les Atari (chaînes d'une même couleur sans liberté)
  // Recherche à gauche
  if(iColumn > 0)
  {
    if(this.Grid[iLine][iColumn - 1] == ' ')
    {
      // Signaler que la cellule a été traitée
      Mark[iLine][iColumn] = 'X';

      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.AreaFindAtari(iPlayer, iLine, iColumn - 1, Atari[0], Mark);
    }
    else
    {
      Atari[0].Valid = false;
    }
  }
  else
  {
    Atari[0].Valid = false;
  }

  // Recherche à droite
  if(iColumn < (this.Size - 1))
  {
    if(this.Grid[iLine][iColumn + 1] == ' ')
    {
      // Réinitialiser le tableaud des marques
      this.InitMarkArray(Mark);

      // Signaler que la cellule a été traitée
      Mark[iLine][iColumn] = 'X';

      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.AreaFindAtari(iPlayer, iLine, iColumn + 1, Atari[1], Mark);
    }
    else
    {
      Atari[1].Valid = false;
    }
  }
  else
  {
    Atari[1].Valid = false;
  }

  // Recherche en haut 
  if(iLine > 0)
  {
    if(this.Grid[iLine - 1][iColumn] == ' ')
    {
      // Réinitialiser le tableaud des marques
      this.InitMarkArray(Mark);

      // Signaler que la cellule a été traitée
      Mark[iLine][iColumn] = 'X';

      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.AreaFindAtari(iPlayer, iLine - 1, iColumn, Atari[2], Mark);
    }
    else
    {
      Atari[2].Valid = false;
    }
  }
  else
  {
    Atari[2].Valid = false;
  }

  // Recherche en bas 
  if(iLine < (this.Size - 1))
  {
    if(this.Grid[iLine + 1][iColumn] == ' ')
    {
      // Réinitialiser le tableaud des marques
      this.InitMarkArray(Mark);

      // Signaler que la cellule a été traitée
      Mark[iLine][iColumn] = 'X';

      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.AreaFindAtari(iPlayer, iLine + 1, iColumn, Atari[3], Mark); 
    }
    else
    {
      Atari[3].Valid = false;
    }
  }
  else
  {
    Atari[3].Valid = false;
  }

  // Compter le nombre de chaines Atari valides
  for(i = 0 ; i < 4 ; i++)
  {
    if(Atari[i].Valid == true)
    {
      AtariNumber++;
    }
  }

  // Vérifier si la position est autorisée
  if(AtariNumber == 0)
  {
    return ValRet;
  }

  //Mettre à jour la grille des territoires 
  for(i = 0 ; i < 4 ; i++)
  {
    if(Atari[i].Valid == true)
    {
      for(j = 0 ; j < Atari[i].Cellule.length ; j++)
      {
        iPlayerArea[Atari[i].Cellule[j].Line][Atari[i].Cellule[j].Column] = iPlayer;
      }
    }
  }

  // Compter les pierres de l'Atari.
  ValRet = 1;
  for(i = 0 ; i < this.Size ; i++)
  {
    for(j = 0; j< this.Size; j++)
    {
      if(iPlayerArea[i][j] == iPlayer)
      {
        ValRet++;
      }
    }
  }
  return ValRet;
}

/** La méthode recherche les territoires du joueur dans le Goban.

  \param [in] {string} iPlayer Le joueur en cours ('n' ou 'b').
  \param [in] {int} iLine      Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn    Numéro de la colonne (débute à 0).
  \param [in] {CAtari} ioAtari Atari associé.
  \param [in] {Array} ioMark   Tableaux des marques pour savoir si la case a déjà été traitée.

  \return
  La méthode ne retourne pas de valeur.
*/
CGoban.prototype.AreaFindAtari = function(iPlayer, iLine, iColumn, ioAtari, ioMark)
{
  var opponent;

  // Vérifier les paramètres
  if(iLine < 0)
  {
    return;
  }
  if(iLine >= this.Size)
  {
    return;
  }
  if(iColumn < 0)
  {
    return;
  }
  if(iColumn >= this.Size)
  {
    return;
  }

  if(ioAtari.Valid == false)
  {
    return;
  }

  if(ioMark[iLine][iColumn] == 'X')
  {
    return;
  }

  //Initialiser l'adversaire
  if(iPlayer == 'n')
  {
    opponent = 'b';
  }
  else if(iPlayer == 'b')
  {
    opponent = 'n';
  }
  else
  {
    return;
  }

  if(this.Grid[iLine][iColumn] == ' ')
  {
    // Ajouter les coordonnées de la pierre à l'Atari
    var c = new CCoordinate(iLine, iColumn);
    ioAtari.Cellule[ioAtari.Cellule.length] = c;

    // Signaler que la cellule a été traitée
    ioMark[iLine][iColumn] = 'X';

    // Rechercher les Atari (chaînes d'une même couleur sans liberté)
    // Recherche à gauche
    if(iColumn > 0)
    {
      // Rechercher un Atari (chaîne d'une même couleur sans liberté)
      this.AreaFindAtari(iPlayer, iLine, iColumn - 1, ioAtari, ioMark);
    }

    // Recherche à droite
    if(ioAtari.Valid == true)
    {
      if(iColumn < (this.Size - 1))
      {
        // Rechercher un Atari (chaîne d'une même couleur sans liberté)
        this.AreaFindAtari(iPlayer, iLine, iColumn + 1, ioAtari, ioMark);
      }
    }

    // Recherche en haut 
    if(ioAtari.Valid == true)
    {
      if(iLine > 0)
      {
        // Rechercher un Atari (chaîne d'une même couleur sans liberté)
        this.AreaFindAtari(iPlayer, iLine - 1, iColumn, ioAtari, ioMark);
      }
    }

    // Recherche en bas 
    if(ioAtari.Valid == true)
    {
      if(iLine < (this.Size - 1))
      {
        // Rechercher un Atari (chaîne d'une même couleur sans liberté)
        this.AreaFindAtari(iPlayer, iLine + 1, iColumn, ioAtari, ioMark); 
      }
    }
  }
  else if(this.Grid[iLine][iColumn] == opponent)
  {
    // La chaine contient encore de libertés : Signalé que l'Atari n'est plus valide
    ioAtari.Valid = false;

    // Signaler que la cellule a été traitée
    ioMark[iLine][iColumn] = 'X';
  }
}

/** La méthode affiche les territoires sur le goban

  \return
  La méthode ne retourne pas de valeur.
*/
CGoban.prototype.DisplayArea = function(iPlayerArea, iPlayer, iAreaImg)
{
  var htmlCellule;
  var ObjSize;
 
  // Afficher le térritoire
  for (var i = 0; i < this.Size; i++) 
  {
    for (var j = 0; j < this.Size; j++) 
    {
      htmlCellule = document.getElementById('L' + i + '_C' + j);

      if (iPlayerArea[i][j] == iPlayer)
      {
        htmlCellule.style.background = "url("+iAreaImg+")";
        htmlCellule.style.backgroundPosition = "center";
        htmlCellule.style.backgroundRepeat = "no-repeat";

        htmlCellule.setAttribute("onclick","OnStonePosition("+i+", "+j+")");
        ObjSize = 33;
        htmlCellule.style.width = ObjSize+"px";
        ObjSize = 31;
        htmlCellule.style.height = ObjSize+"px";
        htmlCellule.style.padding = "0 px";
      }
    }
  }
}

/** La méthode affiche un pouvoir sur le goban

  \return
  La méthode ne retourne pas de valeur.
*/
CGoban.prototype.DisplayPower = function(iPlayer, iPowerImg)
{
  var htmlCellule;
  var ObjSize;
 
  // Remplacer toutes les images des pions du joueur par celle du pouvoir
  for (var i = 0; i < this.Size; i++) 
  {
    for (var j = 0; j < this.Size; j++) 
    {
      htmlCellule = document.getElementById('L' + i + '_C' + j);

      if (this.Grid[i][j] == iPlayer)
      {
        htmlCellule.style.background = "url("+iPowerImg+")";
        htmlCellule.style.backgroundPosition = "center";
        htmlCellule.style.backgroundRepeat = "no-repeat";

        htmlCellule.setAttribute("onclick","OnStonePosition("+i+", "+j+")");
        ObjSize = 33;
        htmlCellule.style.width = ObjSize+"px";
        ObjSize = 31;
        htmlCellule.style.height = ObjSize+"px";
        htmlCellule.style.padding = "0 px";
      }
    }
  }
}

CGoban.prototype.GobanRempli = function (){
  var i = 0;
  var j = 0;
  var Compter = 0;

  for(i=0;i<this.Size;i++)
  {
    for(j=0;j<this.Size;j++)
    {
      if(this.Grid[i][j] != ' ')
      {
        Compter = Compter+1;
      }
    }
  }
  if(Compter == (this.Size*this.Size))
  {
    return true;
  }
  else
  {
    return false;
  }
}