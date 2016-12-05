// Définitions des coins du goban
const IA_CORNER_TOP_LEFT     = 0;
const IA_CORNER_TOP_RIGHT    = 1;
const IA_CORNER_BOTTOM_LEFT  = 2;
const IA_CORNER_BOTTOM_RIGHT = 3;

/** Classe de gestion d'un joueur dans le jeu de go.

  \param [in] {int} iMaxPower Nombre maximum d'utilisation du pouvoir
*/
function CPlayer(iMaxPower)
{
  // Nom du joueur
  this.Name = '';

  //Maison qu'a choisi le joueur
  this.House;

  //Signal si le joueur est une IA ou non 
  this.IA = false;

  //Coordonnée de la dernière pierre placée
  this.OldPosition = new CCoordinate(-1, -1);

  // Nombre restant d'utilisation du pouvoir
  this.Power = iMaxPower;

  // Signale si le pouvoir est activé
  this.PowerActived = false;

  // En IA, indique le nombre de coups joués
  this.MovesNumber = 0;
}

/*
  La méthode met à jour le nom du joueur 

  \param [in] {string} iName Nom du joueur (taille tronquée à max 10 caractères pour des raisons d'affichage)

  \return
  La méthode ne retourne pas de valeur.
*/
CPlayer.prototype.SetName = function (iName)
{
  if(iName.length > 0)
  {
    this.Name = iName.substr(0, 10);
  }
  else
  {
    this.Name = '';
  }
}

/*
  La méthode met à jour la maison du joueur 

  \param [in] {CHouse} iHouse Instance de la classe CHouse

  \return
  La méthode ne retourne pas de valeur.
*/
CPlayer.prototype.SetHouse = function (iHouse)
{
  this.House = iHouse;
}

/** La méthode joue un coup en automatique (simulation IA).

  \param [in,out] {CGoban} ioGoban Goban

  \return
  La méthode retourne true si le joueur a pu jouer, sinon false.
*/
CPlayer.prototype.PlayAuto = function(ioGoban)
{
  var ValRet = false;

  // Vérifier si un pion est en danger
  if (this.IADangerZone(ioGoban) == true)
  {
    // Incrémenter le nombre de coups joués
    this.MovesNumber ++;

    // Réafficher le Goban
    ioGoban.Display();

    return true;
  }

  // Attaquer un pion adverse qui n'a plus qu'une liberté
  if (this.IAFinishOff(ioGoban) == true)
  {
    // Incrémenter le nombre de coups joués
    this.MovesNumber ++;

    // Réafficher le Goban
    ioGoban.Display();

    return true;
  }

  // Recherche une stratégie en fonction de la partie
  if (this.IAStrategy(ioGoban) == true)
  {
    // Incrémenter le nombre de coups joués
    this.MovesNumber ++;

    // Réafficher le Goban
    ioGoban.Display();

    return true;
  }


  // Tenter de positionner le pion aléatoirement
  if(this.IARandom(ioGoban) == true)
  {
    // Incrémenter le nombre de coups joués
    this.MovesNumber ++;

    // Réafficher le Goban
    ioGoban.Display();

    return true;
  }

  return ValRet;
}

/** simulation IA : La méthode vérifie si un pion est en danger et le protège.

  \param [in,out] {CGoban} ioGoban Goban

  \return
  La méthode retourne true si un pion est en danger et qu'il a été protégé, sinon false.
*/
CPlayer.prototype.IADangerZone = function(ioGoban)
{
  var i = 0;
  var j = 0;
  var Line = -1;
  var Column = -1;

  // Vérfier si un pion est en danger
  for(i = 0 ; i < ioGoban.Size ; i++)
  {
    for(j = 0 ; j < ioGoban.Size ; j++)
    {
      if(ioGoban.CrossingIsEmpty(i, j) == true)
      {
        if(ioGoban.SimulFindAtari('n', i, j) == true)
        {
          Line = i;
          Column = j;
          i = ioGoban.Size;
          j = ioGoban.Size;
        }
      }
    }
  }

  if(Line != -1)
  {
    this.CheckPosition(ioGoban, Line, Column);
    return true;
  }

  return false;
}

/** simulation IA : La méthode attaque un pion adverse qui n'a plus qu'une liberté.

  \param [in,out] {CGoban} ioGoban Goban

  \return
  La méthode retourne true si un pion adverse est attaqué, sinon false.
*/
CPlayer.prototype.IAFinishOff = function(ioGoban)
{
  var i = 0;
  var j = 0;
  var Line = -1;
  var Column = -1;

  // Vérfier si un pion adverse n'a plus qu'une seule liberté
  for(i = 0 ; i < ioGoban.Size ; i++)
  {
    for(j = 0 ; j < ioGoban.Size ; j++)
    {
      if(ioGoban.CrossingIsEmpty(i, j) == true)
      {
        if(ioGoban.SimulFindAtari('b', i, j) == true)
        {
          Line = i;
          Column = j;
          i = ioGoban.Size;
          j = ioGoban.Size;
        }
      }
    }
  }

  if(Line != -1)
  {
    this.CheckPosition(ioGoban, Line, Column);
    return true;
  }

  return false;
}

