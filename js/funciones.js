//Oyente para mostrar/ocultar el contenido de un campo password
$('.mostrarClave,#mostrarClave').click(function(){
  var estado=$(this).attr('estado');
  if(estado=='ver'){
    var campo=$(this).parent().parent().find('input[type=password]');
    campo.get(0).type='text';
    $(this).html('Ocultar clave');
    $(this).attr('estado','oculto');
  }
  else{
    var campo=$(this).parent().parent().find('input[type=text]');
    campo.get(0).type='password';
    $(this).html('Mostrar clave');
    $(this).attr('estado','ver');
  }
});

  
//Oyente para validación de CIF
$(".validaCIF").on('change',function(){
    //validaCIF($(this).val());
    if(!validaCifDniNIE($(this).val())){
      alert('CIF/NIF no válido');
    }
});

//Oyente para validación de DNI
$(".validaDNI").on('change',function(){
    //validaDNI($(this).val());
    if(!validaCifDniNIE($(this).val())){
      alert('DNI no válido');
    }
});

function formateaNumeroCalculo(num){ //MODIFICACIÓN OFICINA 12/06/2015
  var numero=num.toString();
   numero=numero.replace('.','');
   numero=numero.replace(',','.');
   numero=numero.replace(' €','');
   if(numero==''){
       numero=0;
   }

   /* ! TODO ANTONIO
   if (numero.split('.').length > 2) // Significa que tiene mas de un .
   {  
      var puntoFinal = numero.split('.').length - 1; // Longitud del numero en base a .
      var decimal = numero.split('.')[puntoFinal]; // Obtenemos el valor decimal
      var i = 0; // Contador
      var entero = ""; // Para ir concatenando los enteros como string
      while (i <= puntoFinal - 1) { // Mientras el contador sea menor que el numero de decimales
          entero = entero + numero.split('.')[i]; // Concatenamos los enteros
          i++; // Incrementamos el contador
      } 
      numero = entero + "." + decimal; // Por ultimo concatenamos el decimal
   }
   */


   return parseFloat(numero);
}

function formateaNumeroWeb(num){  //MODIFICACIÓN OFICINA 12/06/2015
  var numero=parseFloat(num);
  var numero=redondearDecimales(numero); //numero.toFixed(2).toString();
  numero=numero.replace('.',',');
  if(numero=='NaN'){
    numero='';
  }
  return numero;
}

function formateaNumeroWebConMiles(num){  //MODIFICACIÓN 23/03/2020
  var numero=formateaNumeroWeb(num);
  if(numero!=''){
    partes=numero.split(',');
    numero='';
    var j=0;
    for(var i=(partes[0].length-1);i>=0;i--){
      j++;
      numero=(partes[0][i])+numero;
      if(j==3 && i!=0){
        numero='.'+numero;
        j=0;
      }
    }
    numero+=','+partes[1];
  }
  return numero;
}

function redondearDecimales(numero) {
  var nDecimales = numero.toString().split(".");
  nDecimales = nDecimales[1]?.length || 0;
  var multiplicador = 0;  
  switch (nDecimales) {
      case 3:
          multiplicador = 100;
          break;
      case 4:
          multiplicador = 1000;
          break;
  }   
  if (multiplicador != 0) 
  {
       numero = Math.round((parseFloat(numero) * multiplicador)) / multiplicador;
  }
  return numero.toFixed(2).toString();
}

function obtieneFilaCampo(campo){
  return campo.attr('id').replace(/\D/g,'');//Expresión regular que elimina las letras del id, para quedarse solo con el número de fila
}

function validaDNI(dni) {
  var numero
  var let
  var letra
  var expresion_regular_dni

  expresion_regular_dni = /^\d{8}[a-zA-Z]$/;
  expresion_regular_nie = /^[xyzXYZ]{1}[0-9]{7}[a-zA-Z]{1}$/i;

  if(expresion_regular_dni.test (dni) == true){
    numero = dni.substr(0,dni.length-1);
    let = dni.substr(dni.length-1,1);
    numero = numero % 23;
    letra='TRWAGMYFPDXBNJZSQVHLCKET';
    letra=letra.substring(numero,numero+1);
    if (letra!=let.toUpperCase()) {
       alert('DNI erróneo, la letra no corresponde con el NIF');
       return false;
    }
  }
  else if(expresion_regular_nie.test (dni) == false){
    alert('DNI erróneo, formato no válido');
    return false;
  }

  return true;
}


