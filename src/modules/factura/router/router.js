import Factura from "../components/Factura.vue";
import RegistroAutomatico from "../views/RegistroAutomatico.vue";
import RegistroManual from "../views/RegistroManual.vue";


export const FacturaRoutes = [
    {
        path: 'automatico',
        component: RegistroAutomatico
    },
    {
        path: 'manual',
        component: RegistroManual
    }
]