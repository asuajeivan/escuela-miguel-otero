//Funcion que se ejecutará al inicio

function init() {
	
	//Oculta el formulario al cargar la pagina
	mostrarform(false);

	//Muestra la lista de representantes
	listar();

	//Se ejecuta cuando se envia el formulario
	$([representante]).on('submit', function (event) {
		if ($([representante])[0].checkValidity()) {
			guardaryeditar(event);
		}
		else {
			scrollTo(0,100);
		}
	});

	//Se ejecuta al quitar el foco del input cedula
	$('#cedula').on('blur', function () {

		if ($('#cedula')[0].value == '') {
			$('#cedula').removeClass('is-valid');
		}
		comprobarRepresentante();
		comprobarPersona();
	});

	//Se ejecuta al seleccionar un elemento del select documento
	$('#documento').on('change', function () {
		comprobarRepresentante();
		comprobarPersona();
	});

	//Carga los estados al select
	estados();

	//Comprueba cada cambio en el select de estado
	$('#estado').on('change', function () {
		estado = $('#estado')[0].value;
		if (estado != '') {
			$('#municipio').prop('disabled', false);
			municipios(estado);

			$('#parroquia').html('<option value="">Seleccione</option>');
			$('#parroquia').prop('disabled', true);
			$('#parroquia').selectpicker('refresh');
		}
		else {
			$('#municipio').html('<option value="">Seleccione</option>');
			$('#municipio').prop('disabled', true);
			$('#municipio').selectpicker('refresh');

			$('#parroquia').html('<option value="">Seleccione</option>');
			$('#parroquia').prop('disabled', true);
			$('#parroquia').selectpicker('refresh');
		}
	});

	//Comprueba cada cambio en el select de municipio
	$('#municipio').on('change', function () {
		municipio = $('#municipio')[0].value;
		if (municipio != '') {
			$('#parroquia').prop('disabled', false);
			parroquias(municipio);
		}
		else {
			$('#parroquia').html('<option value="">Seleccione</option>');
			$('#parroquia').prop('disabled', true);
			$('#parroquia').selectpicker('refresh');
		}
	});

	tabla.ajax.reload();
			
}

//Comprueba que el representante no esté registrado
function comprobarRepresentante() {
	var documento = $('#documento')[0].value;
	var cedula = $('#cedula')[0].value;


	if (documento != '' && cedula != '') {

		if (documento == 'venezolano') {
			documento = 'V-';
		}
		else if (documento == 'extranjero') {
			documento = 'E-';
		}
		else if (documento == 'pasaporte') {
			documento = 'P-';
		}

		cedula = documento+cedula;

		$.ajax({
			url: '../controladores/representante.php?op=comprobarrepresentante',
			type: 'POST',
			data: {cedula: cedula},
			success: function (datos) {
				if (datos != 'null') {
					$('#cedula').removeClass('is-valid');
					$('#cedula').addClass('is-invalid');
					$('#mensajeCedula').html('El representante ya se encuentra registrado');
				}
				else {
					$('#cedula').removeClass('is-invalid');
					$('#cedula').addClass('is-valid');
				}
			}
		});
	}
}

