class EmailService {
    async enviarCorreo(datos) {
        try {
            console.log('Verificando credenciales EmailJS:', {
                serviceId: config.EMAIL_SERVICE_ID,
                templateId: config.EMAIL_TEMPLATE_ID,
                userId: config.EMAIL_USER_ID
            });
            
            console.log('Datos a enviar:', datos);
            
            const templateParams = {
                to_name: datos.nombre,
                to_email: datos.email,
                tipo_reunion: datos.tipoReunion,
                fecha: datos.fecha
            };

            console.log('Parámetros de plantilla:', templateParams);

            const response = await emailjs.send(
                config.EMAIL_SERVICE_ID,
                config.EMAIL_TEMPLATE_ID,
                templateParams
            );

            console.log('Respuesta del servidor EmailJS:', response);
            return response;
        } catch (error) {
            console.error('Error detallado al enviar correo:', error);
            throw error;
        }
    }
} 