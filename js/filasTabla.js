function insertaFila(tabla){
    //Clono la última fila de la tabla
    var $tr = $('#'+tabla).find("tbody tr:last").clone();

    //Si existe un campo de descarga, creo un input file junto a él
    var nombreDescarga=$tr.find('.descargaFichero').attr('nombre');
    $tr.find('.descargaFichero').after("<input type='file' name='"+nombreDescarga+"' id='"+nombreDescarga+"' />");

    //Obtengo el atributo name para los inputs y selects
    $tr.find("input:not([name='filasTabla[]'],.input-block-level),select,textarea").attr("name", function(){
        return obtenerName(this.name);
    }).attr("id", function(){
        return this.name;
    });


    $tr.find("input[name='filasTabla[]']").attr("value", function(){
        var valor=parseInt(this.value);
        return valor+parseInt(1);
    });
    
    $tr.find("button:not(.selectpicker)").attr("id", function(){//Para los botones de cálculo
        var parts = this.id.match(/(\D+)(\d*)$/);
        if(parts!=null){
            return parts[1] + ++parts[2];    
        }
        
    });

    $tr.find(".botonSelectAjax").attr("id", function(){//Para los botones de los desplegables con búsqueda por AJAX (LAE y similares)
        var parts = this.id.match(/(\D+)(\d*)$/);
        return parts[1] + ++parts[2];
    });


    $tr.find("input:not([type=checkbox],[type=radio]),textarea").attr("value","");
	$tr.find("input[type=checkbox]").removeAttr("checked");//Para quitar el check a la nueva fila clon de la anterior
    $tr.find("select").val("NULL");
    $tr.find('.bootstrap-select').remove();//Eliminación de los selectpicker
    $tr.find('.bootstrap-filestyle').remove();//Eliminación de los filestyle
    $tr.find('.descargaFichero').remove();//Eliminación del enlace de descarga, si lo hubiere

    //Añado la nueva fila a la tabla
    $('#'+tabla).find("tbody tr:last").after($tr);
    
    if(typeof jQuery.fn.selectpicker=='function'){//Compruebo que esté cargada la librería selectpicker, y en ese caso la inicializo para los select de la nueva fila
        $tr.find(".selectpicker").selectpicker('refresh');
    }
    if(typeof jQuery.fn.filestyle=='function'){//Misma operación para el filestyle
        $tr.find(':file').filestyle({input: false, iconName: "icon-folder-open", buttonText: "Seleccionar..."});
    }
    if(typeof jQuery.fn.rating=='function'){//Misma operación para el input-rating
        var campoRating=$tr.find('.rating');//La librería bootstrap-rating-input mete el input dentro de un div, por lo que primero rescato el input...
        $tr.find('.rating-input').replaceWith(campoRating);//... y sustituyo el div por él (si no crearía 2 filas de estrellas)
        campoRating.rating();//Inicializo la librería sobre el input
    }

    $('.hasDatepicker').datepicker({format:'dd/mm/yyyy',weekStart:1}).on('changeDate',function(e){$(this).datepicker('hide');});
}

function eliminaFila(tabla){
  if($('#'+tabla).find("tbody tr").length>1){//Si la tabla tiene más de 1 fila...
    var filasSeleccionadas=0;
    $('input[name="filasTabla[]"]:checked').each(function() {
        var fila=$(this).val()-filasSeleccionadas;
        $('#'+tabla+' tr').eq(fila).remove();
        filasSeleccionadas++;
    });

    if(filasSeleccionadas>0){
        //Renumeración de los índices de la tabla
        var numFilas=$('#'+tabla+' tr:not(:first)').length;
        for(i=0;i<numFilas;i++){
           $('#'+tabla+' tr:not(:first)').eq(i).find("input:not([name='filasTabla[]'],.input-block-level),select,textarea").attr("name", function(){
                return obtenerName(this.name,i);
            }).attr("id", function(){
                return this.name
            });

            $('#'+tabla+' tr:not(:first)').eq(i).find("input[name='filasTabla[]']").attr("value", function(){
                var j=i+1
                return j;
            });
        }
        //Fin renumeración
    }
    else{
        alert('Para eliminar un registro, debe seleccionarlo utilizando el último check que tiene a su derecha.');
    }
  }
  else{
    alert('La tabla debe de contar con al menos 1 fila.');
  }
}

