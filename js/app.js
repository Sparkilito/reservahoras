class AgendarApp {
    constructor() {
        this.googleSheetsService = new GoogleSheetsService();
        this.emailService = new EmailService();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const tipoReunionSelect = document.getElementById('tipoReunion');
        tipoReunionSelect.addEventListener('change', async (e) => {
            console.log('Tipo de reunión seleccionado:', e.target.value);
            await this.actualizarFechas(e.target.value);
        });

        document.getElementById('agendarForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(e);
        });
    }

    async actualizarFechas(tipoReunion) {
        const fechaSelect = document.getElementById('fecha');
        fechaSelect.innerHTML = '<option value="">Cargando fechas...</option>';

        try {
            if (tipoReunion) {
                console.log('Solicitando fechas para:', tipoReunion);
                const fechas = await this.googleSheetsService.obtenerFechasDeGoogleSheets(tipoReunion);
                console.log('Fechas recibidas:', fechas);
                this.renderizarFechas(fechas);
            }
        } catch (error) {
            console.error('Error al actualizar fechas:', error);
            fechaSelect.innerHTML = '<option value="">Error al cargar fechas</option>';
        }
    }

    renderizarFechas(fechas) {
        const fechaSelect = document.getElementById('fecha');
        if (!fechas || fechas.length === 0) {
            fechaSelect.innerHTML = '<option value="">No hay fechas disponibles</option>';
            return;
        }

        fechaSelect.innerHTML = '<option value="">Selecciona una fecha</option>';
        fechas.forEach(fecha => {
            console.log('Agregando fecha:', fecha);
            const option = document.createElement('option');
            option.value = fecha;
            option.textContent = fecha;
            fechaSelect.appendChild(option);
        });
    }

    async handleSubmit(e) {
        try {
            const formData = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                tipoReunion: document.getElementById('tipoReunion').value,
                fecha: document.getElementById('fecha').value
            };

            console.log('Datos del formulario:', formData);

            if (!formData.nombre || !formData.email || !formData.tipoReunion || !formData.fecha) {
                alert('Por favor, completa todos los campos');
                return;
            }

            await this.emailService.enviarCorreo(formData);
            alert('¡Reunión agendada con éxito!');
            document.getElementById('agendarForm').reset();
            
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Error al agendar la reunión. Por favor, intenta nuevamente.');
        }
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando aplicación...');
    new AgendarApp();
}); 