/** simulation IA : La méthode décide d'une stratégie en fonction de la partie en cours.

  \param [in,out] {CGoban} ioGoban Goban

  \return
  La méthode retourne true si une stratégie a été sélectionné, sinon false.
*/
CPlayer.prototype.IAStrategy = function(ioGoban)
{
  var PointNbPlayer1 = 0;
  var PointNbIA = 0;

  if(this.MovesNumber > 0)
  {
    // Récupérer les points du joueur 1
    PointNbPlayer1 = ioGoban.CalcPoints('n', '', false);

    // Récupérer les points de l'IA
    PointNbIA = ioGoban.CalcPoints('b', '', false);

    /*console.log("joueur 1 : ", PointNbPlayer1);
    console.log("AI       : ", PointNbIA);*/

    if(PointNbIA + 1 >= PointNbPlayer1)
    {
      // Créer des territoires
      return this.IACreateArea(ioGoban);
    }
    else
    {
      // Attaquer
      return this.IAChase(ioGoban);
    }
  }

  return false;
}

/** simulation IA : La méthode tente de créer des territoires. 

  \param [in,out] {CGoban} ioGoban Goban

  \return
  La méthode retourne true si un pion a été placé pour créer un territoire, sinon false.
*/
CPlayer.prototype.IACreateArea = function(ioGoban)
{
  var ValRet = false;

  var Ret = null;
  var CornerNumber = 0;
  var AreaLevel = 0;
  var Mask = [];
  var Continue = true;
  var Indice = 0;

  // Déterminer le coin et le niveau du territoire qu'il faut créer
  Ret = this.IADefineCornerAndAeraLevel(ioGoban);
  if(Ret == null)
  {
    return false;
  }

  CornerNumber = Ret[0];
  AreaLevel = Ret[1];

  // Récuperer le masque des territoires
  Mask = this.IAGetMask(AreaLevel, CornerNumber, ioGoban.Size);

  do
  {
    if(Mask.length > 0)
    {
      // Récupérer un pion au hasard
      Indice = Math.floor(Math.random()*Mask.length);
      
      if(this.CheckPosition(ioGoban, Mask[Indice].Line, Mask[Indice].Column) == true)
      {
        ValRet = true;
        Continue = false;
      }
      else
      {
        // Supprimer le pion du tableau
        Mask.splice(Indice, 1);
      }
    }
    else
    {
      Continue = false;
    }
  } while(Continue == true);

  return ValRet;
}

/** simulation IA : La méthode détermine le coin et le niveau du territoire qu'il faut créer.

  \param [in] {CGoban} iGoban Goban

  \return
  La méthode retourne sous forme de tableau Le numéro du coin (indice 0) et le niveau du territoire (indice 1) si le traitement d'un coin est possible, sinon null.
*/
CPlayer.prototype.IADefineCornerAndAeraLevel = function(iGoban)
{
  var ValRet = null;
  var CornerNumber = 0;
  var AreaLevel = 1;

  var MaxLevel = 0;
  var BlackPawnNumber = [];
  var WhitePawnNumber = [];
  var LevelIsCompleted = [];

  var Indice = 0;
  var i = 0;
  var j = 0;
  var ValueMax = 0;
  var IsEqual = true;
  var Continue = true;

  // Déterminer le niveau max
  switch(iGoban.Size)
  {
    case CGOBAN_SMALL :
      MaxLevel = 3;
      break;

    case CGOBAN_MEDIUM :
      MaxLevel = 5;
      break;

    case CGOBAN_LARGE :
      MaxLevel = 6;
      break;
  }

  // Récupèrer le nombre de pions noirs et blancs pour chaque coin.
  this.IAGetPawnsdForEachCorner(iGoban, MaxLevel, BlackPawnNumber, WhitePawnNumber);

  // Vérifier si chaque niveau de chaque coin est complété
  this.IAVerifyIfEachLevelIsCompleted(iGoban, MaxLevel, LevelIsCompleted);

  // A Déterminer le coin
  // A1 - Supprimer le coin dont la densité de noirs est supérieure
  if((BlackPawnNumber[0][1] != BlackPawnNumber[1][1])
     || (BlackPawnNumber[1][1] != BlackPawnNumber[2][1])
     || (BlackPawnNumber[2][1] != BlackPawnNumber[3][1]))
  {
    Indice = 0;
    ValueMax = BlackPawnNumber[0][1];

    for(i = 1 ; i < BlackPawnNumber.length; i++)
    {
      if(BlackPawnNumber[i][1] > ValueMax)
      {
        Indice = i;
        ValueMax = BlackPawnNumber[i][1];
      }
    }

    // Supprimer le coin
    BlackPawnNumber.splice(Indice, 1);
    WhitePawnNumber.splice(Indice, 1);
  }

  do
  {
    if(WhitePawnNumber.length > 0)
    {
      // A2 - Prendre le coin dont la densité de blanc est supérieure
      IsEqual = true;
      ValueMax = WhitePawnNumber[0][1];
      for(i = 1 ; i < WhitePawnNumber.length; i++)
      {
        if(WhitePawnNumber[i][1] != ValueMax)
        {
          i = WhitePawnNumber.length;
          IsEqual = false;
        }
      }

      if(IsEqual == false)
      {
        Indice = 0;
        ValueMax = WhitePawnNumber[0][1];

        for(i = 1 ; i < WhitePawnNumber.length; i++)
        {
          if(WhitePawnNumber[i][1] > ValueMax)
          {
            Indice = i;
            ValueMax = WhitePawnNumber[i][1];
          }
        }
        CornerNumber = WhitePawnNumber[Indice][0];
      }
      else
      {
        Indice = Math.floor(Math.random()*WhitePawnNumber.length);
        CornerNumber = WhitePawnNumber[Indice][0];
      }

      // B Déterminer le niveau
      AreaLevel = 1;
      for(i = 0 ; i < LevelIsCompleted[CornerNumber].length; i++)
      {
        if(LevelIsCompleted[CornerNumber][i] == false)
        {
          i = LevelIsCompleted[CornerNumber].length;
        }
        else
        {
          AreaLevel ++;
        }
      }

      if((AreaLevel - 1) == MaxLevel)
      {
        // Supprimer le coin terminé
        Indice = 0;
        for(i = 0 ; i < BlackPawnNumber.length; i++)
        {
          if(BlackPawnNumber[i][0] == CornerNumber)
          {
            Indice = i;
            i = BlackPawnNumber.length;
          }
        }

        BlackPawnNumber.splice(Indice, 1);
        WhitePawnNumber.splice(Indice, 1);
      }
      else
      {
        Continue = false;
      }
    }
    else
    {
      Continue = false;
      return null;
    }
  } while(Continue == true);

  // Mettre à jour la valeur de retour
  ValRet    = [];
  ValRet[0] = CornerNumber;
  ValRet[1] = AreaLevel;

  return ValRet;
}