//Comprueba que la persona no esté registrada
function comprobarPersona() {
	var documento = $('#documento')[0].value;
	var cedula = $('#cedula')[0].value;

	if (documento != '' && cedula != '') {

		if (documento == 'venezolano') {
			documento = 'V-';
		}
		else if (documento == 'extranjero') {
			documento = 'E-';
		}
		else if (documento == 'pasaporte') {
			documento = 'P-';
		}

		cedula = documento+cedula;

		$.ajax({
			url: '../controladores/representante.php?op=comprobarrepresentante',
			type: 'POST',
			data: {cedula: cedula},
			success: function (datos) {
				datosRepresentante = datos;
				$.ajax({
					url: '../controladores/representante.php?op=comprobarpersona',
					type: 'POST',
					data: {cedula: cedula},
					success: function (datosPersona) {
						if (datosRepresentante == 'null' && datosPersona != 'null') {
							data = JSON.parse(datosPersona);
							$('#p_nombre').val(data.p_nombre);
							$('#s_nombre').val(data.s_nombre);
							$('#p_apellido').val(data.p_apellido);
							$('#s_apellido').val(data.s_apellido);
							$('#genero').val(data.genero);
							$('#genero').selectpicker('refresh');
							$('#f_nac').val(data.f_nac);
							$('#email').val(data.email);
							$('#celular').val(data.celular);
							$('#fijo').val(data.fijo);
							$('#estado').val(data.idestado);
							$('#estado').selectpicker('refresh');
							if (data.idmunicipio != null) {
								$('#municipio').html('<option value="'+data.idmunicipio+'">'+data.municipio+'</option>');
								$('#municipio').prop('disabled', false);
								$('#municipio').selectpicker('refresh');	
							}
							if (data.idparroquia != null) {
								$('#parroquia').html('<option value="'+data.idparroquia+'">'+data.parroquia+'</option>');
								$('#parroquia').prop('disabled', false);
								$('#parroquia').selectpicker('refresh');
							}
							$('#direccion').val(data.direccion);
							$('#idpersona').val(data.id);
						}
					}
				});
			}
		});
	}
}

//Función para mostrar los estados
function estados() {
	$.post('../controladores/representante.php?op=listarestados', function (data) {
		$('#estado').append(data);
	});
}

//Función para mostrar los municipios
function municipios(idestado) {
	$.post('../controladores/representante.php?op=listarmunicipios&idestado='+idestado, function (data) {
		$('#municipio').html('<option value="">Seleccione</option>');
		$('#municipio').append(data);
		$('#municipio').selectpicker('refresh');
	});
}

//Función para mostrar las parroquias
function parroquias(idmunicipio) {
	$.post('../controladores/representante.php?op=listarparroquias&idmunicipio='+idmunicipio, function (data) {
		$('#parroquia').html('<option value="">Seleccione</option>');
		$('#parroquia').append(data);
		$('#parroquia').selectpicker('refresh');
	});
}

//Función para guardar y editar 
function guardaryeditar(event) {
	event.preventDefault(); //Evita que se envíe el formulario automaticamente
	// 
	$('#btnGuardar').prop('disabled', true); //Deshabilita el botón submit para evitar que lo presionen dos veces
	var formData = new FormData($([representante])[0]); //Se obtienen los datos del formulario
	
	var documento = formData.get('documento'); //Se obtiene el tipo de documento
	documento = tipo_documento(documento);//Se llama la función que lo transforma Ej: 'Venezolano' = V-
	
	var cedula = formData.get('cedula');// Se obtiene la cédula 
	
	formData.set('cedula', documento+cedula);//Se le asigna a la cédula del formData el tipo de documento

	$.ajax({
		url: '../controladores/representante.php?op=guardaryeditar', //Dirección a donde se envían los datos
		type: 'POST', //Método por el cual se envían los datos
		data: formData, //Datos
		contentType: false, //Este parámetro es para mandar datos al servidor por el encabezado
		processData: false, //Evita que jquery transforme la data en un string
		success: function (datos) {
			if (datos == 'true') {
				const Toast = Swal.mixin({
				  toast: true,
				  position: 'top-end',
				  showConfirmButton: false,
				  timer: 3000
				});

				Toast.fire({
				  type: 'success',
				  title: 'Representante registrado exitosamente :)'
				});
			}
			if (datos == 'update') {
				const Toast = Swal.mixin({
				  toast: true,
				  position: 'top-end',
				  showConfirmButton: false,
				  timer: 3000
				});

				Toast.fire({
				  type: 'success',
				  title: 'Representante actualizado exitosamente :)'
				});
			}
			else {

				const Toast = Swal.mixin({
				  toast: true,
				  position: 'top-end',
				  showConfirmButton: false,
				  timer: 3000
				});

				Toast.fire({
				  type: 'error',
				  title: 'Ocurrió un error y no se pudo registrar :('
				});
			}

			mostrarform(false);
			limpiar();
			tabla.ajax.reload();//Recarga la tabla con el listado sin refrescar la página

		}

	});		
}

