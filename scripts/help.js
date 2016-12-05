$(document).ready(function(){

  $(".text_help").hide();

  $("h5").click(function(){
    
    if($(this).hasClass("active"))
    {
      //fermer question en cours
    $("h5.active").next().slideUp();
    $("h5.active").removeClass("active")
    
    }
    else{
      //fermer question en cours
    $("h5.active").next().slideUp();
    $("h5.active").removeClass("active")
    
    //ouvrir nouvelle question
    $(this).next().slideDown();
    $(this).addClass("active");
    }
  });
});