/** simulation IA : La méthode récupère le nombre de pions noirs et blancs pour chaque coin.

  \param [in] {CGoban} iGoban Goban
  \param [in] {int}    iMaxLevel Numéro du niveau maximum.
  \param [in] {Array}  iBlackPawnNumber Tableau du nombre de poins noirs pour chacun des coins.
  \param [in] {Array}  iWhitePawnNumber Tableau du nombre de poins noirs pour chacun des coins.

  \return
  La méthode ne retourne pas de valeur.

  \note
  Le méthode est sous-méthode de la méthode IADefineCornerAndAeraLevel().
*/
CPlayer.prototype.IAGetPawnsdForEachCorner = function(iGoban, iMaxLevel, oBlackPawnNumber, oWhitePawnNumber)
{
  var i = 0;
  var j = 0;
  var IndiceLineMax = iGoban.Size - 1;
  var IndiceColumMax = iGoban.Size - 1;

  // Initialiser les tableaux
  oBlackPawnNumber[0] = [];
  oBlackPawnNumber[1] = [];
  oBlackPawnNumber[2] = [];
  oBlackPawnNumber[3] = [];

  oWhitePawnNumber[0] = [];
  oWhitePawnNumber[1] = [];
  oWhitePawnNumber[2] = [];
  oWhitePawnNumber[3] = [];

  oBlackPawnNumber[0][0] = IA_CORNER_TOP_LEFT;
  oBlackPawnNumber[0][1] = 0;
  oBlackPawnNumber[1][0] = IA_CORNER_TOP_RIGHT;
  oBlackPawnNumber[1][1] = 0;
  oBlackPawnNumber[2][0] = IA_CORNER_BOTTOM_LEFT;
  oBlackPawnNumber[2][1] = 0;
  oBlackPawnNumber[3][0] = IA_CORNER_BOTTOM_RIGHT;
  oBlackPawnNumber[3][1] = 0;

  oWhitePawnNumber[0][0] = IA_CORNER_TOP_LEFT;
  oWhitePawnNumber[0][1] = 0;
  oWhitePawnNumber[1][0] = IA_CORNER_TOP_RIGHT;
  oWhitePawnNumber[1][1] = 0;
  oWhitePawnNumber[2][0] = IA_CORNER_BOTTOM_LEFT;
  oWhitePawnNumber[2][1] = 0;
  oWhitePawnNumber[3][0] = IA_CORNER_BOTTOM_RIGHT;
  oWhitePawnNumber[3][1] = 0;

  // Récuperer les pions du coin haut gauche
  for(i = 0 ; i <= iMaxLevel ; i++)
  {
    for(j = 0 ; j <= iMaxLevel ; j++)
    {
      if(iGoban.Grid[i][j] == 'n')
      {
        oBlackPawnNumber[0][1] ++;
      }
      else if(iGoban.Grid[i][j] == 'b')
      {
        oWhitePawnNumber[0][1] ++;
      }
    }
  }

  // Récuperer les pions du coin haut droit
  for(i = 0 ; i <= iMaxLevel ; i++)
  {
    for(j = 0 ; j <= iMaxLevel ; j++)
    {
      if(iGoban.Grid[i][IndiceColumMax - j] == 'n')
      {
        oBlackPawnNumber[1][1] ++;
      }
      else if(iGoban.Grid[i][IndiceColumMax - j] == 'b')
      {
        oWhitePawnNumber[1][1] ++;
      }
    }
  }

  // Récuperer les pions du coin bas gauche
  for(i = 0 ; i <= iMaxLevel ; i++)
  {
    for(j = 0 ; j <= iMaxLevel ; j++)
    {
      if(iGoban.Grid[IndiceLineMax - i][j] == 'n')
      {
        oBlackPawnNumber[2][1] ++;
      }
      else if(iGoban.Grid[IndiceLineMax - i][j] == 'b')
      {
        oWhitePawnNumber[2][1] ++;
      }
    }
  }

  // Récuperer les pions du coin bas droit
  for(i = 0 ; i <= iMaxLevel ; i++)
  {
    for(j = 0 ; j <= iMaxLevel ; j++)
    {
      if(iGoban.Grid[IndiceLineMax - i][IndiceColumMax - j] == 'n')
      {
        oBlackPawnNumber[3][1] ++;
      }
      else if(iGoban.Grid[IndiceLineMax - i][IndiceColumMax - j] == 'b')
      {
        oWhitePawnNumber[3][1] ++;
      }
    }
  }

}
/** simulation IA : La méthode vérifie si chaque niveau de chaque coin est complété.

  \param [in] {CGoban} iGoban Goban
  \param [in] {int}    iMaxLevel Numéro du niveau maximum.
  \param [in] {Array}  oLevelIsCompleted Tableau qui signale si chaque niveau de chaque coin est complété.

  \return
  La méthode ne retourne pas de valeur.

  \note
  Le méthode est sous-méthode de la méthode IADefineCornerAndAeraLevel().
*/
CPlayer.prototype.IAVerifyIfEachLevelIsCompleted = function(iGoban, iMaxLevel, oLevelIsCompleted)
{
  var Indice = 0;
  var i = 0;
  var j = 0;
  var Mask = [];
  var Cpt = 0;

  // Initialiser le tableau des niveaux
  oLevelIsCompleted[IA_CORNER_TOP_LEFT] = [];
  oLevelIsCompleted[IA_CORNER_TOP_RIGHT] = [];
  oLevelIsCompleted[IA_CORNER_BOTTOM_LEFT] = [];
  oLevelIsCompleted[IA_CORNER_BOTTOM_RIGHT] = [];

  for(Indice = 0 ; Indice < iMaxLevel ; Indice++)
  {
    // Initialiser les niveaux
    oLevelIsCompleted[IA_CORNER_TOP_LEFT][Indice] = false;
    oLevelIsCompleted[IA_CORNER_TOP_RIGHT][Indice] = false;
    oLevelIsCompleted[IA_CORNER_BOTTOM_LEFT][Indice] = false;
    oLevelIsCompleted[IA_CORNER_BOTTOM_RIGHT][Indice] = false;

    // Récuperer le masque des territoires pour le coin haut gauche
    // et le niveau en cours
    Mask = this.IAGetMask(Indice + 1, IA_CORNER_TOP_LEFT, iGoban.Size);
    Cpt = 0;
    for(i = 0 ; i < Mask.length ; i++)
    {
      if(iGoban.Grid[Mask[i].Line][Mask[i].Column] != ' ')
      {
        Cpt ++;
      }
      else
      {
        i = Mask.length;
      }
    }

    if(Cpt == Mask.length)
    {
      oLevelIsCompleted[IA_CORNER_TOP_LEFT][Indice] = true;
    }

    // Récuperer le masque des territoires pour le coin haut droit
    // et le niveau en cours
    Mask = this.IAGetMask(Indice + 1, IA_CORNER_TOP_RIGHT, iGoban.Size);
    Cpt = 0;
    for(i = 0 ; i < Mask.length ; i++)
    {
      if(iGoban.Grid[Mask[i].Line][Mask[i].Column] != ' ')
      {
        Cpt ++;
      }
      else
      {
        i = Mask.length;
      }
    }

    if(Cpt == Mask.length)
    {
      oLevelIsCompleted[IA_CORNER_TOP_RIGHT][Indice] = true;
    }

    // Récuperer le masque des territoires pour le coin bas gauche
    // et le niveau en cours
    Mask = this.IAGetMask(Indice + 1, IA_CORNER_BOTTOM_LEFT, iGoban.Size);
    Cpt = 0;
    for(i = 0 ; i < Mask.length ; i++)
    {
      if(iGoban.Grid[Mask[i].Line][Mask[i].Column] != ' ')
      {
        Cpt ++;
      }
      else
      {
        i = Mask.length;
      }
    }

    if(Cpt == Mask.length)
    {
      oLevelIsCompleted[IA_CORNER_BOTTOM_LEFT][Indice] = true;
    }

    // Récuperer le masque des territoires pour le coin bas droit
    // et le niveau en cours
    Mask = this.IAGetMask(Indice + 1, IA_CORNER_BOTTOM_RIGHT, iGoban.Size);
    Cpt = 0;
    for(i = 0 ; i < Mask.length ; i++)
    {
      if(iGoban.Grid[Mask[i].Line][Mask[i].Column] != ' ')
      {
        Cpt ++;
      }
      else
      {
        i = Mask.length;
      }
    }

    if(Cpt == Mask.length)
    {
      oLevelIsCompleted[IA_CORNER_BOTTOM_RIGHT][Indice] = true;
    }
  }
}