function validaCIF(cif){
    //Quitamos el primer caracter y el ultimo digito
    var valueCif=cif.substr(1,cif.length-2);

    var suma=0;

    //Sumamos las cifras pares de la cadena
    for(i=1;i<valueCif.length;i=i+2){
        suma=suma+parseInt(valueCif.substr(i,1));
    }

    var suma2=0;

    //Sumamos las cifras impares de la cadena
    for(i=0;i<valueCif.length;i=i+2){

        var result=parseInt(valueCif.substr(i,1))*2;
        if(String(result).length==1){
            // Un solo caracter
            suma2=suma2+parseInt(result);
        }
        else{
            // Dos caracteres. Los sumamos...
            suma2=suma2+parseInt(String(result).substr(0,1))+parseInt(String(result).substr(1,1));
        }
    }

    // Sumamos las dos sumas que hemos realizado
    suma=suma+suma2;

    var unidad = String(suma).substr(String(suma).length - 1, 1);
    unidad=10-parseInt(unidad);

    var primerCaracter=cif.substr(0,1).toUpperCase();

    var lastchar=cif.substr(cif.length-1,1);
    var lastcharchar=lastchar;

    if(!isNaN(lastchar)) {
        lastcharchar=String.fromCharCode(64+parseInt(lastchar));
    }

    if(primerCaracter.match(/^[FJKNPQRSUVW]$/)) {
        //Empieza por .... Comparamos la ultima letra
        if(String.fromCharCode(64+unidad).toUpperCase()==lastcharchar) {
            return true;
        }
    }
    else if(primerCaracter.match(/^[XYZ]$/)){
        return validaDNI(cif);
    }
    else if(primerCaracter.match(/^[ABCDEFGHLM]$/)){
        //Se revisa que el último valor coincida con el cálculo
        if(unidad==10){
            unidad=0;
        }
        if(cif.substr(cif.length-1,1)==String(unidad)){
            return true;
        }
        else{
            //Se valida como un DNI
            return validaDNI(cif);
        }
    }
    else{
        return validaDNI(cif);
    }
    
    alert('CIF no válido');
    return false;
}

function fechaActual(formatoBD=false){
  var hoy = new Date();
  var dd = hoy.getDate();
  var mm = hoy.getMonth()+1; //hoy es 0!
  var yyyy = hoy.getFullYear();

  if(dd<10) {
      dd='0'+dd;
  } 

  if(mm<10) {
      mm='0'+mm;
  } 

  if(formatoBD){
    hoy=yyyy+'-'+mm+'-'+dd;
  } else {
    hoy = dd+'/'+mm+'/'+yyyy;
  }
  return hoy;
} 




//Función obtenida de: https://gist.github.com/afgomez/5691823
validaCifDniNIE = (function() {
  'use strict';
  
  var DNI_REGEX = /^(\d{8})([A-Z])$/;
  var CIF_REGEX = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
  var NIE_REGEX = /^[XYZ]\d{7,8}[A-Z]$/;

  var validaCifDniNIE = function( str ) {

    // Ensure upcase and remove whitespace
    str = str.toUpperCase().replace(/\s/, '');

    var valid = false;
    var type = spainIdType( str );

    switch (type) {
      case 'dni':
        valid = validDNI( str );
        break;
      case 'nie':
        valid = validNIE( str );
        break;
      case 'cif':
        valid = validCIF( str );
        break;
    }

    /*return {
      type: type,
      valid: valid
    };*/

    return valid;

  };

  var spainIdType = function( str ) {
    if ( str.match( DNI_REGEX ) ) {
      return 'dni';
    }
    if ( str.match( CIF_REGEX ) ) {
      return 'cif';
    }
    if ( str.match( NIE_REGEX ) ) {
      return 'nie';
    }
  };

  var validDNI = function( dni ) {
    var dni_letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    var letter = dni_letters.charAt( parseInt( dni, 10 ) % 23 );
    
    return letter == dni.charAt(8);
  };

  var validNIE = function( nie ) {

    // Change the initial letter for the corresponding number and validate as DNI
    var nie_prefix = nie.charAt( 0 );

    switch (nie_prefix) {
      case 'X': nie_prefix = 0; break;
      case 'Y': nie_prefix = 1; break;
      case 'Z': nie_prefix = 2; break;
    }

    return validDNI( nie_prefix + nie.substr(1) );

  };

  var validCIF = function( cif ) {

    var match = cif.match( CIF_REGEX );
    var letter  = match[1],
        number  = match[2],
        control = match[3];

    var even_sum = 0;
    var odd_sum = 0;
    var n;

    for ( var i = 0; i < number.length; i++) {
      n = parseInt( number[i], 10 );

      // Odd positions (Even index equals to odd position. i=0 equals first position)
      if ( i % 2 === 0 ) {
        // Odd positions are multiplied first.
        n *= 2;

        // If the multiplication is bigger than 10 we need to adjust
        odd_sum += n < 10 ? n : n - 9;

      // Even positions
      // Just sum them
      } else {
        even_sum += n;
      }

    }

    //Parche
    //Línea original: var control_digit = (10 - (even_sum + odd_sum).toString().substr(-1) );
    var ultimoDigito=(even_sum + odd_sum).toString().substr(-1)
    var control_digit=0;
    if(parseInt(ultimoDigito)>0){
      control_digit = (10 - (even_sum + odd_sum).toString().substr(-1) );
    }
    //Fin parche
    
    var control_letter = 'JABCDEFGHI'.substr( control_digit, 1 );

    // Control must be a digit
    if ( letter.match( /[ABEH]/ ) ) {
      return control == control_digit;

    // Control must be a letter
    } else if ( letter.match( /[KPQS]/ ) ) {
      return control == control_letter;

    // Can be either
    } else {
      return control == control_digit || control == control_letter;
    }

  };

  return validaCifDniNIE;
})();