//Función para listar los registros
function listar() {
	tabla = $('#tblistado').DataTable({
		"processing": true,
		pagingType: "first_last_numbers",
		language: {
			"info":           "Mostrando desde _START_ hasta _END_ de _TOTAL_ registros",
			"lengthMenu":     "Mostrar _MENU_ entradas",
			"loadingRecords": "Cargando...",
		    "processing":     "Procesando...",
		    "search":         "Buscar:",
			"emptyTable":     "No hay datos para mostrar",
			"infoEmpty":      "Mostrando 0 hasta 0 de 0 entradas",
			"paginate": {
	        "first":      "Primero",
	        "last":       "Último"
	    	},
		},
		dom: 'lfrtip', 
		"destroy": true, //Elimina cualquier elemente que se encuentre en la tabla
		"ajax": {
			url: '../controladores/representante.php?op=listar',
			type: 'GET',
			dataType: 'json'
		},
		'order': [[0, 'desc']]
	});
}

//Función para mostrar un registro para editar
function mostrar(idrepresentante) {
	$.post('../controladores/representante.php?op=mostrar',{idrepresentante: idrepresentante}, function (data) {	
		data = JSON.parse(data);
		mostrarform(true);

		var documento = data.cedula.slice(0,2);
		var cedula = data.cedula.slice(2);

		if (documento == 'V-') {
			documento = 'venezolano';
		}
		else if (documento == 'E-') {
			documento = 'extranjero';
		}
		else if (documento == 'P-') {
			documento = 'pasaporte';
		}

		$('#documento').val(documento);
		$('#documento').selectpicker('refresh');
		$('#cedula').val(cedula);
		$('#p_nombre').val(data.p_nombre);
		$('#s_nombre').val(data.s_nombre);
		$('#p_apellido').val(data.p_apellido);
		$('#s_apellido').val(data.s_apellido);
		$('#genero').val(data.genero);
		$('#genero').selectpicker('refresh');
		$('#f_nac').val(data.f_nac);
		$('#instruccion').val(data.instruccion);
		$('#instruccion').selectpicker('refresh');
		$('#oficio').val(data.oficio);
		$('#email').val(data.email);
		$('#celular').val(data.movil);
		$('#fijo').val(data.fijo);
		$('#estado').val(data.idestado);
		$('#estado').selectpicker('refresh');
		$('#municipio').html('<option value="'+data.idmunicipio+'">'+data.municipio+'</option>');
		$('#municipio').prop('disabled', false);
		$('#municipio').selectpicker('refresh');
		$('#parroquia').html('<option value="'+data.idparroquia+'">'+data.parroquia+'</option>');
		$('#parroquia').prop('disabled', false);
		$('#parroquia').selectpicker('refresh');
		$('#direccion').val(data.direccion);
		$('#idrepresentante').val(data.idrepresentante);
	});
}

//Función para eliminar(desactivar) representantes
function desactivar(idrepresentante) {

		const swalWithBootstrapButtons = Swal.mixin({
		  customClass: {
		    confirmButton: 'btn btn-primary  mx-1 p-2',
		    cancelButton: 'btn btn-danger  mx-1 p-2'
		  },
		  buttonsStyling: false
		})

		swalWithBootstrapButtons.fire({
		  title: '¿Estas seguro?',
		  text: "¿Quieres desactivar a este representante?",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonText: 'Desactivar',
		  cancelButtonText: 'Cancelar',
		  reverseButtons: true
		}).then((result) => {
		  if (result.value) {
		  	$.post('../controladores/representante.php?op=desactivar', {idrepresentante: idrepresentante}, function (e) {
				if (e == 'true') {
					const Toast = Swal.mixin({
					  toast: true,
					  position: 'top-end',
					  showConfirmButton: false,
					  timer: 3000
					});

					Toast.fire({
					  type: 'success',
					  title: 'El representante ha sido desactivado :)'
					});
				}
				else {
					const Toast = Swal.mixin({
					  toast: true,
					  position: 'top-end',
					  showConfirmButton: false,
					  timer: 3000
					});

					Toast.fire({
					  type: 'error',
					  title: 'Ups! No se pudo desactivar el representante'
					});
				}
				tabla.ajax.reload();
			});  
		  } 
		});
}