/** simulation IA : La méthode récupère le masque des pions à positionner dans le goban.

  \param [in] {int} iAreaLevel  Niveau du territoire à conquérir (de 1 à 6).
  \param [in] {int} iCornerNumber  Numéro du coin (IA_CORNER_TOP_LEFT, IA_CORNER_TOP_RIGHT, IA_CORNER_BOTTOM_LEFT ou IA_CORNER_BOTTOM_RIGHT).
  \param [in] {int} iGobanSize  Taille du goban (CGOBAN_SMALL, CGOBAN_MEDIUM ou CGOBAN_LARGE).

  \return
  La méthode retourne le masque des pions à positionner dans le goban.
*/
CPlayer.prototype.IAGetMask = function(iAreaLevel, iCornerNumber, iGobanSize)
{
  var Mask = [];
  var IndiceLineMax = iGobanSize - 1;
  var IndiceColumMax = iGobanSize - 1;

  // Initialiser le masque
  if(iCornerNumber == IA_CORNER_TOP_LEFT)
  {
    switch(iAreaLevel)
    {
      case 1 :
        Mask[0] = new CCoordinate(0,1);
        Mask[1] = new CCoordinate(1,0);
        break;

      case 2 :
        Mask[0] = new CCoordinate(1,2);
        Mask[1] = new CCoordinate(2,1);
        break;

      case 3 :
        Mask[0] = new CCoordinate(0,3);
        Mask[1] = new CCoordinate(2,3);
        Mask[2] = new CCoordinate(3,0);
        Mask[3] = new CCoordinate(3,2);
        break;

      case 4 :
        Mask[0] = new CCoordinate(1,4);
        Mask[1] = new CCoordinate(3,4);
        Mask[2] = new CCoordinate(4,1);
        Mask[3] = new CCoordinate(4,3);
        break;

      case 5 :
        Mask[0] = new CCoordinate(0,5);
        Mask[1] = new CCoordinate(2,5);
        Mask[2] = new CCoordinate(4,5);
        Mask[3] = new CCoordinate(5,0);
        Mask[4] = new CCoordinate(5,2);
        Mask[5] = new CCoordinate(5,4);
        break;

      case 6 :
        Mask[0] = new CCoordinate(1,6);
        Mask[1] = new CCoordinate(3,6);
        Mask[2] = new CCoordinate(5,6);
        Mask[3] = new CCoordinate(6,1);
        Mask[4] = new CCoordinate(6,3);
        Mask[5] = new CCoordinate(6,5);
        break;
    }
  }
  else if(iCornerNumber == IA_CORNER_TOP_RIGHT)
  {
    switch(iAreaLevel)
    {
      case 1 :
        Mask[0] = new CCoordinate(0,IndiceColumMax - 1);
        Mask[1] = new CCoordinate(1,IndiceColumMax - 0);
        break;

      case 2 :
        Mask[0] = new CCoordinate(1,IndiceColumMax - 2);
        Mask[1] = new CCoordinate(2,IndiceColumMax - 1);
        break;

      case 3 :
        Mask[0] = new CCoordinate(0,IndiceColumMax - 3);
        Mask[1] = new CCoordinate(2,IndiceColumMax - 3);
        Mask[2] = new CCoordinate(3,IndiceColumMax - 0);
        Mask[3] = new CCoordinate(3,IndiceColumMax - 2);
        break;

      case 4 :
        Mask[0] = new CCoordinate(1,IndiceColumMax - 4);
        Mask[1] = new CCoordinate(3,IndiceColumMax - 4);
        Mask[2] = new CCoordinate(4,IndiceColumMax - 1);
        Mask[3] = new CCoordinate(4,IndiceColumMax - 3);
        break;

      case 5 :
        Mask[0] = new CCoordinate(0,IndiceColumMax - 5);
        Mask[1] = new CCoordinate(2,IndiceColumMax - 5);
        Mask[2] = new CCoordinate(4,IndiceColumMax - 5);
        Mask[3] = new CCoordinate(5,IndiceColumMax - 0);
        Mask[4] = new CCoordinate(5,IndiceColumMax - 2);
        Mask[5] = new CCoordinate(5,IndiceColumMax - 4);
        break;

      case 6 :
        Mask[0] = new CCoordinate(1,IndiceColumMax - 6);
        Mask[1] = new CCoordinate(3,IndiceColumMax - 6);
        Mask[2] = new CCoordinate(5,IndiceColumMax - 6);
        Mask[3] = new CCoordinate(6,IndiceColumMax - 1);
        Mask[4] = new CCoordinate(6,IndiceColumMax - 3);
        Mask[5] = new CCoordinate(6,IndiceColumMax - 5);
        break;
    }
  }
  else if(iCornerNumber == IA_CORNER_BOTTOM_LEFT)
  {
    switch(iAreaLevel)
    {
      case 1 :
        Mask[0] = new CCoordinate(IndiceLineMax - 0,1);
        Mask[1] = new CCoordinate(IndiceLineMax - 1,0);
        break;

      case 2 :
        Mask[0] = new CCoordinate(IndiceLineMax - 1,2);
        Mask[1] = new CCoordinate(IndiceLineMax - 2,1);
        break;

      case 3 :
        Mask[0] = new CCoordinate(IndiceLineMax - 0,3);
        Mask[1] = new CCoordinate(IndiceLineMax - 2,3);
        Mask[2] = new CCoordinate(IndiceLineMax - 3,0);
        Mask[3] = new CCoordinate(IndiceLineMax - 3,2);
        break;

      case 4 :
        Mask[0] = new CCoordinate(IndiceLineMax - 1,4);
        Mask[1] = new CCoordinate(IndiceLineMax - 3,4);
        Mask[2] = new CCoordinate(IndiceLineMax - 4,1);
        Mask[3] = new CCoordinate(IndiceLineMax - 4,3);
        break;

      case 5 :
        Mask[0] = new CCoordinate(IndiceLineMax - 0,5);
        Mask[1] = new CCoordinate(IndiceLineMax - 2,5);
        Mask[2] = new CCoordinate(IndiceLineMax - 4,5);
        Mask[3] = new CCoordinate(IndiceLineMax - 5,0);
        Mask[4] = new CCoordinate(IndiceLineMax - 5,2);
        Mask[5] = new CCoordinate(IndiceLineMax - 5,4);
        break;

      case 6 :
        Mask[0] = new CCoordinate(IndiceLineMax - 1,6);
        Mask[1] = new CCoordinate(IndiceLineMax - 3,6);
        Mask[2] = new CCoordinate(IndiceLineMax - 5,6);
        Mask[3] = new CCoordinate(IndiceLineMax - 6,1);
        Mask[4] = new CCoordinate(IndiceLineMax - 6,3);
        Mask[5] = new CCoordinate(IndiceLineMax - 6,5);
        break;
    }
  }
  else if(iCornerNumber == IA_CORNER_BOTTOM_RIGHT)
  {
    switch(iAreaLevel)
    {
      case 1 :
        Mask[0] = new CCoordinate(IndiceLineMax - 0,IndiceColumMax - 1);
        Mask[1] = new CCoordinate(IndiceLineMax - 1,IndiceColumMax - 0);
        break;

      case 2 :
        Mask[0] = new CCoordinate(IndiceLineMax - 1,IndiceColumMax - 2);
        Mask[1] = new CCoordinate(IndiceLineMax - 2,IndiceColumMax - 1);
        break;

      case 3 :
        Mask[0] = new CCoordinate(IndiceLineMax - 0,IndiceColumMax - 3);
        Mask[1] = new CCoordinate(IndiceLineMax - 2,IndiceColumMax - 3);
        Mask[2] = new CCoordinate(IndiceLineMax - 3,IndiceColumMax - 0);
        Mask[3] = new CCoordinate(IndiceLineMax - 3,IndiceColumMax - 2);
        break;

      case 4 :
        Mask[0] = new CCoordinate(IndiceLineMax - 1,IndiceColumMax - 4);
        Mask[1] = new CCoordinate(IndiceLineMax - 3,IndiceColumMax - 4);
        Mask[2] = new CCoordinate(IndiceLineMax - 4,IndiceColumMax - 1);
        Mask[3] = new CCoordinate(IndiceLineMax - 4,IndiceColumMax - 3);
        break;

      case 5 :
        Mask[0] = new CCoordinate(IndiceLineMax - 0,IndiceColumMax - 5);
        Mask[1] = new CCoordinate(IndiceLineMax - 2,IndiceColumMax - 5);
        Mask[2] = new CCoordinate(IndiceLineMax - 4,IndiceColumMax - 5);
        Mask[3] = new CCoordinate(IndiceLineMax - 5,IndiceColumMax - 0);
        Mask[4] = new CCoordinate(IndiceLineMax - 5,IndiceColumMax - 2);
        Mask[5] = new CCoordinate(IndiceLineMax - 5,IndiceColumMax - 4);
        break;

      case 6 :
        Mask[0] = new CCoordinate(IndiceLineMax - 1,IndiceColumMax - 6);
        Mask[1] = new CCoordinate(IndiceLineMax - 3,IndiceColumMax - 6);
        Mask[2] = new CCoordinate(IndiceLineMax - 5,IndiceColumMax - 6);
        Mask[3] = new CCoordinate(IndiceLineMax - 6,IndiceColumMax - 1);
        Mask[4] = new CCoordinate(IndiceLineMax - 6,IndiceColumMax - 3);
        Mask[5] = new CCoordinate(IndiceLineMax - 6,IndiceColumMax - 5);
        break;
    }
  }

  return Mask;
}

