<?php 

#Se incluye la conexión a la base de datos
require_once '../config/conexion.php';

/**
 * Modelo de Aspecto Socioeconómico
 */
class AspectoSocioeconomico
{	
	
	#Constructor de la clase
	public function __construct()
	{
		
	}

	#Método para insertar registros
	function insertar($idestudiante, $tipo_vivienda, $grupo_familiar, $ingreso_mensual)
	{
		$sql = "INSERT INTO aspecto_socioeconomico (id, idestudiante, tipo_vivienda, grupo_familiar, ingreso_mensual) VALUES(NULL, '$idestudiante', '$tipo_vivienda', '$grupo_familiar', '$ingreso_mensual')";

		return ejecutarConsulta($sql);

	}

	#Método para editar registros
	function editar($idestudiante, $tipo_vivienda, $grupo_familiar, $ingreso_mensual)
	{
		$sql = "UPDATE aspecto_socioeconomico SET tipo_vivienda = '$tipo_vivienda', grupo_familiar = '$grupo_familiar', ingreso_mensual = '$ingreso_mensual' WHERE idestudiante = '$idestudiante'";

		return ejecutarConsulta($sql);
		
	}

}