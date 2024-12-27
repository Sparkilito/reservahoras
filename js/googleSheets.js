class GoogleSheetsService {
    constructor() {
        this.initialized = false;
    }

    async init() {
        try {
            if (this.initialized) return;
            
            console.log('Iniciando Google Sheets API...');
            
            await new Promise((resolve) => gapi.load('client', resolve));
            await gapi.client.init({
                apiKey: config.API_KEY,
            });
            await gapi.client.load('sheets', 'v4');
            
            console.log('API inicializada correctamente');
            this.initialized = true;
        } catch (error) {
            console.error('Error en init:', error);
            throw error;
        }
    }

    async obtenerFechasDeGoogleSheets(tipoReunion) {
        try {
            console.log('Obteniendo fechas para:', tipoReunion);
            await this.init();
            
            const range = `${tipoReunion}!A2:A`;
            console.log('Consultando rango:', range);
            
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: config.SPREADSHEET_ID,
                range: range,
                valueRenderOption: 'FORMATTED_VALUE'
            });

            console.log('Respuesta completa de Google Sheets:', response);
            
            if (!response.result || !response.result.values) {
                console.log('No se encontraron valores en la hoja');
                return [];
            }

            const fechas = response.result.values
                .flat()
                .filter(fecha => fecha !== null && fecha !== undefined)
                .map(fecha => String(fecha))
                .filter(fecha => fecha.trim() !== '');

            console.log('Fechas encontradas:', fechas);
            return fechas;
        } catch (error) {
            console.error('Error detallado al obtener fechas:', error);
            throw error;
        }
    }
} 