/** simulation IA : La méthode traque un pion adverse et tente de l'entourer.

  \param [in,out] {CGoban} ioGoban Goban

  \return
  La méthode retourne true si un pion adverse est traqué, sinon false.
*/
CPlayer.prototype.IAChase = function(ioGoban)
{
  var ValRet = false;
  var PawnFindNumber = 0;
  var Pawns = [];
  var Indice = 0;
  var Continue = true;

  // Rechercher les pions adverses qui ont 2 libertes
  this.IAFindPawnWithLiberty(ioGoban, 2, Pawns);
  do
  {
    if(Pawns.length > 0)
    {
      // Récupérer un pion au hasard
      Indice = Math.floor(Math.random()*Pawns.length);
      
      if(this.CheckPosition(ioGoban, Pawns[Indice].Line, Pawns[Indice].Column) == true)
      {
        ValRet = true;
        Continue = false;
      }
      else
      {
        // Supprimer le pion du tableau
        Pawns.splice(Indice, 1);
      }
    }
    else
    {
      Continue = false;
    }
  } while (Continue == true);

  if(ValRet == true)
  {
    return ValRet;
  }

  // Rechercher les pions adverses qui ont 3 libertes
  Pawns = [];
  this.IAFindPawnWithLiberty(ioGoban, 3, Pawns);
  do
  {
    if(Pawns.length > 0)
    {
      // Récupérer un pion au hasard
      Indice = Math.floor(Math.random()*Pawns.length);
      
      if(this.CheckPosition(ioGoban, Pawns[Indice].Line, Pawns[Indice].Column) == true)
      {
        ValRet = true;
        Continue = false;
      }
      else
      {
        // Supprimer le pion du tableau
        Pawns.splice(Indice, 1);
      }
    }
    else
    {
      Continue = false;
    }
  } while (Continue == true);

  if(ValRet == true)
  {
    return ValRet;
  }

  // Rechercher les pions adverses qui ont 4 libertes
  Pawns = [];
  this.IAFindPawnWithLiberty(ioGoban, 4, Pawns);
  do
  {
    if(Pawns.length > 0)
    {
      // Récupérer un pion au hasard
      Indice = Math.floor(Math.random()*Pawns.length);
      
      if(this.CheckPosition(ioGoban, Pawns[Indice].Line, Pawns[Indice].Column) == true)
      {
        ValRet = true;
        Continue = false;
      }
      else
      {
        // Supprimer le pion du tableau
        Pawns.splice(Indice, 1);
      }
    }
    else
    {
      Continue = false;
    }
  } while (Continue == true);

  return ValRet;
}

