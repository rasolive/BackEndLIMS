const errorLog = (message, data, spacesOnJson = false) => {
    if (process.env.NODE_ENV === 'HML') {
        return null
    }
    
    const payload = Boolean(data) 
    ?   `${message}:\n → ${
            typeof data === 'object' 
                ? JSON.stringify(data, null, spacesOnJson ? 4 : null)
                : data
        }` 
    : `${message}`;
    console.error('\n!!►',new Error(payload),'\n')

    return Boolean(data) ? data : message;

    /**@todo: Adicionar visualizador de log para HML E Produção */
}

module.exports = errorLog