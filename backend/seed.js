// remoto/backend/seed.js

import mongoose from 'mongoose';
import Usuario from './models/usuario.model.js';
import Empleado from './models/empleado.model.js';
import Modelo from './models/modelo.model.js'; 
import { v4 as uuidv4 } from 'uuid'; 

// --- 1. DATOS DE EMPLEADOS (Jerarquía y Roles DEFINITIVOS) ---
const defaultPasswordHash = '12345'; 

const employeeData = [
    // 1. GESTIÓN
    { nombre: "Borja Díaz Cabezas", code: "900", rol: "DIRECTOR" }, 
    { nombre: "Francisco San Martín", code: "901", rol: "GERENTE" }, 
    
    // 2. LÍDERES (Con sus códigos originales)
    { nombre: "Antonio Montes", code: "120", rol: "LIDER" }, 
    { nombre: "Jonatan Escarraman", code: "178", rol: "LIDER" }, 
    { nombre: "Francisco Garcia", code: "229", rol: "LIDER" }, 
    
    // 3. OPERARIOS (Los demás, con códigos originales)
    { nombre: "Eloy Quiñones", code: "40", rol: "OPERARIO" },
    { nombre: "Carlos Javier Rivera", code: "158", rol: "OPERARIO" },
    { nombre: "Humberto Mariscal", code: "177", rol: "OPERARIO" },
    { nombre: "Jose Gregorio Sarti", code: "196", rol: "OPERARIO" },
    { nombre: "Francisco Quiñones", code: "199", rol: "OPERARIO" },
    { nombre: "Juan Jose Sarti", code: "203", rol: "OPERARIO" },
    { nombre: "Juan Carlos Ugueto", code: "204", rol: "OPERARIO" },
    { nombre: "Francisco Romero", code: "239", rol: "OPERARIO" },
    { nombre: "Antonio Ramos", code: "243", rol: "OPERARIO" },
    { nombre: "Juan Manuel Baez", code: "244", rol: "OPERARIO" },
    { nombre: "Josue Cortes", code: "246", rol: "OPERARIO" },
    { nombre: "Angel Luis Torres", code: "250", rol: "OPERARIO" },
    { nombre: "Francisco Javier Herrera", code: "251", rol: "OPERARIO" },
    { nombre: "José Pérez", code: "252", rol: "OPERARIO" }
];

// --- 4. MAPEO DE REPORTES (Código de Operario -> Código de Líder) ---
const REPORTING_MAP = {
    "199": "120", "246": "120", "251": "120", // Reportan a Antonio Montes (120)
    "177": "178", "250": "178", "252": "178", // Reportan a Jonatan Escarraman (178)
    "196": "229", "203": "229", "204": "229", "243": "229", // Reportan a Francisco Garcia (229)
    // Los códigos 40, 158, 239, 244 no reportan a un líder en la lista, se asignarán a null.
};

// --- 5. DATOS DE MODELOS DE PALETS ---
const modeloData = [
    { name: "CHEP 120x100", type: "Palet" }, { name: "IPP 120x80", type: "Palet" },
    { name: "PR80", type: "Palet" }, { name: "UK100", type: "Palet" },
    { name: "AZ80", type: "Palet" }, { name: "EUR-UIC", type: "Palet" },
    { name: "Tapa Estándar", type: "Tapa" }, { name: "Modelo Especial X", type: "Especial" },
];

// --- 6. CONFIGURACIÓN E INICIO ---
const MONGO_URI = 'mongodb://127.0.0.1:27017/produccion'; 

async function seedDB() {
    try {
        console.log('🔗 Conectando a MongoDB para la siembra...');
        await mongoose.connect(MONGO_URI);

        console.log('🧹 Limpiando colecciones existentes...');
        await Usuario.deleteMany({});
        await Empleado.deleteMany({});
        await Modelo.deleteMany({}); 

        // Generar IDs y separar roles
        const employeesWithIds = employeeData.map(emp => ({ ...emp, userId: uuidv4() }));

        const director = employeesWithIds.find(e => e.rol === 'DIRECTOR');
        const gerente = employeesWithIds.find(e => e.rol === 'GERENTE');
        const lideres = employeesWithIds.filter(e => e.rol === 'LIDER');
        const operarios = employeesWithIds.filter(e => e.rol === 'OPERARIO');
        
        // 7. Mapear para inserción
        const usuarios = employeesWithIds.map(e => ({
            userId: e.userId,
            username: e.code,
            passwordHash: defaultPasswordHash, 
            roles: [e.rol]
        }));

        const empleados = employeesWithIds.map(e => {
            let reportsTo = null;
            let leaderOf = [];

            if (e.rol === 'OPERARIO') {
                const liderCode = REPORTING_MAP[e.code];
                const liderAsignado = lideres.find(l => l.code === liderCode);
                reportsTo = liderAsignado ? liderAsignado.userId : null;
            } else if (e.rol === 'LIDER') {
                reportsTo = gerente.userId; 
                // Asigna operarios dinámicamente
                const myOperariosCodes = Object.keys(REPORTING_MAP).filter(opCode => REPORTING_MAP[opCode] === e.code);
                leaderOf = operarios.filter(op => myOperariosCodes.includes(op.code)).map(op => op.userId);
            } else if (e.rol === 'DIRECTOR') {
                // 🔴 CORRECCIÓN CRÍTICA: DIRECTOR reporta a GERENTE
                reportsTo = gerente.userId; 
            }
            // GERENTE reporta a NULL (Es el superior máximo)

            return {
                userId: e.userId,
                code: e.code,
                nombre: e.nombre,
                rol: e.rol,
                reportsTo: reportsTo, 
                leaderOf: leaderOf
            };
        });


        // 8. Insertar datos
        await Usuario.insertMany(usuarios);
        await Empleado.insertMany(empleados);
        await Modelo.insertMany(modeloData); 
        
        console.log(`✅ ¡SIEMBRA FINALIZADA! Se insertaron ${usuarios.length} perfiles y ${modeloData.length} modelos.`);
        console.log(`
        ====================================================
        🔑 DATOS DE PRUEBA (Usuario / Contraseña):
        ----------------------------------------------------
        GERENTE (Top): ${gerente.code} / ${defaultPasswordHash} (${gerente.nombre})
        DIRECTOR:  ${director.code} / ${defaultPasswordHash} (${director.nombre})
        LÍDER 1:   ${lideres[0].code} / ${defaultPasswordHash} (${lideres[0].nombre})
        OPERARIO:  ${operarios[0].code} / ${defaultPasswordHash} (${operarios[0].nombre})
        ====================================================
        `);

    } catch (error) {
        console.error('❌ Error durante la siembra de la BD:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexión a MongoDB cerrada.');
    }
}

seedDB();