/** simulation IA : La méthode recherche les pions adverse qui n'ont plus que le nombre de liberté passé en paramètre.

  \param [in,out] {CGoban} ioGoban Goban
  \param [in] {int} iLibertyNumber  Nombre de liberté (de 2 à 4).
  \param [in,out] {Array} ioPawns  Tableau de coordonnés (classe CCoordinate) des pions trouvé.

  \return
  La méthode ne retourne pas de valeur.
*/
CPlayer.prototype.IAFindPawnWithLiberty = function(iGoban, iLibertyNumber, ioPawns)
{
  var i = 0;
  var j = 0;

  // Rechercher les pions adverses qui ont 2 libertes
  for(i = 0 ; i < iGoban.Size ; i++)
  {
    for(j = 0 ; j < iGoban.Size ; j++)
    {
      if(iGoban.Grid[i][j] == 'n')
      {
        this.IAAddPawnToLimitLiberty(iGoban, iLibertyNumber, ioPawns, i, j)
      }
    }
  }
}

/** simulation IA : La méthode ajoute les pions qui peuvent limiter les libertes d'un pion adverse.

  \param [in,out] {CGoban} ioGoban Goban
  \param [in] {int} iLibertyNumber  Nombre de liberté déjà conquise (de 0 à 3).
  \param [in,out] {Array} ioPawns  Tableau de coordonnés (classe CCoordinate) des pions trouvé.
  \param [in] {int} iLine  Numéro de la ligne du pion adverse dont il faut limiter les libertés (débute à 0).
  \param [in] {int} iColumn  Numéro de la colonne du pion adverse dont il faut limiter les libertés (débute à 0).

  \return
  La méthode ne retourne pas de valeur.
*/
CPlayer.prototype.IAAddPawnToLimitLiberty = function(iGoban, iLibertyNumber, ioPawns, iLine, iColumn)
{
  var liberty = 0;
  var i = 0;
  var j = 0;
  var Cpt = 0;
  var PawnsTemp = [];
  var AlreadyExist = false;

  for(liberty = 0 ; liberty < 4 ; liberty++)
  {
    switch(liberty)
    {
      case 0:
        i = iLine;
        j = iColumn - 1;
        break;

      case 1:
        i = iLine;
        j = iColumn + 1;
        break;

      case 2:
        i = iLine - 1;
        j = iColumn;
        break;

      case 3:
        i = iLine + 1;
        j = iColumn;
        break;
    }

    if(i >= 0)
    {
      if(i < iGoban.Size)
      {
        if(j >= 0)
        {
          if(j < iGoban.Size)
          {
            if(iGoban.Grid[i][j] == 'b')
            {
              // Incrémenter le nombre de liberté déjà prise
              Cpt++;
            }
            else if(iGoban.Grid[i][j] == ' ')
            {
              // Ajouter la position qui peut être prise
              PawnsTemp[PawnsTemp.length] = new CCoordinate(i,j);
            }
          }
        }
      }
    }

  }

  // Vérifier si le compteur correspond au nombre de liberté déjà prise
  if(Cpt == (4 - iLibertyNumber))
  {
    if(PawnsTemp.length > 0)
    {
      for(i = 0 ; i < PawnsTemp.length ; i++)
      {
        // Vérifier si la cellule est déjà dans le tableau
        AlreadyExist = false;
        for(j = 0 ; j < ioPawns.length ; j++)
        {
          if((PawnsTemp[i].Line == ioPawns[j].Line) &&  (PawnsTemp[i].Column == ioPawns[j].Column))
          {
            AlreadyExist = true;
            j = ioPawns.length;
          }
        }

        // Ajouter le pion à la liste des pions
        if(AlreadyExist == false)
        {
          ioPawns[ioPawns.length] = PawnsTemp[i]
        }
      }
    }
  }
}