function obtenerName(name,indice=''){
    var res='';
    //Compruebo si el campo es un array (select multiple)
    var esArray='';
    if(name.includes('[]')){
        esArray='[]';
        name=name.replace('[]','');
    }
    //Expresión regular para separar el nombre del campo y el numero de fila del name y el id
    var parts = name.match(/(\D+)(\d*)$/);
    //Pregunta si el indice ya viene definido o no
    if(indice===''){
        //Creo un nombre nuevo incrementando el número de fila
        res = parts[1] + ++parts[2] + esArray;
    } else {
        //Creo un nombre nuevo añadiendo el indice
        res = parts[1] + indice + esArray;
    }
    return res;
}

function insertaFilaGestion(tabla){
    //Clono la última fila de la tabla
    var $tr = $('#'+tabla+" > tbody > tr:last").clone();

    //Si existe un campo de descarga, creo un input file junto a él
    var nombreDescarga=$tr.find('.descargaFichero').attr('nombre');
    $tr.find('.descargaFichero').after("<input type='file' name='"+nombreDescarga+"' id='"+nombreDescarga+"' />");

    //Obtengo el atributo name para los inputs y selects
    $tr.find("input:not([name='filasTabla[]'],.input-block-level),select,textarea").attr("name", function(){
        return obtenerName(this.name,true);
    }).attr("id", function(){//Hago lo mismo con los IDs
        return obtenerID(this.id,true);
    });

    $tr.find(".table").attr("id", function(){//Para el identificador de la subtabla padre
        parts=this.id.split('_');
        var parts1 = parts[0].match(/(\D+)(\d*)$/);
        return parts1[1] + ++parts1[2] +'_'+parts[1];
    });

    $tr.find(".btn-success").attr("onclick", function(){//Para los botones de añadir alumno
        parts=$(this).attr('onclick').split('_');
        var parts1 = parts[0].match(/(\D+)(\d*)$/);
        return "insertaFila2"+parts1[1] + ++parts1[2] +'_'+parts[1];
    });

    $tr.find(".btn-danger").attr("onclick", function(){//Para los botones de añadir alumno
        parts=$(this).attr('onclick').split('_');
        var parts1 = parts[0].match(/(\D+)(\d*)$/);
        return "eliminarFila2"+parts1[1] + ++parts1[2] +'_'+parts[1];
    });


    $tr.find("input[name='filasTabla[]']").attr("value", function(){
        var valor=parseInt(this.value);
        return valor+parseInt(1);
    });
    
    $tr.find("button:not(.selectpicker)").attr("id", function(){//Para los botones de cálculo
        var parts = this.id.match(/(\D+)(\d*)$/);
        return parts[1] + ++parts[2];
    });

    $tr.find("input:not([type=checkbox],[type=radio]),textarea").attr("value","");
    $tr.find("select").val("NULL");
    $tr.find('.bootstrap-select').remove();//Eliminación de los selectpicker
    $tr.find('.bootstrap-filestyle').remove();//Eliminación de los filestyle
    $tr.find('.descargaFichero').remove();//Eliminación del enlace de descarga, si lo hubiere
    $tr.find(".existeGestion").val("NO");
    //Añado la nueva fila a la tabla
    $('#'+tabla+" > tbody > tr:last").after($tr);
    
    if(typeof jQuery.fn.selectpicker=='function'){//Compruebo que esté cargada la librería selectpicker, y en ese caso la inicializo para los select de la nueva fila
        $tr.find(".selectpicker").selectpicker('refresh');
    }
    if(typeof jQuery.fn.filestyle=='function'){//Misma operación para el filestyle
        $tr.find(':file').filestyle({input: false, iconName: "icon-folder-open", buttonText: "Seleccionar..."});
    }
    if(typeof jQuery.fn.rating=='function'){//Misma operación para el input-rating
        var campoRating=$tr.find('.rating');//La librería bootstrap-rating-input mete el input dentro de un div, por lo que primero rescato el input...
        $tr.find('.rating-input').replaceWith(campoRating);//... y sustituyo el div por él (si no crearía 2 filas de estrellas)
        campoRating.rating();//Inicializo la librería sobre el input
    }
    $('.hasDatepicker').datepicker({format:'dd/mm/yyyy',weekStart:1}).on('changeDate',function(e){$(this).datepicker('hide');});
}

function obtenerID(id,losDos=false){
    var parts = id.split('_');
    var parts1 = parts[0].match(/(\D+)(\d*)$/);
    var parts2 = parts[1].match(/(\D+)(\d*)$/);
    if(id.indexOf("_gestion")>0){
      if(losDos){
        id = parts[0] +'_'+parts2[1] + ++parts2[2] +'_'+parts[2];
      } else {
        id = parts1[1] + ++parts1[2] +'_'+parts[1];
      }
    }
    return id;
  }