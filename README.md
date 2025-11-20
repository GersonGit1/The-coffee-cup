The Coffee cup — Real-Time Kitchen Dashboard (Next.js)

Un sistema completo para gestión de pedidos en restaurantes, desarrollado con Next.js, Prisma, PostgreSQL, Zustand, React Query y Pusher para actualizaciones en tiempo real.

El proyecto permite que los clientes creen pedidos, la cocina los gestione en un dashboard en vivo y ambos lados mantengan sincronización instantánea del estado de la orden.

🚀 Tecnologías Principales

Next.js 14 (App Router)

Prisma ORM

PostgreSQL

Pusher Channels (tiempo real)

Zustand (estado del carrito y orden activa)

React Query (cache + invalidaciones inteligentes)

TailwindCSS

Server Actions

TypeScript

Zod (validaciones)

🧠 Características Principales
🛒 1. Carrito y creación de pedidos (Cliente)

El cliente selecciona productos desde la UI.

Carrito manejado con Zustand.

Validación del pedido con Zod.

Guarda orden + productos relacionados en la BD.

Se crea automáticamente un canal dinámico Pusher por orden (order-{id}).

El cliente recibe notificaciones en tiempo real del estado de su pedido.

👨‍🍳 2. Dashboard en tiempo real para Cocina

Vista en vivo de órdenes pending y preparing.

Cada acción del staff:

pending → preparing

preparing → ready

canceled

Dispara eventos Pusher que actualizan automáticamente la UI:

new-order

preparing-order

ready-order

canceled-order

🔄 3. Actualización automática con React Query + Pusher

El dashboard invalida automáticamente la query de órdenes cuando recibe eventos del canal principal:

channel.bind("new-order", handler);
channel.bind("preparing-order", handler);
channel.bind("ready-order", handler);
channel.bind("canceled-order", handler);

📦 4. Estado sincronizado del cliente (Zustand)

Después de crear un pedido:

Se limpia el carrito.

Se almacena currentOrder para mostrar el estado de la orden.

El canal order-{id} escucha cambios del servidor para actualizar la UI.

Cuando la orden termina:

currentOrder se limpia automáticamente si está en "ready" o "canceled".

🧱 5. Base de datos con Prisma

Relaciones:

Order → OrderProducts → Product


Los productos del pedido se crean mediante un createMany implícito en Prisma.

Cada orden incluye:

{
  id,
  name,
  total,
  status,
  date,
  readyAt,
  OrderProducts: [
    { id, productId, quantity, product: {...} }
  ]
}

🛠️ 6. Server Actions para operaciones CRUD

createOrder

changeStatusOrder

cancelOrder

Implementadas con validaciones Zod y protección de errores.

📡 Arquitectura en Tiempo Real
Canales usados:
Canal global de cocina

orders-channel

new-order

preparing-order

ready-order

canceled-order

Canales dinámicos por cliente

order-{id}

order-status-changed

Esto permite:

Cocina: ver siempre la cola en tiempo real.

Cliente: recibir cambios sin recargar ni consultar nada.

📦 Scripts de instalación
npm install
npx prisma generate
npx prisma db push
npm run dev


Configurar variables de entorno:

DATABASE_URL=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PUSHER_APP_ID=
PUSHER_SECRET=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=


✔️ Características completadas

 Crear pedido con productos

 Guardar pedido en la BD

 Mostrar pedido al cliente en vivo

 Dashboard de cocina en tiempo real

 Cambiar estado de órdenes

 Cancelación de órdenes

 Canales dinámicos por orden (cliente)

 Limpieza automática de estados (Zustand)

 UI completa con TailwindCSS

 Queries reactivas con React Query

 Server Actions con validación Zod

🧑‍💻 Autor

Desarrollado por Gerson Amaya como parte de un sistema de gestión de pedidos moderno y escalable.

📝 Licencia

MIT