/** Classe de gestion d'une maison dans le jeu de go.

  \param [in] {int} iHouseNb Le numéro de la maison (commence à 0)
  \param [in] {string} iHouseName Nom associé à la maison. Note : le nom de la maison correspond au nom du ficher image associé.
  \param [in] {int} iHousePower Le numéro du poivoir associé à la maison (de 1 à 4)

*/
function CHouse(iHouseNb, iHouseName, iHousePower)
{
  //Numéro de la maison
  this.HouseNb = iHouseNb;

  // Largeur de l'image de la maison en pixels
  this.WidthPx = 230;

  // Hauteur de l'image de la maison en pixels
  this.HeightPx = 276;

  // Chemin de l'image de la maison activée
  this.ActivedHousePath = "./images/blasons/"+iHouseName+"1.png";

  // Chemin de l'image de la maison désactivée
  this.DeactivatedHousePath = "./images/blasons/"+iHouseName+"2.png";

  // Chemin de l'image de la pierre associé à la maison
  this.PawnPath = "./images/pions/"+iHouseName+".png";

  //Chemin de l'image de la pierre du territoire associé à la maison
  this.AreaPath = "./images/pions/"+iHouseName+"3.png";

  // Numéro du pouvoir associé à la maison
  this.PowerNumber = iHousePower;

  // Chemin de l'image de la pierre associé au pouvoir 1 (foudre)
  this.Power1 = "./images/pions/"+iHouseName+"4.gif";

  // Chemin de l'image de la pierre associé au pouvoir 2 (neige)
  this.Power2 = "./images/pions/"+iHouseName+"5.gif";

  // Chemin de l'image de la pierre associé au pouvoir 3 (disparition)
  this.Power3 = "./images/pions/"+iHouseName+"6.gif";

  // Chemin de l'image de la pierre associé au pouvoir 4 (feu)
  this.Power4 = "./images/pions/"+iHouseName+"7.gif";
}

/** La méthode récupère le chemin d'accès à l'image du pion losque le pouvoir passé en paramètre est activé

  \param [in] {int} iHouseNb Le numéro de la maison (commence à 0)
  \param [in] {string} iHouseName Nom associé à la maison. Note : le nom de la maison correspond au nom du ficher image associé.
  \param [in] {int} iHousePower Le numéro du poivoir associé à la maison (de 1 à 4)

*/
CHouse.prototype.PowerImg = function (iPowerNumber)
{
  var valret = '';
  switch(iPowerNumber)
  {
    case 1:
      valret = this.Power1;
      break;

    case 2:
      valret = this.Power2;
      break;

    case 3:
      valret = this.Power3;
      break;

    case 4:
      valret = this.Power4;
      break;
  }

  return valret;
}
