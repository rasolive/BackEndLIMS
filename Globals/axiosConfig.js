const axios = require('axios');
require("dotenv").config()
/**
 * @tutorial
   const instance = axios.create({
        .. where we make our configurations
        baseURL: 'https://api.example.com'
    });
    
    // Where you would set stuff like your 'Authorization' header, etc ...
    instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';
    
    // Also add/ configure interceptors && all the other cool stuff
    // instance.interceptors.request...
 */

const ENVIRONMENT = process.env.NODE_ENV;

if (!Boolean(ENVIRONMENT)) {
    const errorMessage = Error("\n► NODE_ENV VAR is required at .ENV \n► ending process..")
    console.error(errorMessage)
    process.exit(1);
}

const pilares = {
    LOCAL: {
        intakeDB: 'http://localhost:8082/v1',
        geralConfigDB: 'http://localhost:8083/v1',
        bioagriculturaDB: 'http://localhost:8084/v1',
        tecCosmetica: 'http://localhost:8085/v1',
     },
    DEV: {
        intakeDB: 'https://pilares-intake-db-int-dev.naturacloud.com/v1',
        geralConfigDB: 'https://pilares-geral-config-db-int-dev.naturacloud.com/v1',
        tecCosmetica: 'https://pilares-tec-cosmetica-db-int-dev.naturacloud.com/v1',
        bioagriculturaDB: 'https://pilares-bioagricultura-db-int-dev.naturacloud.com/v1',
        transcriptomaDB: 'http://pilares-transcriptoma-db-int-dev.naturacloud.com/v1',
    },
    HML: {
        intakeDB: 'https://pilares-intake-db-int-hml.naturacloud.com/v1',
        geralConfigDB: 'https://pilares-geral-config-db-int-hml.naturacloud.com/v1',
        tecCosmetica: 'https://pilares-tec-cosmetica-db-int-hml.naturacloud.com/v1',
        bioagriculturaDB: 'https://pilares-bioagricultura-db-int-hml.naturacloud.com/v1',
        transcriptomaDB: 'http://pilares-transcriptoma-db-int-hml.naturacloud.com/v1',
    },
    PROD: {
        intakeDB: 'https://pilares-intake-db-int-prd.naturacloud.com/v1',
        geralConfigDB: 'https://pilares-geral-config-db-int-prd.naturacloud.com/v1',
        tecCosmetica: 'https://pilares-tec-cosmetica-db-int-prd.naturacloud.com/v1',
        bioagriculturaDB: 'https://pilares-bioagricultura-db-int-prd.naturacloud.com/v1',
        transcriptomaDB: 'http://pilares-transcriptoma-db-int-prd.naturacloud.com/v1',
    },
}

const geralConfigDB = axios.create({
    baseURL: pilares[ENVIRONMENT].geralConfigDB,
});

const intakeDB = axios.create({
    baseURL: pilares[ENVIRONMENT].intakeDB,
});


const showAllBaseUrls = async (active = false) => {
    if (!active) return null
    const urls = []
    urls.push(`► ENVIRONMENT → ${ENVIRONMENT}`)
    urls.push(`► bioagriculturaDB → ${pilares[ENVIRONMENT].bioagriculturaDB}`)
    urls.push(`► geralConfigDB → ${pilares[ENVIRONMENT].geralConfigDB}`)
    urls.push(`► intakeDB → ${pilares[ENVIRONMENT].intakeDB}`)
    urls.push('')
    urls.forEach(item => console.log(item))
}

module.exports = {
    showAllBaseUrls,
    axios,
    geralConfigDB,
    intakeDB
}