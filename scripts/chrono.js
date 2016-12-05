duree=globGoGame.Chrono;
function t()
{
  var compteur=document.getElementById('compteur');
  s=duree;
  m=0;
  if(s < 0)
  {
    compteur.innerHTML="You only have 30 s left per turn";
    tJ1();
  }
  else
  {
    if(s>59)
    {
      m=Math.floor(s/60);
      s=s-m*60;
    }
    if(m>59)
    {
      h=Math.floor(m/60);
      m=m-h*60;
    }
    if(s<10)
    {
      s="0"+s;
    }
    if(m<10)
    {
      m="0"+m;
    }
    compteur.innerHTML=m+":"+s;
    duree=duree-1;
    globGoGame.Chrono = duree;
    window.setTimeout("t();",999);
    return globGoGame.Chrono;
  }
}            



//fonction appelée à la fin de game / onselect house
duree2="30";



function tJ1()
{
  var compteur2=document.getElementById('compteurJ1');
  var seconde=duree2;
  var min=0;
  var heur = 0;
  if(min == 0 && seconde < 0)
  {
    globGoGame.End();
  }
  else
  {
    if(seconde>59)
    {
      min=Math.floor(sseconde/60);
      seconde=seconde-min*60;
    }
    if(min>59)
    {
      heur=Math.floor(min/60);
      min=min-heur*60;
    }
    if(seconde<10)
    {
      seconde="0"+seconde;
    }
    if(min<10)
    {
      min="0"+min;
    }
      compteur2.innerHTML=min+":"+seconde;
      duree2=duree2-1;
      window.setTimeout("tJ1();",999);
  }
}