/** simulation IA : La méthode positionne un pion aléatoirement.

  \param [in,out] {CGoban} ioGoban Goban

  \return
  La méthode retourne true si un pion a pu être positionné, sinon false.
*/
CPlayer.prototype.IARandom = function(ioGoban)
{
  var ValRet = true;
  var Mark = [];
  var X = 0;
  var Y = 0;
  var ValidatedPosition = false;
  var Cpt = 0;

  // Créer le tableau des marques
  for(i = 0; i < ioGoban.Size; i++)
  {
    Mark[i] = [];
    for(j = 0; j < ioGoban.Size; j++)
    {
      Mark[i][j] = '';
    }
  }

  do
  {
    X = Math.floor(Math.random()*ioGoban.Size);
    Y = Math.floor(Math.random()*ioGoban.Size);

    if(Mark[X][Y] != 'X')
    {
      ValidatedPosition = this.CheckPosition(ioGoban, X, Y);

      if(ValidatedPosition == false)
      {
        // Ajouter la position au tableau des marques
        Mark[X][Y] = 'X';

        // Vérifier si le tableau des marques est complet
        Cpt = 0;
        for(i = 0; i < ioGoban.Size; i++)
        {
          for(j = 0; j < ioGoban.Size; j++)
          {
            if(Mark[i][j] == 'X')
            {
              Cpt ++;
            }
          }
        }

        if(Cpt == (ioGoban.Size * ioGoban.Size))
        {
          // Arrêter le traitement
          ValidatedPosition = true;

          // Mettre à jour la valeur de retour
          ValRet = false;
        }
      }
    }

  }while(ValidatedPosition == false);

  return ValRet;
}

/** La méthode vérifie si la position est autorisée

  \param [in,out] {CGoban} ioGoban Goban
  \param [in] {int} iLine  Numéro de la ligne (débute à 0).
  \param [in] {int} iColumn  Numéro de la colonne (débute à 0).

  \return
  La méthode retourne true si la position est autorisée, sinon false.
*/
CPlayer.prototype.CheckPosition = function(ioGoban, iLine, iColumn)
{
  //Vérifier si l’intersection est vide
  if(ioGoban.CrossingIsEmpty(iLine, iColumn) == true)
  {
    //Vérifier si le joueur a joué cette position à son dernier tour 
    if((this.OldPosition.Line == iLine) && (this.OldPosition.Column == iColumn))
    {
      return false;
    }
    else
    {
      //Vérifier si l’emplacement est autorisé 
      if(ioGoban.StonePosition('b', iLine, iColumn) == true)
      {
        //Mettre à jour la dernière position du joueur 
        this.OldPosition.Line = iLine;
        this.OldPosition.Column = iColumn;

        return true;
      }
      else
      {
        return false;
      }
    }
  }

  return false;
}