//Función para activar usuarios
function activar(idrepresentante) {

	const swalWithBootstrapButtons = Swal.mixin({
		  customClass: {
		    confirmButton: 'btn btn-primary  mx-1 p-2',
		    cancelButton: 'btn btn-danger  mx-1 p-2'
		  },
		  buttonsStyling: false
		})

		swalWithBootstrapButtons.fire({
		  title: '¿Estas seguro?',
		  text: "¿Quieres activar a este usuario?",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonText: 'Activar',
		  cancelButtonText: 'Cancelar',
		  reverseButtons: true
		}).then((result) => {
		  if (result.value) {
		  	$.post('../controladores/representante.php?op=activar', {idrepresentante: idrepresentante}, function (e) {
				if (e == 'true') {
					const Toast = Swal.mixin({
					  toast: true,
					  position: 'top-end',
					  showConfirmButton: false,
					  timer: 3000
					});

					Toast.fire({
					  type: 'success',
					  title: 'El representante ha sido activado :)'
					});
				}
				else {
					const Toast = Swal.mixin({
					  toast: true,
					  position: 'top-end',
					  showConfirmButton: false,
					  timer: 3000
					});

					Toast.fire({
					  type: 'error',
					  title: 'Ups! No se pudo activar el representante'
					});
				}
				tabla.ajax.reload();
			});  
		  } 
		});

}

//Función para mostrar o ocultar el formulario
function mostrarform(flag) {
	limpiar();
	if (flag) {
		$('#listadoregistros').hide();
		$('#formularioregistros').show();
		$('#btnGuardar').prop('disabled', false);
		$('#btnagregar').hide();
	}
	else{
		$('#listadoregistros').show();
		$('#formularioregistros').hide();
		$('#btnagregar').show();
	}
}

//Función cancelarform
function cancelarform() {
	limpiar();
	mostrarform(false);
}

//Función para limpiar el formulario
function limpiar() {
	$('#documento').val('');
	$('#documento').selectpicker('refresh');
	$('#cedula').removeClass('is-invalid');
	$('#cedula').removeClass('is-valid');
	$('#cedula').val('');
	$('#p_nombre').val('');
	$('#s_nombre').val('');
	$('#p_apellido').val('');
	$('#s_apellido').val('');
	$('#genero').val('');
	$('#genero').selectpicker('refresh');
	$('#icono_genero').removeClass('bg-primary');
	$('#icono_genero').removeClass('bg-danger');
	$('#instruccion').val('');
	$('#instruccion').selectpicker('refresh');
	$('#oficio').val('');
	$('#f_nac').val('');
	$('#email').val('');
	$('#celular').val('');
	$('#fijo').val('');
	$('#estado').val('');
	$('#estado').selectpicker('refresh');
	$('#municipio').html('<option value="">Seleccione</option>');
	$('#municipio').prop('disabled', true);
	$('#municipio').selectpicker('refresh');
	$('#parroquia').html('<option value="">Seleccione</option>');
	$('#parroquia').prop('disabled', true);
	$('#parroquia').selectpicker('refresh');
	$('#direccion').val('');
	$('#idrepresentante').val('');
	$('#idpersona').val('');
	$('#formularioregistros').removeClass('was-validated');
}

//Determinar documento 
function tipo_documento(documento) {
	if (documento == 'venezolano') {
		return 'V-';
	}
	else if (documento == 'extranjero') {
		return 'E-';
	}
	else if (documento == 'pasaporte') {
		return 'P-';
	}
}

init();