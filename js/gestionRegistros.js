//Gestión de registros en las distintas secciones

$('#eliminar').click(function(){//Eliminación de registros
	
	var valoresChecks=recorreChecks();
	
	if(valoresChecks['codigo0']==undefined){
		alert('Por favor, seleccione antes un registro del listado.');
	}
	else if(confirm('¿Está seguro/a de que desea eliminar los registros seleccionados?')){
		valoresChecks['elimina']='SI';
		creaFormulario(document.URL,valoresChecks,'post');//Cambiado el nombre del documento por la URL.
	}
});

$('#reactivar').click(function(){//Eliminación de registros
	var valoresChecks=recorreChecks();
	
	if(valoresChecks['codigo0']==undefined){
		alert('Por favor, seleccione antes un registro del listado.');
	}
	else if(confirm('¿Está seguro/a de que desea restaurar los registros seleccionados?')){
		valoresChecks['elimina']='NO';
		creaFormulario(document.URL,valoresChecks,'post');//Cambiado el nombre del documento por la URL.
	}
});


$('#enviarEmail').click(function(){//MODIFICACIÓN 25/09/2015: nuevo oyente para el envío de emails
	var valoresChecks=recorreChecks();
	
	if(valoresChecks['codigo0']==undefined){
		alert('Por favor, seleccione antes un destinatario del listado.');
	}
	else{
		creaFormulario($(this).attr('destino'),valoresChecks,'post');//Cambiado el nombre del documento por la URL.
	}
});


//El siguiente código hace desaparecer automáticamente los mensajes de resultado correcto tras 3 segundos
if($(".errorLogin .alert-success").html()!=undefined){
	setTimeout(function() {
		$(".errorLogin:not(:contains('Error'),:contains('Atención'))").fadeOut(3000);
	},3000);

	setTimeout(function() {
		$(".errorLogin:not(:contains('Error'),:contains('Atención'))").remove();
	},6000);
}

//Esta función crea un fomulario oculto y lo envía. Para su uso en combinación con los checks de los listados y los botones
function creaFormulario(destino, campos, metodo, target) {

	var form=document.createElement("form");

	form.setAttribute("method", metodo);
	form.setAttribute("action", destino);
	form.setAttribute("id", 'formularioEliminar');

	for(var clave in campos) {

		if(campos.hasOwnProperty(clave)) {
			var camposOcultos = document.createElement("input");
			camposOcultos.setAttribute("type", "hidden");
			camposOcultos.setAttribute("name", clave);
			camposOcultos.setAttribute("value", campos[clave]);

			form.appendChild(camposOcultos);
		}
	}

	document.getElementById('contenido').appendChild(form);

	if(target!=undefined){//Si se define el atributo target, se añade al formulario y éste se envía de forma normal
		form.setAttribute("target",target);    
	}
	
	form.submit();	
}


//Esta otra función recorre los checkbox marcados en los listados
function recorreChecks(){
	var valoresChecks=[];
	var i=0;
	
	$('input[name="codigoLista[]"]:checked').each(function() {
		valoresChecks['codigo'+i]=$(this).val();
		i++;
	});

	return valoresChecks;
}


$(document).on('click', '#todo', function(e){
	$(this).closest('table').find('tbody td input:checkbox').prop('checked',this.checked);
});

$('.todoTabla').click(function(e){
	$(this).parents('table').find('td input:checkbox').prop('checked',this.checked);
});

//Nueva función para desactivar los botones no disponibles en la versiones demo:
$('a.demo,button.demo').unbind();
$(document).on('click','a.demo,button.demo',function(e){
	e.preventDefault();
	alert('Función no disponible en la versión demo.')
});

//Para evitar re-envío de datos de formularios
if (window.history.replaceState) { //Verificamos disponibilidad de manipulación de historial
	window.history.replaceState(null, null, window.location.href);
}